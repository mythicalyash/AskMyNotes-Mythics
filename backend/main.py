from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
import os
import json
import math
import shutil
import fitz
import re
import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv
from typing import List, Annotated


# =============================
# LOAD ENV VARIABLES
# =============================
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env")

# Gemini — used for embeddings and image extraction
genai.configure(api_key=API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.5-flash-lite")

# Groq — used for LLM answer generation
groq_client = Groq(api_key=GROQ_API_KEY)


# =============================
# TEXT CLEANING
# =============================
def clean_text(text):
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s([,.!?;:])", r"\1", text)
    return text.strip()


# =============================
# GEMINI IMAGE EXTRACTION
# =============================
def extract_text_with_gemini(image_path):

    ext = image_path.lower().split(".")[-1]

    mime_map = {
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg"
    }

    mime_type = mime_map.get(ext, "image/png")

    with open(image_path, "rb") as f:
        image_bytes = f.read()

    response = gemini_model.generate_content(
        [
            {
                "mime_type": mime_type,
                "data": image_bytes,
            },
            """
            Extract ALL readable text from this image.
            Preserve headings and structure.
            Do NOT explain anything.
            Return ONLY the extracted text.
            """
        ]
    )

    return response.text


# =============================
# PDF PAGE → IMAGE (SCANNED PDF)
# =============================
def convert_page_to_image(page, page_num):

    pix = page.get_pixmap(dpi=200)

    image_path = f"temp_page_{page_num}.png"
    pix.save(image_path)

    return image_path


# =============================
# PDF EXTRACTION
# =============================
def extract_pdf_pages(file_path):

    doc = fitz.open(file_path)
    pages = []

    for page_num, page in enumerate(doc):

        raw_text = page.get_text("text")
        cleaned = clean_text(raw_text)

        # scanned page detection
        if len(cleaned.strip()) < 40:

            print(f"⚠️ Page {page_num+1} appears scanned → using Gemini")

            image_path = convert_page_to_image(page, page_num)

            try:
                cleaned = extract_text_with_gemini(image_path)
            finally:
                if os.path.exists(image_path):
                    os.remove(image_path)

        pages.append({
            "page": page_num + 1,
            "text": cleaned
        })

    doc.close()
    return pages


# =============================
# CHUNKING
# =============================
def split_into_sentences(text):
    return re.split(r'(?<=[.!?])\s+', text)


def create_smart_chunks(pages, source_name, chunk_size=400, overlap=50):

    chunks = []
    chunk_counter = 0

    for page_obj in pages:

        page_num = page_obj["page"]
        text = page_obj["text"]

        sentences = split_into_sentences(text)

        current_chunk = []
        current_words = 0

        for sentence in sentences:

            words = sentence.split()
            word_count = len(words)

            if current_words + word_count > chunk_size:

                chunk_text = " ".join(current_chunk)

                chunks.append({
                    "chunk_id": f"{source_name}_{chunk_counter}",
                    "page": page_num,
                    "source": source_name,
                    "text": chunk_text
                })

                chunk_counter += 1

                # overlap
                current_chunk = current_chunk[-overlap:]
                current_words = len(" ".join(current_chunk).split())

            current_chunk.append(sentence)
            current_words += word_count

        if current_chunk:
            chunks.append({
                "chunk_id": f"{source_name}_{chunk_counter}",
                "page": page_num,
                "source": source_name,
                "text": " ".join(current_chunk)
            })
            chunk_counter += 1

    return chunks


# =============================
# EMBEDDINGS (GEMINI)
# =============================
def get_embedding(text, task_type="retrieval_document"):
    """Return embedding vector for text using Gemini with a short timeout."""
    import concurrent.futures

    def _call():
        return genai.embed_content(
            model="models/gemini-embedding-001",
            content=text,
            task_type=task_type
        )

    try:
        with concurrent.futures.ThreadPoolExecutor() as pool:
            future = pool.submit(_call)
            result = future.result(timeout=15)  # 15s max per embedding
        print("🔵 embedding generated")
        return result["embedding"]
    except concurrent.futures.TimeoutError:
        print("⚠️ Embedding timed out (15s)")
        return None
    except Exception as e:
        print(f"⚠️ Embedding failed: {e}")
        return None


def cosine_similarity(a, b):
    """Pure Python cosine similarity between two vectors."""
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(x * x for x in b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)


# =============================
# FASTAPI APP
# =============================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
    )
    # Fix UploadFile fields: Swagger UI needs format: binary
    for schema in openapi_schema.get("components", {}).get("schemas", {}).values():
        for prop in schema.get("properties", {}).values():
            items = prop.get("items", {})
            if items.get("contentMediaType") == "application/octet-stream":
                items["format"] = "binary"
    app.openapi_schema = openapi_schema
    return openapi_schema


app.openapi = custom_openapi

UPLOAD_DIR = "uploads"
INDEX_DIR = "index"

os.makedirs("uploads/subject1", exist_ok=True)
os.makedirs("uploads/subject2", exist_ok=True)
os.makedirs("uploads/subject3", exist_ok=True)
os.makedirs(INDEX_DIR, exist_ok=True)


# =============================
# FLAT JSON INDEX STORAGE
# =============================
def save_chunks_to_index(subject, chunks):
    """Append chunks to index/{subject}_index.json with embeddings."""

    index_path = os.path.join(INDEX_DIR, f"{subject}_index.json")

    # Load existing chunks
    if os.path.exists(index_path):
        try:
            with open(index_path, "r", encoding="utf-8") as f:
                existing = json.load(f)
        except (json.JSONDecodeError, ValueError):
            existing = []
    else:
        existing = []

    # Add citation + embedding and append
    for chunk in chunks:
        chunk["citation"] = f"{chunk['source']} | page {chunk['page']}"

        # Generate embedding if not already present
        if "embedding" not in chunk:
            embedding = get_embedding(chunk["text"], task_type="retrieval_document")
            if embedding:
                chunk["embedding"] = embedding

        existing.append(chunk)

    # Write back safely (atomic-ish via temp file)
    tmp_path = index_path + ".tmp"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)
    os.replace(tmp_path, index_path)

    print(f"💾 Saved {len(chunks)} chunks → {index_path} (total: {len(existing)})")


# =============================
# INDEX LOADING
# =============================
def load_subject_index(subject):
    """Load all chunks from index/{subject}_index.json."""

    index_path = os.path.join(INDEX_DIR, f"{subject}_index.json")

    if not os.path.exists(index_path):
        return []

    try:
        with open(index_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, ValueError):
        return []


# =============================
# SEMANTIC RETRIEVAL
# =============================
def retrieve_relevant_chunks(query, chunks, top_k=5):
    """Score chunks by cosine similarity with query embedding, return top_k."""

    print("🧠 semantic retrieval running")

    query_embedding = get_embedding(query, task_type="retrieval_query")
    if not query_embedding:
        return []

    scored = []
    for chunk in chunks:
        chunk_embedding = chunk.get("embedding")
        if not chunk_embedding:
            continue
        score = cosine_similarity(query_embedding, chunk_embedding)
        scored.append((score, chunk))

    scored.sort(key=lambda x: x[0], reverse=True)

    return [chunk for _, chunk in scored[:top_k]]


# =============================
# BASIC ROUTES
# =============================
@app.get("/")
def home():
    return {"status": "Backend is running 🚀"}


@app.get("/subjects")
def subjects():
    return {"subjects": ["subject1", "subject2", "subject3"]}


# =============================
# UPLOAD ROUTE
# =============================
@app.post("/upload")
async def upload_file(
    subject: Annotated[str, Form(...)],
    files: Annotated[list[UploadFile], File(description="Upload PDFs and images")],
):

    if subject not in ["subject1", "subject2", "subject3"]:
        return {"error": "Invalid subject"}

    subject_path = os.path.join(UPLOAD_DIR, subject)

    results = []

    for file in files:

        file_path = os.path.join(subject_path, file.filename)

        # save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        extracted_preview = None

        # =============================
        # PDF
        # =============================
        if file.filename.lower().endswith(".pdf"):

            pages = extract_pdf_pages(file_path)

            chunks = create_smart_chunks(
                pages,
                source_name=file.filename
            )

            print(f"\n===== PDF: {file.filename} =====")
            print("Pages:", len(pages))
            print("Chunks:", len(chunks))

            save_chunks_to_index(subject, chunks)

            extracted_preview = pages[0]["text"][:300] if pages else None

        # =============================
        # IMAGE
        # =============================
        elif file.filename.lower().endswith((".png", ".jpg", ".jpeg")):

            extracted_text = extract_text_with_gemini(file_path)

            pages = [{
                "page": 1,
                "text": clean_text(extracted_text)
            }]

            chunks = create_smart_chunks(
                pages,
                source_name=file.filename
            )

            print(f"\n===== IMAGE: {file.filename} =====")
            print("Chunks:", len(chunks))

            save_chunks_to_index(subject, chunks)

            extracted_preview = extracted_text[:300]

        results.append({
            "filename": file.filename,
            "preview": extracted_preview
        })

    return {
        "message": "Files uploaded successfully",
        "total_files": len(results),
        "files": results
    }


# =============================
# ASK ROUTE (SEMANTIC RETRIEVAL)
# =============================
@app.post("/ask")
async def ask_question(
    subject: Annotated[str, Form(...)],
    question: Annotated[str, Form(...)],
):

    if subject not in ["subject1", "subject2", "subject3"]:
        return {"error": "Invalid subject"}

    chunks = load_subject_index(subject)

    if not chunks:
        return {"question": question, "results": [], "message": "No index found for this subject. Upload files first."}

    relevant = retrieve_relevant_chunks(question, chunks)

    return {
        "question": question,
        "results": [
            {
                "citation": chunk["citation"],
                "text": chunk["text"]
            }
            for chunk in relevant
        ]
    }


# =============================
# ASK V2 — LLM GROUNDED ANSWER
# =============================

MIN_SCORE_THRESHOLD = 0.55


def retrieve_relevant_chunks_with_scores(query, chunks, top_k=5):
    """Score chunks by cosine similarity, return top_k that pass threshold."""

    print("🧠 ask_v2 retrieval running")

    query_embedding = get_embedding(query, task_type="retrieval_query")
    if not query_embedding:
        return []

    all_scores = []
    scored = []
    for chunk in chunks:
        chunk_embedding = chunk.get("embedding")
        if not chunk_embedding:
            continue
        score = cosine_similarity(query_embedding, chunk_embedding)
        all_scores.append((round(score, 4), chunk["citation"][:40]))
        if score >= MIN_SCORE_THRESHOLD:
            scored.append({"score": score, "text": chunk["text"], "citation": chunk["citation"]})

    # Log all scores for debugging
    all_scores.sort(key=lambda x: x[0], reverse=True)
    print(f"📊 All scores (top 5): {all_scores[:5]}")
    print(f"✅ Passed threshold ({MIN_SCORE_THRESHOLD}): {len(scored)} chunks")

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]


def build_context_from_chunks(chunks):
    """Build a single context string from the top 3 chunks."""
    parts = []
    for chunk in chunks[:3]:
        parts.append(f"SOURCE: {chunk['citation']}\nTEXT: {chunk['text']}")
    return "\n\n".join(parts)


def get_confidence_label(score):
    """Map similarity score to confidence label."""
    if score >= 0.72:
        return "High"
    elif score >= 0.60:
        return "Medium"
    return "Low"


def generate_grounded_answer(question, context, fallback_text=""):
    """Use Groq (Llama 3.3 70B) to generate a grounded answer from context."""

    print("🤖 Groq LLM generating answer")

    system_prompt = """You are AskMyNotes.

Answer ONLY using the provided context.
Do NOT invent information.

If the answer is not found in the context, return EXACTLY:
"Not found in your notes."

Return concise educational answers."""

    user_prompt = f"""CONTEXT:
{context}

QUESTION:
{question}"""

    full_prompt = f"SYSTEM:\n{system_prompt}\n\nUSER:\n{user_prompt}"

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=512
        )
        answer = response.choices[0].message.content.strip()
        print(f"✅ Groq answered")
        return answer, full_prompt
    except Exception as e:
        print(f"⚠️ Groq LLM failed: {e}")
        if fallback_text:
            print("🔄 Using best chunk as fallback answer")
            return fallback_text, full_prompt
        return "Could not generate answer. Please try again.", full_prompt


@app.post("/ask_v2")
async def ask_v2(
    subject: Annotated[str, Form(...)],
    question: Annotated[str, Form(...)],
):

    if subject not in ["subject1", "subject2", "subject3"]:
        return {"error": "Invalid subject"}

    chunks = load_subject_index(subject)

    if not chunks:
        return {
            "answer": f"Not found in your notes for {subject}.",
            "confidence": "Low",
            "evidence": [],
            "message": "No index found for this subject. Upload files first."
        }

    scored_chunks = retrieve_relevant_chunks_with_scores(question, chunks)

    if not scored_chunks:
        return {
            "answer": f"Not found in your notes for {subject}.",
            "confidence": "Low",
            "evidence": []
        }

    best_score = scored_chunks[0]["score"]
    strong_chunks = scored_chunks[:3]

    context = build_context_from_chunks(strong_chunks)
    fallback = strong_chunks[0]["text"][:500]
    answer, prompt = generate_grounded_answer(question, context, fallback_text=fallback)
    confidence = get_confidence_label(best_score)

    print(f"📈 Best score: {best_score:.4f} → {confidence} confidence")

    evidence = [
        {
            "citation": chunk["citation"],
            "snippet": chunk["text"][:200]
        }
        for chunk in strong_chunks
    ]

    return {
        "answer": answer,
        "confidence": confidence,
        "evidence": evidence,
        "prompt": prompt
    }


# =============================
# AI TEACHER ROUTE
# =============================
def generate_teacher_answer(question, context, history, fallback_text=""):
    """Use Groq (Llama 3.3 70B) to generate a conversational teacher answer with a follow up question."""

    print("🤖 Groq LLM generating teacher answer")

    system_prompt = """You are AskMyNotes, an encouraging and interactive AI Teacher.

    RULES:
    1. Answer the student's question concisely using the provided CONTEXT. If the user is asking a follow-up (like "simplify it", "give an example", "compare"), use the CONVERSATION HISTORY to understand what they are referring to.
    2. Do NOT invent information that is not in the context or history.
    3. If the answer is not in the context or history, say "I couldn't find that in your notes, but..." and give a brief general answer if appropriate.
    4. Speak naturally and conversationally, suitable for text-to-speech.
    5. MOST IMPORTANT: ALWAYS end your response with ONE relevant, thought-provoking follow-up question to test the student's understanding or guide them deeper into the topic. Do not just ask "does that make sense?" Ask a specific, content-related question.

    HISTORY contains previous messages in the conversation to help you maintain context.
    """

    history_text = "\n".join([f"{msg['role'].upper()}: {msg['content']}" for msg in history[-4:]]) if history else "No previous history."

    user_prompt = f"""CONTEXT:
{context}

CONVERSATION HISTORY:
{history_text}

STUDENT QUESTION:
{question}
"""

    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.5,
            max_tokens=600
        )
        answer = response.choices[0].message.content.strip()
        print(f"✅ Groq answered as Teacher")
        return answer
    except Exception as e:
        print(f"⚠️ Groq LLM failed: {e}")
        if fallback_text:
            return fallback_text
        return "I'm having trouble connecting to my knowledge base. Can you try asking that again?"


@app.post("/teacher_ask")
async def teacher_ask(
    subject: Annotated[str, Form(...)],
    question: Annotated[str, Form(...)],
    history: Annotated[str, Form(...)], # JSON string of history array
):

    import json
    try:
        history_list = json.loads(history)
    except:
        history_list = []

    if subject not in ["subject1", "subject2", "subject3"]:
        return {"reply": "Invalid subject provided."}

    chunks = load_subject_index(subject)

    if not chunks:
        return {"reply": "It looks like you haven't uploaded any notes for this subject yet. Please upload some files first so I can teach you from them!"}

    # If the user asks a short follow-up question like "simplify it" or "give an example",
    # the vector search alone will fail to find context. We prepend the recent history 
    # topic to the semantic search query.
    search_query = question
    if len(question.split()) < 8 and history_list:
        last_user_msg = next((msg['content'] for msg in reversed(history_list) if msg['role'] == 'user'), "")
        if last_user_msg:
            search_query = f"{last_user_msg} {question}"

    scored_chunks = retrieve_relevant_chunks_with_scores(search_query, chunks, top_k=3)

    context = ""
    fallback = ""
    if scored_chunks:
        strong_chunks = scored_chunks[:3]
        context = build_context_from_chunks(strong_chunks)
        fallback = "Here's what I found: " + strong_chunks[0]["text"][:200] + "... What part of that is most interesting to you?"

    # LLM will fall back gracefully to conversation history if context doesn't match well due to the follow up
    answer = generate_teacher_answer(question, context, history_list, fallback_text=fallback)

    return {
        "reply": answer
    }
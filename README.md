# 📚 AskMyNotes

**AI-powered study assistant that answers questions grounded exclusively in your own uploaded notes.**

Upload PDFs or images per subject, ask questions via chat or voice, and every answer comes back with citations, confidence scores, and exact text evidence — no hallucinations.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📁 **File Upload** | Upload PDFs & images per subject (Mathematics, Web Dev, Java) |
| 💬 **Chat Q&A** | Ask questions and get cited, grounded answers |
| 🎓 **AI Voice Tutor** | Interactive conversational teacher with voice I/O |
| 📝 **Quiz Generator** | Auto-generates MCQs & short-answer questions from your notes |
| 🗂 **File Manager** | View and delete uploaded files per subject |
| 🔍 **Source Citations** | Every answer shows the file name, page number, and exact snippet |
| 📊 **Confidence Scoring** | High / Medium / Low confidence based on semantic similarity |

---

## 🏗 Tech Stack

**Frontend**
- [Next.js 14](https://nextjs.org/) (App Router) · TypeScript · Tailwind CSS
- Web Speech API (voice input & TTS for AI Tutor)
- Shadcn/ui component primitives

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) (Python) · Uvicorn
- [PyMuPDF](https://pymupdf.readthedocs.io/) — PDF text extraction
- Flat-file JSON vector index (zero infra required)

**AI Models**
- **Google Gemini** — `gemini-embedding-001` for semantic embeddings + Vision OCR for scanned pages
- **Groq** — `llama-3.3-70b-versatile` for LLM answer generation (low-latency inference)

---

## 📁 Project Structure

```
AskMyNotes/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout with sidebar
│   ├── page.tsx                # Dashboard
│   ├── study/page.tsx          # Chat Q&A + Quiz page
│   ├── subjects/page.tsx       # File management
│   ├── teacher/page.tsx        # AI Voice Tutor
│   ├── settings/page.tsx       # Settings
│   └── api/teacher/route.ts    # Next.js → FastAPI proxy
│
├── components/
│   ├── sidebar/Sidebar.tsx
│   ├── dashboard/              # Dashboard widgets
│   ├── teacher/
│   │   └── AIVoiceInterface.tsx  # Voice tutor UI
│   └── ui/                     # Shadcn primitives
│
├── lib/
│   ├── constants.ts            # Subject definitions
│   └── utils.ts
│
├── backend/
│   ├── main.py                 # FastAPI app + all RAG logic
│   ├── uploads/
│   │   ├── subject1/           # Uploaded files — Mathematics
│   │   ├── subject2/           # Uploaded files — Web Development
│   │   └── subject3/           # Uploaded files — Java
│   └── index/
│       ├── subject1_index.json # Vector index — Mathematics
│       ├── subject2_index.json # Vector index — Web Development
│       └── subject3_index.json # Vector index — Java
│
├── data/events.json            # Calendar events
├── package.json
└── next.config.mjs
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)
- A [Groq](https://console.groq.com/) API key

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/askmynotes.git
cd askmynotes
```

### 2. Frontend setup

```bash
npm install
```

### 3. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install fastapi uvicorn python-dotenv pymupdf google-generativeai groq
```

### 4. Environment variables

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

---

## 🚀 Running the App

**Terminal 1 — Frontend**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

**Terminal 2 — Backend**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```
API available at [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🧠 RAG Pipelines

### 1. Document Ingestion (`POST /upload`)

```
PDF / Image
    └─→ PyMuPDF text extraction (or Gemini Vision OCR for scanned pages)
        └─→ Sentence-aware chunking (~400 words, 50-word overlap)
            └─→ Gemini embedding-001 (per chunk)
                └─→ Saved to index/subjectN_index.json
```

### 2. Chat Q&A (`POST /ask_v2`)

```
Question
    └─→ Gemini embedding (retrieval_query)
        └─→ Cosine similarity against all chunks (threshold: 0.55)
            └─→ Top 3 chunks as context
                └─→ Groq Llama 3.3 70B → grounded answer
                    └─→ Returns: answer + confidence + evidence[]
```

### 3. AI Tutor (`POST /teacher_ask`)

```
Question (+ rolling 20-turn conversation memory)
    └─→ Short-query enrichment (prepends topic from memory if < 8 words)
        └─→ Semantic retrieval (top 3 chunks)
            └─→ Groq Llama 3.3 70B (conversational, Socratic tone)
                └─→ Returns: reply + evidence[]
                    └─→ Web Speech API reads reply aloud
```

### 4. Quiz Generator (`POST /generate_quiz`)

```
Subject selected
    └─→ First 15 chunks as context (~15k chars)
        └─→ Groq Llama 3.3 70B (JSON mode)
            └─→ 5 MCQs + 3 Short Answer questions
                └─→ Rendered with answer reveal + explanations
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/upload` | Upload PDF/image files for a subject |
| `GET` | `/files/{subject}` | List uploaded files for a subject |
| `DELETE` | `/files/{subject}/{filename}` | Delete a file + remove its index chunks |
| `POST` | `/ask_v2` | Chat Q&A — grounded answer with evidence |
| `POST` | `/teacher_ask` | AI Tutor — conversational answer with memory |
| `POST` | `/generate_quiz` | Generate MCQs + short-answer quiz |
| `GET` | `/subjects` | List all subjects |
| `GET` | `/` | Health check |

**Common form fields:** `subject` (`subject1` / `subject2` / `subject3`), `question`

---

## 📐 Confidence Scoring

Answers are scored by the cosine similarity of the question embedding vs. the best matching chunk:

| Score | Confidence | Meaning |
|---|---|---|
| ≥ 0.72 | 🟢 High | Strong match found in notes |
| 0.60 – 0.72 | 🟡 Medium | Partial match |
| < 0.60 | 🔴 Low | Weak match — treat with caution |
| No chunks ≥ 0.55 | — | "Not found in your notes" returned |

---

## 🗺 Roadmap

- [ ] User authentication (per-user note storage)
- [ ] Vector DB migration (Qdrant / Chroma) for larger corpora
- [ ] Study analytics (quiz scores, weak topics, streaks)
- [ ] Multi-language note support
- [ ] Video lecture summarisation
- [ ] Collaborative note sharing

---

## 📄 License

MIT © 2026 AskMyNotes

"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Bot,
  User,
  BookOpen,
  Leaf,
  Globe,
  Users,
  Calculator,
  Code,
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Quote,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Brain,
  ListChecks,
  PenLine,
  AlignLeft,
} from "lucide-react"
import { subjects } from "@/lib/constants"

/* ─── Icon map ─── */
const iconMap: Record<string, React.ElementType> = {
  leaf: Leaf,
  globe: Globe,
  "book-open": BookOpen,
  users: Users,
  calculator: Calculator,
  code: Code,
}

/* ─── Types for Chat (Subject Q&A) ─── */
type Confidence = "High" | "Medium" | "Low"

interface Evidence {
  snippet: string
  citation: string
}

interface Citation {
  file: string
  section: string
}

interface AIMessage {
  id: number
  role: "assistant"
  content: string
  confidence: Confidence
  citations: Citation[]
  evidence: Evidence[]
}

interface UserMessage {
  id: number
  role: "user"
  content: string
}

type Message = UserMessage | AIMessage

/* ─── Types for Study Mode (MCQ/Short) ─── */
type MCQ = {
  q: string
  options: string[]
  answer: number
  explanation: string
  citation: string
}
type ShortQ = {
  q: string
  answer: string
  citation: string
}
type SubjectBank = { mcqs: MCQ[]; short: ShortQ[] }

/* ─── Chat Response Bank ─── */
const chatResponseBank: Record<
  string,
  {
    keywords: string[]
    content: string
    confidence: Confidence
    citations: Citation[]
    evidence: Evidence[]
  }[]
> = {
  Biology: [
    {
      keywords: ["photosynthesis", "light", "chlorophyll", "plant"],
      content:
        "Photosynthesis is the process by which green plants convert light energy into chemical energy (glucose). It occurs in chloroplasts and proceeds in two stages:\n\n1. **Light-dependent reactions** — in the thylakoid membranes, light energy is used to produce ATP and NADPH.\n2. **Calvin Cycle** — in the stroma, ATP and NADPH drive the fixation of CO₂ into glucose.\n\nThe overall equation is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
      confidence: "High",
      citations: [
        { file: "Biology_Chapter4.pdf", section: "Page 23, Section 4.2" },
        { file: "Lab_Notes_Week3.txt", section: "Week 3, Experiment Summary" },
      ],
      evidence: [
        {
          snippet:
            "Photosynthesis occurs primarily in the leaves through specialized cell structures called chloroplasts containing the pigment chlorophyll.",
          source: "Biology_Chapter4.pdf · Page 23",
        },
        {
          snippet:
            "The two stages of photosynthesis are the light-dependent reactions (thylakoid) and the Calvin Cycle (stroma).",
          source: "Biology_Chapter4.pdf · Page 27",
        },
      ],
    },
    {
      keywords: ["mitosis", "meiosis", "cell division", "chromosome"],
      content:
        "**Mitosis** produces two genetically identical diploid (2n) daughter cells. It is used for growth, tissue repair, and asexual reproduction.\n\n**Meiosis** produces four genetically unique haploid (n) daughter cells. It is used for sexual reproduction and is responsible for genetic variation through crossing over.",
      confidence: "High",
      citations: [
        { file: "Biology_Chapter7.pdf", section: "Page 68–74, Section 7.3" },
      ],
      evidence: [
        {
          snippet:
            "Mitosis results in two genetically identical daughter cells, each with the same chromosome number as the parent cell.",
          source: "Biology_Chapter7.pdf · Page 68",
        },
        {
          snippet:
            "Meiosis I separates homologous chromosomes; Meiosis II separates sister chromatids, yielding four haploid cells.",
          source: "Biology_Chapter7.pdf · Page 72",
        },
      ],
    },
    {
      keywords: ["dna", "rna", "replication", "gene", "genetics", "protein"],
      content:
        "DNA replication is semi-conservative: each daughter molecule retains one original strand. The process involves:\n- **Helicase** — unwinds the double helix\n- **Primase** — adds RNA primers\n- **DNA Polymerase III** — synthesizes the new strand (5'→3')\n- **Ligase** — seals Okazaki fragments\n\nGene expression then converts DNA → mRNA (transcription) → protein (translation).",
      confidence: "Medium",
      citations: [
        { file: "Biology_Chapter6.pdf", section: "Page 52–60, Section 6.1–6.3" },
      ],
      evidence: [
        {
          snippet:
            "DNA replication is described as semi-conservative because each new double helix retains one parental strand.",
          source: "Biology_Chapter6.pdf · Page 58",
        },
        {
          snippet:
            "DNA polymerase can only add nucleotides in the 5' to 3' direction, requiring a leading and lagging strand.",
          source: "Biology_Chapter6.pdf · Page 55",
        },
      ],
    },
  ],
  "Web Design": [
    {
      keywords: ["flexbox", "flex", "layout", "css", "box model"],
      content:
        "Flexbox is a one-dimensional CSS layout model. Key properties:\n\n- `display: flex` — activates flex container\n- `flex-direction` — row (default) or column\n- `justify-content` — alignment along main axis\n- `align-items` — alignment along cross axis\n- `flex-wrap` — allow items to wrap\n\nThe **CSS Box Model** layers (outside-in): margin → border → padding → content.",
      confidence: "High",
      citations: [
        { file: "WebDesign_Notes.pdf", section: "Page 38–45, Section 5: Layouts" },
      ],
      evidence: [
        {
          snippet:
            "Flexbox is activated by setting display: flex on a parent container, making all direct children flex items.",
          source: "WebDesign_Notes.pdf · Page 38",
        },
        {
          snippet:
            "The CSS Box Model consists of content, padding, border, and margin from inside out.",
          source: "WebDesign_Notes.pdf · Page 15",
        },
      ],
    },
    {
      keywords: ["responsive", "media query", "breakpoint", "mobile"],
      content:
        "Responsive design makes layouts adapt to different screen sizes. Key tools:\n\n- **Media Queries**: `@media (max-width: 768px) { ... }` apply rules conditionally\n- **Fluid Grids**: use `%` widths instead of fixed `px`\n- **Flexible Images**: `max-width: 100%` prevents overflow\n- **Viewport meta tag**: `<meta name=\"viewport\" content=\"width=device-width\">` is required for mobile",
      confidence: "High",
      citations: [
        { file: "WebDesign_Notes.pdf", section: "Page 50–58, Section 6: Responsive" },
      ],
      evidence: [
        {
          snippet:
            "Media queries allow applying different CSS rules depending on device characteristics such as screen width.",
          source: "WebDesign_Notes.pdf · Page 50",
        },
        {
          snippet:
            "Common breakpoints: 480px (mobile), 768px (tablet), 1024px (desktop), 1280px (large desktop).",
          source: "WebDesign_Notes.pdf · Page 54",
        },
      ],
    },
  ],
  Philosophy: [
    {
      keywords: ["ethics", "moral", "utilitarianism", "kant", "deontology"],
      content:
        "**Deontological Ethics (Kant):** Actions are moral or immoral based on adherence to rules/duties, regardless of outcomes. The Categorical Imperative: 'Act only according to maxims you could will to be universal laws.'\n\n**Consequentialism / Utilitarianism (Mill/Bentham):** The morality of an action depends solely on its consequences. The goal is to maximize overall happiness.",
      confidence: "High",
      citations: [
        { file: "Philosophy_Notes.pdf", section: "Page 68–78, Section 7: Ethics" },
      ],
      evidence: [
        {
          snippet:
            "Kant argued morality must be based on universal laws: the Categorical Imperative demands we act only on maxims we could consistently will to be universal.",
          source: "Philosophy_Notes.pdf · Page 70",
        },
        {
          snippet:
            "Bentham proposed the 'felicific calculus' to measure pleasure and pain for ethical decision-making.",
          source: "Philosophy_Notes.pdf · Page 72",
        },
      ],
    },
    {
      keywords: ["plato", "socrates", "forms", "knowledge", "epistemology"],
      content:
        "**Plato's Theory of Forms:** The physical world is an imperfect shadow of a higher realm of eternal, perfect Forms. Material objects are merely copies (e.g., a physical circle approximates the Form of Circle).\n\n**Epistemology** is the branch studying knowledge: its nature, scope, and limits. Key question: What can we know, and how?",
      confidence: "Medium",
      citations: [
        { file: "Philosophy_Notes.pdf", section: "Page 40–48, Section 4: Metaphysics" },
        { file: "Philosophy_Notes.pdf", section: "Page 10–18, Section 1: Epistemology" },
      ],
      evidence: [
        {
          snippet:
            "For Plato, the world perceived by the senses is a realm of shadows and opinions, while the Forms represent true knowledge.",
          source: "Philosophy_Notes.pdf · Page 44",
        },
        {
          snippet:
            "Socrates used questioning (the Socratic method) to expose contradictions and guide interlocutors toward clearer understanding.",
          source: "Philosophy_Notes.pdf · Page 7",
        },
      ],
    },
  ],
}

/* ─── Quiz Question Bank ─── */
const quizQuestionBank: Record<string, SubjectBank> = {
  Biology: {
    mcqs: [
      {
        q: "Which organelle is known as the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"],
        answer: 2,
        explanation:
          "Mitochondria produce ATP through cellular respiration, supplying energy to the cell.",
        citation: "Biology Chapter 2, Page 34",
      },
      {
        q: "What is the primary pigment responsible for photosynthesis?",
        options: ["Carotenoid", "Xanthophyll", "Chlorophyll", "Anthocyanin"],
        answer: 2,
        explanation:
          "Chlorophyll absorbs light energy, mainly red and blue wavelengths, to drive photosynthesis.",
        citation: "Biology Chapter 4, Page 23",
      },
      {
        q: "DNA replication is described as:",
        options: ["Conservative", "Semi-conservative", "Dispersive", "Random"],
        answer: 1,
        explanation:
          "Each daughter DNA molecule retains one original strand and one new strand—semi-conservative.",
        citation: "Biology Chapter 6, Page 58",
      },
      {
        q: "Which base pairs with Adenine in DNA?",
        options: ["Guanine", "Cytosine", "Uracil", "Thymine"],
        answer: 3,
        explanation:
          "Adenine (A) pairs with Thymine (T) via two hydrogen bonds in DNA.",
        citation: "Biology Chapter 6, Page 52",
      },
      {
        q: "Meiosis results in how many daughter cells?",
        options: ["2", "4", "8", "1"],
        answer: 1,
        explanation:
          "Meiosis undergoes two rounds of division, producing four genetically unique haploid cells.",
        citation: "Biology Chapter 7, Page 72",
      },
    ],
    short: [
      {
        q: "Explain the difference between mitosis and meiosis.",
        answer:
          "Mitosis produces two genetically identical diploid daughter cells used for growth and repair. Meiosis produces four genetically unique haploid cells used for sexual reproduction.",
        citation: "Biology Chapter 7, Page 68–74",
      },
      {
        q: "What are the two stages of photosynthesis?",
        answer:
          "1. Light-dependent reactions (in thylakoid membranes) – capture light energy to produce ATP and NADPH.\n2. Calvin Cycle / light-independent reactions (in stroma) – use ATP and NADPH to fix CO₂ into glucose.",
        citation: "Biology Chapter 4, Page 27–28",
      },
      {
        q: "Define natural selection in your own words.",
        answer:
          "Natural selection is the process by which individuals with traits better suited to their environment survive and reproduce more successfully, passing those advantageous traits to offspring over generations.",
        citation: "Biology Chapter 10, Page 110",
      },
    ],
  },
  "Web Design": {
    mcqs: [
      {
        q: "Which CSS property controls the space between the content and the border?",
        options: ["margin", "padding", "border-spacing", "gap"],
        answer: 1,
        explanation:
          "Padding is the inner space between the element's content and its border.",
        citation: "Web Design Notes, Page 12",
      },
      {
        q: "Which HTML tag is used for the largest heading?",
        options: ["<h6>", "<h2>", "<h1>", "<header>"],
        answer: 2,
        explanation: "<h1> represents the top-level heading in HTML hierarchy.",
        citation: "Web Design Notes, Page 4",
      },
      {
        q: "In the CSS box model, which property is outermost?",
        options: ["padding", "border", "margin", "content"],
        answer: 2,
        explanation:
          "The box model layers are: content → padding → border → margin (outermost).",
        citation: "Web Design Notes, Page 15",
      },
      {
        q: "What does CSS stand for?",
        options: [
          "Creative Style Sheets",
          "Cascading Style Sheets",
          "Computer Style Syntax",
          "Cascading System Styles",
        ],
        answer: 1,
        explanation:
          "CSS stands for Cascading Style Sheets, used to style HTML documents.",
        citation: "Web Design Notes, Page 1",
      },
      {
        q: "Which value of 'position' removes an element from the normal document flow?",
        options: ["static", "relative", "absolute", "inherit"],
        answer: 2,
        explanation:
          "position: absolute removes the element from the document flow and positions it relative to its nearest positioned ancestor.",
        citation: "Web Design Notes, Page 22",
      },
    ],
    short: [
      {
        q: "Explain the difference between inline and block elements.",
        answer:
          "Block elements (e.g., <div>, <p>) start on a new line and take full width. Inline elements (e.g., <span>, <a>) flow within text and take only as much width as needed.",
        citation: "Web Design Notes, Page 8",
      },
      {
        q: "What is the purpose of media queries in CSS?",
        answer:
          "Media queries allow CSS rules to be applied conditionally based on device characteristics such as screen width, enabling responsive design that adapts to different screen sizes.",
        citation: "Web Design Notes, Page 38",
      },
      {
        q: "Describe the Flexbox layout model.",
        answer:
          "Flexbox is a one-dimensional CSS layout model that distributes space along a main axis (row or column). It provides properties like justify-content, align-items, and flex-wrap to control how children are arranged.",
        citation: "Web Design Notes, Page 42",
      },
    ],
  },
  Philosophy: {
    mcqs: [
      {
        q: "Who authored 'Critique of Pure Reason'?",
        options: ["Hegel", "Descartes", "Kant", "Nietzsche"],
        answer: 2,
        explanation:
          "Immanuel Kant wrote 'Critique of Pure Reason' (1781), examining the limits of human knowledge.",
        citation: "Philosophy Notes, Page 55",
      },
      {
        q: "The philosophical position that reality is fundamentally mental is called:",
        options: ["Materialism", "Dualism", "Idealism", "Empiricism"],
        answer: 2,
        explanation:
          "Idealism holds that reality is mentally constructed or immaterial.",
        citation: "Philosophy Notes, Page 20",
      },
      {
        q: "Which philosopher famously said 'I think, therefore I am'?",
        options: ["Aristotle", "Descartes", "Locke", "Hume"],
        answer: 1,
        explanation:
          "René Descartes used 'Cogito, ergo sum' as the foundation of his rationalist philosophy.",
        citation: "Philosophy Notes, Page 32",
      },
      {
        q: "Utilitarianism was developed primarily by:",
        options: ["Kant", "Aristotle", "Bentham and Mill", "Nietzsche"],
        answer: 2,
        explanation:
          "Jeremy Bentham and John Stuart Mill developed Utilitarianism, which judges actions by their consequences for overall happiness.",
        citation: "Philosophy Notes, Page 68",
      },
      {
        q: "What branch of philosophy deals with the nature of knowledge?",
        options: ["Ethics", "Metaphysics", "Epistemology", "Logic"],
        answer: 2,
        explanation:
          "Epistemology studies knowledge: its nature, scope, and limits.",
        citation: "Philosophy Notes, Page 10",
      },
    ],
    short: [
      {
        q: "What is the Socratic method?",
        answer:
          "The Socratic method is a form of cooperative argumentative dialogue in which Socrates asked probing questions to expose contradictions in others' beliefs and guide them toward clearer understanding.",
        citation: "Philosophy Notes, Page 7",
      },
      {
        q: "Distinguish between deontological and consequentialist ethics.",
        answer:
          "Deontological ethics (e.g., Kant) judges the morality of an action based on rules or duties, regardless of outcomes. Consequentialist ethics (e.g., Utilitarianism) judges actions solely by their consequences or outcomes.",
        citation: "Philosophy Notes, Page 70–75",
      },
      {
        q: "What is Plato's Theory of Forms?",
        answer:
          "Plato argued that the physical world is a shadow of a higher reality of eternal, perfect 'Forms' or 'Ideas'. Material things are imperfect copies of these abstract Forms (e.g., a circle is an imperfect copy of the perfect Form of a Circle).",
        citation: "Philosophy Notes, Page 44",
      },
    ],
  },
}

// Fallback bank for subjects not explicitly mapped
const fallbackBank: SubjectBank = {
  mcqs: [
    {
      q: "This subject has many foundational concepts. Which of the following best describes a primary key in a database?",
      options: [
        "A key used for encryption",
        "A uniquely identifying field in a table",
        "A foreign reference field",
        "A composite attribute",
      ],
      answer: 1,
      explanation: "A primary key uniquely identifies each record in a table.",
      citation: "Study Notes, Chapter 1",
    },
    {
      q: "Which data structure uses FIFO (First In, First Out) ordering?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      answer: 1,
      explanation: "A Queue processes elements in the order they were added.",
      citation: "Study Notes, Chapter 3",
    },
    {
      q: "What does API stand for?",
      options: [
        "Application Program Interface",
        "Applied Programming Input",
        "Automated Process Integration",
        "Application Protocol Interface",
      ],
      answer: 0,
      explanation:
        "API stands for Application Programming Interface, enabling software components to communicate.",
      citation: "Study Notes, Chapter 5",
    },
    {
      q: "Which sorting algorithm has O(n log n) average time complexity?",
      options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
      answer: 2,
      explanation: "Merge Sort consistently achieves O(n log n) time complexity.",
      citation: "Study Notes, Chapter 7",
    },
    {
      q: "What is encapsulation in OOP?",
      options: [
        "Inheriting from a parent class",
        "Hiding internal state behind a public interface",
        "Creating multiple instances of a class",
        "Overriding a parent method",
      ],
      answer: 1,
      explanation:
        "Encapsulation bundles data and methods, restricting direct access to an object's internal state.",
      citation: "Study Notes, Chapter 9",
    },
  ],
  short: [
    {
      q: "Explain the concept of abstraction in programming.",
      answer:
        "Abstraction simplifies complex systems by exposing only the necessary parts and hiding implementation details. For example, calling a function without knowing its internal logic is a form of abstraction.",
      citation: "Study Notes, Chapter 9",
    },
    {
      q: "What is the difference between a compiler and an interpreter?",
      answer:
        "A compiler translates the entire source code into machine code before execution. An interpreter translates and executes code line by line, making debugging easier but often slower.",
      citation: "Study Notes, Chapter 2",
    },
    {
      q: "Describe the client–server model.",
      answer:
        "In the client–server model, a client device sends requests to a centralized server, which processes them and returns responses. Examples include web browsers (clients) requesting pages from web servers.",
      citation: "Study Notes, Chapter 6",
    },
  ],
}

function getBank(subjectName: string): SubjectBank {
  return quizQuestionBank[subjectName] ?? fallbackBank
}

// Helper to map visual name to backend ID
function getBackendSubjectId(name: string) {
  switch (name) {
    case "Biology": return "subject1";
    case "Web Design": return "subject2";
    case "Philosophy": return "subject3";
    default: return "subject1";
  }
}

// Helper to fetch actual AI response from the backend
async function fetchBackendAIResponse(
  subjectName: string,
  question: string
): Promise<Omit<AIMessage, "id" | "role">> {
  try {
    const formData = new FormData()
    formData.append("subject", getBackendSubjectId(subjectName))
    formData.append("question", question)

    const response = await fetch("http://127.0.0.1:8000/ask_v2", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Map backend response format to our UI components
    return {
      content: data.answer || "No response received.",
      confidence: (data.confidence as Confidence) || "Low",
      citations: data.evidence.map((ev: any) => {
        const parts = ev.citation.split("|")
        return {
          file: parts[0]?.trim() || "Unknown Source",
          section: parts[1]?.trim() || "Unknown Page",
        }
      }),
      evidence: data.evidence.map((ev: any) => ({
        snippet: ev.snippet,
        citation: ev.citation,
      })),
    }
  } catch (error) {
    console.error("Backend ask_v2 error:", error)
    return {
      content: "Failed to connect to the backend. Is the FastAPI server running?",
      confidence: "Low",
      citations: [],
      evidence: [],
    }
  }
}

/* ─── Confidence badge ─── */
function ConfidenceBadge({ level }: { level: Confidence }) {
  const config = {
    High: {
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20",
    },
    Medium: {
      icon: MinusCircle,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20",
    },
    Low: {
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
    },
  }
  const c = config[level]
  const Icon = c.icon
  return (
    <span
      className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${c.color} ${c.bg} ${c.border}`}
    >
      <Icon className="h-3 w-3" />
      {level} Confidence
    </span>
  )
}

/* ─── AI bubble ─── */
function AIBubble({
  msg,
  subjectColor,
}: {
  msg: AIMessage
  subjectColor: string
}) {
  const [showEvidence, setShowEvidence] = useState(false)

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)]">
        <Bot className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex max-w-[85%] flex-col gap-2">
        {/* Answer */}
        <div className="rounded-2xl rounded-tl-sm bg-[rgba(255,255,255,0.04)] px-4 py-3">
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
            {msg.content}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          <ConfidenceBadge level={msg.confidence} />
          {/* Citations */}
          {msg.citations.map((c, i) => (
            <span
              key={i}
              className="flex items-center gap-1 rounded-md bg-green-1/10 px-2 py-0.5 text-[10px] text-green-3"
            >
              <FileText className="h-2.5 w-2.5 shrink-0" />
              {c.file} · {c.section}
            </span>
          ))}
        </div>

        {/* Evidence toggle */}
        <button
          onClick={() => setShowEvidence((v) => !v)}
          className="flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-foreground"
        >
          <Quote className="h-3 w-3" />
          {showEvidence ? "Hide" : "Show"} supporting evidence
          {showEvidence ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>

        {/* Evidence snippets */}
        {showEvidence && (
          <div className="flex flex-col gap-2">
            {msg.evidence.map((ev, i) => (
              <div
                key={i}
                className="rounded-xl border-l-2 py-2 pl-3 pr-4"
                style={{
                  borderColor: subjectColor,
                  backgroundColor: `${subjectColor}08`,
                }}
              >
                <p className="text-[11px] italic leading-relaxed text-muted-foreground">
                  "{ev.snippet}"
                </p>
                <p
                  className="mt-1 text-[10px] font-medium"
                  style={{ color: subjectColor }}
                >
                  — {ev.citation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Main page ─── */
type View = "pick" | "chat" | "mode-picker" | "mcq" | "short"

export default function StudyPage() {
  const [view, setView] = useState<View>("pick")
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null)

  // Chat state
  const [showSubjectPicker, setShowSubjectPicker] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedSubject = selectedSubjectId ? subjects.find((s) => s.id === selectedSubjectId)! : null
  const SubjectIcon = selectedSubject ? iconMap[selectedSubject.icon] || BookOpen : BookOpen
  const activeBank = selectedSubject ? getBank(selectedSubject.name) : fallbackBank

  // Auto-scroll for chat
  useEffect(() => {
    if (view === "chat") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping, view])

  // Routing
  const startChat = (id: number) => {
    setSelectedSubjectId(id)
    setMessages([])
    setView("chat")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const startQuizMode = (id: number) => {
    setSelectedSubjectId(id)
    setSelectedAnswers({})
    setRevealed({})
    setView("mode-picker")
  }

  const handleBack = () => {
    if (view === "chat" || view === "mode-picker") {
      setView("pick")
      setSelectedSubjectId(null)
    } else if (view === "mcq" || view === "short") {
      setView("mode-picker")
    }
  }

  // Chat Subject change
  const changeSubject = (id: number) => {
    setSelectedSubjectId(id)
    setMessages([])
    setShowSubjectPicker(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  /* ───────────────── 1. SUBJECT PICKER LANDING ───────────────── */
  if (view === "pick") {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 p-4 lg:p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-1/20">
            <Sparkles className="h-5 w-5 text-green-2" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Study &amp; Q&amp;A</h1>
            <p className="text-sm text-muted-foreground">
              Ask questions or test your knowledge from your uploaded notes
            </p>
          </div>
        </div>

        {/* Subject cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {subjects.slice(0, 3).map((s) => {
            const SIcon = iconMap[s.icon] || BookOpen
            const bankLength = getBank(s.name)
            return (
              <div
                key={s.id}
                className="glass flex flex-col gap-6 rounded-2xl p-6 transition-all"
              >
                {/* Top Section */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${s.color}20` }}
                  >
                    <SIcon className="h-7 w-7" style={{ color: s.color }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-foreground">{s.name}</h2>
                    <p className="mt-1 text-[11px] text-muted-foreground">{s.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex w-full gap-2">
                  <div className="flex flex-1 flex-col items-center rounded-xl py-2" style={{ backgroundColor: `${s.color}12` }}>
                    <ShieldCheck className="mb-1 h-3.5 w-3.5" style={{ color: s.color }} />
                    <span className="text-xs font-bold text-foreground">Grounded</span>
                    <span className="text-[9px] text-muted-foreground">Q&amp;A</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center rounded-xl py-2" style={{ backgroundColor: `${s.color}12` }}>
                    <ListChecks className="mb-1 h-3.5 w-3.5" style={{ color: s.color }} />
                    <span className="text-xs font-bold text-foreground">{bankLength.mcqs.length}</span>
                    <span className="text-[9px] text-muted-foreground">MCQs</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center rounded-xl py-2" style={{ backgroundColor: `${s.color}12` }}>
                    <AlignLeft className="mb-1 h-3.5 w-3.5" style={{ color: s.color }} />
                    <span className="text-xs font-bold text-foreground">{bankLength.short.length}</span>
                    <span className="text-[9px] text-muted-foreground">Short Ans</span>
                  </div>
                </div>

                {/* Row of buttons */}
                <div className="mt-auto flex gap-3 pt-2">
                  <button
                    onClick={() => startChat(s.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[rgba(255,255,255,0.1)] py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-[rgba(255,255,255,0.05)]"
                  >
                    Ask Questions
                  </button>
                  <button
                    onClick={() => startQuizMode(s.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: `${s.color}25`,
                      color: s.color,
                    }}
                  >
                    Start Studying
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ───────────────── 2. CHAT VIEW ───────────────── */
  if (view === "chat" && selectedSubject) {
    const sendMessage = async () => {
      if (!input.trim() || isTyping) return
      const q = input.trim()
      setInput("")

      const userMsg: UserMessage = {
        id: Date.now(),
        role: "user",
        content: q,
      }
      setMessages((prev) => [...prev, userMsg])
      setIsTyping(true)

      // Fetch from real backend
      const resp = await fetchBackendAIResponse(selectedSubject.name, q)
      const aiMsg: AIMessage = {
        id: Date.now() + 1,
        role: "assistant",
        ...resp,
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }

    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col p-4 lg:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${selectedSubject.color}20` }}
            >
              <SubjectIcon className="h-4 w-4" style={{ color: selectedSubject.color }} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{selectedSubject.name} Q&amp;A</h1>
              <p className="text-xs text-muted-foreground">
                Answers grounded exclusively in your uploaded notes
              </p>
            </div>
          </div>

          {/* Subject selector */}
          <div className="relative">
            <button
              onClick={() => setShowSubjectPicker((v) => !v)}
              className="glass flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-[rgba(255,255,255,0.08)]"
            >
              <div
                className="flex h-5 w-5 items-center justify-center rounded-md"
                style={{ backgroundColor: `${selectedSubject.color}25` }}
              >
                <SubjectIcon className="h-3 w-3" style={{ color: selectedSubject.color }} />
              </div>
              {selectedSubject.name}
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${showSubjectPicker ? "rotate-180" : ""
                  }`}
              />
            </button>

            {showSubjectPicker && (
              <div className="glass absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl py-2 shadow-xl">
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Switch Subject
                </p>
                {subjects.slice(0, 3).map((s) => {
                  const SIcon = iconMap[s.icon] || BookOpen
                  const isActive = s.id === selectedSubjectId
                  return (
                    <button
                      key={s.id}
                      onClick={() => changeSubject(s.id)}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-[rgba(255,255,255,0.06)] ${isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                    >
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${s.color}20` }}
                      >
                        <SIcon className="h-3.5 w-3.5" style={{ color: s.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground">{s.files} files</p>
                      </div>
                      {isActive && (
                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="glass flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl">
          <div className="flex flex-1 flex-col gap-5 overflow-auto p-5 lg:p-6">
            {messages.length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${selectedSubject.color}20` }}
                >
                  <SubjectIcon className="h-8 w-8" style={{ color: selectedSubject.color }} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Ask anything about {selectedSubject.name}
                  </h2>
                  <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                    Your answers will include citations, confidence levels, and
                    supporting evidence from your uploaded notes.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {[
                    selectedSubject.name === "Biology" ? "What is photosynthesis?" : selectedSubject.name === "Web Design" ? "How does Flexbox work?" : "What is Kantian ethics?",
                    selectedSubject.name === "Biology" ? "Explain DNA replication" : selectedSubject.name === "Web Design" ? "What are media queries?" : "Explain Plato's Theory of Forms",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q)
                        setTimeout(() => inputRef.current?.focus(), 50)
                      }}
                      className="rounded-xl border border-[rgba(255,255,255,0.1)] px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-foreground"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="flex justify-end gap-3">
                  <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-green-1/15 px-4 py-3 text-sm text-foreground">
                    {msg.content}
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-1/20">
                    <User className="h-4 w-4 text-green-2" />
                  </div>
                </div>
              ) : (
                <AIBubble key={msg.id} msg={msg as AIMessage} subjectColor={selectedSubject.color} />
              )
            )}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)]">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-[rgba(255,255,255,0.04)] px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: selectedSubject.color, animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: selectedSubject.color, animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: selectedSubject.color, animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-[rgba(255,255,255,0.05)] p-4">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-green-2" />
              <p className="text-[11px] text-muted-foreground">
                Answering from <span style={{ color: selectedSubject.color }} className="font-semibold">{selectedSubject.name}</span> notes only · <span className="text-muted-foreground/60">{selectedSubject.files} files, {selectedSubject.files * 22} pages</span>
              </p>
            </div>
            <div className="glass flex items-center gap-3 rounded-xl px-4 py-2.5">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={`Ask a question about ${selectedSubject.name}…`}
                className="flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all disabled:opacity-30"
                style={{ backgroundColor: `${selectedSubject.color}30` }}
              >
                <Send className="h-3.5 w-3.5" style={{ color: selectedSubject.color }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ───────────────── 3. STUDY MODE PICKER ───────────────── */
  if (view === "mode-picker" && selectedSubject) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 p-4 lg:p-6">
        <button
          onClick={handleBack}
          className="flex w-fit items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.05)] hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Choose Subject
        </button>

        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${selectedSubject.color}20` }}
          >
            <SubjectIcon className="h-7 w-7" style={{ color: selectedSubject.color }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Study {selectedSubject.name}</h1>
            <p className="text-sm text-muted-foreground">Choose a test format to evaluate your knowledge</p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
          {/* MCQ */}
          <button
            onClick={() => setView("mcq")}
            className="glass group flex flex-col items-start gap-6 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02]"
            style={{ borderColor: `${selectedSubject.color}30` }}
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${selectedSubject.color}20` }}
            >
              <ListChecks className="h-8 w-8" style={{ color: selectedSubject.color }} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Multiple Choice</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {activeBank.mcqs.length} MCQs with 4 options each. Select an answer, then reveal the correct
                option with a full explanation and citation from your notes.
              </p>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="text-xs text-muted-foreground">{activeBank.mcqs.length} questions · Instant feedback</span>
              <div
                className="rounded-xl px-5 py-2.5 text-sm font-semibold"
                style={{ backgroundColor: `${selectedSubject.color}25`, color: selectedSubject.color }}
              >
                Start MCQ →
              </div>
            </div>
          </button>

          {/* Short Answer */}
          <button
            onClick={() => setView("short")}
            className="glass group flex flex-col items-start gap-6 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02]"
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${selectedSubject.color}20` }}
            >
              <PenLine className="h-8 w-8" style={{ color: selectedSubject.color }} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Short Answer</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {activeBank.short.length} open-ended questions with detailed model answers. Review the answer
                and source citations from your study materials.
              </p>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="text-xs text-muted-foreground">{activeBank.short.length} questions · Model answers</span>
              <div
                className="rounded-xl px-5 py-2.5 text-sm font-semibold"
                style={{ backgroundColor: `${selectedSubject.color}25`, color: selectedSubject.color }}
              >
                Start Short Ans →
              </div>
            </div>
          </button>
        </div>
      </div>
    )
  }

  /* ───────────────── 4. MCQ VIEW ───────────────── */
  if (view === "mcq" && selectedSubject) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 p-4 lg:p-6 overflow-hidden">
        <button
          onClick={handleBack}
          className="flex w-fit items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.05)] hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Choose Mode
        </button>

        <div className="flex items-center gap-3 shrink-0">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${selectedSubject.color}20` }}
          >
            <ListChecks className="h-5 w-5" style={{ color: selectedSubject.color }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {selectedSubject.name} — Multiple Choice
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeBank.mcqs.length} questions · Select an answer then reveal explanation
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-xl">
          <div className="flex flex-col gap-6 pb-4">
            {activeBank.mcqs.map((mcq, qi) => {
              const chosen = selectedAnswers[qi]
              const isRevealed = revealed[qi]
              return (
                <div key={qi} className="glass flex flex-col gap-4 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{ backgroundColor: `${selectedSubject.color}20`, color: selectedSubject.color }}
                    >
                      {qi + 1}
                    </span>
                    <p className="text-sm font-semibold text-foreground">{mcq.q}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {mcq.options.map((opt, oi) => {
                      let cls = "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm text-left transition-all cursor-pointer "
                      if (!isRevealed) {
                        cls += chosen === oi
                          ? "border-green-1/50 bg-green-1/10 text-foreground"
                          : "border-[rgba(255,255,255,0.08)] text-muted-foreground hover:border-[rgba(255,255,255,0.2)] hover:text-foreground"
                      } else {
                        if (oi === mcq.answer) {
                          cls += "border-green-1/60 bg-green-1/15 text-green-2"
                        } else if (chosen === oi) {
                          cls += "border-red-500/40 bg-red-500/10 text-red-400"
                        } else {
                          cls += "border-[rgba(255,255,255,0.05)] text-muted-foreground/50"
                        }
                      }
                      return (
                        <button
                          key={oi}
                          className={cls}
                          disabled={isRevealed}
                          onClick={() => setSelectedAnswers((prev) => ({ ...prev, [qi]: oi }))}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.2)] text-[10px] font-bold">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                          {isRevealed && oi === mcq.answer && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-green-2" />}
                          {isRevealed && chosen === oi && oi !== mcq.answer && <XCircle className="ml-auto h-4 w-4 shrink-0 text-red-400" />}
                        </button>
                      )
                    })}
                  </div>

                  {!isRevealed && (
                    <button
                      onClick={() => setRevealed((prev) => ({ ...prev, [qi]: true }))}
                      disabled={chosen === undefined}
                      className="self-start rounded-xl px-4 py-2 text-xs font-semibold transition-all disabled:opacity-30"
                      style={{ backgroundColor: `${selectedSubject.color}25`, color: selectedSubject.color }}
                    >
                      Reveal Answer
                    </button>
                  )}

                  {isRevealed && (
                    <div
                      className="flex flex-col gap-2 rounded-xl p-4"
                      style={{ backgroundColor: `${selectedSubject.color}10` }}
                    >
                      <p className="text-xs font-semibold" style={{ color: selectedSubject.color }}>Explanation</p>
                      <p className="text-xs text-muted-foreground">{mcq.explanation}</p>
                      <span className="flex w-fit items-center gap-1 rounded-md bg-green-1/10 px-2 py-0.5 text-[10px] text-green-3">
                        <FileText className="h-2.5 w-2.5" />
                        {mcq.citation}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  /* ───────────────── 5. SHORT ANSWER VIEW ───────────────── */
  if (view === "short" && selectedSubject) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col gap-6 p-4 lg:p-6 overflow-hidden">
        <button
          onClick={handleBack}
          className="flex w-fit items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.05)] hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Choose Mode
        </button>

        <div className="flex items-center gap-3 shrink-0">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${selectedSubject.color}20` }}
          >
            <PenLine className="h-5 w-5" style={{ color: selectedSubject.color }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {selectedSubject.name} — Short Answer
            </h1>
            <p className="text-xs text-muted-foreground">
              {activeBank.short.length} questions · Tap "Show Answer" to reveal the model answer
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-xl">
          <div className="flex flex-col gap-6 pb-4">
            {activeBank.short.map((sq, qi) => {
              const isRevealed = revealed[qi]
              return (
                <div key={qi} className="glass flex flex-col gap-4 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{ backgroundColor: `${selectedSubject.color}20`, color: selectedSubject.color }}
                    >
                      {qi + 1}
                    </span>
                    <p className="text-sm font-semibold text-foreground">{sq.q}</p>
                  </div>

                  {!isRevealed ? (
                    <button
                      onClick={() => setRevealed((prev) => ({ ...prev, [qi]: true }))}
                      className="self-start rounded-xl px-4 py-2 text-xs font-semibold transition-all"
                      style={{ backgroundColor: `${selectedSubject.color}25`, color: selectedSubject.color }}
                    >
                      Show Answer
                    </button>
                  ) : (
                    <div
                      className="flex flex-col gap-3 rounded-xl p-4"
                      style={{ backgroundColor: `${selectedSubject.color}10` }}
                    >
                      <p className="text-xs font-semibold" style={{ color: selectedSubject.color }}>Model Answer</p>
                      <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                        {sq.answer}
                      </p>
                      <span className="flex w-fit items-center gap-1 rounded-md bg-green-1/10 px-2 py-0.5 text-[10px] text-green-3">
                        <FileText className="h-2.5 w-2.5" />
                        {sq.citation}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return null
}

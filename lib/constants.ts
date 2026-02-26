export const courses = [
  {
    id: 1,
    title: "UI/UX Design",
    classes: 3,
    color: "from-[#6366f1] to-[#818cf8]",
    bgColor: "bg-[#6366f1]/20",
    students: 3,
    icon: "palette",
  },
  {
    id: 2,
    title: "Derivation",
    classes: 3,
    color: "from-[#06b6d4] to-[#67e8f9]",
    bgColor: "bg-[#06b6d4]/20",
    students: 3,
    icon: "compass",
  },
  {
    id: 3,
    title: "Photoshop Course",
    classes: 3,
    color: "from-[#38bdf8] to-[#7dd3fc]",
    bgColor: "bg-[#38bdf8]/20",
    students: 3,
    icon: "image",
  },
]

export const calendarEvents = [
  {
    id: 1,
    date: "24 November",
    time: "09:00",
    subject: "Philosophy",
    topic: "Geological evolution",
    color: "#84B179",
  },
  {
    id: 2,
    date: "25 November",
    time: "12:00",
    subject: "Web design",
    topic: "Color composition",
    color: "#A2CB8B",
  },
  {
    id: 3,
    date: "26 November",
    time: "10:00",
    subject: "Sociology",
    topic: "Ethics of science",
    color: "#C7EABB",
  },
]

export const chartData = [
  { subject: "Biology", score: 76, fill: "#6366f1" },
  { subject: "Geography", score: 58, fill: "#818cf8" },
  { subject: "History", score: 85, fill: "#a78bfa" },
  { subject: "Math", score: 62, fill: "#c4b5fd" },
  { subject: "Literature", score: 71, fill: "#8b5cf6" },
  { subject: "Art", score: 90, fill: "#7c3aed" },
  { subject: "Comp. Science", score: 67, fill: "#6d28d9" },
]

export const userProfile = {
  name: "Mariya Bestkity",
  level: "Sophomore",
  meanScore: 192,
  avatar: "/avatar.jpg",
}

export const subjects = [
  {
    id: 1,
    name: "Biology",
    files: 4,
    progress: 72,
    color: "#84B179",
    icon: "leaf",
    description: "Cell biology, genetics, and evolution",
  },
  {
    id: 2,
    name: "Web Design",
    files: 6,
    progress: 88,
    color: "#A2CB8B",
    icon: "globe",
    description: "HTML, CSS, UI/UX principles",
  },
  {
    id: 3,
    name: "Philosophy",
    files: 3,
    progress: 45,
    color: "#C7EABB",
    icon: "book-open",
    description: "Ethics, logic, and metaphysics",
  },
  {
    id: 4,
    name: "Sociology",
    files: 5,
    progress: 60,
    color: "#E8F5BD",
    icon: "users",
    description: "Social structures and behavior",
  },
  {
    id: 5,
    name: "Mathematics",
    files: 8,
    progress: 35,
    color: "#84B179",
    icon: "calculator",
    description: "Calculus, algebra, and statistics",
  },
  {
    id: 6,
    name: "Computer Science",
    files: 7,
    progress: 91,
    color: "#A2CB8B",
    icon: "code",
    description: "Data structures and algorithms",
  },
]

export const chatMessages = [
  {
    id: 1,
    role: "user" as const,
    content: "What is photosynthesis?",
    timestamp: "09:30 AM",
  },
  {
    id: 2,
    role: "assistant" as const,
    content:
      "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water. It generally involves the green pigment chlorophyll and generates oxygen as a by-product.",
    timestamp: "09:30 AM",
    sources: ["Biology Chapter 4, Page 23", "Lab Notes - Week 3"],
  },
  {
    id: 3,
    role: "user" as const,
    content: "What are the two stages of photosynthesis?",
    timestamp: "09:32 AM",
  },
  {
    id: 4,
    role: "assistant" as const,
    content:
      "The two main stages of photosynthesis are:\n\n1. **Light-dependent reactions** - These occur in the thylakoid membranes and require direct light to produce ATP and NADPH.\n\n2. **Light-independent reactions (Calvin Cycle)** - These occur in the stroma and use ATP and NADPH to convert CO2 into glucose.",
    timestamp: "09:33 AM",
    sources: ["Biology Chapter 4, Page 27-28"],
  },
]

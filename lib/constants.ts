export const courses = [
  {
    id: 1,
    title: "Mathematics",
    classes: 3,
    color: "from-[#6366f1] to-[#818cf8]",
    bgColor: "bg-[#6366f1]/20",
    students: 3,
    icon: "calculator",
  },
  {
    id: 2,
    title: "Web development",
    classes: 3,
    color: "from-[#06b6d4] to-[#67e8f9]",
    bgColor: "bg-[#06b6d4]/20",
    students: 3,
    icon: "globe",
  },
  {
    id: 3,
    title: "Java",
    classes: 3,
    color: "from-[#38bdf8] to-[#7dd3fc]",
    bgColor: "bg-[#38bdf8]/20",
    students: 3,
    icon: "code",
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
  { subject: "Mathematics", mcq: 85, short: 65 },
  { subject: "Web dev.", mcq: 90, short: 80 },
  { subject: "Java", mcq: 75, short: 55 },
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
    name: "Mathematics",
    files: 4,
    progress: 72,
    color: "#84B179",
    icon: "calculator",
    description: "Calculus, algebra, and statistics",
  },
  {
    id: 2,
    name: "Web development",
    files: 6,
    progress: 88,
    color: "#A2CB8B",
    icon: "globe",
    description: "HTML, CSS, JavaScript frameworks",
  },
  {
    id: 3,
    name: "Java",
    files: 3,
    progress: 45,
    color: "#C7EABB",
    icon: "code",
    description: "Object-oriented programming in Java",
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

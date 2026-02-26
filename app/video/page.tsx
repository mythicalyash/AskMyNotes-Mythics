"use client"

import { useState } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  Send,
  Bot,
  User,
  Clock,
  MessageSquare,
} from "lucide-react"

interface VideoMessage {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp?: string
  videoTime?: string
}

const sampleCaptions = [
  { time: "00:00", text: "Welcome to the Biology lecture on photosynthesis." },
  {
    time: "02:15",
    text: "Today we will explore how plants convert light energy into chemical energy.",
  },
  {
    time: "05:30",
    text: "The process occurs in two main stages: light-dependent and light-independent reactions.",
  },
  {
    time: "08:45",
    text: "Chlorophyll plays a crucial role in absorbing light energy.",
  },
  {
    time: "12:00",
    text: "The Calvin Cycle converts CO2 into glucose using ATP and NADPH.",
  },
]

export default function VideoPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState("05:30")
  const [messages, setMessages] = useState<VideoMessage[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "I am watching this lecture with you. Ask me anything about what is being discussed, and I will provide timestamp-aware answers.",
      videoTime: "00:00",
    },
    {
      id: 2,
      role: "user",
      content: "What was just explained about the light-dependent reactions?",
      videoTime: "05:30",
    },
    {
      id: 3,
      role: "assistant",
      content:
        "At 05:30, the lecturer explains that photosynthesis occurs in two main stages. The light-dependent reactions happen in the thylakoid membranes, where water molecules are split and ATP/NADPH are produced using light energy absorbed by chlorophyll.",
      videoTime: "05:30",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [progress] = useState(35)

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const userMsg: VideoMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputMessage,
      videoTime: currentTime,
    }

    const aiResponse: VideoMessage = {
      id: messages.length + 2,
      role: "assistant",
      content: `At timestamp ${currentTime}, the lecture discusses this topic. Based on the video content and captions, ${
        inputMessage.toLowerCase().includes("calvin")
          ? "the Calvin Cycle is explained starting at 12:00, where CO2 is converted into glucose using ATP and NADPH produced in the light-dependent reactions."
          : "the relevant content can be found in the current segment. The lecturer provides a detailed explanation in the following minutes."
      }`,
      videoTime: currentTime,
    }

    setMessages((prev) => [...prev, userMsg, aiResponse])
    setInputMessage("")
  }

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col gap-4 p-4 lg:flex-row lg:p-6">
      {/* Video Player Section */}
      <div className="flex flex-1 flex-col gap-3">
        {/* Video Frame */}
        <div className="glass relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a]" />

          {/* Play overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-green-1/20 text-green-2 transition-all hover:scale-110 hover:bg-green-1/30"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 fill-current" />
            ) : (
              <Play className="ml-1 h-6 w-6 fill-current" />
            )}
          </button>

          {/* Video Title */}
          <div className="absolute left-4 top-4 z-10">
            <span className="rounded-lg bg-[rgba(0,0,0,0.6)] px-3 py-1 text-xs font-medium text-foreground">
              Biology Lecture - Photosynthesis
            </span>
          </div>

          {/* Caption Display */}
          <div className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2">
            <span className="rounded-lg bg-[rgba(0,0,0,0.7)] px-4 py-2 text-xs text-foreground">
              {sampleCaptions.find((c) => c.time === currentTime)?.text ||
                "The process occurs in two main stages..."}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-3">
            <div className="h-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.15)]">
              <div
                className="h-full rounded-full bg-green-1 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass flex items-center justify-between rounded-xl px-4 py-2">
          <div className="flex items-center gap-2">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-foreground"
              aria-label="Skip back"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-1/20 text-green-2 transition-colors hover:bg-green-1/30"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="ml-0.5 h-4 w-4" />
              )}
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-foreground"
              aria-label="Skip forward"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          <span className="text-xs text-muted-foreground">
            {currentTime} / 45:00
          </span>

          <div className="flex items-center gap-2">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-foreground"
              aria-label="Volume"
            >
              <Volume2 className="h-4 w-4" />
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-foreground"
              aria-label="Fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Captions / Timeline */}
        <div className="glass flex flex-col gap-2 rounded-2xl p-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <MessageSquare className="h-3.5 w-3.5 text-green-2" />
            Captions Timeline
          </h3>
          <div className="flex flex-col gap-1.5">
            {sampleCaptions.map((caption, i) => (
              <button
                key={i}
                onClick={() => setCurrentTime(caption.time)}
                className={`flex items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                  currentTime === caption.time
                    ? "bg-green-1/10 text-foreground"
                    : "text-muted-foreground hover:bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                <span className="flex shrink-0 items-center gap-1 text-[10px] font-mono">
                  <Clock className="h-2.5 w-2.5" />
                  {caption.time}
                </span>
                <span className="text-xs">{caption.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      <div className="flex w-full flex-col gap-3 lg:w-96">
        <div className="glass flex items-center gap-2 rounded-xl px-4 py-2">
          <Bot className="h-4 w-4 text-green-2" />
          <span className="text-sm font-medium text-foreground">
            Video AI Assistant
          </span>
          <span className="ml-auto rounded-md bg-green-1/10 px-2 py-0.5 text-[10px] text-green-2">
            Synced at {currentTime}
          </span>
        </div>

        {/* Messages */}
        <div className="glass flex flex-1 flex-col gap-3 overflow-auto rounded-2xl p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user"
                    ? "bg-green-1/20"
                    : "bg-[rgba(255,255,255,0.08)]"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-3.5 w-3.5 text-green-2" />
                ) : (
                  <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <div className="flex max-w-[80%] flex-col gap-1">
                <div
                  className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-green-1/15 text-foreground"
                      : "bg-[rgba(255,255,255,0.05)] text-muted-foreground"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.videoTime && (
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                    <Clock className="h-2 w-2" />
                    at {msg.videoTime}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="glass flex items-center gap-2 rounded-xl px-3 py-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about the video..."
            className="flex-1 border-none bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Video question input"
          />
          <button
            onClick={sendMessage}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-1/20 text-green-2 transition-colors hover:bg-green-1/30"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

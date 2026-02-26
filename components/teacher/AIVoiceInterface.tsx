"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, VolumeX, Volume2, Loader2, Send, Calculator, Globe, Code } from "lucide-react"

type Subject = {
    id: string
    name: string
    color: string
    icon: React.ElementType
}

const SUBJECTS: Subject[] = [
    { id: "subject1", name: "Mathematics", color: "#84B179", icon: Calculator },
    { id: "subject2", name: "Web development", color: "#A2CB8B", icon: Globe },
    { id: "subject3", name: "Java", color: "#C7EABB", icon: Code },
]

// Types
type Message = {
    role: "user" | "ai"
    content: string
}

export default function AIVoiceInterface() {
    const [selectedSubject, setSelectedSubject] = useState<Subject>(SUBJECTS[0])
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hello! I'm your AI teacher. What would you like to learn today?" }
    ])
    const [inputText, setInputText] = useState("")
    const [speechEnabled, setSpeechEnabled] = useState(true)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Web Speech API references
    const recognitionRef = useRef<any>(null)
    const synthRef = useRef<SpeechSynthesis | null>(null)

    useEffect(() => {
        // Initialize Speech Synthesis
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis

            // Initialize Speech Recognition
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition()
                recognitionRef.current.continuous = false
                recognitionRef.current.interimResults = false

                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript
                    handleUserSubmit(transcript)
                }

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error)
                    if (event.error === 'network') {
                        setMessages(prev => [...prev, { role: "ai", content: "I couldn't connect to the speech recognition service. This often happens if your browser (like Brave or Arc) blocks the Google Speech API or if you are offline. Please try typing your question instead!" }])
                    } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                        setMessages(prev => [...prev, { role: "ai", content: "Microphone access was denied. Please allow microphone permissions to use voice chat." }])
                    }
                    setIsListening(false)
                }

                recognitionRef.current.onend = () => {
                    setIsListening(false)
                }
            }
        }

        return () => {
            if (synthRef.current) {
                synthRef.current.cancel()
            }
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [])

    useEffect(() => {
        // Scroll to bottom on new message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop()
            setIsListening(false)
        } else {
            try {
                // Stop any current speech
                if (synthRef.current) synthRef.current.cancel()
                setIsSpeaking(false)

                recognitionRef.current?.start()
                setIsListening(true)
            } catch (e) {
                console.error("Failed to start listening", e)
            }
        }
    }

    const speakText = (text: string) => {
        if (!speechEnabled || !synthRef.current) return

        // Stop any ongoing speech
        synthRef.current.cancel()

        const utterance = new SpeechSynthesisUtterance(text)

        // Configure voice (optional, tries to find a good English voice)
        const voices = synthRef.current.getVoices()
        const preferredVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) || voices[0]
        if (preferredVoice) {
            utterance.voice = preferredVoice
        }

        utterance.rate = 1.0
        utterance.pitch = 1.0

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        synthRef.current.speak(utterance)
    }

    const handleUserSubmit = async (text: string) => {
        const trimmed = text.trim()
        if (!trimmed) return

        // Stop listening if active
        if (isListening) {
            recognitionRef.current?.stop()
            setIsListening(false)
        }

        // Stop speaking if active
        if (synthRef.current) {
            synthRef.current.cancel()
            setIsSpeaking(false)
        }

        // Add user message
        const newMessages: Message[] = [...messages, { role: "user", content: trimmed }]
        setMessages(newMessages)
        setInputText("")
        setIsProcessing(true)

        try {
            const res = await fetch("/api/teacher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: trimmed,
                    subject: selectedSubject.id,
                    history: newMessages.map(m => ({ role: m.role, content: m.content }))
                })
            })

            const data = await res.json()

            if (data.reply) {
                setMessages(prev => [...prev, { role: "ai", content: data.reply }])
                speakText(data.reply)
            } else {
                throw new Error("Invalid response")
            }
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: "ai", content: "I'm sorry, I couldn't connect to my knowledge base right now." }])
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="flex flex-col h-full gap-6">

            {/* Subject Selector */}
            <div className="glass rounded-2xl p-4 shrink-0">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Learning Subject</p>
                <div className="flex gap-2 flex-wrap">
                    {SUBJECTS.map((subject) => {
                        const Icon = subject.icon
                        const isActive = selectedSubject.id === subject.id
                        return (
                            <button
                                key={subject.id}
                                onClick={() => {
                                    setSelectedSubject(subject)
                                    setMessages([{ role: "ai", content: `Switched to ${subject.name}! Ask me anything about your uploaded ${subject.name} notes.` }])
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? "text-[#0a0a0a] shadow-lg scale-105"
                                    : "glass text-muted-foreground hover:text-foreground hover:scale-105"
                                    }`}
                                style={isActive ? { backgroundColor: subject.color, boxShadow: `0 4px 20px ${subject.color}50` } : {}}
                            >
                                <Icon className="w-4 h-4" />
                                {subject.name}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Visualizer & Controls */}
            <div className="glass-strong rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden shrink-0">

                {/* Dynamic Orb Visualization */}
                <div className="relative flex items-center justify-center mb-8">
                    <div className={`absolute w-48 h-48 rounded-full blur-3xl transition-all duration-700 ${isListening ? 'bg-red-500/30 scale-125' : isSpeaking ? 'bg-green-1/40 scale-150 animate-pulse' : isProcessing ? 'bg-blue-500/30 scale-110 animate-spin' : 'bg-green-1/10 scale-100'}`} />

                    <div className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isListening ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/50 scale-110' : isSpeaking ? 'bg-gradient-to-br from-green-3 to-green-1 shadow-green-1/50 scale-105' : 'bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] border border-white/10'}`}>

                        {isProcessing ? (
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                        ) : isListening ? (
                            <div className="flex gap-1 items-center justify-center h-12">
                                <div className="w-2 bg-white rounded-full animate-[bounce_1s_infinite] h-8" />
                                <div className="w-2 bg-white rounded-full animate-[bounce_1s_infinite_0.2s] h-12" />
                                <div className="w-2 bg-white rounded-full animate-[bounce_1s_infinite_0.4s] h-6" />
                                <div className="w-2 bg-white rounded-full animate-[bounce_1s_infinite_0.6s] h-10" />
                            </div>
                        ) : isSpeaking ? (
                            <div className="flex gap-1.5 items-center justify-center h-12">
                                <div className="w-1.5 bg-white/80 rounded-full animate-pulse h-4" />
                                <div className="w-1.5 bg-white rounded-full animate-pulse h-10 delay-75" />
                                <div className="w-1.5 bg-white/90 rounded-full animate-pulse h-6 delay-150" />
                                <div className="w-1.5 bg-white rounded-full animate-pulse h-8 delay-75" />
                                <div className="w-1.5 bg-white/80 rounded-full animate-pulse h-5 delay-300" />
                            </div>
                        ) : (
                            <Mic className="w-12 h-12 text-white/50" />
                        )}
                    </div>
                </div>

                {/* Primary Controls */}
                <div className="flex items-center gap-4 z-10">
                    <button
                        onClick={() => setSpeechEnabled(!speechEnabled)}
                        className={`p-4 rounded-full transition-colors ${speechEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                        title={speechEnabled ? "Disable AI voice output" : "Enable AI voice output"}
                    >
                        {speechEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                    </button>

                    <button
                        onClick={toggleListening}
                        className={`p-6 rounded-full transition-all duration-300 shadow-xl ${isListening ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/50 scale-110' : 'bg-green-1 hover:bg-green-2 text-[#0a0a0a] shadow-green-1/20'}`}
                    >
                        {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </button>
                </div>

                <p className="mt-6 text-sm font-medium text-muted-foreground z-10">
                    {isListening ? "Listening..." : isProcessing ? "Thinking..." : isSpeaking ? "Speaking..." : "Tap the microphone to ask a question"}
                </p>
            </div>

            {/* Transcript / Conversation History */}
            <div className="flex-1 min-h-[300px] glass-strong rounded-3xl p-6 flex flex-col relative w-full overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar mb-[60px]">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-green-1/20 text-green-1 shadow-green-1/5' : 'bg-black/40 border border-white/5 text-foreground'}`}>
                                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Text Input Fallback */}
                <form
                    onSubmit={(e) => { e.preventDefault(); handleUserSubmit(inputText); }}
                    className="absolute bottom-6 left-6 right-6"
                >
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={isProcessing || isListening}
                        placeholder="Or type your question here..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-4 pr-14 text-sm text-foreground outline-none focus:border-green-1/50 transition-colors disabled:opacity-50 shadow-xl"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() || isProcessing || isListening}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-green-1 text-black disabled:opacity-50 disabled:bg-white/10 disabled:text-white/50 transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>

        </div>
    )
}

import AIVoiceInterface from "@/components/teacher/AIVoiceInterface";

export default function TeacherPage() {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      
                    </p>
                </div>
            </div>

            <div className="flex-1 w-full max-w-4xl mx-auto overflow-hidden">
                <AIVoiceInterface />
            </div>
        </div>
    )
}

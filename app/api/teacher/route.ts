import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history } = body;

        // In a real scenario, this connects to the Python vector DB setup:
        // const response = await fetch("http://localhost:8000/api/chat", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ message, history })
        // });
        // const data = await response.json();

        // For now, let's simulate the AI Teacher taking context into account based on vector knowledge:
        let reply = "";
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes("simplify") || lowerMsg.includes("simpler")) {
            reply = "Sure! Let me break that down. Think of it like building blocks. We start with the base, and add pieces one by one.";
        } else if (lowerMsg.includes("example")) {
            reply = "A great example of this would be the water cycle. Evaporation, condensation, and precipitation all working together in a loop.";
        } else if (lowerMsg.includes("compare")) {
            reply = "Compared to the previous concept, this one relies more on active energy rather than passive states.";
        } else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
            reply = "Hello! I am your AI Teacher. Ask me a question and I'll search our knowledge base to help you out.";
        } else {
            reply = `According to the vector database, here is the answer regarding your question about "${message}". The key concept is that it acts as a central hub for interactions. Is there a specific part you'd like me to expand on?`;
        }

        // Artificial delay to simulate DB lookups and LLM generation
        await new Promise(resolve => setTimeout(resolve, 1500));

        return NextResponse.json({ reply });
    } catch (error) {
        console.error("AI Teacher Route Error:", error);
        return NextResponse.json(
            { error: "Failed to process voice query" },
            { status: 500 }
        );
    }
}

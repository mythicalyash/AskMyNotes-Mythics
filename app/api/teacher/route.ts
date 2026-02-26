import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history } = body;

        // Use subject1 as the default subject for now unless provided visually 
        const subject = "subject1";

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("question", message);
        formData.append("history", JSON.stringify(history));

        const response = await fetch("http://127.0.0.1:8000/teacher_ask", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Backend returned status: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({ reply: data.reply });
    } catch (error) {
        console.error("AI Teacher Route Error:", error);
        return NextResponse.json(
            { error: "Failed to process voice query" },
            { status: 500 }
        );
    }
}

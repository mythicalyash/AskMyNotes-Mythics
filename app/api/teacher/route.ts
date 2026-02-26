import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, history, subject } = body;

        // Use selected subject from the frontend; fallback to subject1
        const backendSubject = subject && ["subject1", "subject2", "subject3"].includes(subject) ? subject : "subject1";

        const formData = new FormData();
        formData.append("subject", backendSubject);
        formData.append("question", message);

        const response = await fetch("http://127.0.0.1:8000/teacher_ask", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Backend returned status: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({ reply: data.reply, evidence: data.evidence ?? [] });
    } catch (error) {
        console.error("AI Teacher Route Error:", error);
        return NextResponse.json(
            { error: "Failed to process voice query" },
            { status: 500 }
        );
    }
}

"use server"

import fs from "fs/promises"
import path from "path"

const dataFile = path.join(process.cwd(), "data", "events.json")

export type CalendarEvent = {
    id: number | string
    date: string
    time: string
    subject: string
    topic: string
    color: string
}

export async function getEvents(): Promise<CalendarEvent[]> {
    try {
        const data = await fs.readFile(dataFile, "utf-8")
        return JSON.parse(data) as CalendarEvent[]
    } catch (error) {
        console.error("Error reading events.json:", error)
        // Return empty array if file missing
        return []
    }
}

export async function addEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
    const events = await getEvents()

    const newEvent: CalendarEvent = {
        ...event,
        id: Date.now().toString(),
    }

    events.push(newEvent)

    try {
        await fs.writeFile(dataFile, JSON.stringify(events, null, 2), "utf-8")
        return newEvent
    } catch (error) {
        console.error("Error writing events.json:", error)
        throw new Error("Failed to save event.")
    }
}

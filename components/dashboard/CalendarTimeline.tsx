"use client"

import { useState } from "react"
import { Plus, CalendarDays, MoreHorizontal, Loader2 } from "lucide-react"
import { CalendarEvent, addEvent } from "@/app/actions/events"
import { format, parseISO, compareAsc } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

export default function CalendarTimeline({ initialEvents }: { initialEvents: CalendarEvent[] }) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calendar View State
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Form State
  const [newSubject, setNewSubject] = useState("")
  const [newTopic, setNewTopic] = useState("")
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const [newColor, setNewColor] = useState("#84B179")

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Format standard YYYY-MM-DD to "24 November"
      const dateObj = parseISO(newDate)
      const formattedDate = format(dateObj, "dd MMMM")

      const savedEvent = await addEvent({
        date: formattedDate,
        time: newTime,
        subject: newSubject,
        topic: newTopic,
        color: newColor
      })

      setEvents(prev => [...prev, savedEvent])
      setIsOpen(false)

      // Reset form
      setNewSubject("")
      setNewTopic("")
      setNewDate("")
      setNewTime("")
      setNewColor("#84B179")

    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Group events by date for rendering
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Calendar</h2>
        <div className="flex gap-2">

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-1/20 text-green-2 transition-colors hover:bg-green-1/30"
                aria-label="Add event"
              >
                <Plus className="h-4 w-4" />
              </button>
            </DialogTrigger>

            <DialogContent className="bg-[#0a0a1a] shadow-xl border-white/10 sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add Reminder</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddEvent} className="mt-4 flex flex-col gap-4">

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Subject</label>
                  <input
                    required
                    type="text"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="rounded-lg bg-black/20 p-2 text-sm text-foreground outline-none border border-white/5 focus:border-green-1/50"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Topic</label>
                  <input
                    required
                    type="text"
                    value={newTopic}
                    onChange={e => setNewTopic(e.target.value)}
                    placeholder="e.g. Final Exam"
                    className="rounded-lg bg-black/20 p-2 text-sm text-foreground outline-none border border-white/5 focus:border-green-1/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-muted-foreground">Date</label>
                    <input
                      required
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="rounded-lg bg-black/20 p-2 text-sm text-foreground outline-none border border-white/5 focus:border-green-1/50 [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-muted-foreground">Time</label>
                    <input
                      required
                      type="time"
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      className="rounded-lg bg-black/20 p-2 text-sm text-foreground outline-none border border-white/5 focus:border-green-1/50 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">Color Marker</label>
                  <div className="flex gap-2">
                    {["#84B179", "#A2CB8B", "#C7EABB", "#6366f1", "#f43f5e", "#f59e0b"].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewColor(color)}
                        className={`h-6 w-6 rounded-full transition-transform ${newColor === color ? 'scale-125 ring-2 ring-white/50' : 'hover:scale-110'}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center rounded-lg bg-green-2 px-4 py-2 text-sm font-bold text-background transition-colors hover:bg-green-1 disabled:opacity-50 min-w-[100px]"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.05)] text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                aria-label="Calendar view"
              >
                <CalendarDays className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-[#0a0a1a] border-white/10" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <div key={date} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {date}
              </span>
              <button
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={`Options for ${date}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {dateEvents.map((event) => (
              <div key={event.id} className="bg-black/40 border border-white/5 flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-black/60">
                <span className="text-sm font-bold text-foreground">
                  {event.time}
                </span>
                <div
                  className="h-8 w-0.5 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex flex-col">
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: event.color }}
                  >
                    {event.subject}
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {event.topic}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

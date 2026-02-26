"use client"

import { Search, Bell } from "lucide-react"
import { useState } from "react"

const tabs = ["Remaining", "Ongoing", "Completed"]

export default function DashboardHeader() {
  const [activeTab, setActiveTab] = useState("Remaining")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="glass flex flex-1 items-center gap-3 rounded-xl px-4 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Search courses"
          />
        </div>
        <button
          className="glass flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-[rgba(255,255,255,0.1)]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-green-1 text-primary-foreground shadow-lg shadow-green-1/20"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

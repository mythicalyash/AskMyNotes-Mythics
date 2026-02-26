"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  BarChart3,
  BookOpen,
  FileText,
  Video,
  Settings,
  Users,
  Bot
} from "lucide-react"

const navItems = [
  { icon: Users, href: "/", label: "Dashboard", exact: true },
  { icon: Home, href: "/", label: "Home", exact: true },
  { icon: BarChart3, href: "/", label: "Analytics", exact: true },
  { icon: BookOpen, href: "/subjects", label: "Subjects", exact: false },
  { icon: FileText, href: "/study", label: "Study & Q&A", exact: false },
  { icon: Bot, href: "/teacher", label: "AI Teacher", exact: false },
  { icon: Video, href: "/video", label: "Video", exact: false },
  { icon: Settings, href: "/settings", label: "Settings", exact: false },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <aside
      className={`sticky left-0 top-0 z-40 flex h-screen shrink-0 flex-col items-start gap-2 py-6 pl-2 lg:pl-4 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${isExpanded ? 'w-64' : 'w-16 lg:w-20'}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="glass-strong flex h-full w-full flex-col gap-1 rounded-2xl py-4 overflow-hidden transition-all duration-300 cursor-pointer">
        <div className="flex flex-col gap-1 flex-1">
          {navItems.map((item, index) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) && item.href !== "/"

            return (
              <Link
                key={item.label + index}
                href={item.href}
                onClick={(e) => e.stopPropagation()}
                className={`group relative flex h-10 items-center rounded-xl transition-all duration-200 lg:h-11 mx-2 ${isActive
                  ? "bg-green-1 text-primary-foreground shadow-lg shadow-green-1/30"
                  : "text-muted-foreground hover:bg-[rgba(255,255,255,0.08)] hover:text-foreground"
                  } ${isExpanded ? "justify-start px-3" : "justify-center w-10 lg:w-11 mx-auto"}`}
                aria-label={item.label}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isExpanded && isActive ? "text-primary-foreground" : ""}`} />

                {/* Text label (visible only when expanded) */}
                <span className={`ml-3 whitespace-nowrap text-sm font-medium transition-all duration-300 ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"}`}>
                  {item.label}
                </span>

                {/* Tooltip (visible only when collapsed) */}
                {!isExpanded && (
                  <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-[rgba(15,15,30,0.95)] px-2 py-1 text-xs text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        <div className="mt-auto px-2">
          <div className={`flex items-center rounded-xl transition-all duration-200 hover:bg-[rgba(255,255,255,0.08)] cursor-pointer ${isExpanded ? "p-2 justify-start gap-3" : "h-10 w-10 lg:h-11 lg:w-11 justify-center mx-auto"}`}>
            <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-green-1 to-green-3 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              Y
            </div>

            {/* User profile details (visible only when expanded) */}
            <div className={`flex flex-col overflow-hidden transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 absolute"}`}>
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">Yash</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">Free Plan</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

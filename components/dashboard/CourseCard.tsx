"use client"

import { Play, Palette, Compass, Image, Calculator, Globe, Code } from "lucide-react"
import Link from "next/link"

const iconMap: Record<string, React.ElementType> = {
  palette: Palette,
  compass: Compass,
  image: Image,
  calculator: Calculator,
  globe: Globe,
  code: Code,
}

interface CourseCardProps {
  title: string
  classes: number
  color: string
  icon: string
  students: number
}

export default function CourseCard({
  title,
  classes,
  color,
  icon,
  students,
}: CourseCardProps) {
  const IconComponent = iconMap[icon] || Palette

  return (
    <Link
      href="/study"
      className="glass group flex min-w-[200px] flex-col gap-3 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-1/10"
    >
      <div
        className={`flex h-28 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}
      >
        <IconComponent className="h-10 w-10 text-foreground drop-shadow-lg" />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">
          {classes.toString().padStart(2, "0")} Classes
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {Array.from({ length: students }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-6 rounded-full border-2 border-[rgba(15,15,30,0.8)]"
              style={{
                background: `linear-gradient(135deg, ${["#84B179", "#A2CB8B", "#C7EABB"][i % 3]
                  }, ${["#A2CB8B", "#C7EABB", "#E8F5BD"][i % 3]})`,
              }}
            />
          ))}
        </div>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-green-1/20 text-green-2 transition-colors hover:bg-green-1/30"
          aria-label={`Play ${title}`}
        >
          <Play className="h-3.5 w-3.5 fill-current" />
        </button>
      </div>
    </Link>
  )
}

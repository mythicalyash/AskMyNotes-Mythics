"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { chartData } from "@/lib/constants"
import { TrendingUp } from "lucide-react"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass flex flex-col gap-1 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(15,15,30,0.95)] p-3 text-xs shadow-xl">
        <p className="mb-1 font-bold text-foreground">{label}</p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#84B179]" />
          <span className="text-muted-foreground">Quiz (MCQ):</span>
          <span className="font-semibold text-foreground">{payload[0].value}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#C7EABB]" />
          <span className="text-muted-foreground">Short Answer:</span>
          <span className="font-semibold text-foreground">{payload[1].value}%</span>
        </div>
      </div>
    )
  }
  return null
}

export default function AnalyticsChart() {
  return (
    <div className="glass flex h-full flex-col gap-4 rounded-2xl p-5">
      <div className="flex flex-1 min-h-[176px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="25%" barGap={8}>
            <XAxis
              dataKey="subject"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              angle={0}
              textAnchor="middle"
              height={30}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
            <Bar dataKey="mcq" fill="#84B179" radius={[6, 6, 0, 0]} maxBarSize={40} />
            <Bar dataKey="short" fill="#C7EABB" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass flex items-center gap-4 rounded-xl p-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">83.3%</span>
          <span className="text-sm text-muted-foreground">Avg. Score</span>
        </div>
        <div className="flex items-center gap-1 text-green-2">
          <TrendingUp className="h-3 w-3" />
          <span className="text-xs font-medium">+5.2%</span>
        </div>
        <div className="ml-auto flex flex-col text-right text-xs text-muted-foreground">
          <span>Overall Performance</span>
          <span>
            Quiz &amp; <span className="text-foreground">Short Ans</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#84B179] to-[#C7EABB]" />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">
            Study Legend
          </span>
          <span className="text-[10px] text-muted-foreground">
            Metrics Breakdown
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="h-2 w-2 rounded-full bg-[#84B179]" />
            Quiz (MCQ)
          </span>
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="h-2 w-2 rounded-full bg-[#C7EABB]" />
            Short Answer
          </span>
        </div>
      </div>
    </div>
  )
}

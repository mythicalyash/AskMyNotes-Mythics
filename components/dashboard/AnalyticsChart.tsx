"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts"
import { chartData } from "@/lib/constants"
import { TrendingUp } from "lucide-react"

const barColors = [
  "#84B179",
  "#A2CB8B",
  "#C7EABB",
  "#84B179",
  "#A2CB8B",
  "#C7EABB",
  "#E8F5BD",
]

export default function AnalyticsChart() {
  return (
    <div className="glass flex h-full flex-col gap-4 rounded-2xl p-5">
      <div className="flex flex-1 min-h-[176px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="20%">
            <XAxis
              dataKey="subject"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              angle={-35}
              textAnchor="end"
              height={50}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 15, 30, 0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#f0f0f5",
                fontSize: "12px",
              }}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index % barColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass flex items-center gap-4 rounded-xl p-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">76</span>
          <span className="text-sm text-muted-foreground">Biology</span>
        </div>
        <div className="flex items-center gap-1 text-green-2">
          <TrendingUp className="h-3 w-3" />
          <span className="text-xs font-medium">0.5%</span>
        </div>
        <div className="ml-auto flex flex-col text-right text-xs text-muted-foreground">
          <span>Campbell Biology</span>
          <span>
            16 Nov | <span className="text-foreground">20</span> Questions
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-green-1 to-green-3" />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-foreground">
            Jacob Jones
          </span>
          <span className="text-[10px] text-muted-foreground">
            uiacadge Teacher
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-green-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-2" />
            16
          </span>
          <span className="flex items-center gap-1 text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />4
          </span>
        </div>
      </div>
    </div>
  )
}

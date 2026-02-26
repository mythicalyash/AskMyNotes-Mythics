"use client"

import { userProfile } from "@/lib/constants"

export default function ProfileCard() {
  return (
    <div className="glass-green flex flex-col items-center gap-3 rounded-2xl p-5">
      <div className="relative">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-1 via-green-2 to-green-3 p-0.5">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#1a1a2e]">
            <span className="text-2xl font-bold text-green-2">
              {userProfile.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <h3 className="text-sm font-semibold text-foreground">
          {userProfile.name}
        </h3>
        <p className="text-xs text-muted-foreground">{userProfile.level}</p>
      </div>

      <div className="rounded-full border border-green-1/30 bg-green-1/10 px-4 py-1.5">
        <span className="text-xs font-medium text-green-2">
          Mean score: {userProfile.meanScore}
        </span>
      </div>
    </div>
  )
}

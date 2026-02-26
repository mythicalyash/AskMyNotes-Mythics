"use client"

import { useState } from "react"
import { Settings, User, Bell, Palette, Shield, Moon, Sun } from "lucide-react"

interface SettingToggle {
  id: string
  label: string
  description: string
  enabled: boolean
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<SettingToggle[]>([
    {
      id: "email",
      label: "Email Notifications",
      description: "Receive updates about your courses via email",
      enabled: true,
    },
    {
      id: "push",
      label: "Push Notifications",
      description: "Get notified about upcoming classes",
      enabled: true,
    },
    {
      id: "reminders",
      label: "Study Reminders",
      description: "Daily reminders to review your notes",
      enabled: false,
    },
  ])

  const [appearance, setAppearance] = useState<SettingToggle[]>([
    {
      id: "dark",
      label: "Dark Mode",
      description: "Use dark theme across the application",
      enabled: true,
    },
    {
      id: "animations",
      label: "Animations",
      description: "Enable smooth transitions and effects",
      enabled: true,
    },
    {
      id: "compact",
      label: "Compact View",
      description: "Show more content with reduced spacing",
      enabled: false,
    },
  ])

  const toggleSetting = (
    settings: SettingToggle[],
    setter: React.Dispatch<React.SetStateAction<SettingToggle[]>>,
    id: string
  ) => {
    setter(
      settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-1/20">
          <Settings className="h-5 w-5 text-green-2" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your preferences and account
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <div className="glass flex flex-col gap-4 rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-green-2" />
            <h2 className="text-sm font-semibold text-foreground">Profile</h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-xs text-muted-foreground"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                defaultValue="Mariya Bestkity"
                className="glass rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-green-1/40"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-xs text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                defaultValue="mariya@university.edu"
                className="glass rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-green-1/40"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="level"
                className="text-xs text-muted-foreground"
              >
                Academic Level
              </label>
              <input
                id="level"
                type="text"
                defaultValue="Sophomore"
                className="glass rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-green-1/40"
              />
            </div>
            <button className="mt-2 self-start rounded-lg bg-green-1 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-green-2">
              Save Changes
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass flex flex-col gap-4 rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-green-2" />
            <h2 className="text-sm font-semibold text-foreground">
              Notifications
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {notifications.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-[rgba(255,255,255,0.02)] p-3"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">
                    {setting.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {setting.description}
                  </span>
                </div>
                <button
                  onClick={() =>
                    toggleSetting(
                      notifications,
                      setNotifications,
                      setting.id
                    )
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    setting.enabled ? "bg-green-1" : "bg-[rgba(255,255,255,0.1)]"
                  }`}
                  aria-label={`Toggle ${setting.label}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${
                      setting.enabled ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="glass flex flex-col gap-4 rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-green-2" />
            <h2 className="text-sm font-semibold text-foreground">
              Appearance
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {appearance.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-[rgba(255,255,255,0.02)] p-3"
              >
                <div className="flex items-center gap-2">
                  {setting.id === "dark" ? (
                    setting.enabled ? (
                      <Moon className="h-3.5 w-3.5 text-green-2" />
                    ) : (
                      <Sun className="h-3.5 w-3.5 text-green-4" />
                    )
                  ) : null}
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-foreground">
                      {setting.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {setting.description}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toggleSetting(appearance, setAppearance, setting.id)
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    setting.enabled ? "bg-green-1" : "bg-[rgba(255,255,255,0.1)]"
                  }`}
                  aria-label={`Toggle ${setting.label}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${
                      setting.enabled ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="glass flex flex-col gap-4 rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-2" />
            <h2 className="text-sm font-semibold text-foreground">
              Privacy & Security
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-xl bg-[rgba(255,255,255,0.02)] p-3">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">
                  Two-Factor Authentication
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Add an extra layer of security
                </span>
              </div>
              <button className="rounded-lg bg-green-1/15 px-3 py-1.5 text-[10px] font-medium text-green-2 transition-colors hover:bg-green-1/25">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[rgba(255,255,255,0.02)] p-3">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">
                  Data Export
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Download all your study data
                </span>
              </div>
              <button className="rounded-lg bg-[rgba(255,255,255,0.06)] px-3 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-[rgba(255,255,255,0.1)] hover:text-foreground">
                Export
              </button>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[rgba(255,255,255,0.02)] p-3">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">
                  Delete Account
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Permanently remove your account and data
                </span>
              </div>
              <button className="rounded-lg bg-red-500/10 px-3 py-1.5 text-[10px] font-medium text-red-400 transition-colors hover:bg-red-500/20">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

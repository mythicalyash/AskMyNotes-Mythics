import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import AppSidebar from "@/components/sidebar/AppSidebar"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AskMyNotes - AI Education Dashboard",
  description:
    "Modern AI-powered education dashboard for managing courses, study sessions, and Q&A",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a1a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* Background gradient orbs */}
        <div
          className="bg-orb"
          style={{
            width: "500px",
            height: "500px",
            top: "-10%",
            right: "10%",
            background:
              "radial-gradient(circle, rgba(132, 177, 121, 0.15), transparent 70%)",
          }}
        />
        <div
          className="bg-orb"
          style={{
            width: "400px",
            height: "400px",
            bottom: "10%",
            left: "5%",
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.12), transparent 70%)",
          }}
        />
        <div
          className="bg-orb"
          style={{
            width: "350px",
            height: "350px",
            top: "40%",
            right: "-5%",
            background:
              "radial-gradient(circle, rgba(162, 203, 139, 0.1), transparent 70%)",
          }}
        />

        <div className="relative z-10 flex min-h-screen">
          <AppSidebar />
          <main className="flex-1 min-w-0 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]">{children}</main>
        </div>
        <Analytics />
      </body>
    </html>
  )
}

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Navigation } from "@/components/navigation"

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-dark">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Navigation />
    </div>
  )
}

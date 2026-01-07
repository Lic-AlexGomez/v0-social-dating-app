import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Navigation } from "@/components/navigation"

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen sparkd-bg">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Navigation />
    </div>
  )
}
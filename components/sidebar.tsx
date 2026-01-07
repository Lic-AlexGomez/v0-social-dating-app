"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, HeartIcon, MessageCircle, User, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { MenuDrawer } from "./menu-drawer"
import { NotificationsDropdown } from "./notifications-dropdown"
import { createClient } from "@/lib/supabase/client"

export function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const links = [
    { href: "/feed", icon: Home, label: "Feed" },
    { href: "/discover", icon: Compass, label: "Discover" },
    { href: "/matches", icon: HeartIcon, label: "Matches" },
    { href: "/messages", icon: MessageCircle, label: "Messages" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col glass-strong border-r border-white/10">
      <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
        <Link href="/feed" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center neon-cyan transition-all group-hover:scale-110">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text-cyan-magenta">Sparkd</span>
        </Link>
        <div className="flex items-center gap-2">
          {user && <NotificationsDropdown userId={user.id} />}
          {user && <MenuDrawer user={user} />}
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover-lift",
                isActive ? "glass-strong text-cyan-400 neon-border-cyan" : "text-white/70 hover:text-white hover:glass",
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-cyan-400")} />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Heart, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/feed", icon: Home, label: "Feed" },
    { href: "/discover", icon: Compass, label: "Discover" },
    { href: "/matches", icon: Heart, label: "Matches" },
    { href: "/messages", icon: MessageCircle, label: "Messages" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/10 md:hidden">
      <div className="flex items-center justify-around p-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-2 text-xs transition-colors",
                isActive ? "text-cyan-400" : "text-white/60 hover:text-white",
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "fill-cyan-400")} />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

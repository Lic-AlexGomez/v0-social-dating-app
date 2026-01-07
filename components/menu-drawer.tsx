"use client"

import { useState } from "react"
import { Menu, X, User, Settings, HelpCircle, LogOut, Shield, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface MenuDrawerProps {
  user: {
    id: string
    email?: string
    user_metadata?: {
      display_name?: string
      avatar_url?: string
      username?: string
    }
  }
}

export function MenuDrawer({ user }: MenuDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <>
      {/* Hamburger Button */}
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="relative z-10">
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-background border-l shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Profile Section */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">{user.user_metadata?.display_name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user.user_metadata?.display_name}</p>
                <p className="text-sm text-muted-foreground truncate">@{user.user_metadata?.username}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link href="/profile" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <User className="h-5 w-5" />
                <span>My Profile</span>
              </Button>
            </Link>

            <Link href="/profile/edit" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Settings className="h-5 w-5" />
                <span>Edit Profile</span>
              </Button>
            </Link>

            <Separator className="my-2" />

            <Link href="/support" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <HelpCircle className="h-5 w-5" />
                <span>Support</span>
              </Button>
            </Link>

            <Link href="/privacy" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Shield className="h-5 w-5" />
                <span>Privacy & Safety</span>
              </Button>
            </Link>

            <Link href="/about" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                <Info className="h-5 w-5" />
                <span>About Sparkd</span>
              </Button>
            </Link>
          </nav>

          <Separator />

          {/* Logout */}
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

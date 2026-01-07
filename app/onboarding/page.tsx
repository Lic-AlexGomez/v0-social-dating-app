"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Zap } from "lucide-react"

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null)
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [gender, setGender] = useState("")
  const [bio, setBio] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push("/auth/login")
      }
    }
    getUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: username.toLowerCase().replace(/\s+/g, "_"),
          display_name: displayName,
          date_of_birth: dateOfBirth,
          gender,
          bio: bio || null,
        })
        .eq("id", user.id)

      if (error) throw error
      router.push("/feed")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center sparkd-bg px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="flex flex-col gap-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-full" />
              <Zap className="relative w-16 h-16 gradient-text-cyan-magenta" strokeWidth={1.5} />
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
              <p className="text-muted-foreground">Tell us a bit about yourself</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/80">
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="glass border-white/20 text-white placeholder:text-white/40 focus:neon-border-cyan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-white/80">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  placeholder="John Doe"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="glass border-white/20 text-white placeholder:text-white/40 focus:neon-border-cyan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-white/80">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                  className="glass border-white/20 text-white placeholder:text-white/40 focus:neon-border-cyan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-white/80">
                  Gender
                </Label>
                <Select value={gender} onValueChange={setGender} required>
                  <SelectTrigger className="glass border-white/20 text-white focus:neon-border-cyan">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-white/20">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white/80">
                  Bio (Optional)
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="glass border-white/20 text-white placeholder:text-white/40 focus:neon-border-cyan resize-none"
                />
              </div>
              {error && (
                <div className="glass border-red-500/50 rounded-lg p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full gradient-cyan-magenta text-white hover:opacity-90 neon-cyan font-semibold h-12 text-base"
                disabled={isLoading}
              >
                {isLoading ? "Completing profile..." : "Complete Profile"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

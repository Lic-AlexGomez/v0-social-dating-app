"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [gender, setGender] = useState("")
  const [showMe, setShowMe] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
      return
    }

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (data) {
      setProfile(data)
      setDisplayName(data.display_name || "")
      setBio(data.bio || "")
      setLocation(data.location || "")
      setGender(data.gender || "")
      setShowMe(data.show_me || "")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          bio: bio || null,
          location: location || null,
          gender,
          show_me: showMe,
        })
        .eq("id", profile.id)

      if (error) throw error
      router.push("/profile")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-dark">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/10 glass-strong backdrop-blur-xl px-4">
        <Button variant="ghost" size="icon" asChild className="text-white hover:text-cyan-400">
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold text-white">Edit Profile</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="mx-auto max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4 glass-strong p-6 rounded-2xl animate-float-in">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-white">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-cyan-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-white">
                Gender
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  <SelectItem value="male" className="text-white focus:bg-cyan-400/20">
                    Male
                  </SelectItem>
                  <SelectItem value="female" className="text-white focus:bg-cyan-400/20">
                    Female
                  </SelectItem>
                  <SelectItem value="other" className="text-white focus:bg-cyan-400/20">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="showMe" className="text-white">
                Show Me
              </Label>
              <Select value={showMe} onValueChange={setShowMe}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  <SelectItem value="everyone" className="text-white focus:bg-cyan-400/20">
                    Everyone
                  </SelectItem>
                  <SelectItem value="male" className="text-white focus:bg-cyan-400/20">
                    Men
                  </SelectItem>
                  <SelectItem value="female" className="text-white focus:bg-cyan-400/20">
                    Women
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:from-cyan-500 hover:to-fuchsia-600 text-white font-semibold neon-cyan"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

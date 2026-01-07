"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { SwipeCard } from "@/components/swipe-card"
import { SwipeActions } from "@/components/swipe-actions"
import { useRouter } from "next/navigation"
import { Sparkles, Heart } from "lucide-react"

interface Profile {
  id: string
  display_name: string
  username: string
  avatar_url?: string
  bio?: string
  age?: number
}

export default function DiscoverPage() {
  const [user, setUser] = useState<any>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [matchNotification, setMatchNotification] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
      await loadProfiles(user.id)
    }
    getUser()
  }, [router])

  const loadProfiles = async (userId: string) => {
    const supabase = createClient()
    setIsLoading(true)

    try {
      // Get profiles that the user hasn't swiped on yet
      const { data: swipedIds } = await supabase.from("swipes").select("target_user_id").eq("user_id", userId)

      const swipedUserIds = swipedIds?.map((s) => s.target_user_id) || []

      let query = supabase
        .from("profiles")
        .select("*")
        .neq("id", userId)
        .limit(20)

      if (swipedUserIds.length > 0) {
        query = query.not("id", "in", `(${swipedUserIds.join(",")})`)
      }

      const { data } = await query

      setProfiles(data || [])
      setCurrentIndex(0)
    } catch (error) {
      console.error("Error loading profiles:", error)
      setProfiles([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwipe = async (direction: "left" | "right" | "super") => {
    if (!user || !profiles[currentIndex]) return

    const supabase = createClient()
    const targetProfile = profiles[currentIndex]

    try {
      const { error } = await supabase.from("swipes").insert({
        user_id: user.id,
        target_user_id: targetProfile.id,
        direction,
      })

      if (error) {
        console.error("Swipe insert error:", error)
      }

      // Check for mutual match if swiped right or super
      if (direction === "right" || direction === "super") {
        const { data: mutualSwipe } = await supabase
          .from("swipes")
          .select("*")
          .eq("user_id", targetProfile.id)
          .eq("target_user_id", user.id)
          .in("direction", ["right", "super"])
          .single()

        if (mutualSwipe) {
          setMatchNotification(targetProfile.display_name)
          setTimeout(() => setMatchNotification(null), 3000)
        }
      }
    } catch (error) {
      console.error("Swipe error:", error)
    }

    // Move to next profile
    setCurrentIndex((prev) => prev + 1)

    // Load more profiles if running low
    if (currentIndex >= profiles.length - 3) {
      await loadProfiles(user.id)
    }
  }

  const currentProfile = profiles[currentIndex]

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mx-auto" />
          <p className="text-white/70">Finding connections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl h-screen flex flex-col">
      <header className="flex h-16 items-center glass-strong border-b border-white/10 px-4">
        <h1 className="text-xl font-bold gradient-text-cyan-magenta">Discover</h1>
      </header>

      <div className="flex-1 p-4 flex flex-col">
        <div className="relative flex-1 max-w-md mx-auto w-full">
          {currentProfile ? (
            <SwipeCard key={currentProfile.id} profile={currentProfile} onSwipe={handleSwipe} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center space-y-4 animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center mx-auto opacity-20">
                  <Sparkles className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold text-white">No more profiles</h3>
                <p className="text-white/60">Check back later for new people!</p>
              </div>
            </div>
          )}
        </div>

        {currentProfile && (
          <div className="mt-6">
            <SwipeActions
              onSwipeLeft={() => handleSwipe("left")}
              onSwipeRight={() => handleSwipe("right")}
              onSuperLike={() => handleSwipe("super")}
              disabled={!currentProfile}
            />
          </div>
        )}
      </div>

      {matchNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-strong rounded-3xl p-8 text-center space-y-4 shadow-2xl max-w-sm mx-4 neon-cyan animate-scale-in">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center animate-pulse">
                <Heart className="h-10 w-10 fill-white text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold gradient-text-cyan-magenta">It&apos;s a Match!</h2>
            <p className="text-white/80">You and {matchNotification} liked each other</p>
          </div>
        </div>
      )}
    </div>
  )
}

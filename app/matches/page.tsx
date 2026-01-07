import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function MatchesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get all matches
  const { data: matches } = await supabase
    .from("matches")
    .select(
      `
      *,
      user1:profiles!matches_user1_id_fkey(id, username, display_name, avatar_url, bio),
      user2:profiles!matches_user2_id_fkey(id, username, display_name, avatar_url, bio)
    `,
    )
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  const matchedProfiles = matches?.map((match: any) => {
    const otherProfile = match.user1.id === user.id ? match.user2 : match.user1
    return {
      matchId: match.id,
      ...otherProfile,
    }
  })

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-2xl">
          <header className="sticky top-0 z-40 flex h-16 items-center border-b border-white/10 glass-strong backdrop-blur-xl px-4">
            <h1 className="text-xl font-bold text-white">Matches</h1>
          </header>
          <div className="p-4">
            {matchedProfiles && matchedProfiles.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {matchedProfiles.map((profile: any) => (
                  <Card
                    key={profile.id}
                    className="overflow-hidden glass-strong border border-white/10 hover:scale-105 transition-transform duration-300 animate-scale-in"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={profile.avatar_url || "/placeholder.svg?height=300&width=300&query=neon+portrait"}
                        alt={profile.display_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg text-white">{profile.display_name}</h3>
                        <p className="text-sm text-white/60">@{profile.username}</p>
                      </div>
                      {profile.bio && <p className="text-sm line-clamp-2 text-white/80">{profile.bio}</p>}
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 hover:from-cyan-500 hover:to-fuchsia-600 text-white neon-cyan"
                      >
                        <Link href={`/messages/${profile.matchId}`}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Send Message
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center glass-strong rounded-2xl p-8">
                <p className="text-white/60">No matches yet. Keep swiping to find your match!</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get all matches with their last message
  const { data: matches } = await supabase
    .from("matches")
    .select(
      `
      *,
      user1:profiles!matches_user1_id_fkey(id, username, display_name, avatar_url),
      user2:profiles!matches_user2_id_fkey(id, username, display_name, avatar_url)
    `,
    )
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  // Get last message for each match
  const matchesWithMessages = await Promise.all(
    (matches || []).map(async (match: any) => {
      const { data: lastMessage } = await supabase
        .from("messages")
        .select("*, sender:profiles!messages_sender_id_fkey(display_name)")
        .eq("match_id", match.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      const otherProfile = match.user1.id === user.id ? match.user2 : match.user1

      return {
        matchId: match.id,
        profile: otherProfile,
        lastMessage,
      }
    }),
  )

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-2xl">
          <header className="sticky top-0 z-40 flex h-16 items-center border-b border-white/10 glass-strong backdrop-blur-xl px-4">
            <h1 className="text-xl font-bold text-white">Messages</h1>
          </header>
          <div className="divide-y divide-white/10">
            {matchesWithMessages && matchesWithMessages.length > 0 ? (
              matchesWithMessages.map((match) => (
                <Link key={match.matchId} href={`/messages/${match.matchId}`}>
                  <Card className="flex items-center gap-4 p-4 border-0 rounded-none shadow-none glass hover:glass-strong transition-all duration-200">
                    <Avatar className="h-14 w-14 ring-2 ring-cyan-400/30">
                      <AvatarImage src={match.profile.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white">
                        {match.profile.display_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold truncate text-white">{match.profile.display_name}</h3>
                        {match.lastMessage && (
                          <span className="text-xs text-white/40 ml-2">
                            {formatDistanceToNow(new Date(match.lastMessage.created_at))} ago
                          </span>
                        )}
                      </div>
                      {match.lastMessage ? (
                        <p className="text-sm text-white/60 truncate">
                          {match.lastMessage.sender_id === user.id ? "You: " : ""}
                          {match.lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-sm text-white/40">Start a conversation</p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center glass-strong m-4 rounded-2xl p-8">
                <p className="text-white/60">No messages yet. Match with someone to start chatting!</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  )
}

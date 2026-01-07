import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { Navigation } from "@/components/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Settings, Grid, Heart } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", user.id)

  const { data: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", user.id)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-4xl">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 glass-strong backdrop-blur-xl px-4">
            <h1 className="text-xl font-bold text-white">Profile</h1>
            <Button variant="ghost" size="icon" asChild className="text-white hover:text-cyan-400">
              <Link href="/profile/edit">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </header>

          <div className="glass-strong m-4 rounded-2xl overflow-hidden animate-float-in">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24 ring-4 ring-cyan-400/30">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white">
                    {profile?.display_name?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{profile?.display_name}</h2>
                    <p className="text-white/60">@{profile?.username}</p>
                  </div>

                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-semibold text-cyan-400">{posts?.length || 0}</span>{" "}
                      <span className="text-white/60">posts</span>
                    </div>
                    <div>
                      <span className="font-semibold text-cyan-400">{followersCount || 0}</span>{" "}
                      <span className="text-white/60">followers</span>
                    </div>
                    <div>
                      <span className="font-semibold text-cyan-400">{followingCount || 0}</span>{" "}
                      <span className="text-white/60">following</span>
                    </div>
                  </div>

                  {profile?.bio && <p className="text-sm text-white/80">{profile.bio}</p>}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10">
              <div className="flex">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border-b-2 border-cyan-400 text-cyan-400">
                  <Grid className="h-4 w-4" />
                  <span className="text-sm font-semibold">Posts</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 text-white/60 hover:text-white transition-colors">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">Liked</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-4">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Link key={post.id} href={`/feed`} className="group">
                  <Card className="aspect-square overflow-hidden border-0 rounded-xl glass hover:scale-105 transition-transform duration-300">
                    <img
                      src={post.media_url || "/placeholder.svg?height=300&width=300&query=neon+cyberpunk"}
                      alt="Post"
                      className="h-full w-full object-cover"
                    />
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                <p className="text-white/60">No posts yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  )
}

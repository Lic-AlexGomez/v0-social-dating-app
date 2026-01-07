import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Navigation } from "@/components/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Grid, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("username", resolvedParams.username).single()

  if (!profile) {
    notFound()
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })

  const { data: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profile.id)

  const { data: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", profile.id)

  const { data: isFollowing } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", user.id)
    .eq("following_id", profile.id)
    .single()

  const isOwnProfile = user.id === profile.id

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-4xl">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/feed">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold">{profile.username}</h1>
          </header>

          <div className="bg-white">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">{profile.display_name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{profile.display_name}</h2>
                    <p className="text-muted-foreground">@{profile.username}</p>
                  </div>

                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-semibold">{posts?.length || 0}</span> posts
                    </div>
                    <div>
                      <span className="font-semibold">{followersCount || 0}</span> followers
                    </div>
                    <div>
                      <span className="font-semibold">{followingCount || 0}</span> following
                    </div>
                  </div>

                  {profile.bio && <p className="text-sm">{profile.bio}</p>}

                  {!isOwnProfile && (
                    <Button
                      className={
                        isFollowing
                          ? "bg-gray-200 text-foreground hover:bg-gray-300"
                          : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      }
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t">
              <div className="flex">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border-t-2 border-foreground">
                  <Grid className="h-4 w-4" />
                  <span className="text-sm font-semibold">Posts</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`}>
                  <Card className="aspect-square overflow-hidden border-0 rounded-sm shadow-none">
                    <img src={post.media_url || "/placeholder.svg"} alt="Post" className="h-full w-full object-cover" />
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No posts yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  )
}

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"
import { Navigation } from "@/components/navigation"
import { PostCard } from "@/components/post-card"
import { CreatePostButton } from "@/components/create-post-button"
import { StoriesBar } from "@/components/stories-bar"
import { Zap } from "lucide-react"
import { MenuDrawer } from "@/components/menu-drawer"

export default async function FeedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get posts from followed users and own posts
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles!posts_user_id_fkey(id, username, display_name, avatar_url)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(20)

  // Get user's likes
  const { data: userLikes } = await supabase.from("likes").select("post_id").eq("user_id", user.id)
  const likedPostIds = new Set(userLikes?.map((like) => like.post_id))

  return (
    <div className="flex min-h-screen sparkd-bg">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-2xl">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between glass-strong border-b border-white/10 px-4">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              <h1 className="text-xl font-bold gradient-text-cyan-magenta">Sparkd</h1>
            </div>
            <div className="md:hidden">
              <MenuDrawer user={user} />
            </div>
          </header>
          <StoriesBar currentUserId={user.id} />
          <div className="space-y-6 p-4">
            {posts && posts.length > 0 ? (
              posts.map((post, idx) => (
                <div key={post.id} style={{ animationDelay: `${idx * 50}ms` }}>
                  <PostCard post={post as any} currentUserId={user.id} isLiked={likedPostIds.has(post.id)} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center glass-strong rounded-2xl animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center mb-4 opacity-20">
                  <Zap className="w-10 h-10" />
                </div>
                <p className="text-white/70 text-lg">No posts yet</p>
                <p className="text-white/50 text-sm mt-2">Follow users or create your first post!</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Navigation />
      <CreatePostButton userId={user.id} />
    </div>
  )
}

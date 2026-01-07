"use client"

import { useState } from "react"
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface PostCardProps {
  post: {
    id: string
    caption: string | null
    media_url: string
    media_type: string
    likes_count: number
    comments_count: number
    created_at: string
    profiles: {
      id: string
      username: string
      display_name: string
      avatar_url: string | null
    }
  }
  currentUserId: string
  isLiked?: boolean
}

export function PostCard({ post, currentUserId, isLiked: initialIsLiked = false }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [isLiking, setIsLiking] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    const supabase = createClient()

    try {
      if (isLiked) {
        await supabase.from("likes").delete().match({ user_id: currentUserId, post_id: post.id })
        setIsLiked(false)
        setLikesCount((prev) => prev - 1)
      } else {
        await supabase.from("likes").insert({ user_id: currentUserId, post_id: post.id })
        setIsLiked(true)
        setLikesCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div className="glass-strong rounded-2xl overflow-hidden border border-white/10 hover-lift animate-float-in">
      <div className="flex items-center justify-between p-4">
        <Link href={`/profile/${post.profiles.username}`} className="flex items-center gap-3 group">
          <Avatar className="ring-2 ring-white/10 group-hover:ring-cyan-400/50 transition-all">
            <AvatarImage src={post.profiles.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white">
              {post.profiles.display_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-white group-hover:text-cyan-400 transition-colors">
              {post.profiles.display_name}
            </p>
            <p className="text-xs text-white/50">@{post.profiles.username}</p>
          </div>
        </Link>
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {post.media_type === "image" ? (
        <div className="relative aspect-square bg-muted">
          {!imageError ? (
            <img
              src={post.media_url || "/placeholder.svg"}
              alt="Post"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center skeleton">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center">
                  <Bookmark className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-sm text-white/50">Image unavailable</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <video src={post.media_url} controls className="w-full aspect-square object-cover" />
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              disabled={isLiking}
              className="hover-scale transition-transform"
            >
              <Heart
                className={cn(
                  "h-6 w-6 transition-all",
                  isLiked ? "fill-fuchsia-500 text-fuchsia-500 scale-110" : "text-white/70 hover:text-white",
                )}
              />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover-scale">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover-scale">
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-cyan-400 hover-scale">
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>

        <div>
          <p className="font-semibold text-sm text-white">{likesCount} likes</p>
        </div>

        {post.caption && (
          <div className="text-sm text-white/90">
            <Link href={`/profile/${post.profiles.username}`} className="font-semibold mr-2 hover:text-cyan-400">
              {post.profiles.username}
            </Link>
            <span className="text-white/80">{post.caption}</span>
          </div>
        )}

        {post.comments_count > 0 && (
          <button className="text-sm text-white/50 hover:text-white/70">View all {post.comments_count} comments</button>
        )}

        <p className="text-xs text-white/40">{formatDistanceToNow(new Date(post.created_at))} ago</p>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

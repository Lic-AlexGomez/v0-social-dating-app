"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus } from "lucide-react"

export function StoriesBar({ currentUserId }: { currentUserId: string }) {
  const [stories, setStories] = useState<any[]>([])

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("stories")
      .select(
        `
        *,
        profiles(id, username, display_name, avatar_url)
      `,
      )
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })

    // Group by user
    const groupedStories = data?.reduce(
      (acc, story) => {
        const userId = story.profiles.id
        if (!acc[userId]) {
          acc[userId] = {
            profile: story.profiles,
            stories: [],
          }
        }
        acc[userId].stories.push(story)
        return acc
      },
      {} as Record<string, any>,
    )

    setStories(Object.values(groupedStories || {}))
  }

  return (
    <div className="flex gap-4 overflow-x-auto p-4 bg-white border-b scrollbar-hide">
      <button className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="relative">
          <Avatar className="h-16 w-16 ring-2 ring-gray-200">
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center border-2 border-white">
            <Plus className="h-3 w-3 text-white" />
          </div>
        </div>
        <span className="text-xs font-medium">Your Story</span>
      </button>

      {stories.map((userStory) => (
        <button key={userStory.profile.id} className="flex flex-col items-center gap-2 flex-shrink-0">
          <Avatar className="h-16 w-16 ring-2 ring-gradient-to-r from-pink-500 to-purple-600 ring-offset-2">
            <AvatarImage src={userStory.profile.avatar_url || undefined} />
            <AvatarFallback>{userStory.profile.display_name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium max-w-16 truncate">{userStory.profile.username}</span>
        </button>
      ))}
    </div>
  )
}

"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface NotificationUser {
  username: string
  display_name: string
  avatar_url?: string
}

interface Notification {
  id: string
  type: string
  user_id: string
  from_user_id: string
  post_id?: string
  match_id?: string
  is_read: boolean
  created_at: string
  from_user: NotificationUser
}

export function NotificationsDropdown({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const loadNotifications = useCallback(async () => {
    const supabase = createClient()
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(
          `
          *,
          from_user:profiles!notifications_from_user_id_fkey(username, display_name, avatar_url)
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error loading notifications:", error)
        return
      }

      setNotifications(data || [])
      setUnreadCount(data?.filter((n) => !n.is_read).length || 0)
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }, [userId])

  useEffect(() => {
    loadNotifications()
    
    const supabase = createClient()
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          loadNotifications()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadNotifications, userId])

  const markAsRead = async (notificationId: string) => {
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
      
      if (error) {
        console.error("Error marking notification as read:", error)
        return
      }
      
      loadNotifications()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const getNotificationText = (notification: Notification): string => {
    switch (notification.type) {
      case "like":
        return "liked your post"
      case "comment":
        return "commented on your post"
      case "follow":
        return "started following you"
      case "match":
        return "matched with you"
      case "message":
        return "sent you a message"
      default:
        return "interacted with you"
    }
  }

  const getNotificationLink = (notification: Notification): string => {
    switch (notification.type) {
      case "like":
      case "comment":
        return notification.post_id ? `/post/${notification.post_id}` : "/feed"
      case "follow":
        return `/profile/${notification.from_user.username}`
      case "match":
      case "message":
        return notification.match_id ? `/messages/${notification.match_id}` : "/messages"
      default:
        return "/feed"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-4 py-2 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link
                  href={getNotificationLink(notification)}
                  className={`flex gap-3 p-4 cursor-pointer ${!notification.is_read ? "bg-pink-50" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.from_user?.avatar_url || undefined} />
                    <AvatarFallback>{notification.from_user?.display_name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold">{notification.from_user?.display_name}</span>{" "}
                      {getNotificationText(notification)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at))} ago
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

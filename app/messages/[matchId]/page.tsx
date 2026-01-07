"use client"

import type React from "react"

import { use, useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const resolvedParams = use(params)
  const [user, setUser] = useState<any>(null)
  const [match, setMatch] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
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
      await loadMatch(user.id)
      await loadMessages()
      subscribeToMessages()
    }
    getUser()
  }, [resolvedParams.matchId, router])

  const loadMatch = async (userId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from("matches")
      .select(
        `
        *,
        user1:profiles!matches_user1_id_fkey(id, username, display_name, avatar_url),
        user2:profiles!matches_user2_id_fkey(id, username, display_name, avatar_url)
      `,
      )
      .eq("id", resolvedParams.matchId)
      .single()

    if (data) {
      const otherProfile = data.user1.id === userId ? data.user2 : data.user1
      setMatch({ ...data, otherProfile })
    }
  }

  const loadMessages = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("messages")
      .select(
        `
        *,
        sender:profiles!messages_sender_id_fkey(id, display_name, avatar_url)
      `,
      )
      .eq("match_id", resolvedParams.matchId)
      .order("created_at", { ascending: true })

    setMessages(data || [])
    setTimeout(() => scrollToBottom(), 100)
  }

  const subscribeToMessages = () => {
    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${resolvedParams.matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${resolvedParams.matchId}`,
        },
        async (payload) => {
          const { data: newMessage } = await supabase
            .from("messages")
            .select(
              `
            *,
            sender:profiles!messages_sender_id_fkey(id, display_name, avatar_url)
          `,
            )
            .eq("id", payload.new.id)
            .single()

          if (newMessage) {
            setMessages((prev) => [...prev, newMessage])
            scrollToBottom()
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || isSending) return

    setIsSending(true)
    const supabase = createClient()

    try {
      await supabase.from("messages").insert({
        match_id: resolvedParams.matchId,
        sender_id: user.id,
        content: newMessage.trim(),
      })

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  if (!user || !match) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/messages">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={match.otherProfile.avatar_url || undefined} />
          <AvatarFallback>{match.otherProfile.display_name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-semibold">{match.otherProfile.display_name}</h2>
          <p className="text-xs text-muted-foreground">@{match.otherProfile.username}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.map((message) => {
          const isOwn = message.sender_id === user.id
          return (
            <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-xs ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                {!isOwn && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.avatar_url || undefined} />
                    <AvatarFallback>{message.sender.display_name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "bg-white border text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${isOwn ? "text-right" : "text-left"}`}>
                    {formatDistanceToNow(new Date(message.created_at))} ago
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <form onSubmit={handleSend} className="mx-auto max-w-2xl flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || isSending}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}

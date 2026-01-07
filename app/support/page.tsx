"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

export default function SupportPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
            <Send className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Message Sent!</h2>
          <p className="text-muted-foreground">
            We&apos;ve received your message and will get back to you within 24 hours.
          </p>
          <Button onClick={() => router.back()} className="w-full">
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Support</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">How can we help?</h2>
          <p className="text-muted-foreground">Send us a message and we&apos;ll respond as soon as possible.</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="What's this about?" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Describe your issue or question..." rows={6} required />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Common Questions</h3>
          <div className="space-y-3 text-sm">
            <details className="group">
              <summary className="cursor-pointer font-medium">How do I delete my account?</summary>
              <p className="mt-2 text-muted-foreground pl-4">Go to Profile → Settings → Account → Delete Account</p>
            </details>
            <details className="group">
              <summary className="cursor-pointer font-medium">How do I report a user?</summary>
              <p className="mt-2 text-muted-foreground pl-4">
                Tap the three dots on their profile and select &quot;Report&quot;
              </p>
            </details>
            <details className="group">
              <summary className="cursor-pointer font-medium">How does matching work?</summary>
              <p className="mt-2 text-muted-foreground pl-4">
                When two users swipe right on each other, it&apos;s a match!
              </p>
            </details>
          </div>
        </Card>
      </main>
    </div>
  )
}

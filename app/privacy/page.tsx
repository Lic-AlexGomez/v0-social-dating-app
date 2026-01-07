"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Privacy & Safety</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">Your Privacy Matters</h2>
          <p className="text-muted-foreground">
            We&apos;re committed to keeping your data safe and giving you control over your information.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Safety Tips</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Never share personal information like your address or financial details</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Meet in public places for first dates</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Trust your instincts - if something feels off, it probably is</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Report any suspicious behavior immediately</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Data Protection</h3>
          <p className="text-sm text-muted-foreground">
            Your data is encrypted and stored securely. We never sell your information to third parties. You can request
            a copy of your data or delete your account at any time from your settings.
          </p>
        </Card>
      </main>
    </div>
  )
}

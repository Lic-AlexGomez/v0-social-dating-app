"use client"

import { ArrowLeft, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">About Sparkd</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4 py-8">
          <div className="relative w-24 h-24">
            <Image src="/sparkd-logo.png" alt="Sparkd Logo" fill className="object-contain" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Sparkd
          </h2>
          <p className="text-muted-foreground max-w-md">
            Where connections ignite. A modern social dating platform for the digital age.
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Our Mission
          </h3>
          <p className="text-sm text-muted-foreground">
            To create meaningful connections in an authentic, fun, and safe environment. We believe everyone deserves to
            find their spark.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Version</h3>
          <p className="text-sm text-muted-foreground">1.0.0 (Beta)</p>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Contact</h3>
          <p className="text-sm text-muted-foreground">
            Email: support@sparkd.app
            <br />
            Twitter: @SparkdApp
          </p>
        </Card>
      </main>
    </div>
  )
}

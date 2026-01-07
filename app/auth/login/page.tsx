"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState, useTransition } from "react"
import { ArrowLeft, Zap } from "lucide-react"
import { loginAction } from "./actions"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await loginAction(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center sparkd-bg px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-8">
          {/* Back Button */}
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>

          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-full" />
              <Zap className="relative w-16 h-16 gradient-text-cyan-magenta" strokeWidth={1.5} />
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-strong rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">Log In</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="glass border-white/20 text-white placeholder:text-white/40 focus:neon-border-cyan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/80">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="glass border-white/20 text-white placeholder:text-white/40 focus:neon-border-cyan"
                  />
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-muted-foreground hover:text-white transition-colors block"
                >
                  Forgot Password?
                </Link>
              </div>

              {error && (
                <div className="glass border-red-500/50 rounded-lg p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full gradient-cyan-magenta text-white hover:opacity-90 neon-cyan font-semibold h-12 text-base"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

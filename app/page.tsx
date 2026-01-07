import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col sparkd-bg">
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="flex flex-col items-center gap-12 text-center max-w-md">
          {/* Logo */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl opacity-50 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-full" />
            <div className="relative w-32 h-32 flex items-center justify-center">
              <Zap className="w-24 h-24 gradient-text-cyan-magenta" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold gradient-text-cyan-magenta">Welcome to Sparkd</h1>
            <p className="text-muted-foreground text-lg">Lost in the rhythm of the city. Who's out tonight?</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Button asChild size="lg" className="glass-strong text-white hover:glass neon-cyan border-0 font-semibold">
              <Link href="/auth/sign-up">Join with Email</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="glass text-white hover:glass-strong border-white/20 bg-transparent"
            >
              <Link href="/auth/login">Continue with Apple</Link>
            </Button>
          </div>

          {/* Login Link */}
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">
              Log In
            </Link>
          </p>
        </div>
      </main>

      {/* Removed footer and additional sections for simplicity */}
    </div>
  )
}

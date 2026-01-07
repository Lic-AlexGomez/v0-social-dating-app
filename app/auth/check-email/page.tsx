import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center sparkd-bg px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-8">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>

          <div className="glass-strong rounded-2xl p-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-full" />
                <div className="relative w-16 h-16 flex items-center justify-center glass rounded-full">
                  <Mail className="h-8 w-8 text-cyan-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Check Your Email</h1>
              <p className="text-muted-foreground">We've sent you a confirmation link</p>
            </div>

            <p className="text-sm text-white/70">
              Please check your email and click the confirmation link to activate your account.
            </p>

            <Button
              asChild
              variant="outline"
              className="w-full glass text-white hover:glass-strong border-white/20 bg-transparent"
            >
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

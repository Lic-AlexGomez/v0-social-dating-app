"use client"

import { useState } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { MapPin, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SwipeCardProps {
  profile: {
    id: string
    username: string
    display_name: string
    bio: string | null
    avatar_url: string | null
    date_of_birth: string
    gender: string | null
    location: string | null
  }
  onSwipe: (direction: "left" | "right" | "super") => void
}

export function SwipeCard({ profile, onSwipe }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

  const calculateAge = (dob: string) => {
    const diff = Date.now() - new Date(dob).getTime()
    return Math.abs(new Date(diff).getUTCFullYear() - 1970)
  }

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitX(info.offset.x > 0 ? 200 : -200)
      onSwipe(info.offset.x > 0 ? "right" : "left")
    }
  }

  return (
    <motion.div
      className="absolute h-full w-full cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="absolute inset-0">
          <img
            src={profile.avatar_url || "/placeholder.svg?height=600&width=400"}
            alt={profile.display_name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold">
                {profile.display_name}, {calculateAge(profile.date_of_birth)}
              </h2>
            </div>

            {profile.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.bio && <p className="text-sm leading-relaxed">{profile.bio}</p>}

            {profile.gender && (
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {profile.gender}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
        >
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  )
}

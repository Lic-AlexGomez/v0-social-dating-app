"use client"

import { X, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SwipeActionsProps {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSuperLike: () => void
  disabled?: boolean
}

export function SwipeActions({ onSwipeLeft, onSwipeRight, onSuperLike, disabled }: SwipeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 bg-transparent"
        onClick={onSwipeLeft}
        disabled={disabled}
      >
        <X className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-16 w-16 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600 bg-transparent"
        onClick={onSuperLike}
        disabled={disabled}
      >
        <Star className="h-7 w-7" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-14 w-14 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 bg-transparent"
        onClick={onSwipeRight}
        disabled={disabled}
      >
        <Heart className="h-6 w-6" />
      </Button>
    </div>
  )
}

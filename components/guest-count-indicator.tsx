"use client"

import { useAuth } from "@/components/auth-provider"

const SOFT_LIMITS: Record<string, number> = { free: 50, esencial: 150, premium: 500 }

interface GuestCountIndicatorProps {
  guestCount: number
}

export function GuestCountIndicator({ guestCount }: GuestCountIndicatorProps) {
  const { user } = useAuth()
  if (!user) return null

  const plan = user.plan ?? "free"
  const limit = SOFT_LIMITS[plan] ?? 50
  const pct = guestCount / limit
  const warningThreshold = 0.7

  // GuestLimitBanner handles >= 70%
  if (pct >= warningThreshold) return null
  if (guestCount === 0) return null

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {guestCount} de {limit} invitados
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-xs">
        <div
          className="h-full rounded-full bg-muted-foreground/30 transition-all"
          style={{ width: `${Math.min(pct * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}

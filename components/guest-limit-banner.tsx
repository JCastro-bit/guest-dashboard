"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"

const LIMITS: Record<string, number> = { free: 50, esencial: 150, premium: 500 }
const NEXT_PLAN: Record<string, string | null> = { free: "Esencial", esencial: "Premium", premium: null }

interface GuestLimitBannerProps {
  guestCount: number
  userPlan: string
}

export function GuestLimitBanner({ guestCount, userPlan }: GuestLimitBannerProps) {
  const limit = LIMITS[userPlan] ?? 50
  const nextPlan = NEXT_PLAN[userPlan] ?? null
  const pct = guestCount / limit

  if (pct < 0.7 || !nextPlan) return null

  if (pct >= 1) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
        <p className="text-sm text-destructive flex-1">
          {guestCount}/{limit} invitados &middot; Limite alcanzado.{" "}
          <Link href="/upgrade" className="underline font-semibold hover:opacity-80">
            Actualizar plan &rarr;
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30">
      <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
      <p className="text-sm text-warning-foreground flex-1">
        {guestCount}/{limit} invitados &middot; Estas cerca del limite &mdash; pasa al Plan {nextPlan} para agregar mas.{" "}
        <Link href="/upgrade" className="underline font-semibold hover:opacity-80">
          Ver planes &rarr;
        </Link>
      </p>
    </div>
  )
}

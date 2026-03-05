"use client"

import { Sparkles, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { canWrite } from "@/lib/plan"

interface UpgradeBannerProps {
  message?: string
  compact?: boolean
}

export function UpgradeBanner({
  message = "Activa tu plan para comenzar a gestionar tu boda.",
  compact = false,
}: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const { user } = useAuth()

  if (!user || canWrite(user.plan, user.planStatus) || dismissed) return null

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
        <Sparkles className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm text-foreground flex-1">{message}</p>
        <Link
          href="/upgrade"
          className="text-sm font-semibold text-primary hover:underline shrink-0"
        >
          Ver planes
        </Link>
      </div>
    )
  }

  return (
    <div className="relative flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 shrink-0">
        <Sparkles className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-foreground text-sm">Plan gratuito activo</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Link
        href="/upgrade"
        className="shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors duration-200"
      >
        Activar plan
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

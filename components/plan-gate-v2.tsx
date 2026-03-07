"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

const PLAN_ORDER: Record<string, number> = { free: 0, esencial: 1, premium: 2 }

interface PlanGateV2Props {
  requiredPlan: "esencial" | "premium"
  userPlan: string
  planStatus: string
  children: ReactNode
  mode?: "overlay" | "hide"
}

export function PlanGateV2({
  requiredPlan,
  userPlan,
  planStatus,
  children,
  mode = "overlay",
}: PlanGateV2Props) {
  const router = useRouter()
  const hasAccess =
    planStatus === "active" && (PLAN_ORDER[userPlan] ?? 0) >= (PLAN_ORDER[requiredPlan] ?? 0)

  if (hasAccess) return <>{children}</>

  const label = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)

  if (mode === "hide") {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-muted text-muted-foreground">
        <Lock className="w-4 h-4 shrink-0" />
        <span className="text-sm">Disponible en Plan {label}</span>
      </div>
    )
  }

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/85 backdrop-blur-sm rounded-lg">
        <Lock className="w-5 h-5 text-muted-foreground mb-2" />
        <p className="text-sm font-medium text-foreground mb-3">Disponible en Plan {label}</p>
        <Button size="sm" onClick={() => router.push("/upgrade")}>
          Ver planes
        </Button>
      </div>
    </div>
  )
}

"use client"

import { Lock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { canWrite } from "@/lib/plan"

interface PlanGateProps {
  children: React.ReactNode
  message?: string
}

export function PlanGate({ children, message = "Requiere plan activo" }: PlanGateProps) {
  const { user } = useAuth()

  if (!user || canWrite(user.plan, user.planStatus)) return <>{children}</>

  return (
    <div className="relative inline-flex">
      <div className="pointer-events-none opacity-50 select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Link
          href="/upgrade"
          className="flex items-center gap-1 text-xs font-medium bg-card border border-border rounded-md px-2 py-1 text-muted-foreground hover:text-foreground transition-colors duration-200 shadow-sm"
          title={message}
        >
          <Lock className="w-3 h-3" />
          Activar
        </Link>
      </div>
    </div>
  )
}

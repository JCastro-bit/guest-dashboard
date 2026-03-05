"use client"

import { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Users, Mail, LayoutGrid, BarChart2, AlertCircle, RefreshCw, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"

// ==================== Table Skeleton ====================

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-4 rounded-lg bg-muted/30 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/5" />
          <div className="h-4 bg-muted rounded w-1/6 ml-auto" />
        </div>
      ))}
    </div>
  )
}

// ==================== Stats Skeleton ====================

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
          <div className="h-3 bg-muted rounded w-2/3 mb-3" />
          <div className="h-8 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

// ==================== Empty State ====================

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-8 text-center">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      </div>
      {action && (
        <Button onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  )
}

export const EMPTY_STATES = {
  guests: {
    icon: Users,
    title: "Sin invitados aun",
    description: "Agrega tu primer invitado para comenzar a gestionar confirmaciones.",
  },
  invitations: {
    icon: Mail,
    title: "Sin invitaciones aun",
    description: "Crea tu primera invitacion y compartela con tus invitados.",
  },
  tables: {
    icon: LayoutGrid,
    title: "Sin mesas configuradas",
    description: "Organiza tu boda creando las mesas y asignando invitados.",
  },
  stats: {
    icon: BarChart2,
    title: "Sin datos todavia",
    description: "Las estadisticas apareceran conforme agregues invitados.",
  },
} as const

// ==================== Error Message ====================

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export function ErrorMessage({
  message = "No se pudieron cargar los datos.",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 p-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
        <AlertCircle className="w-6 h-6 text-destructive" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Verifica tu conexion e intenta de nuevo.
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
          <RefreshCw className="w-3 h-3" />
          Reintentar
        </Button>
      )}
    </div>
  )
}

// ==================== Network Status ====================

export function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium shadow-lg">
      <WifiOff className="w-4 h-4" />
      Sin conexion — los cambios no se guardaran
    </div>
  )
}

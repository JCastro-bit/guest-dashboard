"use client"

import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ErrorAlertProps {
  title?: string
  message?: string
  retry?: boolean
}

export function ErrorAlert({
  title = "No se pudo cargar la informacion",
  message = "Ocurrio un problema al conectar con el servidor. Verifica tu conexion e intenta de nuevo.",
  retry = true,
}: ErrorAlertProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 shrink-0">
        <WifiOff className="w-5 h-5 text-destructive" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">{title}</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {retry && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.refresh()}
          className="shrink-0 gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reintentar
        </Button>
      )}
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function UpgradeFailurePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-serif font-bold">El pago no fue completado</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        No se pudo procesar el pago. Puedes intentarlo nuevamente.
      </p>
      <Button onClick={() => router.push("/upgrade")} className="mt-4">
        Intentar de nuevo
      </Button>
    </div>
  )
}

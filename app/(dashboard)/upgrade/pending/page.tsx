"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export default function UpgradePendingPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
        <Clock className="h-8 w-8 text-warning" />
      </div>
      <h2 className="text-2xl font-serif font-bold">Tu pago esta siendo procesado</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Recibiras un correo cuando se confirme tu pago y se active tu plan.
      </p>
      <Button onClick={() => router.push("/")} className="mt-4">
        Ir a mi dashboard
      </Button>
    </div>
  )
}

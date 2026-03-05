"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function UpgradeSuccessPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()

  useEffect(() => {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      await refreshUser()
      if (attempts >= 5) clearInterval(interval)
    }, 3000)
    return () => clearInterval(interval)
  }, [refreshUser])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="h-8 w-8 text-success" />
      </div>
      <h2 className="text-2xl font-serif font-bold">Pago procesado</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Tu plan se activara en segundos. Recibiras un correo de confirmacion en breve.
      </p>
      <Button onClick={() => router.push("/")} className="mt-4">
        Ir a mi dashboard
      </Button>
    </div>
  )
}

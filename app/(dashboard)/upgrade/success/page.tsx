"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { canWrite } from "@/lib/plan"
import { getInvitations } from "@/lib/api"

export default function UpgradeSuccessPage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [polling, setPolling] = useState(true)
  const redirectedRef = useRef(false)

  const planActivated = user ? canWrite(user.plan, user.planStatus) : false

  useEffect(() => {
    if (planActivated) {
      setPolling(false)
      if (!redirectedRef.current) {
        redirectedRef.current = true
        getInvitations()
          .then((invitations) => {
            router.push(invitations.length === 0 ? "/onboarding" : "/")
          })
          .catch(() => router.push("/"))
      }
      return
    }

    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        await refreshUser()
      } catch {
        // Silently continue polling
      }
      if (attempts >= 5) {
        clearInterval(interval)
        setPolling(false)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [refreshUser, planActivated, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="h-8 w-8 text-success" />
      </div>
      <h2 className="text-2xl font-serif font-bold">Pago procesado</h2>
      {planActivated ? (
        <p className="text-sm text-muted-foreground max-w-sm">
          Tu plan <strong>{user?.plan}</strong> esta activo. Ya puedes gestionar tu boda.
        </p>
      ) : polling ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Activando tu plan...
        </div>
      ) : (
        <p className="text-sm text-muted-foreground max-w-sm">
          Tu plan se activara en breve. Si no se activa en unos minutos, recibiras un correo de confirmacion.
        </p>
      )}
      <Button onClick={() => router.push("/")} className="mt-4">
        Ir a mi dashboard
      </Button>
    </div>
  )
}

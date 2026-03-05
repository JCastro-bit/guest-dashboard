"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Loader2, Sparkles, Crown } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { canWrite, PLAN_PRICES } from "@/lib/plan"

const PLAN_FEATURES = {
  esencial: [
    "Save the Date digital",
    "Cuenta regresiva",
    "Galeria de fotos",
    "Mesa de regalos",
    "Ubicacion con mapa",
    "Mensajes de invitados",
    "Musica personalizada",
  ],
  premium: [
    "Todo lo del plan Esencial",
    "App de gestion de invitados",
    "Scanner de codigos QR",
    "RSVP automatizado",
    "Soporte prioritario",
  ],
}

export default function UpgradePage() {
  const [loadingPlan, setLoadingPlan] = useState<"esencial" | "premium" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const hasAccess = user ? canWrite(user.plan, user.planStatus) : false

  async function handleSelectPlan(plan: "esencial" | "premium") {
    setLoadingPlan(plan)
    setError(null)

    try {
      const { createPaymentPreference } = await import("@/lib/api")
      const data = await createPaymentPreference(plan)
      const url = process.env.NODE_ENV === "production"
        ? data.initPoint
        : data.sandboxInitPoint
      window.location.href = url
    } catch {
      setError("No se pudo iniciar el pago. Intenta de nuevo.")
      setLoadingPlan(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Elige tu plan</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Activa tu invitacion digital y sorprende a tus invitados
        </p>
      </div>

      {hasAccess && (
        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
          <Check className="w-4 h-4 text-success" />
          <p className="text-sm text-foreground">
            Ya tienes el plan <strong>{user?.plan}</strong> activo.
          </p>
        </div>
      )}

      {error && (
        <div className="text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {/* Esencial */}
        <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-lg font-serif font-semibold">Esencial</h3>
          </div>
          <div className="mb-6">
            <span className="text-3xl font-bold text-foreground">
              ${PLAN_PRICES.esencial.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground ml-1">MXN</span>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {PLAN_FEATURES.esencial.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            onClick={() => handleSelectPlan("esencial")}
            disabled={loadingPlan !== null}
            variant="outline"
            className="w-full"
          >
            {loadingPlan === "esencial" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Elegir Esencial"
            )}
          </Button>
        </div>

        {/* Premium */}
        <div className="flex flex-col rounded-xl border-2 border-primary bg-card p-6 shadow-sm relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            Recomendado
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <Crown className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-lg font-serif font-semibold">Premium</h3>
          </div>
          <div className="mb-6">
            <span className="text-3xl font-bold text-foreground">
              ${PLAN_PRICES.premium.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground ml-1">MXN</span>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {PLAN_FEATURES.premium.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            onClick={() => handleSelectPlan("premium")}
            disabled={loadingPlan !== null}
            className="w-full"
          >
            {loadingPlan === "premium" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Elegir Premium"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

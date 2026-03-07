"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Check,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  Crown,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { createPaymentPreference } from "@/lib/api"
import { toast } from "sonner"

const FREE_YES = [
  "1 invitacion",
  "Hasta 50 invitados",
  "1 diseno basico",
  "RSVP basico",
  "Compartir por WhatsApp",
]
const FREE_NO = [
  "Disenos premium",
  "Sin branding LOVEPOSTAL",
  "Mesa de regalos",
  "Recordatorios",
  "Exportar lista",
]

const ESENCIAL_YES = [
  "Invitaciones ilimitadas",
  "Hasta 150 invitados",
  "Todos los disenos premium",
  "Sin branding LOVEPOSTAL",
  "RSVP avanzado",
  "Confirmaciones por email",
  "Recordatorios automaticos",
  "Save the Date",
  "Mesa de regalos",
  "Exportar Excel/PDF",
]
const ESENCIAL_NO = ["Codigos QR", "Check-in scanner"]

const PREMIUM_YES = [
  ...ESENCIAL_YES.filter((f) => f !== "Hasta 150 invitados"),
  "Hasta 500 invitados",
  "Codigos QR por invitado",
  "Check-in scanner QR",
  "Soporte WhatsApp",
]

const FAQ = [
  {
    q: "Puedo cambiar de plan despues?",
    a: "Actualmente los planes son de pago unico. Puedes hacer upgrade contactando soporte.",
  },
  {
    q: "Mi invitacion gratuita se pierde si no pago?",
    a: "No. Tu invitacion permanece activa para siempre, incluyendo el link compartido.",
  },
  {
    q: "Como funciona el pago en OXXO?",
    a: "Recibiras una referencia de pago. Tu plan se activara en maximo 3 dias habiles.",
  },
  {
    q: "Es seguro pagar aqui?",
    a: "Si. Los pagos son procesados por MercadoPago con protocolos PCI DSS.",
  },
]

function FeatureItem({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {included ? (
        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
      )}
      <span className={included ? "text-foreground" : "text-muted-foreground"}>{text}</span>
    </li>
  )
}

export default function UpgradePage() {
  const { user } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState<"esencial" | "premium" | null>(null)
  const [msiMode, setMsiMode] = useState(false)

  async function handlePayment(plan: "esencial" | "premium") {
    setLoadingPlan(plan)
    try {
      const data = await createPaymentPreference(plan)
      window.location.href = data.initPoint
    } catch {
      toast.error("No pudimos procesar tu solicitud. Intenta de nuevo.")
      setLoadingPlan(null)
    }
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold text-foreground">Elige tu plan</h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Pago unico. Sin suscripciones. Tu invitacion disponible para siempre.
        </p>
      </div>

      {/* MSI toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setMsiMode(false)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              !msiMode ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            Precio total
          </button>
          <button
            onClick={() => setMsiMode(true)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              msiMode ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            Pago en cuotas
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GRATUITO */}
        <div className="flex flex-col rounded-xl border bg-card p-6">
          <h3 className="text-lg font-serif font-semibold text-foreground">Gratuito</h3>
          <div className="my-4">
            <span className="text-3xl font-bold text-foreground">$0</span>
          </div>
          {user?.plan === "free" && (
            <span className="inline-block mb-4 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium w-fit">
              Tu plan actual
            </span>
          )}
          <ul className="space-y-2 mb-6 flex-1">
            {FREE_YES.map((f) => <FeatureItem key={f} text={f} included />)}
            {FREE_NO.map((f) => <FeatureItem key={f} text={f} included={false} />)}
          </ul>
          <Button variant="outline" className="w-full" disabled={user?.plan === "free"}>
            {user?.plan === "free" ? "Plan actual" : "Comenzar gratis"}
          </Button>
        </div>

        {/* ESENCIAL */}
        <div className="flex flex-col rounded-xl border-2 border-primary bg-card p-6 relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            Mas popular
          </span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-serif font-semibold text-foreground">Esencial</h3>
          </div>
          <div className="my-4">
            {msiMode ? (
              <div>
                <span className="text-2xl font-bold text-foreground">12 MSI de $125 MXN/mes</span>
                <p className="text-xs text-muted-foreground mt-1">Total: $1,499 MXN</p>
              </div>
            ) : (
              <div>
                <span className="text-3xl font-bold text-foreground">$1,499</span>
                <span className="text-sm text-muted-foreground ml-1">MXN pago unico</span>
              </div>
            )}
          </div>
          {user?.plan === "esencial" && (
            <span className="inline-block mb-4 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium w-fit">
              Tu plan actual
            </span>
          )}
          <ul className="space-y-2 mb-6 flex-1">
            {ESENCIAL_YES.map((f) => <FeatureItem key={f} text={f} included />)}
            {ESENCIAL_NO.map((f) => <FeatureItem key={f} text={f} included={false} />)}
          </ul>
          <Button
            className="w-full"
            onClick={() => handlePayment("esencial")}
            disabled={loadingPlan !== null || user?.plan === "esencial"}
          >
            {loadingPlan === "esencial" ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Procesando...</>
            ) : user?.plan === "esencial" ? "Plan actual" : "Elegir Esencial"}
          </Button>
        </div>

        {/* PREMIUM */}
        <div className="flex flex-col rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            <h3 className="text-lg font-serif font-semibold text-foreground">Premium</h3>
          </div>
          <div className="my-4">
            {msiMode ? (
              <div>
                <span className="text-2xl font-bold text-foreground">24 MSI de $125 MXN/mes</span>
                <p className="text-xs text-muted-foreground mt-1">Total: $2,999 MXN</p>
              </div>
            ) : (
              <div>
                <span className="text-3xl font-bold text-foreground">$2,999</span>
                <span className="text-sm text-muted-foreground ml-1">MXN pago unico</span>
              </div>
            )}
          </div>
          {user?.plan === "premium" && (
            <span className="inline-block mb-4 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium w-fit">
              Tu plan actual
            </span>
          )}
          <ul className="space-y-2 mb-6 flex-1">
            {PREMIUM_YES.map((f) => <FeatureItem key={f} text={f} included />)}
          </ul>
          <Button
            className="w-full"
            onClick={() => handlePayment("premium")}
            disabled={loadingPlan !== null || user?.plan === "premium"}
          >
            {loadingPlan === "premium" ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Procesando...</>
            ) : user?.plan === "premium" ? "Plan actual" : "Elegir Premium"}
          </Button>
        </div>
      </div>

      {/* Trust row */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Pago seguro con MercadoPago</span>
        </div>
        <span>VISA · Mastercard · OXXO · SPEI · Meses sin intereses</span>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-serif font-semibold text-foreground mb-4 text-center">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible>
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-sm text-foreground">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Heart, Sparkles, TreePine, Minus, Copy, MessageCircle, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { createInvitation, updateInvitation, getInvitationTemplates } from "@/lib/api"
import { toast } from "sonner"

type Style = "romantico" | "moderno" | "rustico" | "minimalista"

interface FormData {
  coupleName: string
  eventDate: string
  noDate: boolean
  venue: string
  style: Style | null
}

interface Template {
  id: string
  name: string
  plan: string
  style: string
  previewUrl: string
  defaultColorPalette: string
}

const PLAN_ORDER: Record<string, number> = { free: 0, esencial: 1, premium: 2 }

const STYLE_OPTIONS: { value: Style; label: string; icon: typeof Heart }[] = [
  { value: "romantico", label: "Romantico", icon: Heart },
  { value: "moderno", label: "Moderno", icon: Sparkles },
  { value: "rustico", label: "Rustico", icon: TreePine },
  { value: "minimalista", label: "Minimalista", icon: Minus },
]

const INVITATION_TEXTS: Record<Style, string> = {
  romantico: "Junto con sus familias, {coupleName} tienen el honor de invitarles a celebrar su matrimonio el {date}{venue}.",
  moderno: "Nos casamos! {coupleName} los invitan a ser parte de su dia mas especial el {date}{venue}.",
  rustico: "Con mucho amor, {coupleName} los invitan a acompanarlos en su boda el {date}{venue}.",
  minimalista: "{coupleName} · {date}{venue}.",
}

function generateText(style: Style, coupleName: string, eventDate: string, venue: string) {
  const venueText = venue ? ` en ${venue}` : ""
  const dateText = eventDate || "fecha por confirmar"
  return INVITATION_TEXTS[style]
    .replace("{coupleName}", coupleName)
    .replace("{date}", dateText)
    .replace("{venue}", venueText)
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    coupleName: "",
    eventDate: "",
    noDate: false,
    venue: "",
    style: null,
  })
  const [createdInvitation, setCreatedInvitation] = useState<{ id: string; slug: string } | null>(null)

  // Step 2 state
  const [templates, setTemplates] = useState<Template[]>([])
  const [userPlan, setUserPlan] = useState("free")

  // Step 3 state
  const [messageText, setMessageText] = useState("")
  const [selectedPalette, setSelectedPalette] = useState("warm")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Step 4 state
  const [copied, setCopied] = useState(false)

  const handleStep1Submit = async () => {
    if (!formData.coupleName || !formData.style) return
    setLoading(true)
    try {
      const inv = await createInvitation({
        name: formData.coupleName,
        eventDate: formData.noDate ? null : formData.eventDate || null,
        location: formData.venue || null,
        message: "",
      })
      setCreatedInvitation({ id: inv.id, slug: inv.slug || "" })
      // Update with template fields
      await updateInvitation(inv.id, {
        // @ts-expect-error — stylePreset, templateId, colorPalette are new Prisma fields not yet in CreateInvitationRequest type
        stylePreset: formData.style,
        templateId: "free-clasico",
        colorPalette: "warm",
      })
      setStep(2)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear la invitacion")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: fetch templates
  useEffect(() => {
    if (step !== 2 || !formData.style) return
    getInvitationTemplates(formData.style)
      .then((data) => {
        setTemplates(data.templates)
        setUserPlan(data.userPlan)
      })
      .catch(() => toast.error("Error al cargar plantillas"))
  }, [step, formData.style])

  const handleSelectTemplate = async (template: Template) => {
    if (!createdInvitation) return
    setLoading(true)
    try {
      await updateInvitation(createdInvitation.id, {
        // @ts-expect-error — templateId, colorPalette are new Prisma fields not yet in CreateInvitationRequest type
        templateId: template.id,
        colorPalette: template.defaultColorPalette,
      })
      setSelectedPalette(template.defaultColorPalette)
      setStep(3)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al seleccionar plantilla")
    } finally {
      setLoading(false)
    }
  }

  // Step 3: pre-fill text
  useEffect(() => {
    if (step === 3 && formData.style) {
      setMessageText(generateText(formData.style, formData.coupleName, formData.noDate ? "" : formData.eventDate, formData.venue))
    }
  }, [step, formData.style, formData.coupleName, formData.eventDate, formData.noDate, formData.venue])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleMessageChange = useCallback((text: string) => {
    setMessageText(text)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      if (!createdInvitation) return
      try {
        await updateInvitation(createdInvitation.id, { message: text })
      } catch {
        // silent
      }
    }, 800)
  }, [createdInvitation])

  const handlePaletteSelect = async (palette: string) => {
    setSelectedPalette(palette)
    if (!createdInvitation) return
    try {
      await updateInvitation(createdInvitation.id, {
        // @ts-expect-error — colorPalette is a new Prisma field not yet in CreateInvitationRequest type
        colorPalette: palette,
      })
    } catch {
      // silent
    }
  }

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopy = () => {
    const url = `https://app.lovepostal.studio/i/${createdInvitation?.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  const shareUrl = `https://app.lovepostal.studio/i/${createdInvitation?.slug}`

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-2">Paso {step} de 4</p>
        <div className="h-2 rounded-full bg-secondary">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-foreground">Crea tu invitacion</h1>

          <div className="space-y-2">
            <Label htmlFor="coupleName">Como se llaman?</Label>
            <Input
              id="coupleName"
              placeholder="Ej. Ana Garcia & Carlos Lopez"
              value={formData.coupleName}
              onChange={(e) => setFormData((f) => ({ ...f, coupleName: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">Asi aparecera en tu invitacion</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDate">Fecha de la boda</Label>
            <Input
              id="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData((f) => ({ ...f, eventDate: e.target.value }))}
              disabled={formData.noDate}
            />
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={formData.noDate}
                onChange={(e) => setFormData((f) => ({ ...f, noDate: e.target.checked, eventDate: "" }))}
                className="rounded border-input"
              />
              Aun no tenemos fecha
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Lugar de la ceremonia</Label>
            <Input
              id="venue"
              placeholder="Ej. Hacienda San Jose, Tlajomulco"
              value={formData.venue}
              onChange={(e) => setFormData((f) => ({ ...f, venue: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Estilo</Label>
            <div className="grid grid-cols-2 gap-3">
              {STYLE_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData((f) => ({ ...f, style: value }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    formData.style === value
                      ? "border-primary bg-secondary"
                      : "border-border bg-card hover:border-muted-foreground"
                  }`}
                >
                  <Icon className="w-6 h-6 text-foreground" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleStep1Submit}
            disabled={!formData.coupleName || !formData.style || loading}
            className="w-full"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando...</>
            ) : (
              <>Ver mi invitacion <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-foreground">Elige tu diseno</h1>
          <p className="text-sm text-muted-foreground">Selecciona la plantilla que mas te guste.</p>

          <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
            {templates.map((template, idx) => {
              const canAccess = PLAN_ORDER[userPlan] >= PLAN_ORDER[template.plan]
              return (
                <div
                  key={template.id}
                  className={`relative flex-shrink-0 w-56 md:w-auto rounded-lg border bg-card overflow-hidden ${
                    !canAccess ? "opacity-60" : ""
                  }`}
                >
                  <div
                    className="h-48 bg-secondary"
                    style={{
                      backgroundImage: `url(${template.previewUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {idx === 0 && canAccess && (
                    <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                      Recomendada
                    </span>
                  )}
                  {!canAccess && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold uppercase bg-card/90 px-3 py-1 rounded-full text-foreground border">
                        {template.plan.toUpperCase()}
                      </span>
                      <a
                        href="/upgrade"
                        className="mt-2 text-xs text-primary underline pointer-events-auto"
                      >
                        Ver planes &rarr;
                      </a>
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground">{template.name}</p>
                    {canAccess && (
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleSelectTemplate(template)}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Usar este diseno"}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <h1 className="text-2xl font-serif font-bold text-foreground">Personaliza tu invitacion</h1>

          <div className="space-y-2">
            <Label htmlFor="messageText">Texto de la invitacion</Label>
            <Textarea
              id="messageText"
              rows={5}
              value={messageText}
              onChange={(e) => handleMessageChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Paleta de colores</Label>
            <div className="flex gap-3">
              {[
                { id: "clasico", colorClass: "bg-foreground" },
                { id: "warm", colorClass: "bg-primary" },
                { id: "minimal", colorClass: "bg-muted-foreground" },
              ].map(({ id, colorClass }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handlePaletteSelect(id)}
                  className={`w-10 h-10 rounded-full transition-all ${colorClass} ${
                    selectedPalette === id ? "ring-2 ring-offset-2 ring-ring" : ""
                  }`}
                  aria-label={`Paleta ${id}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" disabled>
              Agregar fotos (opcional)
            </Button>
            <p className="text-xs text-muted-foreground text-center">Proximamente disponible</p>
          </div>

          <Button onClick={() => setStep(4)} className="w-full">
            Ver mi invitacion <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="space-y-6 text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground">Tu invitacion esta lista!</h1>
          <p className="text-sm text-muted-foreground">Comparte este enlace con tus invitados.</p>

          <div className="border rounded-lg bg-secondary p-4 font-mono text-sm text-center text-foreground break-all">
            {shareUrl}
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={handleCopy} variant="outline">
              {copied ? (
                <>Copiado! <span className="ml-1">&#10003;</span></>
              ) : (
                <><Copy className="mr-2 h-4 w-4" />Copiar link</>
              )}
            </Button>
            <Button asChild>
              <a
                href={`https://wa.me/?text=${encodeURIComponent("Nos casamos! Aqui esta nuestra invitacion: " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Compartir por WhatsApp
              </a>
            </Button>
          </div>

          <button
            onClick={() => router.push("/")}
            className="text-sm text-primary hover:underline"
          >
            Ir al dashboard <ArrowRight className="inline h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}

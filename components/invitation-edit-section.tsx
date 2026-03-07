"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Loader2, Check, ChevronDown, ChevronUp, Lock } from "lucide-react"
import { updateInvitation, getInvitationTemplates } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"

interface Template {
  id: string
  name: string
  plan: string
  style: string
  previewUrl: string
  defaultColorPalette: string
}

const PLAN_ORDER: Record<string, number> = { free: 0, esencial: 1, premium: 2 }

const PALETTES = [
  { id: "clasico", label: "Clasico", colorClass: "bg-foreground" },
  { id: "warm", label: "Calido", colorClass: "bg-primary" },
  { id: "minimal", label: "Minimal", colorClass: "bg-muted-foreground" },
]

interface InvitationEditSectionProps {
  invitationId: string
  initialName: string
  initialMessage: string | null
  initialEventDate: string | null
  initialLocation: string | null
  initialTemplateId: string | null
  initialStylePreset: string | null
  initialColorPalette: string | null
}

export function InvitationEditSection({
  invitationId,
  initialName,
  initialMessage,
  initialEventDate,
  initialLocation,
  initialTemplateId,
  initialStylePreset,
  initialColorPalette,
}: InvitationEditSectionProps) {
  const router = useRouter()
  const { user } = useAuth()
  const userPlan = user?.plan ?? "free"

  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState(initialName)
  const [message, setMessage] = useState(initialMessage ?? "")
  const [eventDate, setEventDate] = useState(initialEventDate ?? "")
  const [location, setLocation] = useState(initialLocation ?? "")
  const [templateId, setTemplateId] = useState(initialTemplateId ?? "")
  const [colorPalette, setColorPalette] = useState(initialColorPalette ?? "warm")

  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    if (!expanded) return
    getInvitationTemplates(initialStylePreset ?? undefined)
      .then((data) => setTemplates(data.templates))
      .catch(() => {})
  }, [expanded, initialStylePreset])

  const handleSave = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error("El nombre es obligatorio")
      return
    }

    setSaving(true)
    try {
      await updateInvitation(invitationId, {
        name: trimmedName,
        message: message.trim() || null,
        eventDate: eventDate || null,
        location: location.trim() || null,
        // @ts-expect-error — templateId, colorPalette are new Prisma fields not yet in CreateInvitationRequest type
        templateId: templateId || null,
        colorPalette: colorPalette || null,
      })
      toast.success("Invitacion actualizada")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Personalizar invitacion
          </CardTitle>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-6">
          {/* Event details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Datos del evento</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombres de la pareja</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ej. Ana & Carlos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Fecha del evento</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Ubicacion</Label>
                <Input
                  id="edit-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ej. Hacienda San Jose, Tlajomulco"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-message">Mensaje de la invitacion</Label>
              <Textarea
                id="edit-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Texto que veran tus invitados al abrir el link"
                rows={4}
              />
            </div>
          </div>

          {/* Template selection */}
          {templates.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Plantilla</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {templates.map((t) => {
                  const canAccess = PLAN_ORDER[userPlan] >= PLAN_ORDER[t.plan]
                  const isSelected = templateId === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      disabled={!canAccess}
                      onClick={() => {
                        setTemplateId(t.id)
                        setColorPalette(t.defaultColorPalette)
                      }}
                      className={`relative rounded-lg border-2 overflow-hidden transition-all text-left ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20"
                          : canAccess
                            ? "border-border hover:border-muted-foreground"
                            : "border-border opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div
                        className="h-24 bg-secondary"
                        style={{
                          backgroundImage: `url(${t.previewUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 rounded-full bg-primary p-0.5">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      {!canAccess && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <p className="text-xs font-medium p-2 truncate text-foreground">{t.name}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Color palette */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Paleta de colores</h3>
            <div className="flex gap-3">
              {PALETTES.map(({ id, label, colorClass }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setColorPalette(id)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div
                    className={`w-10 h-10 rounded-full transition-all ${colorClass} ${
                      colorPalette === id ? "ring-2 ring-offset-2 ring-ring" : ""
                    }`}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-2">
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

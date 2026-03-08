"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ExternalLink,
  Loader2,
  Check,
  Lock,
  Eye,
  EyeOff,
  Circle,
} from "lucide-react"
import { updateInvitation } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"
import InvitationPreview from "@/components/invitation-preview"
import {
  TEMPLATES,
  TEMPLATE_LIST,
  getTemplate,
  renderMessage,
  type TemplateId,
} from "@/lib/templates"

const PLAN_ORDER: Record<string, number> = { free: 0, esencial: 1, premium: 2 }

interface InvitationEditorProps {
  invitationId: string
  initialName: string
  initialMessage: string | null
  initialEventDate: string | null
  initialLocation: string | null
  initialTemplateId: string | null
  slug: string | null
}

export function InvitationEditor({
  invitationId,
  initialName,
  initialMessage,
  initialEventDate,
  initialLocation,
  initialTemplateId,
  slug,
}: InvitationEditorProps) {
  const router = useRouter()
  const { user } = useAuth()
  const userPlan = user?.plan ?? "free"

  const initialTemplate = getTemplate(initialTemplateId)

  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(initialTemplate.id)
  const [coupleName, setCoupleName] = useState(initialName)
  const [eventDate, setEventDate] = useState(initialEventDate ?? "")
  const [venue, setVenue] = useState(initialLocation ?? "")
  const [message, setMessage] = useState(
    initialMessage ?? renderMessage(initialTemplate.messageTemplate, initialName, initialEventDate, initialLocation),
  )
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showPreviewMobile, setShowPreviewMobile] = useState(false)

  const currentTemplate = TEMPLATES[selectedTemplateId]

  const markDirty = useCallback(() => setHasUnsavedChanges(true), [])

  const handleTemplateChange = (templateId: TemplateId) => {
    const newTemplate = TEMPLATES[templateId]
    const oldTemplate = TEMPLATES[selectedTemplateId]

    // Only update message if it matches the old template's auto-generated message
    const oldAutoMessage = renderMessage(oldTemplate.messageTemplate, coupleName, eventDate || null, venue || null)
    if (message === oldAutoMessage || message === oldTemplate.messageTemplate || !message.trim()) {
      setMessage(renderMessage(newTemplate.messageTemplate, coupleName, eventDate || null, venue || null))
    }

    setSelectedTemplateId(templateId)
    markDirty()
  }

  const handleSave = async () => {
    const trimmedName = coupleName.trim()
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
        location: venue.trim() || null,
        templateId: selectedTemplateId,
      })
      toast.success("Invitacion actualizada")
      setHasUnsavedChanges(false)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Mi Invitacion</h2>
        <div className="flex items-center gap-2">
          {/* Mobile preview toggle */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowPreviewMobile(!showPreviewMobile)}
          >
            {showPreviewMobile ? (
              <><EyeOff className="mr-2 h-4 w-4" />Editar</>
            ) : (
              <><Eye className="mr-2 h-4 w-4" />Vista previa</>
            )}
          </Button>
          {slug && (
            <Button asChild size="sm" variant="outline">
              <a
                href={`https://app.lovepostal.studio/i/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver publica
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Split screen layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Editor panel */}
        <div className={`lg:w-2/5 space-y-6 ${showPreviewMobile ? "hidden lg:block" : ""}`}>
          {/* Template selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Plantilla</h3>
            <div className="grid grid-cols-2 gap-3">
              {TEMPLATE_LIST.map((t) => {
                const canAccess = PLAN_ORDER[userPlan] >= PLAN_ORDER[t.plan]
                const isSelected = selectedTemplateId === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!canAccess}
                    onClick={() => canAccess && handleTemplateChange(t.id)}
                    className={`relative rounded-lg border-2 overflow-hidden transition-all text-left ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : canAccess
                          ? "border-border hover:border-muted-foreground"
                          : "border-border opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {/* Mini preview swatch */}
                    <div
                      className="h-16 flex items-center justify-center"
                      style={{ backgroundColor: t.colors.background }}
                    >
                      <span
                        className="text-xs font-medium"
                        style={{
                          fontFamily: `'${t.fonts.heading}', serif`,
                          color: t.colors.text,
                        }}
                      >
                        A &amp; B
                      </span>
                    </div>
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
                    <div className="p-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">{t.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        t.plan === "free"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary/10 text-primary"
                      }`}>
                        {t.plan === "free" ? "Gratis" : "Esencial"}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content fields */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Datos del evento</h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="couple-name">Nombre de la pareja</Label>
                <Input
                  id="couple-name"
                  value={coupleName}
                  onChange={(e) => { setCoupleName(e.target.value); markDirty() }}
                  placeholder="Ej. Ana & Carlos"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="event-date">Fecha</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => { setEventDate(e.target.value); markDirty() }}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="venue">Lugar</Label>
                <Input
                  id="venue"
                  value={venue}
                  onChange={(e) => { setVenue(e.target.value); markDirty() }}
                  placeholder="Ej. Hacienda San Jose, Tlajomulco"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); markDirty() }}
                  placeholder="Texto que veran tus invitados"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>
              ) : (
                "Guardar cambios"
              )}
            </Button>
            {hasUnsavedChanges && (
              <span className="flex items-center gap-1.5 text-xs text-warning">
                <Circle className="h-2 w-2 fill-current" />
                Sin guardar
              </span>
            )}
          </div>
        </div>

        {/* Preview panel */}
        <div className={`lg:w-3/5 ${showPreviewMobile ? "" : "hidden lg:block"}`}>
          <div className="sticky top-4">
            <p className="text-xs text-muted-foreground mb-3 text-center hidden lg:block">
              Vista previa en tiempo real
            </p>
            <InvitationPreview
              template={currentTemplate}
              coupleName={coupleName}
              eventDate={eventDate || null}
              venue={venue || null}
              message={message}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

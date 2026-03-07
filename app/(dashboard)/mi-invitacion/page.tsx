export const dynamic = 'force-dynamic'

import { getInvitations } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Calendar, MapPin, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { ErrorAlert } from "@/components/error-alert"
import { InvitationEditSection } from "@/components/invitation-edit-section"
import { CreateFirstInvitation } from "@/components/create-first-invitation"
import type { Metadata } from "next"
import type { Invitation } from "@/lib/types"

export const metadata: Metadata = {
  title: "Mi Invitacion",
  description: "Personaliza el diseno de tu invitacion de boda: plantilla, colores, mensaje y datos del evento.",
}

export default async function MiInvitacionPage() {
  let invitation: Invitation | null = null
  let hasError = false

  try {
    const invitations = await getInvitations()
    invitation = invitations[0] ?? null
  } catch {
    hasError = true
  }

  if (hasError) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Mi Invitacion</h2>
        <ErrorAlert />
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Mi Invitacion</h2>
        <CreateFirstInvitation />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Mi Invitacion</h2>
        {invitation.slug ? (
          <Button asChild>
            <a
              href={`https://app.lovepostal.studio/i/${invitation.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver mi invitacion
            </a>
          </Button>
        ) : (
          <Button disabled title="Generando...">
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver mi invitacion
          </Button>
        )}
      </div>

      {/* Current details summary */}
      <Card>
        <CardHeader>
          <CardTitle>Datos de la boda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-medium">Pareja</p>
              <p className="text-sm text-muted-foreground">{invitation.name}</p>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Fecha</p>
                <p className="text-sm text-muted-foreground">
                  {invitation.eventDate
                    ? format(new Date(invitation.eventDate), "EEEE, MMMM d, yyyy")
                    : "Sin fecha definida"}
                </p>
              </div>
            </div>
            {invitation.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Lugar</p>
                  <p className="text-sm text-muted-foreground">{invitation.location}</p>
                </div>
              </div>
            )}
            {invitation.message && (
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Mensaje</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{invitation.message}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit section */}
      <InvitationEditSection
        invitationId={invitation.id}
        initialName={invitation.name}
        initialMessage={invitation.message}
        initialEventDate={invitation.eventDate}
        initialLocation={invitation.location}
        initialTemplateId={invitation.templateId ?? null}
        initialStylePreset={invitation.stylePreset ?? null}
        initialColorPalette={invitation.colorPalette ?? null}
      />
    </div>
  )
}

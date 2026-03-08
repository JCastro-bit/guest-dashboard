export const dynamic = 'force-dynamic'

import { getMasterInvitation } from "@/lib/api"
import { ErrorAlert } from "@/components/error-alert"
import { CreateFirstInvitation } from "@/components/create-first-invitation"
import { InvitationEditor } from "@/components/invitation-editor"
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
    invitation = await getMasterInvitation()
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
    <InvitationEditor
      invitationId={invitation.id}
      initialName={invitation.name}
      initialMessage={invitation.message}
      initialEventDate={invitation.eventDate}
      initialLocation={invitation.location}
      initialTemplateId={invitation.templateId}
      slug={invitation.slug}
    />
  )
}

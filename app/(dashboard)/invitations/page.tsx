export const dynamic = 'force-dynamic'

import { getInvitationsWithGuests } from "@/lib/api"
import { CreateInvitationModal } from "@/components/create-invitation-modal"
import type { Metadata } from "next"
import { InvitationsContainer } from "@/components/invitations-container"
import { ErrorAlert } from "@/components/error-alert"
import type { Invitation } from "@/lib/types"

export const metadata: Metadata = {
  title: "Grupos",
  description: "Gestiona los grupos de invitados de tu boda. Cada grupo recibe un link unico para confirmar asistencia.",
}

export default async function InvitationsPage() {
  let invitations: Invitation[] = []
  let hasError = false

  try {
    invitations = await getInvitationsWithGuests()
  } catch (error) {
    console.error("Error loading invitations:", error)
    hasError = true
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Grupos</h2>
        <CreateInvitationModal />
      </div>

      {hasError && <ErrorAlert />}

      <InvitationsContainer invitations={invitations} />
    </div>
  )
}

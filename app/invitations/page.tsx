import { getInvitationsWithGuests } from "@/lib/api"
import { CreateInvitationModal } from "@/components/create-invitation-modal"
import type { Metadata } from "next"
import { InvitationsContainer } from "@/components/invitations-container"

export const metadata: Metadata = {
  title: "Invitaciones",
  description: "Gestiona todas tus invitaciones de boda. Crea nuevas invitaciones, rastrea respuestas y envía mensajes personalizados a tus invitados.",
  openGraph: {
    title: "Invitaciones | LOVEPOSTAL",
    description: "Gestiona todas tus invitaciones de boda. Crea nuevas invitaciones, rastrea respuestas y envía mensajes personalizados a tus invitados.",
    url: "/invitations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invitaciones | LOVEPOSTAL",
    description: "Gestiona todas tus invitaciones de boda. Crea nuevas invitaciones, rastrea respuestas y envía mensajes personalizados a tus invitados.",
  },
}

export default async function InvitationsPage() {
  const invitations = await getInvitationsWithGuests()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Invitaciones</h2>
        <CreateInvitationModal />
      </div>

      <InvitationsContainer invitations={invitations} />
    </div>
  )
}

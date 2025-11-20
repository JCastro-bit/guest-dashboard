import { getInvitationsWithGuests } from "@/lib/api"
import { InvitationCard } from "@/components/invitation-card"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { CreateInvitationModal } from "@/components/create-invitation-modal"
import type { Metadata } from "next"
import { SearchButton } from "@/components/search-button"

export const metadata: Metadata = {
  title: "Invitations",
  description: "Manage all your wedding invitations. Create new invitations, track responses, and send personalized messages to your guests.",
  openGraph: {
    title: "Invitations | Guest Dashboard",
    description: "Manage all your wedding invitations. Create new invitations, track responses, and send personalized messages to your guests.",
    url: "/invitations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invitations | Guest Dashboard",
    description: "Manage all your wedding invitations. Create new invitations, track responses, and send personalized messages to your guests.",
  },
}

export default async function InvitationsPage() {
  const invitations = await getInvitationsWithGuests()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Invitations</h2>
        <CreateInvitationModal />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <SearchButton variant="prominent" className="w-full sm:max-w-md" />
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {invitations.map((invitation) => (
          <InvitationCard key={invitation.id} invitation={invitation} />
        ))}
      </div>
    </div>
  )
}

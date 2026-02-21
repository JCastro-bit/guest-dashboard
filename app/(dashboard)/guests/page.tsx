export const dynamic = 'force-dynamic'

import { getInvitationsWithGuests } from "@/lib/api"
import { GuestTable } from "@/components/guest-table"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { ExportGuestsButton } from "@/components/export-guests-button"
import type { Metadata } from "next"
import { SearchButton } from "@/components/search-button"

export const metadata: Metadata = {
  title: "Lista de Invitados",
  description: "Ve y gestiona tu lista completa de invitados de boda. Busca, filtra y exporta información de invitados. Rastrea el estado de asistencia y datos de contacto.",
  openGraph: {
    title: "Lista de Invitados | LOVEPOSTAL",
    description: "Ve y gestiona tu lista completa de invitados de boda. Busca, filtra y exporta información de invitados.",
    url: "/guests",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lista de Invitados | LOVEPOSTAL",
    description: "Ve y gestiona tu lista completa de invitados de boda. Busca, filtra y exporta información de invitados.",
  },
}

export default async function GuestsPage() {
  const invitations = await getInvitationsWithGuests()
  // Flatten invitations to get all guests
  const guests = invitations.flatMap((inv) => inv.guests || [])

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Lista de Invitados</h2>
        <ExportGuestsButton guests={guests} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg shadow-sm border">
        <SearchButton variant="prominent" className="w-full sm:max-w-md" />
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </div>

      <GuestTable guests={guests} />
    </div>
  )
}

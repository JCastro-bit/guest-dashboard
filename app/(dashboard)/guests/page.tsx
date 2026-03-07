export const dynamic = 'force-dynamic'

import { getInvitationsWithGuests, getStats } from "@/lib/api"
import { GuestTable } from "@/components/guest-table"
import { Button } from "@/components/ui/button"
import { Filter, Users } from "lucide-react"
import { ExportGuestsButton } from "@/components/export-guests-button"
import type { Metadata } from "next"
import { SearchButton } from "@/components/search-button"
import Link from "next/link"
import { ErrorAlert } from "@/components/error-alert"
import { GuestLimitBannerWrapper } from "@/components/guest-limit-banner-wrapper"
import { GuestCountIndicator } from "@/components/guest-count-indicator"
import type { Guest } from "@/lib/types"

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
  let guests: Guest[] = []
  let totalGuests = 0
  let hasError = false

  try {
    const [invitations, stats] = await Promise.allSettled([
      getInvitationsWithGuests(),
      getStats(),
    ])

    if (invitations.status === 'fulfilled') {
      guests = invitations.value.flatMap((inv) => inv.guests || [])
    } else {
      hasError = true
    }

    if (stats.status === 'fulfilled') {
      totalGuests = stats.value.totalGuests
    } else {
      totalGuests = guests.length
    }
  } catch (error) {
    console.error("Error loading guests:", error)
    hasError = true
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Lista de Invitados</h2>
        <ExportGuestsButton guests={guests} />
      </div>

      <GuestCountIndicator guestCount={totalGuests} />
      <GuestLimitBannerWrapper guestCount={totalGuests} />

      {hasError && <ErrorAlert />}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg shadow-sm border">
        <SearchButton variant="prominent" className="w-full sm:max-w-md" />
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </div>

      {guests.length > 0 ? (
        <GuestTable guests={guests} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1">Sin invitados aun</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Agrega tu primer invitado creando una invitacion.
            </p>
          </div>
          <Button asChild className="mt-2">
            <Link href="/invitations">Crear invitacion</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

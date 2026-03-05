export const dynamic = 'force-dynamic'

import { getStats, getInvitationsWithGuests } from "@/lib/api"
import { StatCard } from "@/components/stat-card"
import { InvitationCard } from "@/components/invitation-card"
import { GuestMessages } from "@/components/guest-messages"
import { Users, CheckCircle, Clock, XCircle, Mail, PartyPopper } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import { SearchButton } from "@/components/search-button"
import { UpgradeBanner } from "@/components/upgrade-banner"
import type { DashboardStats, Invitation } from "@/lib/types"

export const metadata: Metadata = {
  title: "Tablero",
  description: "Ve las estadísticas de tus invitados, rastrea las confirmaciones y gestiona las invitaciones recientes. Obtén una visión completa de tu planificación.",
  openGraph: {
    title: "Tablero | LOVEPOSTAL",
    description: "Ve las estadísticas de tus invitados, rastrea las confirmaciones y gestiona las invitaciones recientes.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tablero | LOVEPOSTAL",
    description: "Ve las estadísticas de tus invitados, rastrea las confirmaciones y gestiona las invitaciones recientes.",
  },
}

export default async function DashboardPage() {
  let stats: DashboardStats | null = null
  let invitations: Invitation[] = []

  try {
    const results = await Promise.allSettled([
      getStats(),
      getInvitationsWithGuests(),
    ])

    if (results[0].status === "fulfilled") {
      stats = results[0].value
    }
    if (results[1].status === "fulfilled") {
      invitations = results[1].value
    }
  } catch (error) {
    console.error("Error loading dashboard:", error)
  }

  const recentInvitations = invitations.slice(0, 3)
  const isNewWedding = stats && stats.totalGuests === 0 && stats.totalInvitations === 0

  return (
    <div className="space-y-8">
      <UpgradeBanner message="Activa tu plan para comenzar a crear invitaciones y gestionar tu boda." />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Tablero</h2>
        <div className="flex items-center gap-2">
          <SearchButton variant="prominent" className="hidden sm:flex" />
          <Button asChild>
            <Link href="/invitations">Gestionar Invitaciones</Link>
          </Button>
        </div>
      </div>

      <SearchButton variant="prominent" className="sm:hidden" />

      {stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Invitados" value={stats.totalGuests} icon={Users} description="En todas las invitaciones" />
          <StatCard
            title="Confirmados"
            value={stats.confirmedGuests ?? 0}
            icon={CheckCircle}
            description="Invitados asistentes"
            className="border-l-4 border-l-success"
          />
          <StatCard
            title="Pendientes"
            value={stats.pendingGuests ?? 0}
            icon={Clock}
            description="En espera de respuesta"
            className="border-l-4 border-l-warning"
          />
          <StatCard
            title="Rechazados"
            value={stats.declinedGuests ?? 0}
            icon={XCircle}
            description="No asistiran"
            className="border-l-4 border-l-destructive"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[120px] gap-2 p-6 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">No se pudieron cargar las estadisticas.</p>
        </div>
      )}

      {isNewWedding && (
        <div className="flex flex-col items-center gap-3 p-8 rounded-xl bg-card border border-border text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
            <PartyPopper className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-serif font-semibold text-foreground">Bienvenidos a LOVEPOSTAL</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Comienza creando tu primera invitacion para gestionar tus invitados y confirmaciones.
          </p>
          <Button asChild className="mt-2">
            <Link href="/invitations">
              <Mail className="mr-2 h-4 w-4" />
              Crear primera invitacion
            </Link>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight">Invitaciones Recientes</h3>
          <Link href="/invitations" className="text-sm text-muted-foreground hover:text-primary flex items-center">
            Ver todas <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        {recentInvitations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentInvitations.map((invitation) => (
              <InvitationCard key={invitation.id} invitation={invitation} />
            ))}
          </div>
        ) : !isNewWedding ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50">
              <Mail className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No hay invitaciones recientes.</p>
          </div>
        ) : null}
      </div>

      {invitations.length > 0 && <GuestMessages invitations={invitations} />}
    </div>
  )
}

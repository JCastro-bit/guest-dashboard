import { getStats, getInvitationsWithGuests } from "@/lib/api"
import { StatCard } from "@/components/stat-card"
import { InvitationCard } from "@/components/invitation-card"
import { GuestMessages } from "@/components/guest-messages"
import { Users, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import { SearchButton } from "@/components/search-button"

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
  const stats = await getStats()
  const invitations = await getInvitationsWithGuests()
  const recentInvitations = invitations.slice(0, 3)

  return (
    <div className="space-y-8">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Invitados" value={stats.totalGuests} icon={Users} description="En todas las invitaciones" />
        <StatCard
          title="Confirmados"
          value={stats.confirmedGuests}
          icon={CheckCircle}
          description="Invitados asistentes"
          className="border-l-4 border-l-success"
        />
        <StatCard
          title="Pendientes"
          value={stats.pendingGuests}
          icon={Clock}
          description="En espera de respuesta"
          className="border-l-4 border-l-warning"
        />
        <StatCard
          title="Rechazados"
          value={stats.declinedGuests}
          icon={XCircle}
          description="No asistirán"
          className="border-l-4 border-l-destructive"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight">Invitaciones Recientes</h3>
          <Link href="/invitations" className="text-sm text-muted-foreground hover:text-primary flex items-center">
            Ver todas <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentInvitations.map((invitation) => (
            <InvitationCard key={invitation.id} invitation={invitation} />
          ))}
        </div>
      </div>

      <GuestMessages invitations={invitations} />
    </div>
  )
}

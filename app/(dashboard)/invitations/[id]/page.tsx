export const dynamic = 'force-dynamic'

import { getInvitation, getGuests } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GuestTable } from "@/components/guest-table"
import { StatusBadge } from "@/components/status-badge"
import { ArrowLeft, Utensils, Users } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import { getInvitationStatus, getGuestCount } from "@/lib/utils"
import type { Metadata } from "next"
import { GroupShareButtons } from "@/components/group-share-buttons"

interface InvitationDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: InvitationDetailsPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const invitation = await getInvitation(id)
    return {
      title: `${invitation.name} — Grupo`,
    }
  } catch {
    return { title: "Grupo no encontrado" }
  }
}

export default async function GroupDetailPage({ params }: InvitationDetailsPageProps) {
  const { id } = await params

  try {
    const [invitation, allGuests] = await Promise.all([
      getInvitation(id),
      getGuests(id),
    ])

    const invitationWithGuests = { ...invitation, guests: allGuests }
    const status = getInvitationStatus(invitationWithGuests)
    const guestCount = getGuestCount(invitationWithGuests)

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/invitations">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold tracking-tight">{invitation.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Creado el {format(new Date(invitation.createdAt), "d 'de' MMMM, yyyy")}
              </p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Group info + share */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles del grupo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Utensils className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Mesa</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.table?.name ?? "Sin mesa asignada"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Personas</p>
                  <p className="text-sm text-muted-foreground">
                    {guestCount} {guestCount === 1 ? "persona" : "personas"}
                  </p>
                </div>
              </div>
            </div>

            <GroupShareButtons slug={invitation.slug} groupName={invitation.name} />
          </CardContent>
        </Card>

        {/* Guests */}
        <Card>
          <CardHeader>
            <CardTitle>Invitados ({guestCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {allGuests.length > 0 ? (
              <GuestTable guests={allGuests} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay invitados en este grupo todavia.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  } catch {
    notFound()
  }
}

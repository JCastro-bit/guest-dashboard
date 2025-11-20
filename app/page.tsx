import { getStats, getInvitations } from "@/lib/api"
import { StatCard } from "@/components/stat-card"
import { InvitationCard } from "@/components/invitation-card"
import { Users, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default async function DashboardPage() {
  const stats = await getStats()
  const invitations = await getInvitations()
  const recentInvitations = invitations.slice(0, 3)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/invitations">Manage Invitations</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Guests" value={stats.totalGuests} icon={Users} description="Across all invitations" />
        <StatCard
          title="Confirmed"
          value={stats.confirmedGuests}
          icon={CheckCircle}
          description="Guests attending"
          className="border-l-4 border-l-green-500"
        />
        <StatCard
          title="Pending"
          value={stats.pendingGuests}
          icon={Clock}
          description="Awaiting response"
          className="border-l-4 border-l-amber-500"
        />
        <StatCard
          title="Declined"
          value={stats.declinedGuests}
          icon={XCircle}
          description="Not attending"
          className="border-l-4 border-l-red-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight">Recent Invitations</h3>
          <Link href="/invitations" className="text-sm text-muted-foreground hover:text-primary flex items-center">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentInvitations.map((invitation) => (
            <InvitationCard key={invitation.id} invitation={invitation} />
          ))}
        </div>
      </div>
    </div>
  )
}

import { Card } from "@/components/ui/card"
import { Users, Utensils, CheckCircle, UserX } from "lucide-react"
import type { GlobalTableStats } from "@/lib/types"

interface TableStatsCardsProps {
  stats: GlobalTableStats | null
}

export function TableStatsCards({ stats }: TableStatsCardsProps) {
  // Default values if stats or summary is undefined
  const summary = stats?.summary || {
    totalTables: 0,
    totalCapacity: 0,
    totalGuests: 0,
    totalAvailable: 0,
    unassignedGuests: 0,
  }

  const statsConfig = [
    {
      title: "Total Tables",
      value: summary.totalTables,
      icon: Utensils,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Capacity",
      value: summary.totalCapacity,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Assigned Guests",
      value: summary.totalGuests,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Unassigned Guests",
      value: summary.unassignedGuests,
      icon: UserX,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

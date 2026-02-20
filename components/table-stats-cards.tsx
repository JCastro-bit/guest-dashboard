import { Card } from "@/components/ui/card"
import { Users, Utensils, CheckCircle, UserX } from "lucide-react"
import type { GlobalTableStats } from "@/lib/types"

interface TableStatsCardsProps {
  stats: GlobalTableStats | null
}

export function TableStatsCards({ stats }: TableStatsCardsProps) {
  // Default values if stats is undefined
  const totalTables = stats?.totalTables || 0
  const totalCapacity = stats?.totalCapacity || 0
  const totalOccupied = stats?.totalOccupied || 0
  const unassignedGuests = stats?.unassignedGuests || 0

  const statsConfig = [
    {
      title: "Total Mesas",
      value: totalTables,
      icon: Utensils,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Capacidad Total",
      value: totalCapacity,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Invitados Asignados",
      value: totalOccupied,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Sin Asignar",
      value: unassignedGuests,
      icon: UserX,
      color: "text-warning",
      bgColor: "bg-warning/10",
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

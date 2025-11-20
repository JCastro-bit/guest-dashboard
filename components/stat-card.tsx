import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description?: string
  className?: string
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
}

export function StatCard({ title, value, icon: Icon, description, className, trend }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend && (
              <span className={cn("font-medium mr-1", trend.positive ? "text-green-600" : "text-red-600")}>
                {trend.positive ? "+" : ""}
                {trend.value}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

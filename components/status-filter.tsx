"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, XCircle, List } from "lucide-react"
import { cn } from "@/lib/utils"

export type StatusFilter = "all" | "confirmed" | "pending" | "declined"

interface StatusFilterProps {
  status: StatusFilter
  onStatusChange: (status: StatusFilter) => void
}

export function StatusFilterComponent({ status, onStatusChange }: StatusFilterProps) {
  const filters = [
    {
      value: "all" as const,
      label: "All",
      icon: List,
      activeClass: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      inactiveClass: "text-muted-foreground hover:bg-muted",
    },
    {
      value: "confirmed" as const,
      label: "Confirmed",
      icon: CheckCircle,
      activeClass: "bg-success/15 text-success hover:bg-success/20",
      inactiveClass: "text-success/70 hover:bg-success/10",
    },
    {
      value: "pending" as const,
      label: "Pending",
      icon: Clock,
      activeClass: "bg-warning/15 text-warning hover:bg-warning/20",
      inactiveClass: "text-warning/70 hover:bg-warning/10",
    },
    {
      value: "declined" as const,
      label: "Declined",
      icon: XCircle,
      activeClass: "bg-destructive/15 text-destructive hover:bg-destructive/20",
      inactiveClass: "text-destructive/70 hover:bg-destructive/10",
    },
  ]

  return (
    <div className="inline-flex rounded-lg border bg-background p-1 gap-1">
      {filters.map((filter) => {
        const Icon = filter.icon
        const isActive = status === filter.value

        return (
          <Button
            key={filter.value}
            variant="ghost"
            size="sm"
            onClick={() => onStatusChange(filter.value)}
            className={cn(
              "gap-2 transition-colors",
              isActive ? filter.activeClass : filter.inactiveClass
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{filter.label}</span>
          </Button>
        )
      })}
    </div>
  )
}

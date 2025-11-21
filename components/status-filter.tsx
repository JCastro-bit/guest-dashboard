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
      activeClass: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      inactiveClass: "text-slate-600 hover:bg-slate-50",
    },
    {
      value: "confirmed" as const,
      label: "Confirmed",
      icon: CheckCircle,
      activeClass: "bg-green-100 text-green-700 hover:bg-green-200",
      inactiveClass: "text-green-600 hover:bg-green-50",
    },
    {
      value: "pending" as const,
      label: "Pending",
      icon: Clock,
      activeClass: "bg-amber-100 text-amber-700 hover:bg-amber-200",
      inactiveClass: "text-amber-600 hover:bg-amber-50",
    },
    {
      value: "declined" as const,
      label: "Declined",
      icon: XCircle,
      activeClass: "bg-red-100 text-red-700 hover:bg-red-200",
      inactiveClass: "text-red-600 hover:bg-red-50",
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

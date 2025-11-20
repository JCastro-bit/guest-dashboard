import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { RSVPStatus } from "@/lib/types"
import { Check, Clock, X } from "lucide-react"

interface StatusBadgeProps {
  status: RSVPStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 capitalize",
        status === "confirmed" &&
          "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400",
        status === "pending" &&
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400",
        status === "declined" &&
          "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400",
        className,
      )}
    >
      {status === "confirmed" && <Check className="h-3 w-3" />}
      {status === "pending" && <Clock className="h-3 w-3" />}
      {status === "declined" && <X className="h-3 w-3" />}
      {status}
    </Badge>
  )
}

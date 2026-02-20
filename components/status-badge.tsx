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
          "border-success/30 bg-success/10 text-success",
        status === "pending" &&
          "border-warning/30 bg-warning/10 text-warning",
        status === "declined" &&
          "border-destructive/30 bg-destructive/10 text-destructive",
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

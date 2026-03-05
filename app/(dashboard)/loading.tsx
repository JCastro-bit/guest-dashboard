import { StatsSkeleton, TableSkeleton } from "@/components/ui-states"

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="h-9 bg-muted rounded w-48 animate-pulse" />
        <div className="h-10 bg-muted rounded w-48 animate-pulse" />
      </div>
      <StatsSkeleton />
      <TableSkeleton rows={3} />
    </div>
  )
}

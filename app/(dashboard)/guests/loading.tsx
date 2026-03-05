import { TableSkeleton } from "@/components/ui-states"

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="h-9 bg-muted rounded w-56 animate-pulse" />
        <div className="h-10 bg-muted rounded w-32 animate-pulse" />
      </div>
      <div className="flex gap-4 items-center p-4 rounded-lg bg-card border animate-pulse">
        <div className="h-10 bg-muted rounded flex-1 max-w-md" />
        <div className="h-10 bg-muted rounded w-24" />
      </div>
      <TableSkeleton rows={5} />
    </div>
  )
}

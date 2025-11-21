"use client"

import type { Invitation } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, MapPin, Users, Eye } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { getInvitationStatus, getGuestCount } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface InvitationsTableProps {
  invitations: Invitation[]
}

export function InvitationsTable({ invitations }: InvitationsTableProps) {
  const router = useRouter()

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Event Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => {
            const status = getInvitationStatus(invitation)
            const guestCount = getGuestCount(invitation)

            return (
              <TableRow
                key={invitation.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/invitations/${invitation.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{invitation.name}</span>
                    {invitation.table && (
                      <span className="text-xs text-muted-foreground">
                        Table {invitation.table.name}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{guestCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {invitation.eventDate ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {format(new Date(invitation.eventDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not set</span>
                  )}
                </TableCell>
                <TableCell>
                  {invitation.location ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[200px]">
                        {invitation.location}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not set</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/invitations/${invitation.id}`)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        Edit invitation
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        Download QR code
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Delete invitation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

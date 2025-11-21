"use client"

import type { Table as TableType } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, MapPin, Users, Eye, Pencil, Trash2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TablesTableProps {
  tables: TableType[]
}

export function TablesTable({ tables }: TablesTableProps) {
  const router = useRouter()

  if (tables.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No tables found. Create your first table to get started!</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tables.map((table) => {
            const guestCount = table.guestCount || 0
            const available = table.available || table.capacity
            const isNearCapacity = available <= 2 && available > 0
            const isFull = available === 0

            return (
              <TableRow
                key={table.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/tables/${table.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{table.name}</span>
                    {table.notes && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {table.notes}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{table.capacity}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{guestCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${isFull ? 'text-red-600' : isNearCapacity ? 'text-orange-600' : 'text-green-600'}`}>
                    {available}
                  </span>
                </TableCell>
                <TableCell>
                  {table.location ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[150px]">
                        {table.location}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not set</span>
                  )}
                </TableCell>
                <TableCell>
                  {isFull ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Full
                    </Badge>
                  ) : isNearCapacity ? (
                    <Badge variant="outline" className="border-orange-500 text-orange-600 gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {available} left
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-green-500 text-green-600">
                      Available
                    </Badge>
                  )}
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
                          router.push(`/tables/${table.id}`)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit table
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete table
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

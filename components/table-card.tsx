"use client"

import type { Table } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Utensils, MapPin, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface TableCardProps {
  table: Table
}

export function TableCard({ table }: TableCardProps) {
  const guestCount = table.guestCount || 0
  const available = table.available || table.capacity
  const isNearCapacity = available <= 2 && available > 0
  const isFull = available === 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">{table.name}</h3>
          <p className="text-sm text-muted-foreground">
            Capacidad: {table.capacity}
          </p>
        </div>
        {isFull ? (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Llena
          </Badge>
        ) : isNearCapacity ? (
          <Badge variant="outline" className="border-warning text-warning gap-1">
            <AlertCircle className="h-3 w-3" />
            {available} restantes
          </Badge>
        ) : (
          <Badge variant="outline" className="border-success text-success">
            {available} disponibles
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5" />
            <span>{guestCount} {guestCount === 1 ? "invitado" : "invitados"} asignados</span>
          </div>
          {table.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>{table.location}</span>
            </div>
          )}
          {table.invitationsCount !== undefined && table.invitationsCount > 0 && (
            <div className="flex items-center gap-2">
              <Utensils className="h-3.5 w-3.5" />
              <span>{table.invitationsCount} {table.invitationsCount === 1 ? "invitación" : "invitaciones"}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href={`/tables/${table.id}`}>Ver Detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

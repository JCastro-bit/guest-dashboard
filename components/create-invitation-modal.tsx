"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTables } from "@/lib/api"
import type { Table } from "@/lib/types"

export function CreateInvitationModal() {
  const [open, setOpen] = useState(false)
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadTables()
    }
  }, [open])

  const loadTables = async () => {
    try {
      setLoading(true)
      const data = await getTables()
      setTables(data)
    } catch (error) {
      console.error("Failed to load tables:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Crear Invitación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Invitación</DialogTitle>
          <DialogDescription>
            Añade una nueva invitación a tu lista de invitados. Podrás añadir invitados a esta invitación más adelante.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input id="name" placeholder="ej. Familia García" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="table" className="text-right">
              Mesa
            </Label>
            <Select>
              <SelectTrigger className="col-span-3" disabled={loading}>
                <SelectValue placeholder={loading ? "Cargando mesas..." : "Selecciona una mesa"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Sin asignar</SelectItem>
                {tables.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name} ({table.capacity} lugares)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="max-guests" className="text-right">
              Máx. Invitados
            </Label>
            <Input id="max-guests" type="number" defaultValue="2" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="side" className="text-right">
              Lado
            </Label>
            <Select defaultValue="mutual">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona lado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bride">Novia</SelectItem>
                <SelectItem value="groom">Novio</SelectItem>
                <SelectItem value="mutual">Mutuo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>
            Crear Invitación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

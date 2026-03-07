"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTables, createInvitation } from "@/lib/api"
import { toast } from "sonner"
import type { Table } from "@/lib/types"

export function CreateInvitationModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [tables, setTables] = useState<Table[]>([])
  const [loadingTables, setLoadingTables] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [location, setLocation] = useState("")
  const [message, setMessage] = useState("")
  const [tableId, setTableId] = useState("unassigned")
  const [nameError, setNameError] = useState("")

  useEffect(() => {
    if (open) {
      loadTables()
      setName("")
      setEventDate("")
      setLocation("")
      setMessage("")
      setTableId("unassigned")
      setNameError("")
    }
  }, [open])

  const loadTables = async () => {
    try {
      setLoadingTables(true)
      const data = await getTables()
      setTables(data)
    } catch (error) {
      console.error("Failed to load tables:", error)
      toast.error("No se pudieron cargar las mesas. Puedes continuar sin asignar mesa.")
    } finally {
      setLoadingTables(false)
    }
  }

  const handleSubmit = async () => {
    console.log("handleSubmit called", { name, tableId })

    const trimmed = name.trim()
    if (!trimmed) {
      setNameError("El nombre es obligatorio")
      return
    }
    setNameError("")

    setSubmitting(true)
    try {
      await createInvitation({
        name: trimmed,
        eventDate: eventDate || null,
        location: location.trim() || null,
        message: message.trim() || null,
        tableId: tableId === "unassigned" ? null : tableId,
      })
      toast.success("Invitacion creada correctamente")
      setOpen(false)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear la invitacion")
    } finally {
      setSubmitting(false)
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
            <div className="col-span-3 space-y-1">
              <Input
                id="name"
                placeholder="ej. Familia García"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError("") }}
              />
              {nameError && <p className="text-xs text-destructive">{nameError}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="eventDate" className="text-right">
              Fecha
            </Label>
            <Input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Lugar
            </Label>
            <Input
              id="location"
              placeholder="ej. Hacienda San José, Tlajomulco"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Mensaje
            </Label>
            <Textarea
              id="message"
              placeholder="Texto que verán tus invitados al abrir el link"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="table" className="text-right">
              Mesa
            </Label>
            <Select value={tableId} onValueChange={setTableId}>
              <SelectTrigger className="col-span-3" disabled={loadingTables}>
                <SelectValue placeholder={loadingTables ? "Cargando mesas..." : "Selecciona una mesa"} />
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
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando...</>
            ) : (
              "Crear Invitación"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

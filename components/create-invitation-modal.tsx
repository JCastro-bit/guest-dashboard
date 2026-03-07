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
import { Plus, Loader2, Lock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTables, createInvitation } from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"
import type { Table } from "@/lib/types"

interface CreateInvitationModalProps {
  invitationCount?: number
}

export function CreateInvitationModal({ invitationCount = 0 }: CreateInvitationModalProps) {
  const { user } = useAuth()
  const isFreeLimited = user?.plan === "free" && invitationCount >= 1
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [tables, setTables] = useState<Table[]>([])
  const [loadingTables, setLoadingTables] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState("")
  const [tableId, setTableId] = useState("unassigned")
  const [nameError, setNameError] = useState("")

  useEffect(() => {
    if (open) {
      loadTables()
      setName("")
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
        tableId: tableId === "unassigned" ? null : tableId,
      })
      toast.success("Grupo creado correctamente")
      setOpen(false)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear el grupo")
    } finally {
      setSubmitting(false)
    }
  }

  if (isFreeLimited) {
    return (
      <Button variant="outline" disabled className="gap-2 opacity-70">
        <Lock className="h-4 w-4" />
        Crear Grupo
        <span className="text-xs font-normal text-muted-foreground">Plan Esencial</span>
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Crear Grupo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Grupo</DialogTitle>
          <DialogDescription>
            Crea un grupo de invitados. Cada grupo recibe un link unico para confirmar asistencia.
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
              "Crear Grupo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

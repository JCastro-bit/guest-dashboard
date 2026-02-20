"use client"

import { useState } from "react"
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
import { Plus } from "lucide-react"
import { createTable } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function CreateTableModal() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    capacity: "8",
    location: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("Por favor ingresa el nombre de la mesa")
      return
    }

    const capacity = parseInt(formData.capacity)
    if (isNaN(capacity) || capacity < 1) {
      toast.error("Por favor ingresa una capacidad válida")
      return
    }

    setIsLoading(true)

    try {
      await createTable({
        name: formData.name.trim(),
        capacity,
        location: formData.location.trim() || null,
        notes: formData.notes.trim() || null,
      })

      toast.success("Mesa creada exitosamente")
      setOpen(false)
      setFormData({
        name: "",
        capacity: "8",
        location: "",
        notes: "",
      })
      router.refresh()
    } catch (error) {
      console.error("Error creating table:", error)
      toast.error(error instanceof Error ? error.message : "Error al crear la mesa")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Crear Mesa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Mesa</DialogTitle>
            <DialogDescription>
              Añade una nueva mesa a tu distribución de asientos. Podrás asignar invitaciones a esta mesa más adelante.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre *
              </Label>
              <Input
                id="name"
                placeholder="ej. Mesa 1"
                className="col-span-3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacidad *
              </Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                placeholder="8"
                className="col-span-3"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Ubicación
              </Label>
              <Input
                id="location"
                placeholder="ej. Cerca de la entrada"
                className="col-span-3"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notas
              </Label>
              <Textarea
                id="notes"
                placeholder="Notas adicionales..."
                className="col-span-3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear Mesa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CreateInvitationModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#DC325A] hover:bg-[#DC325A]/90 text-white">
          <Plus className="mr-2 h-4 w-4" /> Create Invitation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Invitation</DialogTitle>
          <DialogDescription>
            Add a new invitation to your guest list. You can add guests to this invitation later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="e.g. The Smith Family" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="max-guests" className="text-right">
              Max Guests
            </Label>
            <Input id="max-guests" type="number" defaultValue="2" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="side" className="text-right">
              Side
            </Label>
            <Select defaultValue="mutual">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bride">Bride</SelectItem>
                <SelectItem value="groom">Groom</SelectItem>
                <SelectItem value="mutual">Mutual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>
            Create Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

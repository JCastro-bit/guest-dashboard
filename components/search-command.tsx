"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import {
  Calendar,
  Home,
  Mail,
  MapPin,
  Phone,
  User,
  Users
} from "lucide-react"
import type { Invitation, Guest } from "@/lib/types"

interface SearchCommandProps {
  invitations: Invitation[]
  guests: Guest[]
}

export function SearchCommand({ invitations, guests }: SearchCommandProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    const handleOpenSearch = () => {
      setOpen(true)
    }

    document.addEventListener("keydown", down)
    document.addEventListener("open-search", handleOpenSearch)
    return () => {
      document.removeEventListener("keydown", down)
      document.removeEventListener("open-search", handleOpenSearch)
    }
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search"
      description="Search for invitations and guests"
    >
      <CommandInput placeholder="Search invitations, guests, or navigate..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/invitations"))}
          >
            <Mail className="mr-2 h-4 w-4" />
            All Invitations
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/guests"))}
          >
            <Users className="mr-2 h-4 w-4" />
            All Guests
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {invitations.length > 0 && (
          <CommandGroup heading="Invitations">
            {invitations.map((invitation) => {
              const guestCount = invitation.guests?.length || 0
              return (
                <CommandItem
                  key={invitation.id}
                  value={`invitation-${invitation.name}-${invitation.id}`}
                  onSelect={() => runCommand(() => router.push(`/invitations/${invitation.id}`))}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{invitation.name}</span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {guestCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {guestCount} guest{guestCount !== 1 ? "s" : ""}
                        </span>
                      )}
                      {invitation.eventDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(invitation.eventDate).toLocaleDateString()}
                        </span>
                      )}
                      {invitation.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {invitation.location}
                        </span>
                      )}
                    </div>
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}

        {guests.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Guests">
              {guests.slice(0, 10).map((guest) => {
                const invitation = invitations.find(inv => inv.id === guest.invitationId)
                return (
                  <CommandItem
                    key={guest.id}
                    value={`guest-${guest.name}-${guest.email}-${guest.phone}-${guest.id}`}
                    onSelect={() => {
                      if (guest.invitationId) {
                        runCommand(() => router.push(`/invitations/${guest.invitationId}`))
                      } else {
                        runCommand(() => router.push("/guests"))
                      }
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{guest.name}</span>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {guest.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {guest.email}
                          </span>
                        )}
                        {guest.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {guest.phone}
                          </span>
                        )}
                        {invitation && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {invitation.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

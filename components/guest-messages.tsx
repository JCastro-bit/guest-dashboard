"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"
import type { Invitation } from "@/lib/types"
import { useEffect, useState } from "react"

interface GuestMessagesProps {
  invitations: Invitation[]
}

export function GuestMessages({ invitations }: GuestMessagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter invitations that have messages
  const messagesWithInvitations = invitations
    .filter((inv) => inv.message && inv.message.trim() !== "")
    .map((inv) => ({
      message: inv.message!,
      name: inv.name,
      eventDate: inv.eventDate,
      location: inv.location,
      createdAt: inv.createdAt,
    }))

  // Auto-rotate messages
  useEffect(() => {
    if (messagesWithInvitations.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messagesWithInvitations.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [messagesWithInvitations.length])

  if (messagesWithInvitations.length === 0) {
    return null
  }

  const visibleMessages = messagesWithInvitations.slice(
    currentIndex,
    currentIndex + 3
  )

  // If we don't have enough messages to show 3, wrap around
  while (visibleMessages.length < 3 && visibleMessages.length < messagesWithInvitations.length) {
    const wrapIndex = (currentIndex + visibleMessages.length) % messagesWithInvitations.length
    visibleMessages.push(messagesWithInvitations[wrapIndex])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Guest Messages
        </h3>
        {messagesWithInvitations.length > 3 && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: Math.min(messagesWithInvitations.length, 5) }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex % messagesWithInvitations.length
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-muted-foreground/30"
                  }`}
                  animate={{
                    scale: i === currentIndex % messagesWithInvitations.length ? 1 : 0.8,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleMessages.map((item, index) => (
          <motion.div
            key={`${item.name}-${index}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
          >
            <Card className="h-full border-l-4 border-l-primary/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <h4 className="font-semibold text-lg">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(item.createdAt), "MMM d, yyyy")}
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: index * 0.1 + 0.3,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <MessageSquare className="h-5 w-5 text-primary/60" />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    className="relative"
                  >
                    <p className="text-sm text-muted-foreground italic line-clamp-3 before:content-['\201C'] after:content-['\201D'] before:text-primary/40 after:text-primary/40">
                      {item.message}
                    </p>
                  </motion.div>

                  {(item.eventDate || item.location) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex flex-wrap gap-2 pt-2 border-t text-xs text-muted-foreground"
                    >
                      {item.eventDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(item.eventDate), "MMM d")}</span>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">{item.location}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

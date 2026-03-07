"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, MessageCircle, ExternalLink } from "lucide-react"

interface GroupShareButtonsProps {
  slug: string | null
  groupName: string
}

export function GroupShareButtons({ slug, groupName }: GroupShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  if (!slug) return null

  const shareUrl = `https://app.lovepostal.studio/i/${slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hola! Aqui esta tu invitacion a nuestra boda: ${shareUrl}`
  )}`

  return (
    <div className="flex flex-wrap gap-2 pt-2 border-t">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? (
          <>Copiado! <span className="ml-1">&#10003;</span></>
        ) : (
          <><Copy className="mr-2 h-4 w-4" />Copiar link del grupo</>
        )}
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-2 h-4 w-4" />
          Compartir por WhatsApp
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          Ver invitacion
        </a>
      </Button>
    </div>
  )
}

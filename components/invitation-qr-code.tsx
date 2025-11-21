"use client"

import { useRef, useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, QrCode } from "lucide-react"

interface InvitationQRCodeProps {
  invitationId: string
  invitationName: string
}

export function InvitationQRCode({ invitationId, invitationName }: InvitationQRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [qrValue, setQrValue] = useState<string>("")

  useEffect(() => {
    // Create the invitation URL on the client side
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    setQrValue(`${baseUrl}/invitations/${invitationId}`)
  }, [invitationId])

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas")
    if (!canvas) return

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `invitation-qr-${invitationName.replace(/\s+/g, "-").toLowerCase()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
  }

  if (!qrValue) {
    return null
  }

  return (
    <Card className="h-fit sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Invitation QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div
          ref={qrRef}
          className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm"
        >
          <QRCodeCanvas
            value={qrValue}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <div className="text-center space-y-2 w-full">
          <p className="text-sm text-muted-foreground">
            Scan to view invitation details
          </p>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download QR Code
          </Button>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          <p className="font-mono break-all">{invitationId}</p>
        </div>
      </CardContent>
    </Card>
  )
}

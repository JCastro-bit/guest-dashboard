"use client"

import { useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PaymentPendingBannerProps {
  planStatus?: string
}

export function PaymentPendingBanner({ planStatus }: PaymentPendingBannerProps) {
  if (planStatus !== "pending") return null

  return (
    <div className="flex items-center gap-3 p-4 bg-warning/10 border-b border-warning/30">
      <Clock className="w-5 h-5 text-warning shrink-0" />
      <p className="text-sm text-foreground flex-1">
        Pago en proceso &mdash; Tu plan se activara en cuanto confirmemos tu pago en OXXO (hasta 3 dias habiles).
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Como pagar?
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Como pagar en OXXO</DialogTitle>
          </DialogHeader>
          <ol className="list-decimal list-inside space-y-3 text-sm text-foreground mt-4">
            <li>Ve a cualquier tienda OXXO</li>
            <li>Dile al cajero que quieres hacer un pago de servicio</li>
            <li>Proporciona el numero de referencia recibido por email</li>
            <li>Guarda tu comprobante de pago</li>
          </ol>
        </DialogContent>
      </Dialog>
    </div>
  )
}

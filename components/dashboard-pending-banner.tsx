"use client"

import { useAuth } from "@/components/auth-provider"
import { PaymentPendingBanner } from "@/components/payment-pending-banner"

export function DashboardPendingBanner() {
  const { user } = useAuth()
  return <PaymentPendingBanner planStatus={user?.planStatus} />
}

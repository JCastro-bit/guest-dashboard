"use client"

import { useAuth } from "@/components/auth-provider"
import { GuestLimitBanner } from "@/components/guest-limit-banner"

interface GuestLimitBannerWrapperProps {
  guestCount: number
}

export function GuestLimitBannerWrapper({ guestCount }: GuestLimitBannerWrapperProps) {
  const { user } = useAuth()
  if (!user) return null
  return <GuestLimitBanner guestCount={guestCount} userPlan={user.plan} />
}

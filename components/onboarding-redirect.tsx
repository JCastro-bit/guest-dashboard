"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { getInvitations } from "@/lib/api"

export function OnboardingRedirect() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading || !user) return
    if (user.planStatus !== "active") return

    getInvitations()
      .then((invitations) => {
        if (invitations.length === 0) {
          router.push("/onboarding")
        }
      })
      .catch(() => {
        // silent — don't block dashboard on error
      })
  }, [user, isLoading, router])

  return null
}

import type { MetadataRoute } from "next"
import { getInvitationsWithGuests } from "@/lib/api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  // Fetch all invitations to generate dynamic URLs
  let invitations: Awaited<ReturnType<typeof getInvitationsWithGuests>> = []
  try {
    invitations = await getInvitationsWithGuests()
  } catch (error) {
    console.error("Failed to fetch invitations for sitemap:", error)
  }

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/guests`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/invitations`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ]

  // Dynamic invitation pages
  const invitationPages = invitations.map((invitation) => ({
    url: `${baseUrl}/invitations/${invitation.id}`,
    lastModified: new Date(invitation.updatedAt || invitation.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...invitationPages]
}

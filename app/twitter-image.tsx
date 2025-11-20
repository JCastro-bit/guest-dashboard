import { ImageResponse } from "next/og"

// Image metadata
export const alt = "Guest Dashboard - Wedding Invitation Management"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "linear-gradient(to bottom right, #f1f5f9, #e2e8f0)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              background: "linear-gradient(90deg, #1e293b 0%, #334155 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: 20,
            }}
          >
            Guest Dashboard
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#64748b",
              marginBottom: 40,
            }}
          >
            Wedding Invitation Management
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Manage your wedding guest list and invitations with ease. Track RSVPs, send personalized invitations, and organize your special day.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

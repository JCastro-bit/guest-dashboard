import { ImageResponse } from "next/og"

// Image metadata
export const alt = "LOVEPOSTAL — Dashboard de Invitados"
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
          background: "linear-gradient(to bottom right, #FDFAF6, #F5E6D3)",
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
              color: "#D4714E",
              marginBottom: 20,
            }}
          >
            LOVEPOSTAL
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#2D1B0E",
              marginBottom: 40,
            }}
          >
            Dashboard de Invitados
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(45, 27, 14, 0.6)",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Gestiona tu lista de invitados y confirmaciones de boda. Seguimiento de RSVPs, invitaciones personalizadas y organización de tu día especial.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

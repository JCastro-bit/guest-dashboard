import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { SearchProvider } from "@/components/search-provider"
import { SidebarProvider } from "@/components/sidebar-provider"
import { MainContent } from "@/components/main-content"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" })
const playfairDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: {
    default: "LOVEPOSTAL — Dashboard de Invitados",
    template: "%s | LOVEPOSTAL",
  },
  description:
    "Gestiona tu lista de invitados y confirmaciones de boda con LOVEPOSTAL. Seguimiento de RSVPs, invitaciones personalizadas y organización de tu día especial.",
  keywords: [
    "boda",
    "invitaciones digitales",
    "gestión de invitados",
    "RSVP",
    "planificación de boda",
    "LOVEPOSTAL",
    "invitaciones de boda México",
  ],
  authors: [{ name: "LOVEPOSTAL" }],
  creator: "LOVEPOSTAL",
  publisher: "LOVEPOSTAL",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LOVEPOSTAL — Dashboard de Invitados",
    description:
      "Gestiona tu lista de invitados y confirmaciones de boda con LOVEPOSTAL. Seguimiento de RSVPs, invitaciones personalizadas y organización de tu día especial.",
    url: "/",
    siteName: "LOVEPOSTAL",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOVEPOSTAL — Dashboard de Invitados",
    description:
      "Gestiona tu lista de invitados y confirmaciones de boda con LOVEPOSTAL. Seguimiento de RSVPs, invitaciones personalizadas y organización de tu día especial.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${notoSans.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <Navigation />
            <MainContent>{children}</MainContent>
            <SearchProvider />
            <Toaster />
            <Analytics />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

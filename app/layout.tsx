import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navigation } from "@/components/navigation"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Guest Dashboard - Wedding Invitation Management",
    template: "%s | Guest Dashboard",
  },
  description:
    "Manage your wedding guest list and invitations with ease. Track RSVPs, send personalized invitations, and organize your special day.",
  keywords: [
    "wedding",
    "guest management",
    "invitations",
    "RSVP",
    "wedding planning",
    "event management",
  ],
  authors: [{ name: "Guest Dashboard" }],
  creator: "Guest Dashboard",
  publisher: "Guest Dashboard",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Guest Dashboard - Wedding Invitation Management",
    description:
      "Manage your wedding guest list and invitations with ease. Track RSVPs, send personalized invitations, and organize your special day.",
    url: "/",
    siteName: "Guest Dashboard",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guest Dashboard - Wedding Invitation Management",
    description:
      "Manage your wedding guest list and invitations with ease. Track RSVPs, send personalized invitations, and organize your special day.",
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
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased bg-slate-50/50`}>
        <Navigation />
        <main className="md:pl-72 min-h-screen">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
        <Analytics />
      </body>
    </html>
  )
}

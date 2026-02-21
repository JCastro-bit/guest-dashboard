import type React from "react"
import { Navigation } from "@/components/navigation"
import { SearchProvider } from "@/components/search-provider"
import { SidebarProvider } from "@/components/sidebar-provider"
import { MainContent } from "@/components/main-content"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <Navigation />
        <MainContent>{children}</MainContent>
        <SearchProvider />
      </SidebarProvider>
    </AuthGuard>
  )
}

import type React from "react"
import { Navigation } from "@/components/navigation"
import { SearchProvider } from "@/components/search-provider"
import { SidebarProvider } from "@/components/sidebar-provider"
import { MainContent } from "@/components/main-content"
import { AuthGuard } from "@/components/auth-guard"
import { NetworkStatus } from "@/components/ui-states"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <Navigation />
        <MainContent>{children}</MainContent>
        <SearchProvider />
        <NetworkStatus />
      </SidebarProvider>
    </AuthGuard>
  )
}

"use client"

import { type ReactNode } from "react"
import { useSidebar } from "@/components/sidebar-provider"
import { cn } from "@/lib/utils"

export function MainContent({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <main className={cn(
      "min-h-screen transition-all duration-300",
      isCollapsed ? "md:pl-20" : "md:pl-72"
    )}>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
    </main>
  )
}

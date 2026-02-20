"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Mail, Users, Menu, Settings, LogOut, Search, ChevronLeft, ChevronRight, Utensils } from "lucide-react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSidebar } from "@/components/sidebar-provider"
import { useTheme } from "next-themes"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Invitaciones",
    icon: Mail,
    href: "/invitations",
  },
  {
    label: "Invitados",
    icon: Users,
    href: "/guests",
  },
  {
    label: "Mesas",
    icon: Utensils,
    href: "/tables",
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { isCollapsed } = useSidebar()

  const handleSearchClick = () => {
    document.dispatchEvent(new Event("open-search"))
  }

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background">
        <Link href="/">
          <BrandLogo collapsed={false} />
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleSearchClick}>
            <Search className="h-5 w-5" />
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SidebarContent pathname={pathname} onNavigate={() => setIsOpen(false)} isCollapsed={false} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex h-full flex-col fixed inset-y-0 z-50 border-r bg-background transition-all duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <SidebarContent pathname={pathname} isCollapsed={isCollapsed} />
      </div>
    </>
  )
}

function BrandLogo({ collapsed }: { collapsed: boolean }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (collapsed) {
    return <span className="font-serif font-bold text-lg text-primary">LP</span>
  }

  if (!mounted) {
    return <span className="font-serif font-bold text-2xl text-primary">LOVEPOSTAL</span>
  }

  const logoSrc = resolvedTheme === "dark"
    ? "https://cdn.lovepostal.studio/logotipos/logo_lovepostal_4.webp"
    : "https://cdn.lovepostal.studio/logotipos/logo_lovepostal_6.webp"

  return (
    <Image
      src={logoSrc}
      alt="LOVEPOSTAL"
      width={160}
      height={40}
      className="h-8 w-auto"
      unoptimized
    />
  )
}

function SidebarContent({ pathname, onNavigate, isCollapsed }: { pathname: string; onNavigate?: () => void; isCollapsed: boolean }) {
  const [isMac, setIsMac] = useState(false)
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0)
  }, [])

  const handleSearchClick = () => {
    document.dispatchEvent(new Event("open-search"))
    onNavigate?.()
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background">
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className={cn("flex items-center", isCollapsed ? "px-1" : "pl-3")} onClick={onNavigate}>
            <BrandLogo collapsed={isCollapsed} />
          </Link>
          {!onNavigate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn("h-8 w-8", isCollapsed && "mx-auto")}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={handleSearchClick}
            className="w-full mb-6 flex items-center justify-between px-3 py-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors group"
          >
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              <span>Buscar...</span>
            </div>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
              <span className="text-xs">{isMac ? "\u2318" : "Ctrl"}</span>K
            </kbd>
          </button>
        )}

        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchClick}
            className="w-full mb-6 h-10 text-muted-foreground"
            title="Buscar (Ctrl+K)"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}

        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={onNavigate}
              className={cn(
                "text-sm group flex p-3 w-full font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
                isCollapsed ? "justify-center" : "justify-start"
              )}
              title={isCollapsed ? route.label : undefined}
            >
              <div className={cn("flex items-center", isCollapsed ? "" : "flex-1")}>
                <route.icon className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")} />
                {!isCollapsed && route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-muted-foreground",
              isCollapsed ? "justify-center px-2" : "justify-start"
            )}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")} />
            {!isCollapsed && "Configuración"}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              isCollapsed ? "justify-center px-2" : "justify-start"
            )}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className={cn("h-5 w-5", isCollapsed ? "" : "mr-3")} />
            {!isCollapsed && "Cerrar sesión"}
          </Button>
        </div>
      </div>
    </div>
  )
}

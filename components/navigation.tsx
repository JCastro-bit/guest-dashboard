"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Mail, Users, Menu, Settings, LogOut } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Invitations",
    icon: Mail,
    href: "/invitations",
    color: "text-violet-500",
  },
  {
    label: "Guests",
    icon: Users,
    href: "/guests",
    color: "text-pink-700",
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background">
        <div className="font-serif text-xl font-bold">Wedding Admin</div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent pathname={pathname} onNavigate={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50 border-r bg-background">
        <SidebarContent pathname={pathname} />
      </div>
    </>
  )
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background">
      <div className="px-3 py-2">
        <Link href="/" className="flex items-center pl-3 mb-14" onClick={onNavigate}>
          <h1 className="font-serif text-2xl font-bold">
            Wedding<span className="text-[#DC325A]">.</span>
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={onNavigate}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

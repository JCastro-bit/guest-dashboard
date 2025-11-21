"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchButtonProps {
  variant?: "default" | "prominent"
  className?: string
}

export function SearchButton({ variant = "default", className }: SearchButtonProps) {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0)
  }, [])

  const handleSearchClick = () => {
    document.dispatchEvent(new Event("open-search"))
  }

  if (variant === "prominent") {
    return (
      <button
        onClick={handleSearchClick}
        className={cn(
          "w-full max-w-md flex items-center justify-between px-4 py-3 text-sm text-muted-foreground bg-background border rounded-lg hover:bg-accent transition-colors group shadow-sm",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Search invitations, guests...</span>
        </div>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
          <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
        </kbd>
      </button>
    )
  }

  return (
    <button
      onClick={handleSearchClick}
      className={cn(
        "flex items-center justify-between px-3 py-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg transition-colors group",
        className
      )}
    >
      <div className="flex items-center">
        <Search className="h-4 w-4 mr-2" />
        <span>Search...</span>
      </div>
      <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
        <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
      </kbd>
    </button>
  )
}

"use client"

import * as React from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { RightSidebarTrigger } from "@/components/ui/right-sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"

const topNavItems = [
  { title: "Quick Setup", href: "/docs/quick-setup" },
  { title: "Basics", href: "/docs/basics" },
  { title: "New Features", href: "/docs/new-features" },
  { title: "FAQ", href: "/docs/faq" },
  { title: "Others", href: "/docs/others" },
  { title: "Admin", href: "/docs/admin" },
]

export function DocsTopBar() {
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  return (
    <div className="flex flex-col border-b border-border">
      {/* Top section with search and controls */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
        </div>
        <div className="relative mx-auto w-60 max-w-2xl">
          <button
            type="button"
            className="group flex w-full items-center rounded-md border bg-background px-4 py-2 text-left text-muted-foreground shadow-sm transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-sm text-muted-foreground bg-center">Search</span>
            <kbd className="ml-2 hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput
              ref={inputRef}
              placeholder="Search documentation..."
              className="h-12 text-lg"
            />
            <CommandList>
              <CommandGroup heading="Suggested">
                <CommandItem>
                  <Search className="mr-2 h-4 w-4" />
                  Result1
                </CommandItem>
                <CommandItem>
                  <Search className="mr-2 h-4 w-4" />
                  Result2
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <RightSidebarTrigger />
        </div>
      </div>

      {/* Navigation links section */}
      <div className="flex h-8 items-center gap-6 px-4 overflow-x-auto">
        {topNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground/80",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
} 
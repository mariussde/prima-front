"use client"

import * as React from "react"
import { Search, Globe } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import { RightSidebarTrigger } from "@/components/ui/right-sidebar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Logo } from "@/components/ui/logo"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command"
import { DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import "flag-icons/css/flag-icons.min.css"

const languages = [
  { code: "en", name: "English", flag: "gb" },
  { code: "es", name: "Español", flag: "es" },
  { code: "fr", name: "Français", flag: "fr" },
  { code: "de", name: "Deutsch", flag: "de" },
  { code: "it", name: "Italiano", flag: "it" },
]

const topNavItems = [
  { title: "Quick Setup", href: "/docs/quick-setup" },
  { title: "Basics", href: "/docs/basics" },
  { title: "New Features", href: "/docs/new-features" },
  { title: "Admin", href: "/docs/admin" },
]

export function DocsTopBar() {
  const [open, setOpen] = React.useState(false)
  const [language, setLanguage] = React.useState("en")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const { state } = useSidebar()

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
          {state === "collapsed" && <Logo href="/docs" />}
        </div>
        <div className="relative mx-auto w-40 sm:w-60 max-w-2xl">
          <button
            type="button"
            className="group flex w-full items-center rounded-md border bg-background px-3 sm:px-4 py-2 text-left text-muted-foreground shadow-sm transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="flex-1 text-sm text-muted-foreground bg-center">Search</span>
            <kbd className="ml-2 hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <DialogTitle className="sr-only">Search documentation</DialogTitle>
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
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-10 aspect-square items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent focus:outline-none focus:ring focus:ring-ring">
              <Globe className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "cursor-pointer",
                    language === lang.code && "bg-accent"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={`fi fi-${lang.flag} rounded-sm`}></span>
                    <span>{lang.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <div className="h-6 w-px bg-border mx-2" />
          <RightSidebarTrigger />
          if you want to have the ask ai button on top right corner,
          you can add it here and delete it from line 158 */}
        </div>
      </div>

      {/* Navigation links section */}
      <div className="flex h-12 items-center gap-6 px-4 overflow-x-auto">
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
        <RightSidebarTrigger className="ml-auto" />
      </div>
    </div>
  )
} 
"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { HelpCircle, Home, LogOut, Moon, Settings, Sun, User } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TopBar() {
  const { setTheme, theme } = useTheme()
  const [isThemeChanging, setIsThemeChanging] = useState(false)

  const toggleTheme = () => {
    setIsThemeChanging(true)
    setTheme(theme === "dark" ? "light" : "dark")
    setTimeout(() => setIsThemeChanging(false), 300)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500 text-white">
            <span className="font-bold">P</span>
          </div>
          <span className="hidden font-bold md:inline-block">Prima</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Select defaultValue="default">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Workspace</SelectItem>
            <SelectItem value="marketing">Marketing Team</SelectItem>
            <SelectItem value="engineering">Engineering Team</SelectItem>
            <SelectItem value="sales">Sales Department</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" asChild>
          <Link href="/help">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Link>
        </Button>


        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}


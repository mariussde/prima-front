"use client"

import { useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HelpCircle, Home, LogOut, Settings, User } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"
import "flag-icons/css/flag-icons.min.css"

const countries = [
  { value: "spain", label: "Spain Meltals", code: "es" },
  { value: "spain-softs", label: "Spain Softs", code: "es" },
  { value: "netherlands", label: "Netherlands", code: "nl" },
  { value: "italy", label: "Italy", code: "it" },
  { value: "antwerp-softs", label: "Antwerp Softs", code: "be" },
  { value: "antwerp-metal", label: "Antwerp Metals", code: "be" },
  { value: "united-states", label: "United States", code: "us" },
  { value: "south-africa", label: "South Africa", code: "za" },
  { value: "china", label: "China", code: "cn" },
]

export function TopBar() {
  const router = useRouter()
  const { toast } = useToast()
  const { state } = useSidebar()

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: true,
        callbackUrl: '/login'
      })
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      })
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        {state === "collapsed" && <Logo />}
      </div>

      <div className="flex items-center gap-4">
        <Select defaultValue="spain">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                <div className="flex items-center gap-2">
                  <span className={`fi fi-${country.code} rounded-sm`}></span>
                  <span>{country.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" asChild>
          <Link href="/help">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Link>
        </Button>

        <ThemeToggle />

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
            <DropdownMenuItem asChild>
              <Link href="/session-info" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 dark:text-red-500 focus:text-red-600 dark:focus:text-red-500 font-semibold hover:font-semibold focus:font-semibold data-[highlighted]:font-semibold"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}


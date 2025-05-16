"use client"

import { useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { HelpCircle, Home, LogOut, Settings, User, FileText } from "lucide-react"
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
  { value: "spain", label: "Spain Metals", code: "es", languages: ["es", "en"] },
  { value: "spain-softs", label: "Spain Softs", code: "es", languages: ["es", "en"] },
  { value: "netherlands", label: "Netherlands", code: "nl", languages: ["nl", "en"] },
  { value: "italy", label: "Italy", code: "it", languages: ["it", "en"] },
  { value: "antwerp-softs", label: "Antwerp Softs", code: "be", languages: ["nl", "en"] },
  { value: "antwerp-metal", label: "Antwerp Metals", code: "be", languages: ["nl", "en"] },
  { value: "united-states", label: "United States", code: "us", languages: ["en"] },
  { value: "canada", label: "Canada", code: "ca", languages: ["en", "fr"] },
  { value: "south-africa", label: "South Africa", code: "za", languages: ["en"] },
  { value: "china", label: "China", code: "cn", languages: ["zh", "en"] },
  { value: "singapore", label: "Singapore", code: "sg", languages: ["en"] },
]

const languageLabels = {
  en: "English",
  es: "Español",
  nl: "Nederlands",
  it: "Italiano",
  fr: "Français",
  zh: "中文",
}

export function TopBar() {
  const router = useRouter()
  const { toast } = useToast()
  const { state } = useSidebar()
  const [selectedCountry, setSelectedCountry] = useState("united-states")

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

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value)
  }

  return (
    <header className="top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:px-6 w-full">
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger />
        {state === "collapsed" && <Logo />}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 ml-auto sticky right-0">
        <Select defaultValue={selectedCountry} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[60px] min-[340px]:w-[140px] sm:w-[180px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                <div className="flex items-center gap-2">
                  <span className={`fi fi-${country.code} rounded-sm`}></span>
                  <span className="hidden min-[340px]:inline">{country.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="ghost" size="icon" asChild>
          <Link href="/docs" target="_blank" rel="noopener noreferrer">
            <FileText className="h-5 w-5" />
            <span className="sr-only">Documentation</span>
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
            <DropdownMenuItem asChild>
              <Link href="/help" className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help Center</span>
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

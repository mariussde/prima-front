"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { UsersProvider } from "@/components/users/users-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <UsersProvider>
          {children}
        </UsersProvider>
      </ThemeProvider>
    </SessionProvider>
  )
} 

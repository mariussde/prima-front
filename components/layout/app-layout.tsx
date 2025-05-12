"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TopBar } from "@/components/layout/top-bar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't show the layout on login page
  if (pathname === "/login") {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full overflow-hidden">
          <div className="flex h-full w-full flex-col overflow-hidden">
            <div className="w-full">
              <TopBar />
            </div>
            <div className="px-6 py-4">
              <Breadcrumbs />
            </div>
            <div className="flex-1 w-full overflow-hidden">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}


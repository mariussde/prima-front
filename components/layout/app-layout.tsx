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
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="flex h-full w-full flex-col overflow-x-auto">
            <TopBar />
            <div className="px-6 py-4">
              <Breadcrumbs />
            </div>
            <div className="flex-1 overflow-x-auto w-full">
              <div className="min-w-[800px] h-full">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}


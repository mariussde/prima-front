"use client"

import type React from "react"
import { DocsSidebar } from "./docs-sidebar"
import { DocsTopBar } from "./docs-top-bar"
import { RightSidebarComponent } from "./docs-right-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { RightSidebarProvider } from "@/components/ui/right-sidebar"

export function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
      <SidebarProvider>
        <RightSidebarProvider>
          <div className="flex h-screen w-full overflow-hidden">
            {/* Left Sidebar */}
            <DocsSidebar />
  
            {/* Main Content Area */}
            <SidebarInset className="flex-1 min-w-0 overflow-hidden">
              <div className="flex h-full w-full flex-col overflow-hidden">
                <DocsTopBar />
                <main className="flex-1 overflow-auto p-6">
                  {children}
                </main>
              </div>
            </SidebarInset>
  
            {/* Right Sidebar */}
            <div className="flex flex-col h-full py-2 flex-shrink-0 order-last">
              <RightSidebarComponent />
            </div>
          </div>
        </RightSidebarProvider>
      </SidebarProvider>
    )
  }
  
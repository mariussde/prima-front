"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/ui/logo"

const docsNavigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Authentication", href: "/docs/authentication" },
      { title: "Authorization", href: "/docs/authorization" },
      { title: "Data Models", href: "/docs/data-models" },
    ],
  },
  {
    title: "Features",
    items: [
      { title: "Clients", href: "/docs/clients" },
      { title: "Agents", href: "/docs/agents" },
      { title: "Carriers", href: "/docs/carriers" },
      { title: "Invoices", href: "/docs/invoices" },
    ],
  },
  {
    title: "Advanced",
    items: [
      { title: "API Reference", href: "/docs/api" },
      { title: "Security", href: "/docs/security" },
      { title: "Deployment", href: "/docs/deployment" },
    ],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar variant="inset" className="w-64">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Logo className="w-full" showText={state !== "collapsed"} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {docsNavigation.map((section, index) => (
          <div key={section.title} className="py-2">
            <h3 className={cn(
              "px-4 mb-2 text-sm font-medium text-muted-foreground",
              state === "collapsed" && "hidden"
            )}>
              {section.title}
            </h3>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <ChevronRight className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  )
} 
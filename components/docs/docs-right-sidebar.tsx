"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  RightSidebar,
  RightSidebarContent,
  RightSidebarHeader,
  RightSidebarMenu,
  RightSidebarMenuItem,
  RightSidebarMenuButton,
  RightSidebarMenuSub,
  RightSidebarMenuSubItem,
  RightSidebarMenuSubButton,
  useRightSidebar,
} from "@/components/ui/right-sidebar"
import { Logo } from "@/components/ui/logo"

const rightNavigation = [
  {
    title: "Section 1",
    items: [
      { title: "Item 1", href: "/docs/item1" },
      { title: "Item 2", href: "/docs/item2" },
      { title: "Item 3", href: "/docs/item3" },
    ],
  },
  {
    title: "Section 2",
    items: [
      { title: "Item 4", href: "/docs/item4" },
      { title: "Item 5", href: "/docs/item5" },
      { title: "Item 6", href: "/docs/item6" },
    ],
  },
]

export function RightSidebarComponent() {
  const pathname = usePathname()
  const { state, isMobile } = useRightSidebar()

  return (
    <RightSidebar
      variant="inset"
      className={cn(
        "h-full transition-all duration-300 overflow-hidden",
        state === "collapsed" ? "w-0" : isMobile ? "w-full" : "w-[35rem]"
      )}
    >
      {state !== "collapsed" && (
        <>
          <RightSidebarHeader className="border-b border-border mb-4 px-6 pt-6">
            <div className="flex items-center justify-between">
              <Logo className="w-full" showText />
            </div>
          </RightSidebarHeader>

          <RightSidebarContent className="px-6 pb-6">
            {rightNavigation.map((section) => (
              <div key={section.title} className="py-2">
                <h3 className="px-4 mb-2 text-sm font-medium text-muted-foreground">
                  {section.title}
                </h3>
                <RightSidebarMenu>
                  {section.items.map((item) => (
                    <RightSidebarMenuItem key={item.href}>
                      <RightSidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <ChevronRight className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </RightSidebarMenuButton>
                    </RightSidebarMenuItem>
                  ))}
                </RightSidebarMenu>
              </div>
            ))}
          </RightSidebarContent>
        </>
      )}
    </RightSidebar>
  )
}
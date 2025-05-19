"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  Home,
  Users,
  FileText,
  Database,
  BarChart3,
  Calendar,
  Mail,
  ShoppingCart,
  Layers,
  Clock,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarInput,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRecentlyUsed } from "@/hooks/use-recently-used"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Logo } from "@/components/ui/logo"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  isActive?: boolean
  submenu?: NavItem[]
}

// Map icon names to their components
const iconMap: Record<string, React.ElementType> = {
  Home,
  Users,
  FileText,
  Database,
  BarChart3,
  Calendar,
  Mail,
  ShoppingCart,
  Layers,
  ChevronRight,
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { recentItems, addRecentItem, clearRecentItems } = useRecentlyUsed()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      title: "General Settings",
      href: "",
      icon: Layers,
      isActive: pathname.startsWith("/general-settings"),
      submenu: [
        { title: "Carriers", href: "/general-settings/carriers", icon: ChevronRight },
        { title: "Agents", href: "/general-settings/agents", icon: ChevronRight },
        { title: "Clients", href: "/general-settings/clients", icon: ChevronRight },
        
      ],
    },
    {
      title: "Users",
      href: "",
      icon: Users,
      isActive: pathname.startsWith("/users"),
    },
  ]

  const handleNavigation = (href: string) => {
    // Check if the path exists in our navigation items
    const isValidPath = navItems.some(
      (item) => 
        item.href === href || 
        item.submenu?.some(subitem => subitem.href === href)
    )

    if (!isValidPath) {
      // If the path doesn't exist, redirect to the home page
      router.push("/")
      return
    }

    router.push(href)
  }

  // Track navigation and update recently used items
  useEffect(() => {
    // First try to find a submenu item that matches the current path
    const parentItem = navItems.find(item => 
      item.submenu?.some(subitem => subitem.href === pathname)
    )
    const currentSubmenuItem = parentItem?.submenu?.find(subitem => subitem.href === pathname)

    if (currentSubmenuItem && parentItem) {
      // If we found a submenu item, add it to recently used with parent's icon
      const isAlreadyRecent = recentItems.some(item => item.href === currentSubmenuItem.href)
      if (!isAlreadyRecent) {
        // Get the parent's icon name from the iconMap
        const parentIconName = Object.entries(iconMap).find(([_, component]) => component === parentItem.icon)?.[0] || 'Home'
        addRecentItem({
          title: currentSubmenuItem.title,
          href: currentSubmenuItem.href,
          icon: parentIconName, // Use parent's icon instead of ChevronRight
        })
      }
    } else {
      // If no submenu item found, try to find a parent menu item
      const currentNavItem = navItems.find(
        (item) => item.isActive || item.href === pathname
      )

      if (currentNavItem && pathname !== "/") {
        // Only add if it's not already in recent items
        const isAlreadyRecent = recentItems.some(item => item.href === currentNavItem.href)
        if (!isAlreadyRecent) {
          // Get the icon name from the iconMap
          const iconName = Object.entries(iconMap).find(([_, component]) => component === currentNavItem.icon)?.[0] || 'Home'
          addRecentItem({
            title: currentNavItem.title,
            href: currentNavItem.href,
            icon: iconName,
          })
        }
      }
    }
  }, [pathname]) // Remove addRecentItem from dependencies

  // Filter nav items based on search query
  const filteredNavItems = searchQuery
    ? navItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.submenu?.some((subitem) => subitem.title.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : navItems

  // Limit recent items to 5
  const limitedRecentItems = recentItems.slice(0, 5)

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <Logo className="w-full" showText={true} />
        </div>
        <div className="mt-2">
          <SidebarInput
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Recently Used Section */}
        {limitedRecentItems.length > 0 && (
          <SidebarGroup>
            <div className="flex items-center justify-between">
              <SidebarGroupLabel className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>Recently Used</span>
              </SidebarGroupLabel>
              <SidebarGroupAction onClick={clearRecentItems}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <X className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear recent items</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarGroupAction>
            </div>
            <SidebarMenu>
              {limitedRecentItems.map((item, index) => {
                const IconComponent = iconMap[item.icon] || Home
                return (
                  <SidebarMenuItem key={`recent-${index}`}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <Link href={item.href} onClick={(e) => {
                        e.preventDefault()
                        handleNavigation(item.href)
                      }}>
                        <IconComponent className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {/* Regular Navigation Items */}
        {filteredNavItems.map((item, index) => (
          <SidebarGroup key={index}>
            {index === 0 && <div className="h-px bg-border my-2" />}
            {!item.submenu ? (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.title}>
                    <Link href={item.href} onClick={(e) => {
                      e.preventDefault()
                      handleNavigation(item.href)
                    }}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            ) : (
              <CollapsibleNavItem item={item} onNavigate={handleNavigation} />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <div className="text-xs text-muted-foreground">Prima v1.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}

function CollapsibleNavItem({ item, onNavigate }: { item: NavItem; onNavigate: (href: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Update isOpen when pathname changes and item becomes active
  useEffect(() => {
    const shouldBeOpen = item.isActive || 
      item.submenu?.some(subitem => subitem.href === pathname)
    
    if (shouldBeOpen && !isOpen) {
      setIsOpen(true)
    }
  }, [pathname])

  return (
    <div className="group/collapsible">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive={item.isActive} tooltip={item.title} onClick={() => setIsOpen(!isOpen)}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isOpen ? "rotate-180" : "")} />
          </SidebarMenuButton>
        </SidebarMenuItem>
        {isOpen && item.submenu && (
          <SidebarMenuSub>
            {item.submenu.map((subItem, idx) => (
              <SidebarMenuSubItem key={idx}>
                <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                  <Link href={subItem.href} onClick={(e) => {
                    e.preventDefault()
                    onNavigate(subItem.href)
                  }}>
                    <subItem.icon className="h-3 w-3" />
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenu>
    </div>
  )
}


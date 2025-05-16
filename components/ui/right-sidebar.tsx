"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelRight, Brain } from "lucide-react"

import { useIsRightSidebarMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const RIGHT_SIDEBAR_COOKIE_NAME = "right-sidebar:state"
const RIGHT_SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const RIGHT_SIDEBAR_WIDTH = "32rem"
const RIGHT_SIDEBAR_WIDTH_MOBILE = "18rem"
const RIGHT_SIDEBAR_WIDTH_ICON = "3rem"
const RIGHT_SIDEBAR_KEYBOARD_SHORTCUT = "n"

type RightSidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const RightSidebarContext = React.createContext<RightSidebarContext | null>(null)

function useRightSidebar() {
  const context = React.useContext(RightSidebarContext)
  if (!context) {
    throw new Error("useRightSidebar must be used within a RightSidebarProvider.")
  }

  return context
}

const RightSidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsRightSidebarMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const lastStateRef = React.useRef(defaultOpen)
    const isTransitioningRef = React.useRef(false)
    const toggleTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
    const manualToggleRef = React.useRef(false)

    // This is the internal state of the sidebar.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open

    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // Remember the last expanded state
        if (openState) {
          lastStateRef.current = true
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${RIGHT_SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${RIGHT_SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar with debouncing
    const toggleSidebar = React.useCallback(() => {
      // Clear any existing timeout
      if (toggleTimeoutRef.current) {
        clearTimeout(toggleTimeoutRef.current)
      }

      // Set manual toggle flag
      manualToggleRef.current = true

      // Set a new timeout to handle the toggle
      toggleTimeoutRef.current = setTimeout(() => {
        if (isMobile) {
          setOpenMobile((prev) => !prev)
        } else {
          setOpen((prev) => !prev)
        }
      }, 50) // Small delay to prevent rapid toggling
    }, [isMobile, setOpen])

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (toggleTimeoutRef.current) {
          clearTimeout(toggleTimeoutRef.current)
        }
      }
    }, [])

    // Handle mobile state changes
    React.useEffect(() => {
      if (isTransitioningRef.current || manualToggleRef.current) return

      if (isMobile) {
        // When going to mobile, remember the current state and collapse
        lastStateRef.current = open
        isTransitioningRef.current = true
        setOpen(false)
        // Reset the transition flag after a short delay
        setTimeout(() => {
          isTransitioningRef.current = false
        }, 100)
      } else {
        // When going back to desktop, restore the last expanded state
        isTransitioningRef.current = true
        setOpen(lastStateRef.current)
        // Reset the transition flag after a short delay
        setTimeout(() => {
          isTransitioningRef.current = false
        }, 100)
      }
    }, [isMobile, setOpen, open])

    // Reset manual toggle flag when state changes
    React.useEffect(() => {
      if (manualToggleRef.current) {
        manualToggleRef.current = false
      }
    }, [open])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === RIGHT_SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<RightSidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <RightSidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--right-sidebar-width": RIGHT_SIDEBAR_WIDTH,
                "--right-sidebar-width-icon": RIGHT_SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/right-sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </RightSidebarContext.Provider>
    )
  }
)
RightSidebarProvider.displayName = "RightSidebarProvider"

const RightSidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "inset"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const { isMobile, openMobile, setOpenMobile, state } = useRightSidebar()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          data-state={state}
          className="w-[--right-sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--right-sidebar-width": RIGHT_SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side="right"
        >
          <div className="flex h-full w-full flex-col">{props.children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      ref={ref}
      data-state={state}
      className={cn(
        "relative flex h-full flex-col border-l border-border bg-background text-foreground shadow-lg transition-all duration-300 ease-in-out",
        variant === "inset" && "rounded-l-lg",
        className
      )}
      {...props}
    />
  )
})
RightSidebar.displayName = "RightSidebar"

const RightSidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar, state } = useRightSidebar()

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onClick?.(event)
    toggleSidebar()
  }, [onClick, toggleSidebar])

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="sm"
      className={cn("gap-2", className)}
      onClick={handleClick}
      {...props}
    >
      <Brain className="h-4 w-4" />
      <span>Ask AI</span>
      <span className="sr-only">Toggle Right Sidebar</span>
    </Button>
  )
})
RightSidebarTrigger.displayName = "RightSidebarTrigger"

const RightSidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
RightSidebarHeader.displayName = "RightSidebarHeader"

const RightSidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
RightSidebarContent.displayName = "RightSidebarContent"

const RightSidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
RightSidebarMenu.displayName = "RightSidebarMenu"

const RightSidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
RightSidebarMenuItem.displayName = "RightSidebarMenuItem"

const rightSidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const RightSidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof rightSidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useRightSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(rightSidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
RightSidebarMenuButton.displayName = "RightSidebarMenuButton"

const RightSidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
RightSidebarMenuSub.displayName = "RightSidebarMenuSub"

const RightSidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
RightSidebarMenuSubItem.displayName = "RightSidebarMenuSubItem"

const RightSidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
RightSidebarMenuSubButton.displayName = "RightSidebarMenuSubButton"

export {
  RightSidebar,
  RightSidebarContent,
  RightSidebarHeader,
  RightSidebarMenu,
  RightSidebarMenuItem,
  RightSidebarMenuButton,
  RightSidebarMenuSub,
  RightSidebarMenuSubButton,
  RightSidebarMenuSubItem,
  RightSidebarProvider,
  RightSidebarTrigger,
  useRightSidebar,
} 
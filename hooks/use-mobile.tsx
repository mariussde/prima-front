import * as React from "react"
import { useSidebar } from "@/components/ui/sidebar"

const MOBILE_BREAKPOINT = 768
const RIGHT_SIDEBAR_BASE_BREAKPOINT = 1300 // Base breakpoint when left sidebar is expanded
const LEFT_SIDEBAR_WIDTH = 256 // Width of the left sidebar when expanded

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useIsRightSidebarMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const { state: leftSidebarState } = useSidebar()

  React.useEffect(() => {
    // Adjust breakpoint based on left sidebar state
    const effectiveBreakpoint = leftSidebarState === "collapsed" 
      ? RIGHT_SIDEBAR_BASE_BREAKPOINT - LEFT_SIDEBAR_WIDTH 
      : RIGHT_SIDEBAR_BASE_BREAKPOINT

    const mql = window.matchMedia(`(max-width: ${effectiveBreakpoint - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < effectiveBreakpoint)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < effectiveBreakpoint)
    return () => mql.removeEventListener("change", onChange)
  }, [leftSidebarState])

  return !!isMobile
}

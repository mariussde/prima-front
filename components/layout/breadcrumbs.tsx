"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumbs() {
  const pathname = usePathname()

  // Don't show breadcrumbs on the home page
  if (pathname === "/") {
    return null
  }

  // Split the pathname into segments and remove empty segments
  const segments = pathname.split("/").filter(Boolean)

  // Create breadcrumb items with proper links
  const breadcrumbs = segments.map((segment, index) => {
    // Build the href for this breadcrumb
    const href = `/${segments.slice(0, index + 1).join("/")}`

    // Format the segment for display (capitalize, replace hyphens with spaces)
    const displayName = segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

    return {
      href,
      label: displayName,
      isLast: index === segments.length - 1,
    }
  })

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="flex items-center hover:text-foreground">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            <ChevronRight className="h-4 w-4" />
            {breadcrumb.isLast ? (
              <span className="ml-2 font-medium text-foreground">{breadcrumb.label}</span>
            ) : (
              <Link href={breadcrumb.href} className="ml-2 hover:text-foreground">
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}


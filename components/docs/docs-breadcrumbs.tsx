"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function DocsBreadcrumbs() {
  const pathname = usePathname()

  // Don't show breadcrumbs on the docs home page
  if (pathname === "/docs") {
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
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/docs" className="flex items-center hover:text-foreground">
              <Home className="h-4 w-4" />
              <span className="sr-only">Docs Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {breadcrumb.isLast ? (
                <BreadcrumbPage className="font-medium">{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 
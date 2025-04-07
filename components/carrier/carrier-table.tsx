"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenericTable } from "@/components/ui/generic-table"
import { Carrier } from '@/types/carrier'
import { useCallback, useEffect, useRef } from 'react'

interface CarrierTableProps {
  data: Carrier[]
  onRowClick?: (carrier: Carrier) => void
  onLoadMore?: () => void
  isLoading?: boolean
  hasMore?: boolean
  columnVisibility?: Record<string, boolean>
  onFilterChange?: (columnKey: string, value: string) => void
  columnFilters?: Record<string, string>
  onSortChange?: (column: string, direction: 'asc' | 'desc' | null) => void
}

export function CarrierTable({
  data,
  onRowClick,
  onLoadMore,
  isLoading = false,
  hasMore = false,
  columnVisibility,
  onFilterChange,
  columnFilters = {},
  onSortChange,
}: CarrierTableProps) {
  const observer = useRef<IntersectionObserver | null>(null)
  const lastRowRef = useCallback((node: HTMLTableRowElement | null) => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore?.()
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, hasMore, onLoadMore])

  const columns = [
    { accessorKey: 'CARID', header: 'ID' },
    { accessorKey: 'CARDSC', header: 'Description' },
    { accessorKey: 'Phone', header: 'Phone' },
    { accessorKey: 'eMail', header: 'Email' },
    { accessorKey: 'City', header: 'City' },
    { accessorKey: 'CHGUSR', header: 'Last Modified By' },
    { accessorKey: 'CHGDAT', header: 'Last Modified Date' },
  ]

  return (
    <GenericTable
      data={data}
      columns={columns}
      onRowClick={onRowClick}
      columnVisibility={columnVisibility}
      lastRowRef={lastRowRef}
      isLoading={isLoading}
      onFilterChange={onFilterChange}
      columnFilters={columnFilters}
      onSortChange={onSortChange}
    />
  )
}

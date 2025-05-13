"use client"

import { useCallback, useEffect, useRef } from 'react'
import { GenericTable } from "@/components/ui/generic-table"
import { Agent } from '@/types/agents'
import { TableColumn } from '@/types/table'

// Define columns with exact translations
const columns: TableColumn<Agent>[] = [
  { accessorKey: 'COMPID', header: 'Company ID' },
  { accessorKey: 'AGNTID', header: 'ID' },
  { accessorKey: 'AGNTDSC', header: 'Description' },
  { accessorKey: 'ADDRL1', header: 'Address Line 1' },
  { accessorKey: 'ADDRL2', header: 'Address Line 2' },
  { accessorKey: 'City', header: 'City' },
  { accessorKey: 'ZIPCODE', header: 'ZIP Code' },
  { accessorKey: 'Phone', header: 'Phone' },
  { accessorKey: 'Fax', header: 'Fax' },
  { accessorKey: 'eMail', header: 'Email' },
  { accessorKey: 'WebSite', header: 'Website' },
  { accessorKey: 'FEDTXID', header: 'Federal Tax ID' },
  { accessorKey: 'STETXID', header: 'State Tax ID' },
  { accessorKey: 'CNTYCOD', header: 'Country Code' },
  { accessorKey: 'STAID', header: 'State ID' },
  { accessorKey: 'CRTUSR', header: 'Created By' },
  { accessorKey: 'CRTDAT', header: 'Created Date' },
  { accessorKey: 'CRTTIM', header: 'Created Time' },
  { accessorKey: 'CHGUSR', header: 'Last Modified By' },
  { accessorKey: 'CHGDAT', header: 'Last Modified Date' },
  { accessorKey: 'CHGTIM', header: 'Last Modified Time' }
]

// Define default visible columns
export const defaultVisibleColumns = {
  'COMPID': false, // hidden by default
  'AGNTID': true,
  'AGNTDSC': true,
  'ADDRL1': false, // hidden by default
  'ADDRL2': false, // hidden by default
  'City': false, // hidden by default
  'ZIPCODE': false, // hidden by default
  'Phone': true,
  'Fax': false, // hidden by default
  'eMail': false, // hidden by default
  'WebSite': false, // hidden by default
  'FEDTXID': false, // hidden by default
  'STETXID': false, // hidden by default
  'CNTYCOD': false, // hidden by default
  'STAID': false, // hidden by default
  'CRTUSR': false, // hidden by default
  'CRTDAT': false, // hidden by default
  'CRTTIM': false, // hidden by default
  'CHGUSR': true,
  'CHGDAT': true,
  'CHGTIM': false, // hidden by default
  'actions': true
}

interface AgentTableProps {
  data: Agent[]
  onRowClick?: (agent: Agent) => void
  onLoadMore?: () => void
  isLoading?: boolean
  hasMore?: boolean
  columnVisibility?: Record<string, boolean>
  onFilterChange?: (columnKey: string, value: string) => void
  columnFilters?: Record<string, string>
  onSortChange?: (column: string, direction: 'asc' | 'desc' | null) => void
  showActions?: boolean
  onEdit?: (agent: Agent) => void
  onDelete?: (agent: Agent) => void
}

export function AgentTable({
  data,
  onRowClick,
  onLoadMore,
  isLoading = false,
  hasMore = false,
  columnVisibility,
  onFilterChange,
  columnFilters = {},
  onSortChange,
  showActions = false,
  onEdit,
  onDelete,
}: AgentTableProps) {
  const observer = useRef<IntersectionObserver | null>(null)
  
  const lastRowRef = useCallback((node: HTMLTableRowElement | null) => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        onLoadMore?.()
      }
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    })
    
    if (node) observer.current.observe(node)
  }, [isLoading, hasMore, onLoadMore])

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

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
      hasMore={hasMore}
      showActions={showActions}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  )
} 

import { DropResult } from "@hello-pangea/dnd"

export interface TableColumn<T> {
  accessorKey: keyof T
  header: string
}

export interface TableSortConfig {
  column: string | null
  direction: 'asc' | 'desc' | null
}

export interface TablePagination {
  currentPage: number
  pageSize: number
  totalPages: number
  totalRecords: number
  onPageChange: (page: number) => void
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  pagination?: TablePagination
  onRowClick?: (row: T) => void
  columnVisibility?: Record<string, boolean>
  lastRowRef?: (node: HTMLTableRowElement | null) => void
  isLoading?: boolean
  onFilterChange?: (columnKey: string, value: string) => void
  columnFilters?: Record<string, string>
  onSortChange?: (column: string, direction: 'asc' | 'desc' | null) => void
  hasMore?: boolean
  showActions?: boolean
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  columnOrder?: string[]
  onColumnOrderChange?: (newOrder: string[]) => void
} 

"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface GenericTableProps<T> {
  data: T[]
  columns: {
    accessorKey: string
    header: string
  }[]
  pagination?: {
    currentPage: number
    pageSize: number
    totalPages: number
    totalRecords: number
    onPageChange: (page: number) => void
  }
  onRowClick?: (row: T) => void
  columnVisibility?: Record<string, boolean>
  lastRowRef?: (node: HTMLTableRowElement | null) => void
  isLoading?: boolean
  onFilterChange?: (columnKey: string, value: string) => void
  columnFilters?: Record<string, string>
  onSortChange?: (column: string, direction: 'asc' | 'desc' | null) => void
}

export function GenericTable<T>({
  data,
  columns,
  pagination,
  onRowClick,
  columnVisibility = {},
  lastRowRef,
  isLoading,
  onFilterChange,
  columnFilters = {},
  onSortChange,
}: GenericTableProps<T>) {
  // Track sorting state - column and direction
  const [sortConfig, setSortConfig] = useState<{
    column: string | null,
    direction: 'asc' | 'desc' | null
  }>({
    column: null,
    direction: null
  });

  // Handle sort click
  const handleSort = (columnKey: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.column === columnKey) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({
      column: direction ? columnKey : null,
      direction: direction
    });
    
    // Notify parent component for server-side sorting if provided
    if (onSortChange) {
      onSortChange(columnKey, direction);
    }
  };

  // Get sort icon based on current sort state
  const getSortIcon = (columnKey: string) => {
    if (sortConfig.column !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    }
    
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="ml-2 h-4 w-4" />;
    }
    
    if (sortConfig.direction === 'desc') {
      return <ChevronDown className="ml-2 h-4 w-4" />;
    }
    
    return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
  };

  // Sort the data if onSortChange is not provided (client-side sorting)
  const sortedData = [...data];
  if (!onSortChange && sortConfig.column && sortConfig.direction) {
    sortedData.sort((a, b) => {
      const aValue = (a as any)[sortConfig.column as string];
      const bValue = (b as any)[sortConfig.column as string];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }

  // Calculate visible columns count for colSpan
  const visibleColumnsCount = columns.filter(
    column => !columnVisibility || columnVisibility[column.accessorKey]
  ).length;

  return (
    <div className="space-y-4 w-full overflow-auto">
      <div className="rounded-md border w-full overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => {
                  if (columnVisibility && !columnVisibility[column.accessorKey]) return null;
                  return (
                    <TableHead 
                      key={column.accessorKey} 
                      className="min-w-[120px] h-[100px] relative align-top"
                    >
                      <div className="pt-3 px-2 pb-10">
                        <button 
                          onClick={() => handleSort(column.accessorKey)}
                          className="flex items-center font-semibold text-sm leading-normal hover:text-primary transition-colors w-full text-left"
                        >
                          <span className="break-words whitespace-normal">{column.header}</span>
                          {getSortIcon(column.accessorKey)}
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-0 right-0 px-2">
                        <Input
                          placeholder={`Filter...`}
                          value={columnFilters[column.accessorKey] || ''}
                          onChange={(e) => onFilterChange?.(column.accessorKey, e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(onSortChange ? data : sortedData).map((row, index) => {
                const isLastRow = index === data.length - 1;
                return (
                  <TableRow
                    key={index}
                    ref={isLastRow ? lastRowRef : undefined}
                    className={onRowClick ? 'cursor-pointer hover:bg-muted' : ''}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => {
                      if (columnVisibility && !columnVisibility[column.accessorKey]) return null;
                      return (
                        <TableCell key={column.accessorKey} className="whitespace-normal break-words">
                          {(row as any)[column.accessorKey]}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={visibleColumnsCount} className="text-center">
                    Loading more data...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={visibleColumnsCount} className="text-center py-8">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.currentPage * pagination.pageSize - pagination.pageSize + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of{" "}
            {pagination.totalRecords} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

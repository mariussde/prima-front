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
import { ArrowUpDown } from "lucide-react"
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
}: GenericTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                if (columnVisibility && !columnVisibility[column.accessorKey]) return null
                return (
                  <TableHead key={column.accessorKey} className="min-w-[120px] h-[80px] relative">
                    <div className="absolute top-3 left-0 right-0 px-2">
                      <span className="font-semibold text-sm line-clamp-2 leading-tight block">{column.header}</span>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 px-2">
                      <Input
                        placeholder={`Filter ${column.header.toLowerCase()}...`}
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
            {data.map((row, index) => {
              const isLastRow = index === data.length - 1
              return (
                <TableRow
                  key={index}
                  ref={isLastRow ? lastRowRef : undefined}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted' : ''}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => {
                    if (columnVisibility && !columnVisibility[column.accessorKey]) return null
                    return (
                      <TableCell key={column.accessorKey}>
                        {(row as any)[column.accessorKey]}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading more data...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

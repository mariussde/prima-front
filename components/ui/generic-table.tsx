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
import { ArrowUpDown, ChevronDown, ChevronUp, Loader2, MoreHorizontal, Pencil, Trash } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

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
  hasMore?: boolean
  showActions?: boolean
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
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
  hasMore = false,
  showActions = false,
  onEdit,
  onDelete,
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

  // Add actions column to columns if showActions is true
  const tableColumns = showActions 
    ? [...columns, { accessorKey: 'actions', header: 'Actions' }]
    : columns;

  return (
    <div className="space-y-4 w-full">
      <div className="rounded-md border w-full">
        <div className="min-w-full inline-block align-middle">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((column) => {
                  if (columnVisibility && !columnVisibility[column.accessorKey]) return null;
                  return (
                    <TableHead 
                      key={column.accessorKey} 
                      className={cn(
                        "h-[100px] relative align-top",
                        column.accessorKey === 'actions' ? 'w-[80px] min-w-[80px]' : 'min-w-[120px]'
                      )}
                    >
                      {column.accessorKey === 'actions' ? (
                        <div className="pt-3 px-2 pb-10">
                          <span className="font-semibold text-sm leading-normal">Actions</span>
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
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
                    {tableColumns.map((column) => {
                      if (columnVisibility && !columnVisibility[column.accessorKey]) return null;
                      
                      if (column.accessorKey === 'actions') {
                        return (
                          <TableCell key={column.accessorKey} className="w-[80px] min-w-[80px] text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 mx-auto">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4 rotate-90" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {onEdit && (
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(row);
                                  }}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                )}
                                {onDelete && (
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDelete(row);
                                    }}
                                    className="text-red-600"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={column.accessorKey} className="whitespace-normal break-words min-w-[120px]">
                          {(row as any)[column.accessorKey]}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={visibleColumnsCount} className="text-center py-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading more data...</span>
                    </div>
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

"use client";

import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { TableProps } from "@/types/table";
import { useTableSort } from "@/hooks/use-table-sort";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
  columnOrder,
  onColumnOrderChange,
}: TableProps<T>) {
  const { sortConfig, handleSort, sortData } = useTableSort<T>(onSortChange);

  // Get sort icon based on current sort state
  const getSortIcon = (columnKey: string) => {
    if (sortConfig.column !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    }

    if (sortConfig.direction === "asc") {
      return <ChevronUp className="ml-2 h-4 w-4" />;
    }

    if (sortConfig.direction === "desc") {
      return <ChevronDown className="ml-2 h-4 w-4" />;
    }

    return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
  };

  // Calculate visible columns count for colSpan
  const visibleColumnsCount = columns.filter(
    (column) =>
      !columnVisibility || columnVisibility[column.accessorKey as string]
  ).length;

  // Add actions column to columns if showActions is true
  const tableColumns = showActions
    ? [{ accessorKey: "actions" as keyof T, header: "Actions" }, ...columns]
    : columns;

  // Sort data if not using server-side sorting
  const displayData = onSortChange ? data : sortData(data);
  
  // Get all columns with accessorKey
  const allColumnKeys = tableColumns.map(col => col.accessorKey as string);

  // Create a map for fast column lookup
  const columnMap = new Map(tableColumns.map(col => [col.accessorKey as string, col]));

  // Get ordered and visible columns
  const orderedAndVisibleColumns = columnOrder
    ? columnOrder
        .filter(key => columnMap.has(key) && (!columnVisibility || columnVisibility[key]))
        .map(key => columnMap.get(key)!)
    : tableColumns.filter(col => !columnVisibility || columnVisibility[col.accessorKey as string]);

  // Handle drag end - use visible column indices for drag logic
  const handleDragEnd = (result: any) => {
    if (!result.destination || !onColumnOrderChange) return;
    
    // Get the dragged item's key
    const draggedKey = result.draggableId;
    
    // Get the current order (or default if not defined)
    const currentOrder = columnOrder || allColumnKeys;
    
    // Make a copy of the current order
    const newOrder = [...currentOrder];
    
    // Find current index of the dragged item in the full order
    const currentIndex = newOrder.indexOf(draggedKey);
    
    // Remove the item from its current position
    if (currentIndex !== -1) {
      newOrder.splice(currentIndex, 1);
    }
    
    // Calculate the target index in the full order
    // Find the accessorKey at the destination index in visible columns
    const visibleColumns = orderedAndVisibleColumns.map(col => col.accessorKey as string);
    const targetKey = result.destination.index < visibleColumns.length 
      ? visibleColumns[result.destination.index]
      : visibleColumns[visibleColumns.length - 1];
    
    // Find the index of the target key in the full order
    const targetIndex = newOrder.indexOf(targetKey);
    
    // Insert the dragged item at the target position
    if (targetIndex !== -1) {
      // If dropping before the target
      newOrder.splice(result.destination.index < result.source.index ? targetIndex : targetIndex + 1, 0, draggedKey);
    } else {
      // If target key not found, append to the end
      newOrder.push(draggedKey);
    }
    
    onColumnOrderChange(newOrder);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="rounded-md border relative flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="columns" direction="horizontal">
                {(provided) => (
                  <TableRow
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {orderedAndVisibleColumns.map((column, index) => (
                      <Draggable
                        key={column.accessorKey as string}
                        draggableId={column.accessorKey as string}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <TableHead
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "h-[100px] relative align-top bg-background",
                              column.accessorKey === "actions"
                                ? "w-[50px]"
                                : "min-w-[120px]",
                              snapshot.isDragging && "bg-muted"
                            )}
                          >
                            {column.accessorKey === "actions" ? (
                              <div className="pt-3 px-2 pb-10 text-center" {...provided.dragHandleProps}>
                                <div className="flex items-center justify-center">
                                  <div className="mr-2 cursor-grab">
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <span className="font-semibold text-sm leading-normal">
                                    Actions
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="pt-3 px-2 pb-10 flex items-center" {...provided.dragHandleProps}>
                                  <div className="mr-2 cursor-grab">
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleSort(column.accessorKey as string)
                                    }
                                    className="flex items-center font-semibold text-sm leading-normal hover:text-primary transition-colors w-full text-left"
                                  >
                                    <span className="break-words whitespace-normal">
                                      {column.header}
                                    </span>
                                    {getSortIcon(column.accessorKey as string)}
                                  </button>
                                </div>
                                <div className="absolute bottom-2 left-0 right-0 px-2">
                                  <Input
                                    placeholder={`Filter...`}
                                    value={
                                      columnFilters[column.accessorKey as string] || ""
                                    }
                                    onChange={(e) =>
                                      onFilterChange?.(
                                        column.accessorKey as string,
                                        e.target.value
                                      )
                                    }
                                    className="h-8"
                                  />
                                </div>
                              </>
                            )}
                          </TableHead>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableRow>
                )}
              </Droppable>
            </DragDropContext>
          </TableHeader>
          <TableBody>
            {displayData.map((row, index) => {
              const isLastRow = index === data.length - 1;
              return (
                <TableRow
                  key={index}
                  ref={isLastRow ? lastRowRef : undefined}
                  className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
                  onClick={() => onRowClick?.(row)}
                >
                  {orderedAndVisibleColumns.map((column) => {
                    if (column.accessorKey === "actions") {
                      return (
                        <TableCell
                          key={column.accessorKey as string}
                          className="w-[50px] text-center"
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 mx-auto"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4 rotate-90" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onEdit && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(row);
                                  }}
                                >
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
                      <TableCell
                        key={column.accessorKey as string}
                        className="whitespace-normal break-words min-w-[120px]"
                      >
                        {(row as any)[column.accessorKey]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnsCount}
                  className="text-center py-4"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading more data...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnsCount}
                  className="text-center py-8"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            {pagination.currentPage * pagination.pageSize -
              pagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              pagination.currentPage * pagination.pageSize,
              pagination.totalRecords
            )}{" "}
            of {pagination.totalRecords} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

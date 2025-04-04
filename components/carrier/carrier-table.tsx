"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenericTable } from "@/components/ui/generic-table"

// Define the type for carrier data
export interface Carrier {
  carID: string
  carDsc: string
  // Add other fields as needed based on your API response
}

// Define the columns for the carrier table
const columns: ColumnDef<Carrier>[] = [
  {
    accessorKey: "carID",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Carrier ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "carDsc",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]

interface CarrierTableProps {
  data: Carrier[]
  onRowClick?: (carrier: Carrier) => void
  className?: string
}

export function CarrierTable({ data, onRowClick, className }: CarrierTableProps) {
  return (
    <GenericTable
      data={data}
      columns={columns}
      onRowClick={onRowClick}
      className={className}
    />
  )
} 

"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenericTable } from "@/components/ui/generic-table"

export interface Carrier {
  ADDRL1: string
  ADDRL2: string
  CARDSC: string
  CARID: string
  CHGDAT: string
  CHGTIM: string
  CHGUSR: string
  CNTYCOD: string
  COMPID: string
  CONNME: string
  CRTDAT: string
  CRTTIM: string
  CRTUSR: string
  City: string
  Fax: string
  Phone: string
  RowNum: number
  STAID: string
  WebSite: string
  ZIPCODE: string
  eMail: string
}

interface CarrierTableProps {
  data: Carrier[]
  pagination?: {
    currentPage: number
    pageSize: number
    totalPages: number
    totalRecords: number
    onPageChange: (page: number) => void
  }
  onRowClick?: (carrier: Carrier) => void
  columnVisibility?: Record<string, boolean>
}

const columns: ColumnDef<Carrier>[] = [
  {
    accessorKey: "CARID",
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
    accessorKey: "CARDSC",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "Phone",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "eMail",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "City",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          City
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "CHGUSR",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Last Modified By
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "CHGDAT",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Last Modified Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]

export function CarrierTable({ data, pagination, onRowClick, columnVisibility }: CarrierTableProps) {
  return (
    <GenericTable
      data={data}
      columns={columns}
      pagination={pagination}
      onRowClick={onRowClick}
      columnVisibility={columnVisibility}
    />
  )
} 

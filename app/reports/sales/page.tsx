'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Search } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CarrierTable, Carrier } from '@/components/carrier/carrier-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CarrierResponse {
  data: Carrier[]
  pagination: {
    currentPage: number
    pageSize: number
    totalPages: number
    totalRecords: number
  }
}

const CARRIER_COLUMNS = [
  "CARID",
  "CARDSC",
  "Phone",
  "eMail",
  "City",
  "CHGUSR",
  "CHGDAT"
]

export default function SalesReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [carrierData, setCarrierData] = useState<Carrier[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    CARRIER_COLUMNS.reduce((acc, column) => ({ ...acc, [column]: true }), {})
  )
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchCarrierData()
    }
  }, [status, router])

  const fetchCarrierData = async (pageNum: number = 1) => {
    try {
      setIsLoading(true)
      console.log('Fetching carrier data from our API...')
      
      const response = await fetch(`/api/carrier?page=${pageNum}`)
      console.log('Response Status:', response.status)
      console.log('Response Headers:', response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error Response:', errorText)
        throw new Error(`Failed to fetch carrier data: ${errorText}`)
      }

      const data = await response.json()
      console.log('Carrier Data:', data)

      if (pageNum === 1) {
        setCarrierData(data.data)
      } else {
        setCarrierData(prev => [...prev, ...data.data])
      }
      
      setHasMore(data.data.length === 100) // Assuming 100 is our page size
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load carrier data')
      console.error('Error fetching carrier data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchCarrierData(nextPage)
    }
  }

  const handleRowClick = (carrier: Carrier) => {
    console.log('Clicked carrier:', carrier)
    // Add your row click handling logic here
  }

  const handleAddNew = () => {
    console.log('Add new carrier clicked')
    // Add your add new carrier logic here
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[600px]">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => fetchCarrierData()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-8">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Carrier Data</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Columns</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {CARRIER_COLUMNS.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column}
                      className="capitalize"
                      checked={columnVisibility[column]}
                      onCheckedChange={(value) => setColumnVisibility(prev => ({ ...prev, [column]: value }))}
                    >
                      {column}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Carrier
            </Button>
          </CardHeader>
          <CardContent>
            <CarrierTable
              data={carrierData}
              onRowClick={handleRowClick}
              onLoadMore={handleLoadMore}
              isLoading={isLoading}
              hasMore={hasMore}
              columnVisibility={columnVisibility}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 

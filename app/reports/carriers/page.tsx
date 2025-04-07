'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CarrierTable } from '@/components/carrier/carrier-table'
import { Carrier } from '@/types/carrier'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Custom hook for debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
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

export default function CarriersReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [carrierData, setCarrierData] = useState<Carrier[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    CARRIER_COLUMNS.reduce((acc, column) => ({ ...acc, [column]: true }), {})
  )
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const debouncedFilters = useDebounce(columnFilters, 300)
  const initialFetchDone = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchCarrierData = useCallback(async (pageNum: number = 1, currentFilters = columnFilters) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      setIsLoading(true)
      console.log('Fetching carrier data from our API...')
      
      // Build query parameters more safely
      const params = new URLSearchParams({ page: pageNum.toString() })
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      console.log(`Fetching: /api/carrier?${params.toString()}`);
      
      const response = await fetch(`/api/carrier?${params.toString()}`, {
        signal: abortControllerRef.current.signal
      })
      
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
      // Don't set error state if this was an abort
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
      setError(error instanceof Error ? error.message : 'Failed to load carrier data')
      console.error('Error fetching carrier data:', error)
    } finally {
      setIsLoading(false)
    }
  }, []) // Removed columnFilters from dependencies

  // Handle authentication and initial load
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    
    if (status === 'authenticated' && !initialFetchDone.current) {
      initialFetchDone.current = true
      fetchCarrierData(1)
    }
  }, [status, router, fetchCarrierData])

  // Handle filter changes via debounce - single source of truth for filter-based fetches
  useEffect(() => {
    if (initialFetchDone.current) {
      setPage(1)
      setCarrierData([])
      setHasMore(true)
      fetchCarrierData(1, debouncedFilters)
    }
  }, [debouncedFilters, fetchCarrierData])

  // Cleanup effect for aborting any pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Handle filter change - now just updates state without direct API call
  const handleFilterChange = useCallback((columnKey: string, value: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev }
      if (!value) {
        delete newFilters[columnKey]
      } else {
        newFilters[columnKey] = value
      }
      return newFilters
    })
  }, [])

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchCarrierData(nextPage, columnFilters)
    }
  }, [isLoading, hasMore, page, fetchCarrierData, columnFilters])

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
              onClick={() => {
                setError(null)
                fetchCarrierData(1, columnFilters)
              }}
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
              <CardTitle>Carrier Reports</CardTitle>
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
              onFilterChange={handleFilterChange}
              columnFilters={columnFilters}
            />
            {isLoading && page === 1 && (
              <div className="w-full flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

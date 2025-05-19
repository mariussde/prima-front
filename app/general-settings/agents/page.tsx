'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AgentTable } from '@/components/general-settings/agents/agents-table'
import { AgentFormModal } from '@/components/general-settings/agents/agents-form-modal'
import { Agent } from '@/types/agents'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { defaultVisibleColumns } from '@/components/general-settings/agents/agents-table'

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

const AGENT_COLUMNS = [
  "COMPID",
  "AGNTID",
  "AGNTDSC",
  "ADDRL1",
  "ADDRL2",
  "City",
  "ZIPCODE",
  "Phone",
  "Fax",
  "eMail",
  "WebSite",
  "FEDTXID",
  "STETXID",
  "CNTYCOD",
  "STAID",
  "CRTUSR",
  "CRTDAT",
  "CRTTIM",
  "CHGUSR",
  "CHGDAT",
  "CHGTIM",
  "actions"
]

export default function AgentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [agentData, setAgentData] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(defaultVisibleColumns)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [sortConfig, setSortConfig] = useState<{column: string | null, direction: 'asc' | 'desc' | null}>({
    column: null,
    direction: null
  })
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    agent?: Agent;
  }>({
    isOpen: false,
    mode: 'add'
  })
  const debouncedFilters = useDebounce(columnFilters, 300)
  const initialFetchDone = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchAgentData = useCallback(async (
    pageNum: number = 1, 
    currentFilters = columnFilters,
    sort = sortConfig
  ) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      setIsLoading(true)
      
      // Build query parameters more safely
      const params = new URLSearchParams({ 
        pageNumber: pageNum.toString(),
        pageSize: '100'
      })
      
      // Add filters with new format
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) {
          // Use the original column name as the parameter
          params.append(key, value)
        }
      })
      
      // Add sorting if available
      if (sort.column && sort.direction) {
        params.append('sortColumn', sort.column)
        params.append('sortDirection', sort.direction)
      }
      
      const response = await fetch(`/api/general-settings/agents?${params.toString()}`, {
        signal: abortControllerRef.current.signal
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch agent data: ${errorText}`)
      }
      
      const data = await response.json()
      
      // Update data based on page number
      if (pageNum === 1) {
        setAgentData(data.data)
      } else {
        setAgentData(prev => [...prev, ...data.data])
      }
      
      // Check if we have more data to load based on totalPages
      setHasMore(pageNum < data.totalPages)
    } catch (error) {
      // Don't set error state if this was an abort
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
      setError(error instanceof Error ? error.message : 'Failed to load agent data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle authentication and initial load
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    
    if (status === 'authenticated' && !initialFetchDone.current) {
      initialFetchDone.current = true
      fetchAgentData(1, columnFilters, sortConfig)
    }
  }, [status, router, fetchAgentData])

  // Handle filter and sort changes
  useEffect(() => {
    if (initialFetchDone.current) {
      setPage(1)
      setAgentData([])
      setHasMore(true)
      fetchAgentData(1, debouncedFilters, sortConfig)
    }
  }, [debouncedFilters, sortConfig, fetchAgentData])

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

  // Handle sort change
  const handleSortChange = useCallback((column: string, direction: 'asc' | 'desc' | null) => {
    setSortConfig({ column, direction })
  }, [])

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchAgentData(nextPage, columnFilters, sortConfig)
    }
  }, [isLoading, hasMore, page, fetchAgentData, columnFilters, sortConfig])

  const handleRowClick = (agent: Agent) => {
    // Add your row click handling logic here
  }

  const handleAddNew = () => {
    setModalState({ isOpen: true, mode: 'add' })
  }

  const handleEdit = (agent: Agent) => {
    setModalState({ isOpen: true, mode: 'edit', agent })
  }

  const handleModalClose = () => {
    setModalState({ isOpen: false, mode: 'add' })
  }

  const handleAgentSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/general-settings/agents', {
        method: modalState.mode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Extract the actual error message from the response
        let errorMessage = responseData.error || `Failed to ${modalState.mode} agent`
        
        // If we have details, try to parse them for a more specific error message
        if (responseData.details) {
          try {
            const details = JSON.parse(responseData.details)
            if (details.error) {
              errorMessage = details.error
            } else if (details.message) {
              errorMessage = details.message
            }
          } catch (e) {
            // If parsing fails, use the response details as the error message
            errorMessage = responseData.details || errorMessage
          }
        }

        // Show error toast with complete error message
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 8000,
          className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-100",
        })

        return { error: errorMessage }
      }

      // Show success toast
      toast({
        title: modalState.mode === 'add' ? "Agent Created" : "Agent Updated",
        description: modalState.mode === 'add'
          ? "The new agent has been successfully created."
          : "The agent has been successfully updated.",
        duration: 3000,
        className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-100",
      })

      // Refresh data and close modal
      await fetchAgentData(1, columnFilters, sortConfig)
      handleModalClose()
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while saving the agent"
      
      // Show error toast
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
        className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-100",
      })
      
      return { error: errorMessage }
    }
  }

  const handleDelete = async (agent: Agent) => {
    try {
      const response = await fetch(`/api/general-settings/agents?COMPID=${agent.COMPID}&AGNTID=${agent.AGNTID}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        let errorMessage = errorData.error || 'Failed to delete agent'
        
        // If we have details, try to parse them for a more specific error message
        if (errorData.details) {
          try {
            const details = JSON.parse(errorData.details)
            if (details.error) {
              errorMessage = details.error
            } else if (details.message) {
              errorMessage = details.message
            }
          } catch (e) {
            // If parsing fails, use the response details as the error message
            errorMessage = errorData.details || errorMessage
          }
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
          duration: 8000,
          className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-100",
        })
        
        return
      }

      toast({
        title: "Success",
        description: "Agent has been successfully deleted.",
        duration: 3000,
        className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-100",
      })

      // Refresh the agent data
      await fetchAgentData(1, columnFilters, sortConfig)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete agent",
        variant: "destructive",
        duration: 8000,
        className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-100",
      })
    }
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
        <Card className="w-full max-w-[600px] mx-4">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => {
                setError(null)
                fetchAgentData(1, columnFilters, sortConfig)
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
    <div className="h-full flex flex-col">
      <main className="flex-1 p-2 md:p-4 w-full">
        <Card className="w-full h-full">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 py-4 px-2 sm:px-5">
            <CardTitle>Agents</CardTitle>
            <div className="flex flex-col min-[320px]:flex-row items-start min-[320px]:items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default" className="w-full min-[320px]:w-[120px]">Columns</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
                  {AGENT_COLUMNS.map((column) => (
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
              <Button onClick={handleAddNew} className="w-full min-[320px]:w-[120px]">
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 overflow-auto" style={{ height: "calc(100vh - 245px)" }}>
            <div className="w-full h-full relative">
              <AgentTable
                data={agentData}
                onRowClick={handleRowClick}
                onLoadMore={handleLoadMore}
                isLoading={isLoading}
                hasMore={hasMore}
                columnVisibility={columnVisibility}
                onFilterChange={handleFilterChange}
                columnFilters={columnFilters}
                onSortChange={handleSortChange}
                showActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {isLoading && page === 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <AgentFormModal
        open={modalState.isOpen}
        onOpenChange={(open) => !open && handleModalClose()}
        agent={modalState.agent}
        onSubmit={handleAgentSubmit}
      />
    </div>
  )
} 

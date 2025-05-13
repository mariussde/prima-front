import { useState } from 'react'
import { TableSortConfig } from '@/types/table'

export function useTableSort<T>(
  onSortChange?: (column: string, direction: 'asc' | 'desc' | null) => void
) {
  const [sortConfig, setSortConfig] = useState<TableSortConfig>({
    column: null,
    direction: null
  })

  const handleSort = (columnKey: string) => {
    let direction: 'asc' | 'desc' | null = 'asc'
    
    if (sortConfig.column === columnKey) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc'
      } else if (sortConfig.direction === 'desc') {
        direction = null
      }
    }
    
    setSortConfig({
      column: direction ? columnKey : null,
      direction: direction
    })
    
    if (onSortChange) {
      onSortChange(columnKey, direction)
    }
  }

  const sortData = (data: T[]): T[] => {
    if (!sortConfig.column || !sortConfig.direction) {
      return data
    }

    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortConfig.column as string]
      const bValue = (b as any)[sortConfig.column as string]
      
      if (aValue === bValue) return 0
      
      const comparison = aValue < bValue ? -1 : 1
      return sortConfig.direction === 'asc' ? comparison : -comparison
    })
  }

  return {
    sortConfig,
    handleSort,
    sortData
  }
} 

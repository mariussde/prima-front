"use client"

import { useState, useEffect } from "react"

// Define the structure of a recently used item
export interface RecentlyUsedItem {
  title: string
  href: string
  icon: string
  timestamp: number
}

// Maximum number of recently used items to store
const MAX_RECENT_ITEMS = 5

export function useRecentlyUsed() {
  const [recentItems, setRecentItems] = useState<RecentlyUsedItem[]>([])

  // Load recently used items from localStorage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem("recentlyUsed")
    if (storedItems) {
      try {
        setRecentItems(JSON.parse(storedItems))
      } catch (error) {
        console.error("Failed to parse recently used items:", error)
        // Reset if there's an error
        localStorage.removeItem("recentlyUsed")
      }
    }
  }, [])

  // Add a new item to recently used
  const addRecentItem = (item: Omit<RecentlyUsedItem, "timestamp">) => {
    setRecentItems((prevItems) => {
      // Create new item with current timestamp
      const newItem = { ...item, timestamp: Date.now() }

      // Filter out any existing item with the same href
      const filteredItems = prevItems.filter((i) => i.href !== item.href)

      // Add new item at the beginning and limit to MAX_RECENT_ITEMS
      const updatedItems = [newItem, ...filteredItems].slice(0, MAX_RECENT_ITEMS)

      // Save to localStorage
      localStorage.setItem("recentlyUsed", JSON.stringify(updatedItems))

      return updatedItems
    })
  }

  // Clear all recently used items
  const clearRecentItems = () => {
    localStorage.removeItem("recentlyUsed")
    setRecentItems([])
  }

  return {
    recentItems,
    addRecentItem,
    clearRecentItems,
  }
}


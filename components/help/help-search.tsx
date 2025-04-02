"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function HelpSearch() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock search function - in a real app, this would query an API
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsSearching(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock results based on query
      const mockResults = [
        "How to create a new user account",
        "Managing user permissions and roles",
        "Setting up two-factor authentication",
        "Resetting user passwords",
        "User profile customization options",
      ].filter((item) => item.toLowerCase().includes(query.toLowerCase()))

      setSearchResults(mockResults)
      setIsSearching(false)
    }, 500)
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search help articles..."
            className="pl-10 pr-20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2" disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Search Results</h3>
            <ul className="space-y-1">
              {searchResults.map((result, index) => (
                <li key={index} className="p-2 hover:bg-muted rounded-md cursor-pointer">
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}

        {query && searchResults.length === 0 && !isSearching && (
          <div className="mt-4 text-center text-muted-foreground">No results found for "{query}"</div>
        )}
      </CardContent>
    </Card>
  )
}


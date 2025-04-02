"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download, Upload, Search } from "lucide-react"
import { useUsersContext } from "@/components/users/users-provider"

interface UsersHeaderProps {
  onAddUser: () => void
}

export function UsersHeader({ onAddUser }: UsersHeaderProps) {
  const { filters, setFilters } = useUsersContext()
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null)

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value

      // Clear any existing debounce timer
      if (searchDebounce) clearTimeout(searchDebounce)

      // Set a new debounce timer
      const timer = setTimeout(() => {
        setFilters({ ...filters, search: value })
      }, 300)

      setSearchDebounce(timer)
    },
    [filters, searchDebounce, setFilters],
  )

  const handleStatusChange = useCallback(
    (value: string) => {
      setFilters({ ...filters, status: value })
    },
    [filters, setFilters],
  )

  const handleRoleChange = useCallback(
    (value: string) => {
      setFilters({ ...filters, role: value })
    },
    [filters, setFilters],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button onClick={onAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-8" onChange={handleSearchChange} />
        </div>
        <Select defaultValue="all" onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all" onValueChange={handleRoleChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}


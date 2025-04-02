"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import type { User } from "@/types/user"

// Sample user data
const initialUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
    lastActive: "Today",
    department: "Engineering",
    bio: "Senior software engineer with 10 years of experience.",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
    lastActive: "Yesterday",
    department: "Marketing",
    bio: "Marketing specialist focused on digital campaigns.",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "editor",
    status: "inactive",
    avatar: "/placeholder.svg?height=40&width=40&text=RJ",
    lastActive: "Last week",
    department: "Content",
    bio: "Content editor with expertise in technical documentation.",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "viewer",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40&text=ED",
    lastActive: "2 days ago",
    department: "Sales",
    bio: "Sales representative for the western region.",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "admin",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40&text=MW",
    lastActive: "Just now",
    department: "IT",
    bio: "IT administrator responsible for system security.",
  },
]

type UsersContextType = {
  users: User[]
  filteredUsers: User[]
  filters: {
    search: string
    status: string
    role: string
  }
  setFilters: (filters: { search: string; status: string; role: string }) => void
  addUser: (user: User) => void
  updateUser: (id: string, user: User) => void
  deleteUser: (id: string) => void
  getUserById: (id: string) => User | undefined
}

const UsersContext = createContext<UsersContextType | undefined>(undefined)

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers)
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    role: "all",
  })

  // Memoize the filtering function to prevent unnecessary recalculations
  const applyFilters = useCallback((userList: User[], currentFilters: typeof filters) => {
    let filtered = [...userList]

    // Filter by search term
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          (user.department && user.department.toLowerCase().includes(searchTerm)),
      )
    }

    // Filter by status
    if (currentFilters.status !== "all") {
      filtered = filtered.filter((user) => user.status === currentFilters.status)
    }

    // Filter by role
    if (currentFilters.role !== "all") {
      filtered = filtered.filter((user) => user.role === currentFilters.role)
    }

    return filtered
  }, [])

  // Apply filters whenever users or filters change
  useEffect(() => {
    const filtered = applyFilters(users, filters)
    setFilteredUsers(filtered)
  }, [users, filters, applyFilters])

  const addUser = useCallback((user: User) => {
    setUsers((prev) => [...prev, user])
  }, [])

  const updateUser = useCallback((id: string, updatedUser: User) => {
    setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)))
  }, [])

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }, [])

  const getUserById = useCallback(
    (id: string) => {
      return users.find((user) => user.id === id)
    },
    [users],
  )

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    users: filteredUsers,
    filteredUsers,
    filters,
    setFilters,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
  }

  return <UsersContext.Provider value={contextValue}>{children}</UsersContext.Provider>
}

export const useUsersContext = () => {
  const context = useContext(UsersContext)
  if (context === undefined) {
    throw new Error("useUsersContext must be used within a UsersProvider")
  }
  return context
}


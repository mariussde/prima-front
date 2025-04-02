"use client"

import { useState, useCallback } from "react"
import { UsersTable } from "@/components/users/users-table"
import { UsersHeader } from "@/components/users/users-header"
import { UserFormModal } from "@/components/users/user-form-modal"

export default function UsersPageClient() {
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)

  const openAddUserModal = useCallback(() => {
    setSelectedUserId(undefined)
    setFormModalOpen(true)
  }, [])

  const openEditUserModal = useCallback((userId: string) => {
    setSelectedUserId(userId)
    setFormModalOpen(true)
  }, [])

  return (
    <div className="flex flex-col gap-4 p-8">
      <UsersHeader onAddUser={openAddUserModal} />
      <UsersTable onEditUser={openEditUserModal} />
      <UserFormModal open={formModalOpen} onOpenChange={setFormModalOpen} userId={selectedUserId} />
    </div>
  )
}


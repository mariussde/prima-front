"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function EditUserPage() {
  const router = useRouter()

  // Redirect to the main users page since we're now using modals
  useEffect(() => {
    router.push("/users")
  }, [router])

  return null
}


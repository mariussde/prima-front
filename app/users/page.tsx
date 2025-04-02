import type { Metadata } from "next"
import UsersPageClient from "./users-page-client"

export const metadata: Metadata = {
  title: "Users",
  description: "User management and administration",
}

export default function UsersPage() {
  return <UsersPageClient />
}


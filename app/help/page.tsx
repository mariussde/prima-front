import type { Metadata } from "next"
import { HelpDeskPage } from "@/components/help/help-desk"

export const metadata: Metadata = {
  title: "Help Center",
  description: "Get support and find answers to your questions",
}

export default function HelpPage() {
  return <HelpDeskPage />
}


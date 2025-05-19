import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Prima dashboard overview",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex justify-center mb-8">
        <Image
          src="/logo-marius.svg"
          alt="Prima Logo"
          width={400}
          height={400}
          className="opacity-20"
          priority
        />
      </div>
    </div>
  )
}


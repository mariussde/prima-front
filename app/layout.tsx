import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AppLayout } from "@/components/layout/app-layout"
import { Toaster } from "@/components/ui/toaster"
import { ClientProviders } from "@/components/layout/client-providers"
import { InactivityHandler } from "@/components/layout/inactivity-handler"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Prima",
    template: "%s | Prima",
  },
  description: "A comprehensive dashboard application with authentication and data management",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ClientProviders>
          <AppLayout>
            {children}
          </AppLayout>
          <InactivityHandler />
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  )
}



import './globals.css'

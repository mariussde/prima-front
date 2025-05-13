"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpSearch } from "@/components/help/help-search"
import { SupportOptions } from "@/components/help/support-options"
import { FrequentlyAskedQuestions } from "@/components/help/faq"
import { TicketingSystem } from "@/components/help/ticketing-system"

export function HelpDeskPage() {
  const [activeTab, setActiveTab] = useState("faq")

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Help Center</h1>
        <p className="text-muted-foreground">Find answers, get support, or submit a ticket for assistance</p>
      </div>

      <HelpSearch />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="support">Support Options</TabsTrigger>
          <TabsTrigger value="tickets">Ticketing System</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-6">
          <FrequentlyAskedQuestions />
        </TabsContent>

        <TabsContent value="support" className="mt-6">
          <SupportOptions />
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <TicketingSystem />
        </TabsContent>
      </Tabs>
    </div>
  )
}


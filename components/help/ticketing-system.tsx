"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { AlertCircle, CheckCircle2, Clock, Filter, Plus, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Mock ticket data
interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  category: string
  createdAt: Date
  updatedAt: Date
  assignee?: string
}

const mockTickets: Ticket[] = [
  {
    id: "PRIMA-1001",
    title: "Cannot access user management page",
    description: "I'm getting a 403 error when trying to access the user management section.",
    status: "open",
    priority: "high",
    category: "Access Issue",
    createdAt: new Date(2023, 3, 15),
    updatedAt: new Date(2023, 3, 15),
  },
  {
    id: "PRIMA-1002",
    title: "Dashboard charts not loading",
    description: "The charts on the main dashboard are showing loading spinners but never display data.",
    status: "in-progress",
    priority: "medium",
    category: "UI Issue",
    createdAt: new Date(2023, 3, 14),
    updatedAt: new Date(2023, 3, 16),
    assignee: "Support Team",
  },
  {
    id: "PRIMA-1003",
    title: "Need help with API integration",
    description: "Looking for documentation on how to integrate with the reporting API.",
    status: "resolved",
    priority: "low",
    category: "Documentation",
    createdAt: new Date(2023, 3, 10),
    updatedAt: new Date(2023, 3, 12),
    assignee: "API Team",
  },
  {
    id: "PRIMA-1004",
    title: "Export functionality not working",
    description: "When I try to export reports to PDF, the download never starts.",
    status: "closed",
    priority: "medium",
    category: "Feature Issue",
    createdAt: new Date(2023, 3, 5),
    updatedAt: new Date(2023, 3, 8),
    assignee: "Dev Team",
  },
  {
    id: "PRIMA-1005",
    title: "System extremely slow after latest update",
    description: "Since the update yesterday, all pages are loading very slowly.",
    status: "open",
    priority: "critical",
    category: "Performance",
    createdAt: new Date(2023, 3, 17),
    updatedAt: new Date(2023, 3, 17),
  },
]

export function TicketingSystem() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [activeTab, setActiveTab] = useState("all")
  const [createTicketOpen, setCreateTicketOpen] = useState(false)
  const [viewTicketOpen, setViewTicketOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Filter tickets based on active tab and search query
  const filteredTickets = tickets.filter((ticket) => {
    const matchesTab = activeTab === "all" || ticket.status === activeTab
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleCreateTicket = (newTicket: Partial<Ticket>) => {
    const ticket: Ticket = {
      id: `PRIMA-${1006 + tickets.length}`,
      title: newTicket.title || "",
      description: newTicket.description || "",
      status: "open",
      priority: newTicket.priority || "medium",
      category: newTicket.category || "General",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setTickets([ticket, ...tickets])
    setCreateTicketOpen(false)

    toast({
      title: "Ticket created",
      description: `Your ticket ${ticket.id} has been submitted.`,
    })
  }

  const viewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setViewTicketOpen(true)
  }

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900"
          >
            Open
          </Badge>
        )
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900"
          >
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900"
          >
            Resolved
          </Badge>
        )
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
          >
            Closed
          </Badge>
        )
    }
  }

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
          >
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900"
          >
            Medium
          </Badge>
        )
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-900"
          >
            High
          </Badge>
        )
      case "critical":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900"
          >
            Critical
          </Badge>
        )
    }
  }

  const getStatusIcon = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "closed":
        return <CheckCircle2 className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setTickets([...mockTickets])}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Dialog open={createTicketOpen} onOpenChange={setCreateTicketOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>Fill out the form below to submit a new support ticket.</DialogDescription>
              </DialogHeader>
              <CreateTicketForm onSubmit={handleCreateTicket} onCancel={() => setCreateTicketOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>
                {activeTab === "all"
                  ? "All support tickets"
                  : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tickets`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTickets.length > 0 ? (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => viewTicket(ticket)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(ticket.status)}
                          <span className="font-medium">{ticket.id}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-sm">{ticket.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</div>
                      </div>
                      <div className="flex items-center gap-3 mt-2 sm:mt-0">
                        <div className="text-xs text-muted-foreground">{format(ticket.createdAt, "MMM d, yyyy")}</div>
                        <div className="flex gap-2">
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No tickets found.</div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredTickets.length} of {tickets.length} tickets
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedTicket && (
        <Dialog open={viewTicketOpen} onOpenChange={setViewTicketOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedTicket.id} <span className="text-muted-foreground">·</span> {selectedTicket.title}
              </DialogTitle>
              <DialogDescription>Created on {format(selectedTicket.createdAt, "MMMM d, yyyy")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(selectedTicket.status)}
                {getPriorityBadge(selectedTicket.priority)}
                <Badge variant="outline">{selectedTicket.category}</Badge>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm">{selectedTicket.description}</p>
              </div>

              {selectedTicket.assignee && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Assigned To</h4>
                  <p className="text-sm">{selectedTicket.assignee}</p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Updates</h4>
                <div className="text-sm text-muted-foreground">
                  Last updated on {format(selectedTicket.updatedAt, "MMMM d, yyyy")}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewTicketOpen(false)}>
                Close
              </Button>
              <Button>Update Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface CreateTicketFormProps {
  onSubmit: (ticket: Partial<Ticket>) => void
  onCancel: () => void
}

function CreateTicketForm({ onSubmit, onCancel }: CreateTicketFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Ticket["priority"]>("medium")
  const [category, setCategory] = useState("General")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      priority,
      category,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Brief summary of your issue"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as Ticket["priority"])}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Access Issue">Access Issue</SelectItem>
              <SelectItem value="UI Issue">UI Issue</SelectItem>
              <SelectItem value="Feature Issue">Feature Issue</SelectItem>
              <SelectItem value="Performance">Performance</SelectItem>
              <SelectItem value="Documentation">Documentation</SelectItem>
              <SelectItem value="Billing">Billing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide details about your issue..."
          className="min-h-[150px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit Ticket</Button>
      </DialogFooter>
    </form>
  )
}


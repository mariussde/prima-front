"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Agent } from "@/types/agents"

// Define the form schema based on the required parameters
const agentFormSchema = z.object({
  COMPID: z.string().min(1, "Company ID is required"),
  AGNTID: z.string().min(1, "Agent ID is required"),
  AGNTDSC: z.string().min(1, "Description is required"),
  ADDRL1: z.string().optional(),
  ADDRL2: z.string().optional(),
  City: z.string().optional(),
  ZIPCODE: z.string().optional(),
  Phone: z.string().optional(),
  Fax: z.string().optional(),
  eMail: z.string().optional(),
  WebSite: z.string().optional(),
  FEDTXID: z.string().optional(),
  STETXID: z.string().optional(),
  CNTYCOD: z.string().optional(),
  STAID: z.string().optional(),
  CRTUSR: z.string().optional(),
})

type AgentFormValues = z.infer<typeof agentFormSchema>

interface AgentFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agent?: Agent
  onSubmit: (data: AgentFormValues) => Promise<{ error?: string } | void>
}

export function AgentFormModal({
  open,
  onOpenChange,
  agent,
  onSubmit,
}: AgentFormModalProps) {
  const { toast } = useToast()
  const isEditMode = !!agent

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      COMPID: "PLL", // Default company ID
      AGNTID: "",
      AGNTDSC: "",
      ADDRL1: "",
      ADDRL2: "",
      City: "",
      ZIPCODE: "",
      Phone: "",
      Fax: "",
      eMail: "",
      WebSite: "",
      FEDTXID: "",
      STETXID: "",
      CNTYCOD: "",
      STAID: "",
      CRTUSR: "",
    },
  })

  // Reset form when modal opens/closes or agent changes
  useEffect(() => {
    if (isEditMode && open && agent) {
      form.reset({
        COMPID: agent.COMPID,
        AGNTID: agent.AGNTID,
        AGNTDSC: agent.AGNTDSC,
        ADDRL1: agent.ADDRL1,
        ADDRL2: agent.ADDRL2,
        City: agent.City,
        ZIPCODE: agent.ZIPCODE,
        Phone: agent.Phone,
        Fax: agent.Fax,
        eMail: agent.eMail,
        WebSite: agent.WebSite,
        FEDTXID: agent.FEDTXID,
        STETXID: agent.STETXID,
        CNTYCOD: agent.CNTYCOD,
        STAID: agent.STAID,
        CRTUSR: agent.CRTUSR,
      })
    } else if (!isEditMode && open) {
      form.reset({
        COMPID: "PLL",
        AGNTID: "",
        AGNTDSC: "",
        ADDRL1: "",
        ADDRL2: "",
        City: "",
        ZIPCODE: "",
        Phone: "",
        Fax: "",
        eMail: "",
        WebSite: "",
        FEDTXID: "",
        STETXID: "",
        CNTYCOD: "",
        STAID: "",
        CRTUSR: "",
      })
    }
  }, [isEditMode, agent, form, open])

  const handleSubmit = async (data: AgentFormValues) => {
    try {
      const response = await onSubmit(data)
      
      // If we get a success response, close the modal
      if (response && 'success' in response) {
        onOpenChange(false)
        return
      }

      // If we get an error response, pass it back to the parent
      if (response && 'error' in response) {
        return response
      }

      // If we get here, something unexpected happened
      return { error: "An unexpected error occurred" }
    } catch (error) {
      // Return the error instead of throwing it
      return { 
        error: error instanceof Error ? error.message : "An error occurred while saving the agent"
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{isEditMode ? "Edit Agent" : "Add New Agent"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the agent's information below."
              : "Fill in the information below to create a new agent."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-6">
              <div className="space-y-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="COMPID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company ID</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="AGNTID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agent ID</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isEditMode} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="AGNTDSC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="ADDRL1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ADDRL2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="City"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="STAID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ZIPCODE"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="Phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Fax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fax</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="eMail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="WebSite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="FEDTXID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Federal Tax ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="STETXID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State Tax ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="CNTYCOD"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? "Update Agent" : "Create Agent"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 

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
import { Client } from "@/types/clients"

// Define the form schema based on the required parameters
const clientFormSchema = z.object({
  COMPID: z.string().min(1, "Company ID is required"),
  CLNTID: z.string().min(1, "Client ID is required"),
  CLNTDSC: z.string().min(1, "Description is required"),
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
  CLBILL: z.string().optional(),
  CLEC1: z.string().optional(),
  CLEC2: z.string().optional(),
  CLEC3: z.string().optional(),
  CLEC4: z.string().optional(),
  CLEC5: z.string().optional(),
  CLEN1: z.string().optional(),
  CLEN2: z.string().optional(),
  CLEN3: z.string().optional(),
  CLEN4: z.string().optional(),
  CLEN5: z.string().optional(),
  CNTYCOD: z.string().optional(),
  STAID: z.string().optional(),
  CRTUSR: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

interface ClientFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client
  onSubmit: (data: ClientFormValues) => Promise<{ error?: string } | void>
}

export function ClientFormModal({
  open,
  onOpenChange,
  client,
  onSubmit,
}: ClientFormModalProps) {
  const { toast } = useToast()
  const isEditMode = !!client

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      COMPID: "PLL", // Default company ID
      CLNTID: "",
      CLNTDSC: "",
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
      CLBILL: "",
      CLEC1: "",
      CLEC2: "",
      CLEC3: "",
      CLEC4: "",
      CLEC5: "",
      CLEN1: "",
      CLEN2: "",
      CLEN3: "",
      CLEN4: "",
      CLEN5: "",
      CNTYCOD: "",
      STAID: "",
      CRTUSR: "",
    },
  })

  // Reset form when modal opens/closes or client changes
  useEffect(() => {
    if (isEditMode && open && client) {
      form.reset({
        COMPID: client.COMPID,
        CLNTID: client.CLNTID,
        CLNTDSC: client.CLNTDSC,
        ADDRL1: client.ADDRL1,
        ADDRL2: client.ADDRL2,
        City: client.City,
        ZIPCODE: client.ZIPCODE,
        Phone: client.Phone,
        Fax: client.Fax,
        eMail: client.eMail,
        WebSite: client.WebSite,
        FEDTXID: client.FEDTXID,
        STETXID: client.STETXID,
        CLBILL: client.CLBILL,
        CLEC1: client.CLEC1,
        CLEC2: client.CLEC2,
        CLEC3: client.CLEC3,
        CLEC4: client.CLEC4,
        CLEC5: client.CLEC5,
        CLEN1: client.CLEN1,
        CLEN2: client.CLEN2,
        CLEN3: client.CLEN3,
        CLEN4: client.CLEN4,
        CLEN5: client.CLEN5,
        CNTYCOD: client.CNTYCOD,
        STAID: client.STAID,
        CRTUSR: client.CRTUSR,
      })
    } else if (!isEditMode && open) {
      form.reset({
        COMPID: "PLL",
        CLNTID: "",
        CLNTDSC: "",
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
        CLBILL: "",
        CLEC1: "",
        CLEC2: "",
        CLEC3: "",
        CLEC4: "",
        CLEC5: "",
        CLEN1: "",
        CLEN2: "",
        CLEN3: "",
        CLEN4: "",
        CLEN5: "",
        CNTYCOD: "",
        STAID: "",
        CRTUSR: "",
      })
    }
  }, [isEditMode, client, form, open])

  const handleSubmit = async (data: ClientFormValues) => {
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
        error: error instanceof Error ? error.message : "An error occurred while saving the client"
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{isEditMode ? "Edit Client" : "Add New Client"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the client's information below."
              : "Fill in the information below to create a new client."}
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
                    name="CLNTID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client ID</FormLabel>
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
                  name="CLNTDSC"
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
                          <Input type="email" {...field} />
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
                          <Input type="url" {...field} />
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
                  <FormField
                    control={form.control}
                    name="CLBILL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional fields for CLEC1-5 and CLEN1-5 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <FormField
                      key={`CLEC${num}`}
                      control={form.control}
                      name={`CLEC${num}` as keyof ClientFormValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email {num}</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <FormField
                      key={`CLEN${num}`}
                      control={form.control}
                      name={`CLEN${num}` as keyof ClientFormValues}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name {num}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? "Update Client" : "Create Client"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 

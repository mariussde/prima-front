"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
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
import { Carrier } from "@/types/carrier"

// Define the form schema based on the required parameters from settings_config.json
const carrierFormSchema = z.object({
  COMPID: z.string().min(1, "Company ID is required"),
  CARID: z.string().min(1, "Carrier ID is required"),
  CARDSC: z.string().min(1, "Description is required"),
  ADDRL1: z.string().optional(),
  ADDRL2: z.string().optional(),
  City: z.string().optional(),
  ZIPCODE: z.string().optional(),
  Phone: z.string().optional(),
  Fax: z.string().optional(),
  eMail: z.string().optional(),
  WebSite: z.string().optional(),
  CONNME: z.string().optional(),
  CNTYCOD: z.string().optional(),
  STAID: z.string().optional(),
  CRTUSR: z.string().optional(),
})

type CarrierFormValues = z.infer<typeof carrierFormSchema>

interface CarrierFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  carrier?: Carrier
  onSubmit: (data: CarrierFormValues) => Promise<void>
}

export function CarrierFormModal({
  open,
  onOpenChange,
  carrier,
  onSubmit,
}: CarrierFormModalProps) {
  const { toast } = useToast()
  const isEditMode = !!carrier

  const form = useForm<CarrierFormValues>({
    resolver: zodResolver(carrierFormSchema),
    defaultValues: {
      COMPID: "PLL", // Default company ID
      CARID: "",
      CARDSC: "",
      ADDRL1: "",
      ADDRL2: "",
      City: "",
      ZIPCODE: "",
      Phone: "",
      Fax: "",
      eMail: "",
      WebSite: "",
      CONNME: "",
      CNTYCOD: "",
      STAID: "",
      CRTUSR: "",
    },
  })

  // Reset form when modal opens/closes or carrier changes
  useEffect(() => {
    if (isEditMode && open && carrier) {
      form.reset({
        COMPID: carrier.COMPID,
        CARID: carrier.CARID,
        CARDSC: carrier.CARDSC,
        ADDRL1: carrier.ADDRL1,
        ADDRL2: carrier.ADDRL2,
        City: carrier.City,
        ZIPCODE: carrier.ZIPCODE,
        Phone: carrier.Phone,
        Fax: carrier.Fax,
        eMail: carrier.eMail,
        WebSite: carrier.WebSite,
        CONNME: carrier.CONNME,
        CNTYCOD: carrier.CNTYCOD,
        STAID: carrier.STAID,
        CRTUSR: carrier.CRTUSR,
      })
    } else if (!isEditMode && open) {
      form.reset({
        COMPID: "PLL",
        CARID: "",
        CARDSC: "",
        ADDRL1: "",
        ADDRL2: "",
        City: "",
        ZIPCODE: "",
        Phone: "",
        Fax: "",
        eMail: "",
        WebSite: "",
        CONNME: "",
        CNTYCOD: "",
        STAID: "",
        CRTUSR: "",
      })
    }
  }, [isEditMode, carrier, form, open])

  const handleSubmit = async (data: CarrierFormValues) => {
    try {
      await onSubmit(data)
      toast({
        title: isEditMode ? "Carrier updated" : "Carrier created",
        description: isEditMode
          ? "The carrier has been successfully updated."
          : "The new carrier has been successfully created.",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Carrier" : "Add New Carrier"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the carrier's information below."
              : "Fill in the information below to create a new carrier."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
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
                name="CARID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrier ID</FormLabel>
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
              name="CARDSC"
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

            <div className="grid gap-6 sm:grid-cols-2">
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

            <div className="grid gap-6 sm:grid-cols-3">
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

            <div className="grid gap-6 sm:grid-cols-2">
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

            <div className="grid gap-6 sm:grid-cols-2">
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

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="CONNME"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? "Update Carrier" : "Create Carrier"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 

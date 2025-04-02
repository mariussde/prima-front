"use client"

import { useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useUsersContext } from "@/components/users/users-provider"

const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string({
    required_error: "Please select a role.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  department: z.string().optional(),
  bio: z
    .string()
    .max(500, {
      message: "Bio must not be longer than 500 characters.",
    })
    .optional(),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
}

export function UserFormModal({ open, onOpenChange, userId }: UserFormModalProps) {
  const { toast } = useToast()
  const { addUser, updateUser, getUserById } = useUsersContext()

  const isEditMode = !!userId

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      status: "active",
      department: "",
      bio: "",
    },
  })

  // Reset form when modal opens/closes or userId changes
  useEffect(() => {
    if (isEditMode && open) {
      const user = getUserById(userId)
      if (user) {
        form.reset({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          department: user.department || "",
          bio: user.bio || "",
        })
      }
    } else if (!isEditMode && open) {
      form.reset({
        name: "",
        email: "",
        role: "user",
        status: "active",
        department: "",
        bio: "",
      })
    }
  }, [isEditMode, userId, getUserById, form, open])

  const onSubmit = useCallback(
    (data: UserFormValues) => {
      if (isEditMode && userId) {
        updateUser(userId, {
          ...data,
          id: userId,
          avatar: `/placeholder.svg?height=40&width=40&text=${data.name.charAt(0)}`,
          lastActive: "Just now",
        })
        toast({
          title: "User updated",
          description: "The user has been successfully updated.",
        })
      } else {
        addUser({
          ...data,
          id: Date.now().toString(),
          avatar: `/placeholder.svg?height=40&width=40&text=${data.name.charAt(0)}`,
          lastActive: "Just now",
        })
        toast({
          title: "User created",
          description: "The new user has been successfully created.",
        })
      }

      onOpenChange(false)
    },
    [isEditMode, userId, updateUser, addUser, toast, onOpenChange],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the user's information below."
              : "Fill in the information below to create a new user."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The role determines user permissions.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Active users can access the system.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Engineering" {...field} />
                  </FormControl>
                  <FormDescription>The department the user belongs to.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about this user..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Brief description about the user. Max 500 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? "Update User" : "Create User"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    try {
      console.log('Attempting to sign in...')
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl,
      })
      console.log('Sign in result:', result);

      if (result?.error) {
        console.log('Sign in error:', result.error);
        if (result.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error,
          })
        }
      } else {
        router.push(callbackUrl);
        router.refresh();
        setErrorMessage(null);
      }
    } catch (error) {
      console.log("Catch block executed:", error);
      console.error("Login form error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Something went wrong. Please try again.";
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[400px] bg-[hsl(var(--sidebar-background))]">
      <CardHeader>
        <CardTitle>Welcome to Prima</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              disabled={isLoading}
              placeholder="Enter your username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isLoading}
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 

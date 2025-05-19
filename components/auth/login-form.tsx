"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result) {
        throw new Error("No response from authentication server");
      }

      if (result.error) {
        // Handle specific Cognito error messages
        let errorMessage = result.error;
        if (result.error.includes("Invalid credentials")) {
          errorMessage = "Invalid username or password";
        } else if (result.error.includes("User is not confirmed")) {
          errorMessage = "Please verify your email address before signing in";
        } else if (result.error.includes("User is disabled")) {
          errorMessage = "Your account has been disabled. Please contact support";
        } else if (result.error.includes("Password attempts exceeded")) {
          errorMessage = "Too many failed login attempts. Please try again later";
        } else if (result.error.includes("Failed to connect")) {
          errorMessage = "Unable to connect to authentication server. Please try again later";
        }

        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: errorMessage,
        });
        setErrorMessage(errorMessage);
        return;
      }

      if (result.ok) {
        await router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Login form error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px] bg-[hsl(var(--sidebar-background))]">
      <CardHeader>
        <CardDescription>Sign in to your account to continue</CardDescription>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
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
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 

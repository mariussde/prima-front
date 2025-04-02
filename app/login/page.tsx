import { LoginForm } from "./login-form"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Suspense } from "react"

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="mb-8">
        <Logo className="text-2xl" />
      </div>
      <Suspense fallback={<div className="w-[400px] h-[300px] animate-pulse bg-muted rounded-lg" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
} 

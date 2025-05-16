import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Suspense } from "react";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="mb-8">
        <Image
          src="/logo-marius.svg"
          alt="Prima Logo"
          width={400}
          height={400}
          priority
          unoptimized
        />
      </div>
      <Suspense fallback={<div className="w-[400px] h-[300px] animate-pulse bg-muted rounded-lg" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
} 

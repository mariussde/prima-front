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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center gap-1 w-full max-w-md mx-auto">
        <div className="relative w-full aspect-square max-w-[320px] md:max-w-[380px] mb-[-20px]">
          <Image
            src="/logo-marius.svg"
            alt="Prima Logo"
            fill
            priority
            unoptimized
            className="object-contain"
            style={{ margin: "0 auto" }}
          />
        </div>
        <Suspense
          fallback={
            <div className="w-full h-[300px] animate-pulse bg-muted rounded-lg" />
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
        404
      </h1>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Page Not Found
      </h2>
      <p className="max-w-[600px] text-muted-foreground">
        Sorry, we couldn't find the page you're looking for. The page might have been removed or the link might be broken.
      </p>
      <Link
        href="/"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        tabIndex={0}
        aria-label="Return to home page"
      >
        Return Home
      </Link>
    </div>
  )
} 

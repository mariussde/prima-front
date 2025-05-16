export default function DocsPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Documentation</h1>
      <p>
        Welcome to the Prima documentation. Here you'll find comprehensive guides and documentation to help you start working with Prima as quickly as possible, as well as support if you get stuck.
      </p>

      <h2>Getting Started</h2>
      <p>
        Get started with Prima by following our quick start guide. We'll help you set up your first project and get you familiar with the basics.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Quick Start</h3>
          <p className="text-sm text-muted-foreground">
            Get up and running with Prima in minutes.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Installation</h3>
          <p className="text-sm text-muted-foreground">
            Learn how to install and configure Prima.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Core Concepts</h3>
          <p className="text-sm text-muted-foreground">
            Understand the fundamental concepts of Prima.
          </p>
        </div>
      </div>
    </div>
  )
} 
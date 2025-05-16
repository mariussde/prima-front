import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Introduction - Documentation",
  description: "Welcome to our documentation. Learn about our platform and get started with your first steps.",
}

export default function IntroductionPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Introduction</h1>
      <p className="lead">
        Welcome to our comprehensive documentation. Here you'll find everything you need to know about our platform,
        from getting started to advanced features and best practices.
      </p>

      <h2>Getting Started</h2>
      <p>
        Our platform is designed to be intuitive and user-friendly. Whether you're a beginner or an experienced user,
        you'll find the tools and resources you need to succeed.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li>Intuitive user interface</li>
        <li>Powerful search capabilities</li>
        <li>Real-time collaboration</li>
        <li>Advanced customization options</li>
        <li>Comprehensive API documentation</li>
      </ul>

      <h2>Next Steps</h2>
      <p>
        Ready to dive in? Check out our quick start guide or explore the documentation sections below to learn more
        about specific features and functionality.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Quick Start Guide</h3>
          <p>Get up and running in minutes with our step-by-step guide.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">API Reference</h3>
          <p>Explore our comprehensive API documentation and examples.</p>
        </div>
      </div>
    </div>
  )
}

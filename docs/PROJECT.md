# Prima Frontend Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Core Features](#core-features)
4. [Technical Stack](#technical-stack)
5. [Project Structure](#project-structure)
6. [Authentication](#authentication)
7. [Data Management](#data-management)
8. [UI Components](#ui-components)
9. [API Integration](#api-integration)
10. [State Management](#state-management)
11. [Performance Optimization](#performance-optimization)
12. [Security](#security)
13. [Testing](#testing)
14. [Deployment](#deployment)
15. [Contributing](#contributing)
16. [Support](#support)

## Project Overview

Prima is a comprehensive dashboard application built with Next.js, providing a modern and efficient interface for managing various business entities including carriers, clients, and agents. The application is designed with scalability, performance, and user experience in mind.

### Key Features
- Complete CRUD operations for multiple entities
- Real-time data filtering and sorting
- Infinite scrolling with pagination
- Responsive design
- Role-based access control
- Advanced form validation
- Toast notifications
- Error handling
- Loading states

## Architecture

### 1. Frontend Architecture
The application follows a modern React architecture using Next.js 13+ with the App Router pattern. The architecture is designed to be:
- Component-based
- Type-safe
- Performance-optimized
- Maintainable
- Scalable

### 2. Directory Structure
```
prima-front/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── general-settings/  # Feature pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── types/                # TypeScript definitions
├── hooks/                # Custom React hooks
├── styles/               # Global styles
└── public/              # Static assets
```

### 3. Component Architecture
The application follows a hierarchical component structure:

1. **Layout Components**
   - AppLayout
   - ClientProviders
   - Navigation
   - Sidebar

2. **Feature Components**
   - Entity-specific components (Carriers, Clients, Agents)
   - Form modals
   - Data tables
   - Filter components

3. **UI Components**
   - Generic components (buttons, inputs, etc.)
   - Modal dialogs
   - Toast notifications
   - Loading states

## Technical Stack

### 1. Core Technologies
- **Framework**: Next.js 13+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod
- **API Client**: Native Fetch API
- **Authentication**: NextAuth.js

### 2. UI Libraries
- **Component Library**: Shadcn UI
- **Icons**: Lucide Icons
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Validation**: Zod

### 3. Development Tools
- **Package Manager**: npm/yarn
- **Code Quality**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript
- **Version Control**: Git

## Project Structure

### 1. App Directory (`app/`)
The app directory follows Next.js 13+ conventions with the App Router pattern:

```typescript
// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AppLayout } from "@/components/layout/app-layout"
import { Toaster } from "@/components/ui/toaster"
import { ClientProviders } from "@/components/layout/client-providers"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Prima",
    template: "%s | Prima",
  },
  description: "A comprehensive dashboard application with authentication and data management",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ClientProviders>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  )
}
```

### 2. Components Directory (`components/`)
Organized by feature and type:

```
components/
├── general-settings/     # Feature-specific components
│   ├── carriers/        # Carrier-related components
│   ├── clients/         # Client-related components
│   └── agents/          # Agent-related components
├── layout/              # Layout components
├── ui/                  # Reusable UI components
└── shared/              # Shared components
```

### 3. Types Directory (`types/`)
TypeScript definitions for the application:

```typescript
// types/table.ts
export interface TableColumn<T> {
  accessorKey: keyof T
  header: string
}

// types/carriers.ts
export interface Carrier {
  COMPID: string
  CARID: string
  CARDSC: string
  // ... additional fields
}

// types/clients.ts
export interface Client {
  COMPID: string
  CLNTID: string
  CLNTDSC: string
  // ... additional fields
}

// types/agents.ts
export interface Agent {
  COMPID: string
  AGNTID: string
  AGNTDSC: string
  // ... additional fields
}
```

### 4. API Routes (`app/api/`)
Organized by feature and following RESTful conventions:

```
api/
├── auth/                # Authentication endpoints
├── general-settings/    # Feature-specific endpoints
│   ├── carriers/       # Carrier endpoints
│   ├── clients/        # Client endpoints
│   └── agents/         # Agent endpoints
└── utils/              # API utility functions
```

## Authentication

### 1. Authentication Flow
The application uses NextAuth.js for authentication, providing:
- Session management
- Protected routes
- Role-based access control
- Secure token handling

### 2. Implementation
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 3. Protected Routes
```typescript
// Middleware for route protection
export function middleware(request: NextRequest) {
  const session = await getToken({ req: request })
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
```

## Data Management

### 1. State Management
The application uses React's built-in state management with hooks:

```typescript
// Example of state management in a feature page
const [data, setData] = useState<Entity[]>([])
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
const [page, setPage] = useState<number>(1)
const [hasMore, setHasMore] = useState<boolean>(true)
```

### 2. Data Fetching
Custom hooks for data fetching with:
- Pagination
- Infinite scrolling
- Error handling
- Loading states

```typescript
// Example of data fetching hook
const useEntityData = (entityType: string) => {
  const fetchData = useCallback(async (pageNum: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/${entityType}?page=${pageNum}`)
      const data = await response.json()
      setData(prev => pageNum === 1 ? data : [...prev, ...data])
      setHasMore(data.length === pageSize)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [entityType])
  
  return { data, isLoading, error, fetchData }
}
```

### 3. Form Management
Using React Hook Form with Zod validation:

```typescript
// Example of form setup
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    // ... default values
  }
})
```

## UI Components

### 1. Generic Table Component
A reusable table component with:
- Sorting
- Filtering
- Pagination
- Column visibility
- Row actions

```typescript
// components/ui/generic-table.tsx
export function GenericTable<T>({
  data,
  columns,
  onRowClick,
  columnVisibility,
  lastRowRef,
  isLoading,
  onFilterChange,
  columnFilters,
  onSortChange,
  hasMore,
  showActions,
  onEdit,
  onDelete,
}: GenericTableProps<T>) {
  // Implementation
}
```

### 2. Form Modal Component
Reusable modal for forms with:
- Validation
- Error handling
- Loading states
- Success notifications

```typescript
// components/ui/form-modal.tsx
export function FormModal<T>({
  open,
  onOpenChange,
  data,
  onSubmit,
  schema,
  fields,
}: FormModalProps<T>) {
  // Implementation
}
```

### 3. Toast Notifications
Using React Hot Toast for notifications:
- Success messages
- Error messages
- Loading states
- Custom durations

```typescript
// Example of toast usage
toast({
  title: "Success",
  description: "Operation completed successfully",
  duration: 3000,
})
```

## API Integration

### 1. API Routes
Next.js API routes for each feature:

```typescript
// app/api/general-settings/[entity]/route.ts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = {
      COMPID: searchParams.get('COMPID') || 'PLL',
      pageNumber: searchParams.get('pageNumber') || '1',
      pageSize: searchParams.get('pageSize') || '300',
    }
    
    return makeApiRequest(entity, 'GET', {
      params,
      errorMessage: `Failed to fetch ${entity} data`
    })
  } catch (error) {
    // Error handling
  }
}
```

### 2. API Utilities
Common utilities for API calls:

```typescript
// lib/api-utils.ts
export async function makeApiRequest(
  endpoint: string,
  method: string,
  options: {
    params?: Record<string, string>
    body?: any
    errorMessage?: string
  }
) {
  // Implementation
}
```

### 3. Error Handling
Comprehensive error handling for API calls:

```typescript
// Example of error handling
try {
  const response = await fetch(url)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'An error occurred')
  }
  return await response.json()
} catch (error) {
  // Error handling
}
```

## Development Guidelines

### 1. Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused

### 2. Component Structure
```typescript
// Example of a well-structured component
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Types
interface ComponentProps {
  // Props definition
}

// Schema
const schema = z.object({
  // Schema definition
})

// Component
export function Component({ prop1, prop2 }: ComponentProps) {
  // State
  const [state, setState] = useState()
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [])
  
  // Handlers
  const handleEvent = () => {
    // Event logic
  }
  
  // Render
  return (
    // JSX
  )
}
```

### 3. Testing
- Unit tests for components
- Integration tests for features
- E2E tests for critical paths
- Test coverage requirements

```typescript
// Example of a component test
import { render, screen, fireEvent } from '@testing-library/react'
import { Component } from './Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
  
  it('handles user interaction', () => {
    render(<Component />)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Updated Text')).toBeInTheDocument()
  })
})
```

## Performance Optimization

### 1. Code Splitting
- Dynamic imports for large components
- Route-based code splitting
- Lazy loading of non-critical components

```typescript
// Example of dynamic import
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})
```

### 2. Caching
- React Query for data caching
- SWR for real-time data
- Local storage for user preferences

```typescript
// Example of React Query usage
const { data, isLoading } = useQuery(['key'], fetchData, {
  staleTime: 5 * 60 * 1000,
  cacheTime: 30 * 60 * 1000
})
```

### 3. Image Optimization
- Next.js Image component
- Responsive images
- Lazy loading
- WebP format support

```typescript
// Example of optimized image
import Image from 'next/image'

export function OptimizedImage() {
  return (
    <Image
      src="/image.jpg"
      alt="Description"
      width={800}
      height={600}
      loading="lazy"
      quality={75}
    />
  )
}
```

## Deployment

### 1. Build Process
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

### 2. Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_AUTH_URL=https://auth.example.com
```

### 3. CI/CD Pipeline
- GitHub Actions for automation
- Automated testing
- Deployment to staging/production
- Environment-specific configurations

## Maintenance

### 1. Monitoring
- Error tracking with Sentry
- Performance monitoring
- User analytics
- Server health checks

### 2. Updates
- Regular dependency updates
- Security patches
- Feature updates
- Bug fixes

### 3. Documentation
- Keep documentation up to date
- Document new features
- Update API documentation
- Maintain changelog

## Support

### 1. Getting Help
- GitHub Issues for bug reports
- Feature requests
- Documentation updates
- Community support

### 2. Contributing
- Fork the repository
- Create a feature branch
- Submit a pull request
- Follow code style guidelines

### 3. Contact
- Project maintainers
- Technical support
- Security issues
- General inquiries

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

This documentation is maintained by the Prima Frontend Team. Last updated: [Current Date]

# Prima Frontend Project Documentation

## Overview
This document provides a comprehensive overview of the Prima Frontend project, including its architecture, technology stack, and key features.

## Technology Stack

### Frontend
- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **UI Components**: 
  - Radix UI (for accessible components)
  - Shadcn UI (built on top of Radix)
  - TailwindCSS for styling
- **State Management**: React Hooks
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: Next.js API routes
- **Authentication**: NextAuth.js with Keycloak integration

### Backend Integration
- **Authentication**: Keycloak
- **API**: Custom REST API endpoints
- **Database**: (Not directly visible in frontend code)

## Project Structure
```
prima-front/
├── app/                    # Next.js app directory (App Router)
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── public/                # Static assets
├── styles/                # Global styles
└── middleware.ts          # Authentication middleware
```

## Authentication Flow

### Keycloak Integration
1. **Configuration**:
   - Keycloak realm: Pacorini
   - Client ID: pacorini-api
   - Authentication endpoints configured in `.env`

2. **Middleware Protection**:
   - All routes except `/api/auth`, `/login`, and static assets are protected
   - Uses NextAuth.js middleware with custom authorization logic

3. **Token Management**:
   - Access tokens are managed through NextAuth.js
   - Secure storage of credentials in environment variables

## Data Flow

### API Integration
1. **Authentication**:
   - Token-based authentication with Keycloak
   - Secure storage of client credentials
   - Automatic token refresh handling

2. **Data Fetching**:
   - Protected API routes
   - Server-side data fetching with Next.js
   - Client-side data fetching with React Query (if implemented)

### URL-based Filtering and Sorting
- Implemented through Next.js dynamic routes
- Query parameters for filtering and sorting
- Server-side processing of filter/sort parameters

## Key Features

### UI Components
- Modern, accessible components using Radix UI
- Responsive design with TailwindCSS
- Dark mode support
- Form validation with Zod
- Data tables with sorting and filtering
- Toast notifications
- Modal dialogs
- Date pickers
- Custom tooltips

### State Management
- React Context for global state
- Custom hooks for reusable logic
- Form state management with React Hook Form

## Development Guidelines

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Early returns for better readability
- Tailwind classes for styling
- Descriptive naming conventions
- Accessibility-first approach

### Best Practices
- Server-side rendering where appropriate
- Protected routes with middleware
- Environment variable management
- Secure authentication flow
- Responsive design principles
- Performance optimization

## Environment Configuration
Key environment variables:
- `NEXTAUTH_URL`: Application base URL
- `KEYCLOAK_*`: Keycloak authentication configuration
- `AUTH_*`: API authentication credentials

## Security Considerations
- Protected API routes
- Secure token storage
- Environment variable protection
- CSRF protection through NextAuth.js
- Secure session management

## Performance Optimization
- Next.js App Router for optimized routing
- Server-side rendering capabilities
- Image optimization
- Code splitting
- Caching strategies

## Future Considerations
- API response caching
- Real-time updates
- Enhanced error handling
- Performance monitoring
- Automated testing 

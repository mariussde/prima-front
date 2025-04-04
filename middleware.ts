import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

// Handle URL cleaning for login page
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const token = await getToken({ req: request })
  
  // Handle login page redirects
  if (url.pathname === '/login') {
    // If user is already authenticated and tries to access login page
    if (token) {
      const callbackUrl = url.searchParams.get('callbackUrl') || '/'
      return NextResponse.redirect(new URL(callbackUrl, request.url))
    }
    return NextResponse.next()
  }
  
  // Redirect from auth/signin to login
  if (url.pathname === '/auth/signin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // For protected routes, check authentication
  const isAuthRoute = !url.pathname.startsWith('/api/auth') && 
                     !url.pathname.startsWith('/_next') && 
                     !url.pathname.startsWith('/login') &&
                     url.pathname !== '/favicon.ico' &&
                     !url.pathname.startsWith('/public');
  
  if (isAuthRoute && !token) {
    const callbackUrl = encodeURIComponent(url.pathname + url.search)
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url))
  }
  
  return NextResponse.next()
}

// Augment the middleware with NextAuth's auth check for protected routes
export const config = {
  matcher: [
    // Routes that need authentication
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
} 

import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"

// Handle URL cleaning for login page
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const token = await getToken({ req: request })
  
  // If it's a login URL with a callbackUrl parameter, clean it
  if (url.pathname === '/login' && url.searchParams.has('callbackUrl')) {
    // Remove the callback parameter
    url.searchParams.delete('callbackUrl')
    return NextResponse.redirect(new URL('/login', request.url))
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
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

// Augment the middleware with NextAuth's auth check for protected routes
export const config = {
  matcher: [
    // Routes that need URL cleaning
    "/login",
    "/auth/signin",
    
    // Routes that need authentication
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|login).*)",
  ],
} 

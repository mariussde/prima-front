import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - login (login page)
     * - Specific public root files (e.g., favicon.ico, p-icon.png, logo-marius.svg, site.webmanifest, robots.txt)
     * - Common public asset directories (e.g., /images/*, /assets/*)
     * - not-found (404 page)
     */
    "/((?!api/auth|_next/static|_next/image|login|not-found|favicon\.ico|p-icon\.png|logo-marius\.svg|site\.webmanifest|robots\.txt|images/|assets/).*)",
  ],
};
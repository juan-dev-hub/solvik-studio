import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    
    // Skip subdomain logic for NextAuth API routes, other API routes, and Next.js internal routes
    if (
      pathname.startsWith('/api/auth/') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname === '/favicon.ico'
    ) {
      return NextResponse.next();
    }

    // IMPORTANT: Allow admin routes to pass through normally
    if (pathname.startsWith('/admin')) {
      return NextResponse.next();
    }

    // IMPORTANT: Allow auth routes to pass through normally
    if (pathname.startsWith('/auth/')) {
      return NextResponse.next();
    }

    // IMPORTANT: Allow onboarding route to pass through normally
    if (pathname.startsWith('/onboarding')) {
      return NextResponse.next();
    }

    // Handle subdomain routing
    const host = req.headers.get('host');
    const url = req.nextUrl.clone();

    // Check if it's a subdomain request
    if (host && host.includes('.solvik.app') && !host.startsWith('www.')) {
      const subdomain = host.split('.')[0];
      
      // If it's the main domain, continue normally
      if (subdomain === 'solvik') {
        return NextResponse.next();
      }
      
      // Handle subdomain landing page requests
      url.pathname = `/landing/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }

    // For localhost development, only apply subdomain logic if there's actually a subdomain
    if (host && host.includes('localhost')) {
      const parts = host.split('.');
      if (parts.length > 2) {
        // This is a subdomain on localhost (e.g., test.localhost:3000)
        const subdomain = parts[0];
        url.pathname = `/landing/${subdomain}${url.pathname}`;
        return NextResponse.rewrite(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Only protect admin and onboarding routes
        if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/onboarding')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Protect admin and onboarding routes
    '/admin/:path*',
    '/onboarding/:path*',
    // Handle all other routes for subdomain logic (but skip API and static files)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
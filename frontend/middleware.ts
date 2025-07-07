import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Skip middleware for API routes, static files, and Next.js internal routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle subdomain routing for landing pages
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
}

export const config = {
  matcher: [
    // Handle all routes except API and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
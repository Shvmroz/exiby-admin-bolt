import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page and static assets
  if (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  // Check for authentication (in a real app, verify JWT token)
  const isAuthenticated = request.cookies.get('exiby_user');

  // Redirect to login if not authenticated
  if (!isAuthenticated && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users from login to dashboard
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect root to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
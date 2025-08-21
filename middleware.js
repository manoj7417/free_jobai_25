import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/auth', '/api/auth/login', '/api/auth/signup', '/api/auth/logout'];

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path =>
    pathname === path || pathname.startsWith('/api/auth/')
  );

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  // If accessing a protected route without token, redirect to auth
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If accessing auth page with valid token, redirect to homepage
  if (pathname === '/auth' && token) {
    try {
      const decoded = verifyToken(token);
      if (decoded) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Invalid token, continue to auth page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that are completely public
  const isPublicPath = 
    pathname === '/' ||
    pathname === '/login' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico');

  // Retrieve auth token from cookies
  const token = request.cookies.get('token')?.value;
  let user = null;

  if (token) {
    user = await verifyJWT(token);
  }

  // If user is logged in, redirect them away from login page to the dashboard
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If trying to access protected routes without a token, redirect to login
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');
  const isOnboardingRoute = pathname.startsWith('/onboarding');

  if ((isDashboardRoute || isAdminRoute || isOnboardingRoute) && !user) {
    const loginUrl = new URL('/login', request.url);
    // Remember the original destination
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routing check
  if (isAdminRoute && user && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Specify matching routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/onboarding',
    '/login',
  ],
};

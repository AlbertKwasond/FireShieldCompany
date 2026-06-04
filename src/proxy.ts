import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const normalizedPath = path.toLowerCase();
  const isAdminRoute = normalizedPath.startsWith('/admin');
  const isProtectedRoute = isAdminRoute && normalizedPath !== '/admin/login';
  const isLoginRoute = normalizedPath === '/admin/login';

  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie || '');

  // Redirect to login if accessing a protected route without a valid session
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }

  // Redirect to admin dashboard if accessing login while already authenticated
  if (isLoginRoute && session?.userId) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  // Maintenance Mode Check — only for public-facing pages, never for admin/api/assets
  const isPublicRoute =
    !isAdminRoute &&
    !normalizedPath.startsWith('/api') &&
    !normalizedPath.startsWith('/_next') &&
    !normalizedPath.startsWith('/maintenance') &&
    !normalizedPath.startsWith('/images') &&
    normalizedPath !== '/favicon.ico';

  if (isPublicRoute) {
    try {
      const url = new URL('/api/settings/maintenance', req.url);
      const res = await fetch(url.toString(), {
        next: { tags: ['settings'] },
        cache: 'no-store',
      });
      if (res.ok) {
        const { maintenanceMode } = await res.json();
        if (maintenanceMode) {
          return NextResponse.redirect(new URL('/maintenance', req.url));
        }
      }
    } catch (e) {
      console.error('Proxy fetch maintenance mode error:', e);
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match /admin routes for auth checks, and all public pages for maintenance
   * mode checks. Excludes _next/static, _next/image, favicon, and images.
   *
   * NOTE: Next.js Server Actions bypass this proxy entirely. The verifySession()
   * call inside each Server Action is the true authentication gate.
   */
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};

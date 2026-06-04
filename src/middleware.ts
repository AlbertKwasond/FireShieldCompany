import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith('/admin') && path !== '/admin/login';
  const isLoginRoute = path === '/admin/login';

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

  // Maintenance Mode Check
  // We only check for public routes. We skip checking for /admin, /api, /_next, /favicon.ico, /maintenance, etc.
  const isPublicRoute = !path.startsWith('/admin') && 
                        !path.startsWith('/api') && 
                        !path.startsWith('/_next') && 
                        !path.startsWith('/maintenance') &&
                        !path.startsWith('/images') &&
                        path !== '/favicon.ico';

  if (isPublicRoute) {
    try {
      const url = new URL('/api/settings/maintenance', req.url);
      // Fetch with no-store to avoid stale data if we don't have tags set up,
      // but revalidate: 60 might be safer for performance.
      const res = await fetch(url.toString(), {
        next: { tags: ['settings'] },
        cache: 'no-store'
      });
      if (res.ok) {
        const { maintenanceMode } = await res.json();
        if (maintenanceMode) {
          return NextResponse.redirect(new URL('/maintenance', req.url));
        }
      }
    } catch (e) {
      console.error("Middleware fetch maintenance mode error:", e);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};

import { auth } from '@/lib/auth/server';
import { NextRequest, NextResponse } from 'next/server';

const authMiddleware = auth.middleware({
  loginUrl: '/auth',
});

const PROTECTED_ROUTES = ['/game', '/results', '/leaderboard', '/daily', '/case-file', '/challenge'];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );
}

function addSecurePrefix(cookieHeader: string): string {
  return cookieHeader.replace(/(^|;\s*)(neon-auth\.)/g, '$1__Secure-$2');
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieHeader = request.headers.get('cookie');
  const hasNeonCookies = cookieHeader?.includes('neon-auth.');

  if (hasNeonCookies) {
    const modifiedCookie = addSecurePrefix(cookieHeader!);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('cookie', modifiedCookie);

    if (isProtectedRoute(pathname) && !request.headers.has('Next-Action')) {
      const init: RequestInit = { method: request.method, headers: requestHeaders };
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = request.body;
      }
      const modifiedRequest = new NextRequest(request.url, init as any);
      const authResult = await authMiddleware(modifiedRequest);
      if (authResult) return authResult;
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  if (isProtectedRoute(pathname) && !request.headers.has('Next-Action')) {
    return authMiddleware(request);
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

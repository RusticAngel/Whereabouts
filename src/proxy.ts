import { auth } from '@/lib/auth/server';
import { NextRequest, NextResponse } from 'next/server';

const authMiddleware = auth.middleware({
  loginUrl: '/auth',
});

const PROTECTED_ROUTES = ['/game', '/results', '/leaderboard', '/daily', '/case-file', '/challenge', '/friends'];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    route => pathname === route || pathname.startsWith(route + '/')
  );
}

function addSecurePrefix(cookieHeader: string): string {
  return cookieHeader.replace(/(^|;\s*)(neon-auth\.)/g, '$1__Secure-$2');
}

function isAuthRedirect(location: string): boolean {
  return new URL(location, 'https://placeholder.invalid').pathname.startsWith('/auth');
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
      const init = { method: request.method, headers: requestHeaders };
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        (init as { body?: BodyInit }).body = request.body as BodyInit;
      }
      const modifiedRequest = new NextRequest(request.url, init);
      const authResult = await authMiddleware(modifiedRequest);
      if (authResult) {
        const location = authResult.headers.get('Location');
        if (location && isAuthRedirect(location)) {
          const redirectUrl = new URL(location, request.url);
          if (!redirectUrl.searchParams.has('redirect')) {
            redirectUrl.searchParams.set('redirect', pathname);
            const redirect = NextResponse.redirect(redirectUrl);
            for (const cookie of authResult.headers.getSetCookie()) {
              redirect.headers.append('Set-Cookie', cookie);
            }
            return redirect;
          }
        }
        return authResult;
      }
    }

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  if (isProtectedRoute(pathname) && !request.headers.has('Next-Action')) {
    const authResult = await authMiddleware(request);
    if (authResult) {
      const location = authResult.headers.get('Location');
      if (location && isAuthRedirect(location)) {
        const redirectUrl = new URL(location, request.url);
        if (!redirectUrl.searchParams.has('redirect')) {
          redirectUrl.searchParams.set('redirect', pathname);
          const redirect = NextResponse.redirect(redirectUrl);
          for (const cookie of authResult.headers.getSetCookie()) {
            redirect.headers.append('Set-Cookie', cookie);
          }
          return redirect;
        }
      }
      return authResult;
    }
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

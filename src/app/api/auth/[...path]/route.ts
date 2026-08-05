import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/server';

const handler = auth.handler();

function isHttps(request: NextRequest): boolean {
  return (
    new URL(request.url).protocol === 'https:' ||
    request.headers.get('x-forwarded-proto') === 'https'
  );
}

async function stripSecureFromResponse(response: Response, secure: boolean): Promise<Response> {
  const setCookies = response.headers.getSetCookie();
  if (!setCookies.length) return response;

  const headers = new Headers(response.headers);
  headers.delete('Set-Cookie');
  for (const cookie of setCookies) {
    if (secure) {
      // Production HTTPS: keep __Secure- prefix + Secure flag intact.
      headers.append('Set-Cookie', cookie);
    } else {
      // Local HTTP dev (localhost / LAN): strip __Secure- prefix + Secure
      // flag so cookies are accepted over plain HTTP.
      const renamed = cookie.replace(/^__Secure-/i, '');
      const withoutSecure = renamed.replace(/\s*;\s*secure\s*(;|$)/gi, ';');
      headers.append('Set-Cookie', withoutSecure);
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function wrap(method: (...args: Parameters<typeof handler.GET>) => Promise<Response>) {
  return async (...args: Parameters<typeof handler.GET>) => {
    const [request] = args;
    const response = await method(...args);
    return stripSecureFromResponse(response, isHttps(request as NextRequest));
  };
}

export const GET = wrap(handler.GET);
export const POST = wrap(handler.POST);
export const PUT = wrap(handler.PUT);
export const DELETE = wrap(handler.DELETE);
export const PATCH = wrap(handler.PATCH);

import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/server';

const handler = auth.handler();

async function stripSecureFromResponse(response: Response, requestUrl: string): Promise<Response> {
  const url = new URL(requestUrl);
  if (url.protocol === 'https:') return response;

  const setCookies = response.headers.getSetCookie();
  if (!setCookies.length) return response;

  const headers = new Headers(response.headers);
  headers.delete('Set-Cookie');
  for (const cookie of setCookies) {
    const renamed = cookie.replace(/^__Secure-/i, '');
    const withoutSecure = renamed.replace(/\s*;\s*secure\s*(;|$)/gi, ';');
    headers.append('Set-Cookie', withoutSecure);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function wrap(method: (...args: any[]) => Promise<Response>) {
  return async (request: NextRequest, context: { params: Promise<unknown> }) => {
    const response = await method(request, context);
    return stripSecureFromResponse(response, request.url);
  };
}

export const GET = wrap(handler.GET);
export const POST = wrap(handler.POST);
export const PUT = wrap(handler.PUT);
export const DELETE = wrap(handler.DELETE);
export const PATCH = wrap(handler.PATCH);

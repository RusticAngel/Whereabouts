import { auth } from '@/lib/auth/server';
import { NextRequest } from 'next/server';

const authMiddleware = auth.middleware({
  loginUrl: '/auth',
});

export default function middleware(request: NextRequest) {
  if (request.headers.has('Next-Action')) {
    return;
  }
  return authMiddleware(request);
}

export const config = {
  matcher: ['/game/:path*', '/results/:path*', '/leaderboard', '/daily'],
};

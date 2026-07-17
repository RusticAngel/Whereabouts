import { auth } from '@/lib/auth/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: session } = await auth.getSession();
  const user = session?.user;

  return (
    <main className="flex flex-col min-h-dvh items-center justify-center p-4 sm:p-6 bg-black text-white">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">Trace</h1>
          <p className="text-gray-400 text-lg">Track Cipher across the globe</p>
        </div>

        <div className="space-y-4">
          {user ? (
            <>
              <Link
                href="/game"
                className="block w-full py-3 px-6 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors"
              >
                Play
              </Link>
              <Link
                href="/daily"
                className="block w-full py-3 px-6 rounded-lg border border-gray-700 text-white font-semibold hover:bg-gray-900 transition-colors"
              >
                Daily Challenge
              </Link>
              <Link
                href="/leaderboard"
                className="block w-full py-3 px-6 rounded-lg border border-gray-700 text-white font-semibold hover:bg-gray-900 transition-colors"
              >
                Leaderboard
              </Link>
            </>
          ) : (
            <Link
              href="/auth"
              className="block w-full py-3 px-6 rounded-lg bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors"
            >
              Sign In to Play
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

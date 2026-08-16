import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getProfileProgress } from '@/app/actions';
import { DeleteAccountButton } from '@/components/profile/DeleteAccountButton';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth');

  const progress = await getProfileProgress(session.user.id);
  if (!progress) redirect('/game');

  return (
    <main className="flex flex-col min-h-dvh bg-black text-white items-center p-6 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            &larr; Home
          </Link>
          <h1 className="text-lg font-semibold">Agent Profile</h1>
          <div className="w-10" />
        </div>

        <div className="text-center space-y-1">
          <div className="text-2xl font-bold">{progress.username ?? 'Anonymous'}</div>
          <div className="text-yellow-400 text-lg font-semibold">{progress.title}</div>
          <div className="text-gray-400 text-sm font-mono">Level {progress.level}</div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">XP</span>
            <span className="text-yellow-400 font-mono">
              {progress.xp} / {progress.nextLevelAt}
            </span>
          </div>
          <div className="h-4 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${progress.progress100}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-500 mt-1 font-mono">
            {progress.progress100}% to next rank
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">🔥 {progress.streak}</div>
            <div className="text-xs text-gray-400 mt-1">Day streak</div>
          </div>
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">#{progress.currentLevel}</div>
            <div className="text-xs text-gray-400 mt-1">Current case</div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Badges ({progress.badges.length})
          </h2>
          {progress.badges.length === 0 ? (
            <p className="text-gray-500 text-sm">No badges earned yet. Keep investigating!</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {progress.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="rounded-xl bg-gray-900 border border-gray-800 p-3 text-center"
                  title={badge.desc}
                >
                  <div className="text-3xl">{badge.icon}</div>
                  <div className="text-xs text-white mt-1 font-medium leading-tight">{badge.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DeleteAccountButton />
      </div>
    </main>
  );
}
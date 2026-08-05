import { auth } from '@/lib/auth/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile } from '@/app/actions';
import { FriendActions } from '@/components/friends/FriendActions';

export const dynamic = 'force-dynamic';

function formatStatus(lastActiveAt: Date | null): { label: string; online: boolean } {
  if (!lastActiveAt) return { label: 'Offline', online: false };

  const diffMs = Date.now() - new Date(lastActiveAt).getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins < 5) return { label: 'Online', online: true };

  const hours = Math.floor(mins / 60);
  if (hours < 24) return { label: `${hours}h ago`, online: false };

  const days = Math.floor(hours / 24);
  if (days < 7) return { label: `${days}d ago`, online: false };

  return { label: 'Offline', online: false };
}

export default async function FriendProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth');

  const profile = await getUserProfile(userId);
  if (!profile) notFound();

  const status = formatStatus(profile.lastActiveAt);

  return (
    <main className="flex flex-col min-h-dvh bg-black text-white items-center p-6 animate-fade-in">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/friends" className="text-sm text-gray-400 hover:text-white transition-colors">
            &larr; Friends
          </Link>
          <h1 className="text-lg font-semibold truncate max-w-[14rem]">{profile.username}</h1>
          <div className="w-10" />
        </div>

        <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div>
              <div className="text-xl font-bold">{profile.username}</div>
              <div className="text-sm text-yellow-400">{profile.title}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status.online ? 'bg-green-500' : 'bg-gray-600'}`} />
            <span className={`text-xs ${status.online ? 'text-green-400' : 'text-gray-500'}`}>
              {status.online ? 'Online' : status.label} · Level {profile.level}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{profile.bestScore.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Best score</div>
            </div>
            <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{profile.gamesPlayed}</div>
              <div className="text-xs text-gray-400 mt-1">Games played</div>
            </div>
          </div>
        </div>

        <FriendActions friendId={userId} friendName={profile.username} />
      </div>
    </main>
  );
}
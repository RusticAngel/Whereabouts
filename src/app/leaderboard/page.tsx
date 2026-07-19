import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { syncProfileUsername } from '@/app/actions';
import { LeaderboardClient } from './LeaderboardClient';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth');

  await syncProfileUsername(session.user.id);

  return <LeaderboardClient userId={session.user.id} />;
}

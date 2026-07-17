import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/server';
import { getCampaignScores, getProfile } from '@/app/actions';
import { CaseFileClient } from './CaseFileClient';

export const dynamic = 'force-dynamic';

export default async function CaseFilePage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth');

  const [entries, profile] = await Promise.all([
    getCampaignScores(session.user.id),
    getProfile(session.user.id),
  ]);

  return (
    <div className="min-h-dvh bg-black text-white p-4">
      <div className="max-w-lg mx-auto">
        <CaseFileClient
          entries={entries}
          currentLevel={profile?.currentLevel ?? 1}
        />
      </div>
    </div>
  );
}

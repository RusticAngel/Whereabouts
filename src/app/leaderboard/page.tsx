import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { dailyScores, profiles } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';

export const dynamic = 'force-dynamic';

function getTodayDate() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export default async function LeaderboardPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth');

  const today = getTodayDate();

  const results = await db
    .select({
      username: profiles.username,
      score: dailyScores.totalScore,
      userId: dailyScores.userId,
    })
    .from(dailyScores)
    .innerJoin(profiles, eq(dailyScores.userId, profiles.id))
    .where(eq(dailyScores.date, today))
    .orderBy(sql`${dailyScores.totalScore} DESC`)
    .limit(50);

  const entries = results.map((r, i) => ({
    rank: i + 1,
    username: r.username ?? 'Anonymous',
    score: r.score,
    isCurrentUser: r.userId === session.user.id,
  }));

  const currentUserScore = results.find((r) => r.userId === session.user.id)?.score ?? undefined;

  return (
    <div className="flex flex-col min-h-dvh bg-black text-white">
      <div className="p-4 max-w-lg mx-auto w-full flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-gray-500">{today}</p>
        </div>
        <LeaderboardTable entries={entries} currentUserScore={currentUserScore} />
      </div>
    </div>
  );
}

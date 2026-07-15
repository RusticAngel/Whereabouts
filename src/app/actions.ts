'use server';

import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { images, rounds, dailyScores, profiles } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';

export async function getRandomImage() {
  const [image] = await db
    .select()
    .from(images)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!image) return null;

  return {
    id: image.id,
    image_url: image.imageUrl,
    steps: image.steps as unknown as any[],
    clues: image.clues as unknown as any[],
  };
}

export async function saveRound(
  userId: string,
  imageId: string,
  stepReached: number,
  totalScore: number,
  completed: boolean
): Promise<string | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  const [round] = await db
    .insert(rounds)
    .values({
      userId,
      imageId,
      stepReached,
      totalScore,
      completed,
    })
    .returning({ id: rounds.id });

  return round?.id ?? null;
}

export async function getRound(roundId: string) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  const [round] = await db
    .select({
      total_score: rounds.totalScore,
      step_reached: rounds.stepReached,
      image_data: images,
    })
    .from(rounds)
    .innerJoin(images, eq(rounds.imageId, images.id))
    .where(eq(rounds.id, roundId));

  return round ?? null;
}

export async function getRoundScores(): Promise<number[]> {
  const scores = await db
    .select({ score: rounds.totalScore })
    .from(rounds)
    .where(eq(rounds.completed, true));

  return scores.map((s) => s.score);
}

export async function getDailyLeaderboard(date: string) {
  const results = await db
    .select({
      username: profiles.username,
      score: dailyScores.totalScore,
    })
    .from(dailyScores)
    .innerJoin(profiles, eq(dailyScores.userId, profiles.id))
    .where(eq(dailyScores.date, date))
    .orderBy(sql`${dailyScores.totalScore} DESC`);

  return results as { username: string; score: number }[];
}

export async function getTodayDailyScore(userId: string, date: string): Promise<number | null> {
  const [score] = await db
    .select({ totalScore: dailyScores.totalScore })
    .from(dailyScores)
    .where(and(eq(dailyScores.userId, userId), eq(dailyScores.date, date)))
    .limit(1);

  return score?.totalScore ?? null;
}

export async function upsertDailyScore(userId: string, date: string, totalScore: number) {
  await db
    .insert(dailyScores)
    .values({ userId, date, totalScore })
    .onConflictDoUpdate({
      target: [dailyScores.userId, dailyScores.date],
      set: { totalScore: sql`GREATEST(${dailyScores.totalScore}, ${totalScore})` },
    });
}

export async function getCurrentUser() {
  const { data: session } = await auth.getSession();
  return session?.user ?? null;
}

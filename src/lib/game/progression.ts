import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

const TOTAL_LEVELS = 28;

export async function getCurrentLevel(userId: string): Promise<number> {
  const [profile] = await db
    .select({ currentLevel: profiles.currentLevel })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  return profile?.currentLevel ?? 1;
}

export async function advanceLevel(userId: string): Promise<number> {
  const current = await getCurrentLevel(userId);
  const next = Math.min(current + 1, TOTAL_LEVELS);

  await db
    .update(profiles)
    .set({ currentLevel: next })
    .where(eq(profiles.id, userId));

  return next;
}

export async function getMaxLevel(): Promise<number> {
  return TOTAL_LEVELS;
}

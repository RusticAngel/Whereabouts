'use server';

import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { images, rounds, dailyScores, profiles } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { LocationData, EvidenceItem, CaseFileEntry } from '@/types';
import { getMaxLevel } from '@/lib/game/progression';

export async function getLocationForLevel(level: number): Promise<LocationData | null> {
  const [image] = await db
    .select()
    .from(images)
    .where(and(eq(images.provider, 'mapillary'), eq(images.levelOrder, level)))
    .limit(1);

  if (!image) return null;

  return {
    id: image.id,
    image_url: image.imageUrl,
    lat: image.lat ?? null,
    lng: image.lng ?? null,
    briefing: image.briefing ?? '',
    evidence: (image.evidence ?? []) as EvidenceItem[],
    level_order: image.levelOrder ?? 1,
    provider: image.provider ?? 'mapillary',
    mapillary_id: image.mapillaryId ?? null,
  };
}

export async function saveRound(
  userId: string,
  imageId: string,
  level: number,
  totalScore: number,
  completed: boolean,
  pinData?: {
    pinGuessLat: string;
    pinGuessLng: string;
    pinScore: number;
    evidenceRevealed: number;
    confidence: string;
    distanceKm: number;
  }
): Promise<string | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  const [round] = await db
    .insert(rounds)
    .values({
      userId,
      imageId,
      level,
      totalScore,
      completed,
      pinGuessLat: pinData?.pinGuessLat ?? null,
      pinGuessLng: pinData?.pinGuessLng ?? null,
      pinScore: pinData?.pinScore ?? null,
      evidenceRevealed: pinData?.evidenceRevealed ?? 0,
      confidence: pinData?.confidence ?? 'low',
      distanceKm: pinData?.distanceKm ?? null,
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
      level: rounds.level,
      pin_guess_lat: rounds.pinGuessLat,
      pin_guess_lng: rounds.pinGuessLng,
      pin_score: rounds.pinScore,
      evidence_revealed: rounds.evidenceRevealed,
      confidence: rounds.confidence,
      distance_km: rounds.distanceKm,
      image_data: images,
    })
    .from(rounds)
    .innerJoin(images, eq(rounds.imageId, images.id))
    .where(eq(rounds.id, roundId));

  return round ?? null;
}

export async function getProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  return profile ?? null;
}

export async function getCampaignScores(userId: string): Promise<CaseFileEntry[]> {
  const rows = await db
    .select({
      level: rounds.level,
      totalScore: rounds.totalScore,
      completed: rounds.completed,
    })
    .from(rounds)
    .where(eq(rounds.userId, userId));

  const bestPerLevel = new Map<number, CaseFileEntry>();

  for (const row of rows) {
    const existing = bestPerLevel.get(row.level ?? 0);
    if (!existing || row.totalScore > existing.bestScore) {
      bestPerLevel.set(row.level ?? 0, {
        level: row.level ?? 0,
        bestScore: row.totalScore,
        completed: row.completed,
      });
    }
  }

  return Array.from(bestPerLevel.values()).sort((a, b) => a.level - b.level);
}

export async function advanceLevel(userId: string): Promise<number> {
  const maxLevel = await getMaxLevel();

  const [result] = await db
    .insert(profiles)
    .values({ id: userId, currentLevel: 2 })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { currentLevel: sql`LEAST(${profiles.currentLevel} + 1, ${maxLevel})` },
    })
    .returning({ currentLevel: profiles.currentLevel });

  return result?.currentLevel ?? 2;
}

export async function getLeaderboardCampaign() {
  const results = await db
    .select({
      username: profiles.username,
      userId: rounds.userId,
      totalScore: rounds.totalScore,
      level: rounds.level,
    })
    .from(rounds)
    .innerJoin(profiles, eq(rounds.userId, profiles.id));

  const bestPerUserLevel = new Map<string, Map<number, number>>();

  for (const row of results) {
    if (!row.username) continue;
    if (!bestPerUserLevel.has(row.userId)) {
      bestPerUserLevel.set(row.userId, new Map());
    }
    const userLevels = bestPerUserLevel.get(row.userId)!;
    const existing = userLevels.get(row.level ?? 0) ?? 0;
    if (row.totalScore > existing) {
      userLevels.set(row.level ?? 0, row.totalScore);
    }
  }

  const campaignTotals: { username: string; totalScore: number }[] = [];

  for (const [userId, levels] of bestPerUserLevel) {
    let total = 0;
    for (const score of levels.values()) {
      total += score;
    }
    const username = results.find((r) => r.userId === userId)?.username ?? 'Unknown';
    campaignTotals.push({ username, totalScore: total });
  }

  return campaignTotals.sort((a, b) => b.totalScore - a.totalScore);
}

export async function getLeaderboardLevel(level: number) {
  const results = await db
    .select({
      username: profiles.username,
      totalScore: rounds.totalScore,
    })
    .from(rounds)
    .innerJoin(profiles, eq(rounds.userId, profiles.id))
    .where(eq(rounds.level, level))
    .orderBy(sql`${rounds.totalScore} DESC`);

  const bestPerUser = new Map<string, { username: string; totalScore: number }>();

  for (const row of results) {
    if (!row.username) continue;
    const existing = bestPerUser.get(row.username);
    if (!existing || row.totalScore > existing.totalScore) {
      bestPerUser.set(row.username, { username: row.username, totalScore: row.totalScore });
    }
  }

  return Array.from(bestPerUser.values()).sort((a, b) => b.totalScore - a.totalScore);
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

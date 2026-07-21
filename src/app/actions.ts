'use server';

import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { images, rounds, dailyScores, profiles, challenges, challengeResults } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { LocationData, EvidenceItem, CaseFileEntry, ChallengeData, ChallengeResultData, RelativeResult } from '@/types';
import { getMaxLevel } from '@/lib/game/progression';
import { generateCaseSeed, getImageIndexFromSeed } from '@/lib/game/caseGenerator';

export async function getLocationForLevel(level: number): Promise<LocationData | null> {
  const [image] = await db
    .select()
    .from(images)
    .where(and(eq(images.provider, 'mapillary'), eq(images.isPano, true), eq(images.levelOrder, level)))
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

  const { data: session } = await auth.getSession();
  const userName = session?.user?.name ?? null;

  const [result] = await db
    .insert(profiles)
    .values({ id: userId, currentLevel: 2, username: userName })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        currentLevel: sql`LEAST(${profiles.currentLevel} + 1, ${maxLevel})`,
        username: sql`COALESCE(${profiles.username}, ${userName})`,
      },
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
    if (!bestPerUserLevel.has(row.userId)) {
      bestPerUserLevel.set(row.userId, new Map());
    }
    const userLevels = bestPerUserLevel.get(row.userId)!;
    const existing = userLevels.get(row.level ?? 0) ?? 0;
    if (row.totalScore > existing) {
      userLevels.set(row.level ?? 0, row.totalScore);
    }
  }

  const campaignTotals: { userId: string; username: string; totalScore: number }[] = [];

  for (const [userId, levels] of bestPerUserLevel) {
    let total = 0;
    for (const score of levels.values()) {
      total += score;
    }
    const username = results.find((r) => r.userId === userId)?.username ?? 'Anonymous';
    campaignTotals.push({ userId, username, totalScore: total });
  }

  return campaignTotals.sort((a, b) => b.totalScore - a.totalScore);
}

export async function getLeaderboardLevel(level: number) {
  const results = await db
    .select({
      username: profiles.username,
      userId: rounds.userId,
      totalScore: rounds.totalScore,
    })
    .from(rounds)
    .innerJoin(profiles, eq(rounds.userId, profiles.id))
    .where(eq(rounds.level, level))
    .orderBy(sql`${rounds.totalScore} DESC`);

  const bestPerUser = new Map<string, { userId: string; username: string; totalScore: number }>();

  for (const row of results) {
    const existing = bestPerUser.get(row.userId);
    if (!existing || row.totalScore > existing.totalScore) {
      bestPerUser.set(row.userId, { userId: row.userId, username: row.username ?? 'Anonymous', totalScore: row.totalScore });
    }
  }

  return Array.from(bestPerUser.values()).sort((a, b) => b.totalScore - a.totalScore);
}

export async function getDailyLeaderboard(date: string) {
  const results = await db
    .select({
      username: profiles.username,
      userId: dailyScores.userId,
      score: dailyScores.totalScore,
    })
    .from(dailyScores)
    .innerJoin(profiles, eq(dailyScores.userId, profiles.id))
    .where(eq(dailyScores.date, date))
    .orderBy(sql`${dailyScores.totalScore} DESC`);

  return results as unknown as { username: string; score: number; userId: string }[];
}

export async function getTodayDailyScore(userId: string, date: string): Promise<number | null> {
  const [score] = await db
    .select({ totalScore: dailyScores.totalScore })
    .from(dailyScores)
    .where(and(eq(dailyScores.userId, userId), eq(dailyScores.date, date)))
    .limit(1);

  return score?.totalScore ?? null;
}

export async function updateNickname(userId: string, nickname: string) {
  const trimmed = nickname.trim();
  if (!trimmed || trimmed.length > 30) return;

  await db
    .update(profiles)
    .set({ username: trimmed })
    .where(eq(profiles.id, userId));
}

export async function createChallenge(): Promise<string | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  const allImages = await db
    .select({ id: images.id })
    .from(images)
    .where(and(eq(images.provider, 'mapillary'), eq(images.isPano, true)));

  if (allImages.length === 0) return null;

  const seed = generateCaseSeed();
  const index = getImageIndexFromSeed(seed, allImages.length);
  const imageId = allImages[index].id;

  const [challenge] = await db
    .insert(challenges)
    .values({ seed, imageId, createdBy: session.user.id })
    .returning({ id: challenges.id });

  return challenge?.id ?? null;
}

export async function getChallenge(challengeId: string): Promise<ChallengeData | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  const [challenge] = await db
    .select({
      id: challenges.id,
      seed: challenges.seed,
      imageId: challenges.imageId,
      createdBy: challenges.createdBy,
      creatorUsername: profiles.username,
      playsCount: challenges.playsCount,
      rematchOf: challenges.rematchOf,
    })
    .from(challenges)
    .innerJoin(profiles, eq(challenges.createdBy, profiles.id))
    .where(eq(challenges.id, challengeId))
    .limit(1);

  if (!challenge) return null;

  const rows = await db
    .select({
      id: challengeResults.id,
      challengeId: challengeResults.challengeId,
      userId: challengeResults.userId,
      username: profiles.username,
      score: challengeResults.score,
      distanceKm: challengeResults.distanceKm,
      timeSeconds: challengeResults.timeSeconds,
      evidenceRevealed: challengeResults.evidenceRevealed,
      confidence: challengeResults.confidence,
    })
    .from(challengeResults)
    .innerJoin(profiles, eq(challengeResults.userId, profiles.id))
    .where(eq(challengeResults.challengeId, challengeId))
    .orderBy(sql`${challengeResults.score} DESC, ${challengeResults.distanceKm} ASC, ${challengeResults.timeSeconds} ASC NULLS LAST`);

  const results: ChallengeResultData[] = rows.map((r) => ({
    id: r.id,
    challengeId: r.challengeId,
    userId: r.userId,
    username: r.username ?? 'Anonymous',
    score: r.score,
    distanceKm: r.distanceKm,
    timeSeconds: r.timeSeconds ?? undefined,
    evidenceRevealed: r.evidenceRevealed,
    confidence: r.confidence,
  }));

  return {
    id: challenge.id,
    seed: challenge.seed,
    imageId: challenge.imageId,
    createdBy: challenge.createdBy,
    creatorUsername: challenge.creatorUsername ?? 'Anonymous',
    playsCount: challenge.playsCount,
    rematchOf: challenge.rematchOf,
    results,
  };
}

export async function saveChallengeResult(
  challengeId: string,
  userId: string,
  data: {
    score: number;
    distanceKm: number;
    timeSeconds?: number;
    evidenceRevealed: number;
    confidence: string;
  }
): Promise<void> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return;

  const [existing] = await db
    .select({ id: challengeResults.id })
    .from(challengeResults)
    .where(and(eq(challengeResults.challengeId, challengeId), eq(challengeResults.userId, userId)))
    .limit(1);

  if (!existing) {
    await db
      .update(challenges)
      .set({ playsCount: sql`${challenges.playsCount} + 1` })
      .where(eq(challenges.id, challengeId));
  }

  await db
    .insert(challengeResults)
    .values({
      challengeId,
      userId,
      score: data.score,
      distanceKm: data.distanceKm,
      timeSeconds: data.timeSeconds ?? null,
      evidenceRevealed: data.evidenceRevealed,
      confidence: data.confidence,
    })
    .onConflictDoUpdate({
      target: [challengeResults.challengeId, challengeResults.userId],
      set: {
        score: sql`GREATEST(${challengeResults.score}, ${data.score})`,
        distanceKm: data.distanceKm,
        timeSeconds: data.timeSeconds ?? null,
        evidenceRevealed: data.evidenceRevealed,
        confidence: data.confidence,
      },
    });
}

export async function upsertDailyScore(userId: string, date: string, totalScore: number, timeSeconds?: number, distanceKm?: number) {
  const { data: session } = await auth.getSession();
  if (!session?.user) return;

  await db
    .insert(dailyScores)
    .values({ userId, date, totalScore, timeSeconds, distanceKm })
    .onConflictDoUpdate({
      target: [dailyScores.userId, dailyScores.date],
      set: {
        totalScore: sql`GREATEST(${dailyScores.totalScore}, ${totalScore})`,
        timeSeconds: sql`COALESCE(${dailyScores.timeSeconds}, ${timeSeconds ?? null})`,
        distanceKm: sql`COALESCE(${dailyScores.distanceKm}, ${distanceKm ?? null})`,
      },
    });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const [current] = await db
    .select({ lastDailyDate: profiles.lastDailyDate, dailyStreak: profiles.dailyStreak })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!current) {
    await db.insert(profiles).values({ id: userId, dailyStreak: 1, lastDailyDate: date });
    return;
  }

  let newStreak = 1;
  if (current.lastDailyDate === yesterdayStr) {
    newStreak = (current.dailyStreak ?? 0) + 1;
  } else if (current.lastDailyDate === date) {
    newStreak = current.dailyStreak ?? 0;
  }

  const cappedStreak = Math.min(newStreak, 5);
  await db
    .update(profiles)
    .set({ dailyStreak: cappedStreak, lastDailyDate: date })
    .where(eq(profiles.id, userId));
}

export async function getProfileStreak(userId: string): Promise<{ streak: number; lastDate: string | null }> {
  const [profile] = await db
    .select({ dailyStreak: profiles.dailyStreak, lastDailyDate: profiles.lastDailyDate })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  return {
    streak: profile?.dailyStreak ?? 0,
    lastDate: profile?.lastDailyDate ?? null,
  };
}

export async function getTodayChallengeResult(challengeId: string, userId: string): Promise<number | null> {
  const [result] = await db
    .select({ score: challengeResults.score })
    .from(challengeResults)
    .where(and(eq(challengeResults.challengeId, challengeId), eq(challengeResults.userId, userId)))
    .limit(1);

  return result?.score ?? null;
}

export async function createRematchChallenge(originalChallengeId: string, userId: string): Promise<string | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  const [original] = await db
    .select({ seed: challenges.seed })
    .from(challenges)
    .where(eq(challenges.id, originalChallengeId))
    .limit(1);

  if (!original) return null;

  const allImages = await db
    .select({ id: images.id })
    .from(images)
    .where(and(eq(images.provider, 'mapillary'), eq(images.isPano, true)));

  if (allImages.length === 0) return null;

  const seed = generateCaseSeed();
  const index = getImageIndexFromSeed(seed, allImages.length);
  const imageId = allImages[index].id;

  const [challenge] = await db
    .insert(challenges)
    .values({ seed, imageId, createdBy: userId, rematchOf: originalChallengeId })
    .returning({ id: challenges.id });

  return challenge?.id ?? null;
}

export async function getFocusedLeaderboard(
  challengeId: string,
  currentUserId: string
): Promise<{
  above: ChallengeResultData | null;
  current: ChallengeResultData | null;
  below: ChallengeResultData | null;
  allResults: ChallengeResultData[];
}> {
  const results = await db
    .select({
      id: challengeResults.id,
      challengeId: challengeResults.challengeId,
      userId: challengeResults.userId,
      username: profiles.username,
      score: challengeResults.score,
      distanceKm: challengeResults.distanceKm,
      evidenceRevealed: challengeResults.evidenceRevealed,
      confidence: challengeResults.confidence,
    })
    .from(challengeResults)
    .innerJoin(profiles, eq(challengeResults.userId, profiles.id))
    .where(eq(challengeResults.challengeId, challengeId))
    .orderBy(sql`${challengeResults.score} DESC, ${challengeResults.distanceKm} ASC, ${challengeResults.timeSeconds} ASC NULLS LAST`);

  const mapped: ChallengeResultData[] = results.map((r) => ({
    id: r.id,
    challengeId: r.challengeId,
    userId: r.userId,
    username: r.username ?? 'Anonymous',
    score: r.score,
    distanceKm: r.distanceKm,
    evidenceRevealed: r.evidenceRevealed,
    confidence: r.confidence,
  }));

  const idx = mapped.findIndex((r) => r.userId === currentUserId);

  if (idx === -1) return { above: null, current: null, below: null, allResults: mapped };

  return {
    above: idx > 0 ? mapped[idx - 1] : null,
    current: mapped[idx],
    below: idx < mapped.length - 1 ? mapped[idx + 1] : null,
    allResults: mapped,
  };
}

'use server';

import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { images, rounds, dailyScores, profiles, challenges, challengeResults, badges, friends, friendRequests } from '@/db/schema';
import { eq, sql, and, or, lte, ilike } from 'drizzle-orm';
import { LocationData, EvidenceItem, CaseFileEntry, ChallengeData, ChallengeResultData } from '@/types';
import { getMaxLevel } from '@/lib/game/progression';
import { generateCaseSeed, getImageIndexFromSeed } from '@/lib/game/caseGenerator';
import { getCluesForImage, DynamicClue } from '@/lib/game/dynamicClues';
import { computeLevel, titleForLevel, levelProgress, badgeById, STREAK_REWARDS, XP, BadgeDef } from '@/lib/game/progressionRewards';

export async function getDynamicClues(imageId: string): Promise<DynamicClue[]> {
  try {
    const clues = await getCluesForImage(imageId);
    return clues;
  } catch {
    return [];
  }
}

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
    city_name: image.cityName ?? null,
    country_name: image.countryName ?? null,
    landmark_name: image.landmarkName ?? null,
    fun_fact: image.funFact ?? null,
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
        currentLevel: sql`LEAST(${profiles.currentLevel} + 1, ${maxLevel} + 1)`,
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

  await db
    .insert(profiles)
    .values({ id: userId, username: session.user.name ?? null })
    .onConflictDoNothing({ target: profiles.id });

  await db
    .update(profiles)
    .set({ lastActiveAt: new Date() })
    .where(eq(profiles.id, userId));

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
    await db.insert(profiles).values({ id: userId, dailyStreak: 1, lastDailyDate: date, lastActiveAt: new Date() });
    return;
  }

  let newStreak = 1;
  if (current.lastDailyDate === yesterdayStr) {
    newStreak = (current.dailyStreak ?? 0) + 1;
  } else if (current.lastDailyDate === date) {
    newStreak = current.dailyStreak ?? 0;
  }

  const cappedStreak = Math.max(1, newStreak);
  await db
    .update(profiles)
    .set({ dailyStreak: cappedStreak, lastDailyDate: date, lastActiveAt: new Date() })
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

export async function getDailyChallengeStatus(userId: string) {
  const [profile] = await db
    .select({ xp: profiles.xp })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  const friendRows = await db
    .select({ id: friends.id })
    .from(friends)
    .where(or(eq(friends.userId, userId), eq(friends.friendUserId, userId)));

  const xp = profile?.xp ?? 0;
  const friendCount = friendRows.length;

  const xpUnlocked = xp >= 100;
  const friendsUnlocked = friendCount >= 3;

  return {
    unlocked: xpUnlocked || friendsUnlocked,
    xp,
    xpNeeded: Math.max(0, 100 - xp),
    friends: friendCount,
    friendsNeeded: Math.max(0, 3 - friendCount),
  };
}

export async function updateUserXP(
  userId: string,
  earnedXP: number
): Promise<{ xp: number; level: number; title: string; leveledUp: boolean }> {
  const [profile] = await db
    .select({ xp: profiles.xp })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  const oldXp = profile?.xp ?? 0;
  const newXp = oldXp + Math.max(0, earnedXP);
  const newLevel = computeLevel(newXp);
  const newTitle = titleForLevel(newLevel);
  const oldLevel = computeLevel(oldXp);

  await db
    .insert(profiles)
    .values({ id: userId, xp: newXp, level: newLevel, title: newTitle, lastActiveAt: new Date() })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { xp: newXp, level: newLevel, title: newTitle, lastActiveAt: new Date() },
    });

  return { xp: newXp, level: newLevel, title: newTitle, leveledUp: newLevel > oldLevel };
}

export async function checkAndAwardBadges(userId: string): Promise<BadgeDef[]> {
  const [profile] = await db
    .select({ dailyStreak: profiles.dailyStreak })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  const [played] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(rounds)
    .where(and(eq(rounds.userId, userId), eq(rounds.completed, true)));

  const [perfects] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(rounds)
    .where(and(eq(rounds.userId, userId), eq(rounds.pinScore, 5000)));

  const closeRows = await db
    .select({ id: rounds.id })
    .from(rounds)
    .where(and(eq(rounds.userId, userId), lte(rounds.distanceKm, 1)));

  const dailyRows = await db
    .select({ date: dailyScores.date })
    .from(dailyScores)
    .where(eq(dailyScores.userId, userId));

  const friendRows = await db
    .select({ id: friends.id })
    .from(friends)
    .where(or(eq(friends.userId, userId), eq(friends.friendUserId, userId)));

  const gamesPlayed = played?.count ?? 0;
  const perfectScores = perfects?.count ?? 0;
  const hasCloseCall = closeRows.length > 0;
  const distinctDailyCount = new Set(dailyRows.map((r) => r.date)).size;
  const friendCount = friendRows.length;
  const streak = profile?.dailyStreak ?? 0;

  const earned: string[] = [];
  if (gamesPlayed >= 1) earned.push('first_steps');
  if (gamesPlayed >= 10) earned.push('explorer');
  if (gamesPlayed >= 50) earned.push('adventurer');
  if (gamesPlayed >= 100) earned.push('cartographer');
  if (perfectScores >= 1) earned.push('perfect_score');
  if (perfectScores >= 3) earned.push('sharpshooter');
  if (hasCloseCall) earned.push('close_call');
  if (streak >= 3) earned.push('streak_starter');
  if (streak >= 7) earned.push('streak_committed');
  if (streak >= 30) earned.push('streak_master');
  if (streak >= 60) earned.push('streak_addict');
  if (streak >= 90) earned.push('streak_legend');
  if (streak >= 365) earned.push('streak_immortal');
  if (distinctDailyCount >= 7) earned.push('daily_dedication');
  if (friendCount >= 10) earned.push('social_butterfly');

  if (earned.length === 0) return [];

  const inserted = await db
    .insert(badges)
    .values(earned.map((badgeId) => ({ userId, badgeId })))
    .onConflictDoNothing({ target: [badges.userId, badges.badgeId] })
    .returning({ badgeId: badges.badgeId });

  const newlyEarned: BadgeDef[] = [];
  for (const row of inserted) {
    const def = badgeById(row.badgeId);
    if (def) newlyEarned.push(def);
  }
  return newlyEarned;
}

export interface GameRewards {
  xpGained: number;
  leveledUp: boolean;
  newLevel: number;
  newTitle: string;
  badges: BadgeDef[];
  streak: number;
  streakMilestone: (typeof STREAK_REWARDS)[number] | null;
  perfect: boolean;
}

export async function awardGameRewards(roundId: string): Promise<GameRewards | null> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  const [round] = await db
    .select()
    .from(rounds)
    .where(eq(rounds.id, roundId))
    .limit(1);

  if (!round) return null;

  const userId = session.user.id;
  const distanceKm = round.distanceKm ?? 0;
  const pinScore = round.pinScore ?? 0;
  const perfect = pinScore === 5000;
  const isDaily = (round.level ?? 0) === 0;

  const [profile] = await db
    .select({ dailyStreak: profiles.dailyStreak })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  const streak = profile?.dailyStreak ?? 0;
  const streakMilestone: (typeof STREAK_REWARDS)[number] | null =
    STREAK_REWARDS.find((r) => r.days === streak) ?? null;

  let earned = XP.PLAY;
  if (distanceKm > 10 && distanceKm <= 100) earned += XP.ACCURATE_100;
  if (distanceKm <= 10) earned += XP.ACCURATE_10;
  if (perfect) earned += XP.PERFECT;
  if (isDaily) earned += XP.DAILY;
  if (streakMilestone?.xp) earned += streakMilestone.xp;

  const xpResult = await updateUserXP(userId, earned);
  const badgesGained = await checkAndAwardBadges(userId);

  return {
    xpGained: earned,
    leveledUp: xpResult.leveledUp,
    newLevel: xpResult.level,
    newTitle: xpResult.title,
    badges: badgesGained,
    streak,
    streakMilestone,
    perfect,
  };
}

export async function getProfileProgress(userId: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!profile) return null;

  const xp = profile.xp ?? 0;
  const progress = levelProgress(xp);

  const badgeRows = await db
    .select({ badgeId: badges.badgeId })
    .from(badges)
    .where(eq(badges.userId, userId));

  const badgeList = badgeRows
    .map((r) => badgeById(r.badgeId))
    .filter((b): b is BadgeDef => Boolean(b));

  return {
    username: profile.username,
    xp,
    level: profile.level ?? progress.level,
    title: profile.title ?? titleForLevel(progress.level),
    progress100: progress.progress100,
    nextLevelAt: progress.currentCeil,
    streak: profile.dailyStreak ?? 0,
    currentLevel: profile.currentLevel ?? 1,
    badges: badgeList,
  };
}

export interface FriendSearchResult {
  id: string;
  username: string;
  level: number;
  title: string;
}

export async function searchUsers(query: string): Promise<FriendSearchResult[]> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return [];

  const q = query.trim();
  if (q.length < 3) return [];

  const friendRows = await db
    .select({ userId: friends.userId, friendUserId: friends.friendUserId })
    .from(friends)
    .where(or(eq(friends.userId, session.user.id), eq(friends.friendUserId, session.user.id)));

  const excluded = new Set<string>([session.user.id]);
  for (const f of friendRows) {
    excluded.add(f.userId);
    excluded.add(f.friendUserId);
  }

  const rows = await db
    .select({ id: profiles.id, username: profiles.username, level: profiles.level, title: profiles.title })
    .from(profiles)
    .where(ilike(profiles.username, `%${q}%`))
    .limit(20);

  return rows
    .filter((r) => r.username && !excluded.has(r.id))
    .map((r) => ({
      id: r.id,
      username: r.username as string,
      level: r.level ?? 1,
      title: r.title ?? 'Rookie Agent',
    }));
}

export async function sendFriendRequest(
  toUserId: string
): Promise<'sent' | 'pending_exists' | 'auto_accepted' | 'already_friends'> {
  const { data: session } = await auth.getSession();
  if (!session?.user || toUserId === session.user.id) return 'already_friends';

  const me = session.user.id;

  const existingFriend = await db
    .select({ id: friends.id })
    .from(friends)
    .where(
      or(
        and(eq(friends.userId, me), eq(friends.friendUserId, toUserId)),
        and(eq(friends.userId, toUserId), eq(friends.friendUserId, me))
      )
    )
    .limit(1);
  if (existingFriend.length > 0) return 'already_friends';

  const reverse = await db
    .select({ id: friendRequests.id })
    .from(friendRequests)
    .where(and(eq(friendRequests.fromUserId, toUserId), eq(friendRequests.toUserId, me)))
    .limit(1);
  if (reverse.length > 0) {
    await db
      .insert(friends)
      .values({ userId: toUserId, friendUserId: me })
      .onConflictDoNothing({ target: [friends.userId, friends.friendUserId] });
    await db
      .delete(friendRequests)
      .where(
        or(
          and(eq(friendRequests.fromUserId, toUserId), eq(friendRequests.toUserId, me)),
          and(eq(friendRequests.fromUserId, me), eq(friendRequests.toUserId, toUserId))
        )
      );
    return 'auto_accepted';
  }

  const existing = await db
    .select({ id: friendRequests.id })
    .from(friendRequests)
    .where(and(eq(friendRequests.fromUserId, me), eq(friendRequests.toUserId, toUserId)))
    .limit(1);
  if (existing.length > 0) return 'pending_exists';

  await db.insert(friendRequests).values({ fromUserId: me, toUserId });
  return 'sent';
}

export async function acceptFriendRequest(requestId: string): Promise<{ success: boolean }> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return { success: false };

  const [req] = await db
    .select({ fromUserId: friendRequests.fromUserId, toUserId: friendRequests.toUserId })
    .from(friendRequests)
    .where(eq(friendRequests.id, requestId))
    .limit(1);

  if (!req || req.toUserId !== session.user.id) return { success: false };

  await db
    .insert(friends)
    .values({ userId: req.fromUserId, friendUserId: session.user.id })
    .onConflictDoNothing({ target: [friends.userId, friends.friendUserId] });

  await db
    .delete(friendRequests)
    .where(
      or(
        and(eq(friendRequests.fromUserId, req.fromUserId), eq(friendRequests.toUserId, session.user.id)),
        and(eq(friendRequests.fromUserId, session.user.id), eq(friendRequests.toUserId, req.fromUserId))
      )
    );

  return { success: true };
}

export async function rejectFriendRequest(requestId: string): Promise<{ success: boolean }> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return { success: false };

  const [req] = await db
    .select({ toUserId: friendRequests.toUserId })
    .from(friendRequests)
    .where(eq(friendRequests.id, requestId))
    .limit(1);

  if (!req || req.toUserId !== session.user.id) return { success: false };

  await db.delete(friendRequests).where(eq(friendRequests.id, requestId));
  return { success: true };
}

export async function removeFriend(friendId: string): Promise<{ success: boolean }> {
  const { data: session } = await auth.getSession();
  if (!session?.user) return { success: false };

  await db
    .delete(friends)
    .where(
      or(
        and(eq(friends.userId, session.user.id), eq(friends.friendUserId, friendId)),
        and(eq(friends.userId, friendId), eq(friends.friendUserId, session.user.id))
      )
    );

  return { success: true };
}

export interface PendingRequest {
  requestId: string;
  fromUserId: string;
  username: string;
  level: number;
  title: string;
  createdAt: Date;
}

export async function getPendingRequests(userId: string): Promise<PendingRequest[]> {
  const { data: session } = await auth.getSession();
  if (!session?.user || session.user.id !== userId) return [];

  const rows = await db
    .select({
      requestId: friendRequests.id,
      fromUserId: friendRequests.fromUserId,
      username: profiles.username,
      level: profiles.level,
      title: profiles.title,
      createdAt: friendRequests.createdAt,
    })
    .from(friendRequests)
    .innerJoin(profiles, eq(friendRequests.fromUserId, profiles.id))
    .where(eq(friendRequests.toUserId, userId));

  return rows.map((r) => ({
    requestId: r.requestId,
    fromUserId: r.fromUserId,
    username: r.username ?? 'Anonymous',
    level: r.level ?? 1,
    title: r.title ?? 'Rookie Agent',
    createdAt: r.createdAt,
  }));
}

export interface FriendListItem {
  userId: string;
  username: string;
  level: number;
  title: string;
  lastActiveAt: Date | null;
}

export async function getFriendList(userId: string): Promise<FriendListItem[]> {
  const { data: session } = await auth.getSession();
  if (!session?.user || session.user.id !== userId) return [];

  const otherId = sql<string>`CASE WHEN ${friends.userId} = ${userId} THEN ${friends.friendUserId} ELSE ${friends.userId} END`;

  const rows = await db
    .select({
      userId: otherId,
      username: profiles.username,
      level: profiles.level,
      title: profiles.title,
      lastActiveAt: profiles.lastActiveAt,
    })
    .from(friends)
    .innerJoin(profiles, sql`${profiles.id} = ${otherId}`)
    .where(or(eq(friends.userId, userId), eq(friends.friendUserId, userId)))
    .orderBy(sql`${profiles.lastActiveAt} DESC NULLS LAST`);

  return rows.map((r) => ({
    userId: r.userId,
    username: r.username ?? 'Anonymous',
    level: r.level ?? 1,
    title: r.title ?? 'Rookie Agent',
    lastActiveAt: r.lastActiveAt,
  }));
}

export async function getUserProfile(
  userId: string
): Promise<{ username: string; level: number; title: string; bestScore: number; gamesPlayed: number; lastActiveAt: Date | null } | null> {
  const [profile] = await db
    .select({ username: profiles.username, level: profiles.level, title: profiles.title, lastActiveAt: profiles.lastActiveAt })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!profile) return null;

  const [stats] = await db
    .select({
      bestScore: sql<number>`COALESCE(MAX(${rounds.totalScore}), 0)::int`,
      gamesPlayed: sql<number>`COUNT(*) FILTER (WHERE ${rounds.completed})::int`,
    })
    .from(rounds)
    .where(eq(rounds.userId, userId));

  return {
    username: profile.username ?? 'Anonymous',
    level: profile.level ?? 1,
    title: profile.title ?? 'Rookie Agent',
    bestScore: stats?.bestScore ?? 0,
    gamesPlayed: stats?.gamesPlayed ?? 0,
    lastActiveAt: profile.lastActiveAt,
  };
}

export async function getPendingRequestsCount(userId: string): Promise<{ count: number }> {
  const { data: session } = await auth.getSession();
  if (!session?.user || session.user.id !== userId) return { count: 0 };

  const [row] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(friendRequests)
    .where(eq(friendRequests.toUserId, userId));

  return { count: row?.count ?? 0 };
}

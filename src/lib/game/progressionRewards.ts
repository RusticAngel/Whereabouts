export const MAX_LEVEL = 40;

export const XP = {
  PLAY: 10,
  ACCURATE_100: 5,
  ACCURATE_10: 10,
  PERFECT: 20,
  DAILY: 25,
  STREAK_7: 50,
  STREAK_30: 100,
} as const;

export const STREAK_REWARDS: { days: number; xp?: number; badgeId?: string; label: string }[] = [
  { days: 3, badgeId: 'streak_starter', label: 'Streak Starter' },
  { days: 5, xp: 10, label: '+10 XP' },
  { days: 7, badgeId: 'streak_committed', xp: 50, label: 'Committed — +50 XP' },
  { days: 14, xp: 25, label: '+25 XP + free evidence clue' },
  { days: 30, badgeId: 'streak_master', xp: 100, label: 'Loyalist — +100 XP' },
  { days: 60, badgeId: 'streak_addict', label: 'Addict — profile flair' },
  { days: 90, badgeId: 'streak_legend', label: 'Legend — exclusive location access' },
  { days: 365, badgeId: 'streak_immortal', label: 'Immortal — lifetime free play' },
];

export interface BadgeDef {
  id: string;
  name: string;
  icon: string;
  desc: string;
  howToEarn: string;
}

export const BADGES: BadgeDef[] = [
  { id: 'first_steps', name: 'First Steps', icon: '👣', desc: 'Play 1 game', howToEarn: 'Complete your first case in the campaign.' },
  { id: 'explorer', name: 'Explorer', icon: '🧭', desc: 'Play 10 games', howToEarn: 'Complete 10 cases in the campaign.' },
  { id: 'adventurer', name: 'Adventurer', icon: '🧗', desc: 'Play 50 games', howToEarn: 'Complete 50 cases in the campaign.' },
  { id: 'cartographer', name: 'Cartographer', icon: '🗺️', desc: 'Play 100 games', howToEarn: 'Complete 100 cases in the campaign.' },
  { id: 'perfect_score', name: 'Perfect Score', icon: '🎯', desc: 'Score 5000 on any game', howToEarn: 'Pin within 1 km of the target to earn the full 5000 points.' },
  { id: 'sharpshooter', name: 'Sharpshooter', icon: '🏆', desc: 'Get 3 perfect scores', howToEarn: 'Earn a 5000-point score on 3 different cases.' },
  { id: 'close_call', name: 'Close Call', icon: '🎲', desc: 'Guess within 1 km', howToEarn: 'Place your pin within 1 km of the exact location.' },
  { id: 'streak_starter', name: 'Streak Starter', icon: '🔥', desc: '3-day streak', howToEarn: 'Complete the daily challenge 3 days in a row.' },
  { id: 'streak_committed', name: 'Committed', icon: '📅', desc: '7-day streak', howToEarn: 'Complete the daily challenge 7 days in a row.' },
  { id: 'streak_master', name: 'Streak Master', icon: '⚡', desc: '30-day streak', howToEarn: 'Complete the daily challenge 30 days in a row.' },
  { id: 'streak_addict', name: 'Addict', icon: '💊', desc: '60-day streak', howToEarn: 'Complete the daily challenge 60 days in a row.' },
  { id: 'streak_legend', name: 'Legend', icon: '👑', desc: '90-day streak', howToEarn: 'Complete the daily challenge 90 days in a row.' },
  { id: 'streak_immortal', name: 'Immortal', icon: '♾️', desc: '365-day streak', howToEarn: 'Complete the daily challenge 365 days in a row.' },
  { id: 'daily_dedication', name: 'Daily Dedication', icon: '🚩', desc: 'Complete 7 daily challenges', howToEarn: 'Finish 7 daily challenges in total.' },
  { id: 'social_butterfly', name: 'Social Butterfly', icon: '🦋', desc: 'Add 10 friends', howToEarn: 'Connect with 10 friends on the friends list.' },
  { id: 'referral_king', name: 'Referral King', icon: '👑', desc: 'Refer 10 friends', howToEarn: 'Refer 10 friends to the hunt — coming soon.' },
];

const TITLES: { max: number; title: string }[] = [
  { max: 5, title: 'Rookie Agent' },
  { max: 10, title: 'Field Operative' },
  { max: 15, title: 'Intelligence Analyst' },
  { max: 20, title: 'Senior Investigator' },
  { max: 25, title: 'Cipher Hunter' },
  { max: 30, title: 'Elite Tracker' },
  { max: 35, title: 'Cipher Legend' },
  { max: 40, title: 'Cipher' },
];

export function computeLevel(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1);
}

export function titleForLevel(level: number): string {
  for (const t of TITLES) {
    if (level <= t.max) return t.title;
  }
  return 'Cipher';
}

export function levelProgress(xp: number): {
  level: number;
  currentFloor: number;
  currentCeil: number;
  progress100: number;
} {
  const level = computeLevel(xp);
  const currentFloor = 50 * (level - 1) * (level - 1);
  const currentCeil = 50 * level * level;
  const span = Math.max(1, currentCeil - currentFloor);
  const progress100 = Math.min(100, Math.max(0, Math.round(((xp - currentFloor) / span) * 100)));
  return { level, currentFloor, currentCeil, progress100 };
}

export function badgeById(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}
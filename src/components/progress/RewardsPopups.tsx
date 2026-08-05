'use client';

import { useMemo } from 'react';
import { GameRewards } from '@/app/actions';
import { badgeById } from '@/lib/game/progressionRewards';
import { LevelUpPopup } from './LevelUpPopup';
import { BadgeUnlockedPopup } from './BadgeUnlockedPopup';
import { StreakPopup } from './StreakPopup';

interface RewardsPopupsProps {
  rewards: GameRewards | null;
}

export function RewardsPopups({ rewards }: RewardsPopupsProps) {
  const signature = useMemo(() => {
    if (!rewards) return 'none';
    return JSON.stringify([
      rewards.xpGained,
      rewards.leveledUp,
      rewards.badges.map((b) => b.id),
      rewards.streakMilestone?.days ?? 0,
      rewards.perfect,
    ]);
  }, [rewards]);

  if (!rewards) return null;

  let delay = 0.2;

  return (
    <div key={signature}>
      {rewards.perfect && <div className="fixed inset-0 z-40 pointer-events-none animate-perfect-flash" />}
      {rewards.leveledUp && (
        <LevelUpPopup level={rewards.newLevel} title={rewards.newTitle} delay={`${delay}s`} />
      )}
      {rewards.leveledUp && (delay += 3.4)}
      {rewards.badges.map((b, i) => {
        const def = badgeById(b.id);
        const d = delay + i * 3.4;
        return def ? <BadgeUnlockedPopup key={b.id} badge={def} delay={`${d}s`} /> : null;
      })}
      {rewards.badges.length > 0 && (delay += rewards.badges.length * 3.4)}
      {rewards.streakMilestone && (
        <StreakPopup milestone={rewards.streakMilestone} delay={`${delay}s`} />
      )}
    </div>
  );
}
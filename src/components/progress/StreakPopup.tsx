'use client';

import { Card } from '@/components/ui/Card';
import { STREAK_REWARDS, badgeById } from '@/lib/game/progressionRewards';

interface StreakPopupProps {
  milestone: (typeof STREAK_REWARDS)[number];
  delay?: string;
}

export function StreakPopup({ milestone, delay }: StreakPopupProps) {
  const badge = milestone.badgeId ? badgeById(milestone.badgeId) : undefined;
  return (
    <div
      className="animate-pop-fade fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
      style={{ animationDelay: delay }}
    >
      <div className="animate-level-up">
        <Card className="text-center px-8 py-6 border-orange-400/40 bg-gray-900">
          <div className="text-6xl mb-3">{badge?.icon ?? '🔥'}</div>
          <div className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-1">
            {milestone.days}-day streak
          </div>
          <div className="text-xl font-bold text-white">{milestone.label}</div>
        </Card>
      </div>
    </div>
  );
}
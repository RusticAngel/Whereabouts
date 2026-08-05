'use client';

import { Card } from '@/components/ui/Card';
import { BadgeDef } from '@/lib/game/progressionRewards';

interface BadgeUnlockedPopupProps {
  badge: BadgeDef;
  delay?: string;
}

export function BadgeUnlockedPopup({ badge, delay }: BadgeUnlockedPopupProps) {
  return (
    <div
      className="animate-pop-fade fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
      style={{ animationDelay: delay }}
    >
      <div className="animate-badge-reveal">
        <Card className="text-center px-8 py-6 border-yellow-400/40 bg-gray-900">
          <div className="text-6xl mb-3">{badge.icon}</div>
          <div className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-1">
            Unlocked!
          </div>
          <div className="text-xl font-bold text-white">{badge.name}</div>
          <div className="text-sm text-gray-400 mt-1">{badge.desc}</div>
        </Card>
      </div>
    </div>
  );
}
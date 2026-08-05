'use client';

import { Card } from '@/components/ui/Card';

interface LevelUpPopupProps {
  level: number;
  title: string;
  delay?: string;
}

export function LevelUpPopup({ level, title, delay }: LevelUpPopupProps) {
  return (
    <div
      className="animate-pop-fade fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
      style={{ animationDelay: delay }}
    >
      <div className="animate-level-up">
        <Card className="text-center px-8 py-6 border-yellow-400/40 shadow-[0_0_60px_rgba(250,204,21,0.35)]">
          <div className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-1">
            Level up
          </div>
          <div className="text-5xl font-bold text-yellow-400 animate-glow-pulse mb-2">
            {level}
          </div>
          <div className="text-lg font-semibold text-white">{title}</div>
        </Card>
      </div>
    </div>
  );
}
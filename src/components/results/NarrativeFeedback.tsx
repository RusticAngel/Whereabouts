'use client';

import { getNarrativeFeedback } from '@/lib/game/narrative';

interface NarrativeFeedbackProps {
  distanceKm: number;
}

export function NarrativeFeedback({ distanceKm }: NarrativeFeedbackProps) {
  const text = getNarrativeFeedback(distanceKm);

  const colors =
    distanceKm < 1
      ? 'text-green-400 border-green-400/30 bg-green-400/10'
      : distanceKm < 50
        ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
        : distanceKm < 1000
          ? 'text-orange-400 border-orange-400/30 bg-orange-400/10'
          : 'text-red-400 border-red-400/30 bg-red-400/10';

  return (
    <div className={`rounded-xl border p-4 text-center text-sm font-medium ${colors}`}>
      {text}
    </div>
  );
}

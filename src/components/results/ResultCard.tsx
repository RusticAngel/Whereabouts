'use client';

import { forwardRef } from 'react';
import { getNarrativeFeedback } from '@/lib/game';

interface ResultCardProps {
  score: number;
  distanceKm: number;
  rank?: number;
  totalPlayers?: number;
  aboveName?: string;
  aboveDistance?: number;
  belowName?: string;
  belowDistance?: number;
  isFirst?: boolean;
  isLast?: boolean;
  label?: string;
  streak?: number;
}

export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(function ResultCard({
  score,
  distanceKm,
  rank,
  totalPlayers,
  aboveName,
  aboveDistance,
  belowName,
  belowDistance,
  isFirst,
  isLast,
  label,
  streak,
}, ref) {
  const narrative = getNarrativeFeedback(distanceKm);

  return (
    <div
      ref={ref}
      className="w-full max-w-sm mx-auto bg-[#0a0a0a] rounded-2xl border border-gray-800 overflow-hidden"
      style={{ fontFamily: 'ui-monospace, monospace' }}
    >
      <div className="px-5 pt-5 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-yellow-400 font-semibold tracking-[0.2em] uppercase">FINDME</span>
          {label && (
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</span>
          )}
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-lg font-bold text-white">Mission Complete</h1>
          {rank !== undefined && totalPlayers !== undefined && totalPlayers > 1 && (
            <p className="text-sm text-gray-400">
              #{rank} of {totalPlayers} player{totalPlayers > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="text-center py-3">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Distance from target</p>
          <p className="text-3xl font-bold text-white">
            {distanceKm.toLocaleString()} <span className="text-base text-gray-400 font-normal">km</span>
          </p>
        </div>

        <div className="bg-gray-900/60 rounded-xl px-4 py-3 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Final Score</p>
          <p className="text-2xl font-bold text-yellow-400">{score.toLocaleString()}</p>
        </div>

        {streak !== undefined && streak > 0 && (
          <div className="text-center text-[11px] text-yellow-400/80">
            🔥 {streak}-day streak (×{Math.min(1 + streak * 0.05, 1.25).toFixed(2)})
          </div>
        )}

        {isFirst && (
          <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-4 py-2 text-center">
            <p className="text-sm text-yellow-400 font-medium">🏆 Leading this challenge</p>
          </div>
        )}

        {!isFirst && !isLast && belowName && aboveName && (
          <div className="space-y-1.5 text-[11px]">
            <p className="text-green-400/90 text-center">
              🔥 Beat {belowName} by {Math.abs(aboveDistance! - distanceKm).toLocaleString()} km
            </p>
            <p className="text-red-400/90 text-center">
              😬 {aboveName} ahead by {Math.abs(aboveDistance! - distanceKm).toLocaleString()} km
            </p>
          </div>
        )}

        {isLast && aboveName && (
          <p className="text-red-400/90 text-center text-[11px]">
            😬 {aboveName} beat you by {Math.abs(aboveDistance! - distanceKm).toLocaleString()} km
          </p>
        )}

        <div className="border-t border-gray-800 pt-3 text-center">
          <p className="text-[11px] text-gray-500 italic leading-relaxed">
            &ldquo;{narrative}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
});

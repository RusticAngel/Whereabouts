'use client';

import { useEffect, useState } from 'react';
import { BadgeDef } from '@/lib/game/progressionRewards';

export type ProfileBadge = BadgeDef & { unlockedAt: string | null };

interface BadgeDetailModalProps {
  badge: ProfileBadge;
  onClose: () => void;
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function BadgeDetailModal({ badge, onClose }: BadgeDetailModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const unlocked = formatDate(badge.unlockedAt);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-gray-900 border border-gray-700 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl transition-all duration-300 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-yellow-400/10 flex items-center justify-center">
            <span className="text-4xl">{badge.icon}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{badge.name}</h1>
            <p className="text-sm text-gray-400 mt-1">{badge.desc}</p>
          </div>
          <div className="rounded-xl bg-gray-800/50 border border-gray-700 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-widest text-yellow-300/80 mb-1">
              How to earn
            </div>
            <p className="text-sm text-gray-300">{badge.howToEarn}</p>
          </div>
          {unlocked && (
            <div className="text-xs text-gray-500 font-mono">
              Unlocked: {unlocked}
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
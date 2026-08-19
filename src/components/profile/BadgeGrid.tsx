'use client';

import { useState } from 'react';
import { BadgeDetailModal, ProfileBadge } from './BadgeDetailModal';

interface BadgeGridProps {
  badges: ProfileBadge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  const [selected, setSelected] = useState<ProfileBadge | null>(null);

  return (
    <>
      {badges.length === 0 ? (
        <p className="text-gray-500 text-sm">No badges earned yet. Keep investigating!</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <button
              key={badge.id}
              onClick={() => setSelected(badge)}
              className="rounded-xl bg-gray-900 border border-gray-800 p-3 text-center hover:bg-gray-800 transition-colors active:scale-[0.98] cursor-pointer"
            >
              <div className="text-3xl">{badge.icon}</div>
              <div className="text-xs text-white mt-1 font-medium leading-tight">{badge.name}</div>
            </button>
          ))}
        </div>
      )}

      {selected && <BadgeDetailModal badge={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
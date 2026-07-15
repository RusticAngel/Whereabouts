'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  isCurrentUser: boolean;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserScore?: number;
}

export function LeaderboardTable({ entries, currentUserScore }: LeaderboardTableProps) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {currentUserScore !== undefined && (
        <div className="text-center text-gray-400 text-sm mb-4">
          Your best today: <span className="text-white font-semibold">{currentUserScore}</span>
        </div>
      )}

      <div className="space-y-1">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between px-4 py-3 rounded-lg ${
              entry.isCurrentUser ? 'bg-white/10 border border-white/20' : 'bg-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 text-center text-sm font-bold ${
                entry.rank <= 3 ? 'text-yellow-400' : 'text-gray-500'
              }`}>
                {entry.rank}
              </span>
              <span className="text-white">{entry.username}</span>
              {entry.isCurrentUser && (
                <span className="text-xs text-gray-500">(you)</span>
              )}
            </div>
            <span className="text-white font-mono">{entry.score}</span>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No scores yet today. Be the first!
        </div>
      )}

      <Button
        fullWidth
        variant="secondary"
        onClick={() => router.push('/game')}
        className="mt-4"
      >
        Play
      </Button>
    </div>
  );
}

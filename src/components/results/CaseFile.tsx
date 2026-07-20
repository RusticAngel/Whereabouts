'use client';

import { CaseFileEntry } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface CaseFileProps {
  entries: CaseFileEntry[];
  currentLevel: number;
}

const ARCS = [
  { label: 'The Disappearance', levels: '1–4', start: 1, end: 4 },
  { label: 'The False Trail', levels: '5–8', start: 5, end: 8 },
  { label: 'The Network', levels: '9–12', start: 9, end: 12 },
  { label: 'The Hideout', levels: '13–14', start: 13, end: 14 },
  { label: 'Ghost Trail', levels: '15–18', start: 15, end: 18 },
  { label: 'Deep Cover', levels: '19–22', start: 19, end: 22 },
  { label: 'Final Trace', levels: '23–28', start: 23, end: 28 },
];

export function CaseFile({ entries, currentLevel }: CaseFileProps) {
  const router = useRouter();
  const entryMap = new Map(entries.map((e) => [e.level, e]));
  const campaignTotal = entries.reduce((sum, e) => sum + e.bestScore, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Case File</h1>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total score</p>
          <p className="text-lg font-bold text-yellow-400">{campaignTotal.toLocaleString()}</p>
        </div>
      </div>

      {ARCS.map((arc) => {
        const arcLevels = Array.from({ length: arc.end - arc.start + 1 }, (_, i) => arc.start + i);
        const arcEntries = arcLevels.map((l) => entryMap.get(l));
        const arcTotal = arcEntries.reduce((s, e) => s + (e?.bestScore ?? 0), 0);

        return (
          <Card key={arc.label}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">{arc.label}</h2>
                <p className="text-xs text-gray-500">{arc.levels}</p>
              </div>
              <p className="text-sm font-mono text-yellow-400">{arcTotal.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {arcLevels.map((level) => {
                const entry = entryMap.get(level);
                const unlocked = level <= currentLevel;
                return (
                  <button
                    key={level}
                    onClick={() => router.push(`/game?level=${level}&replay=1`)}
                    disabled={!unlocked}
                    className={`rounded-lg p-3 text-center transition-all ${
                      !unlocked
                        ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                        : entry
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 cursor-pointer'
                          : 'bg-gray-800/50 text-gray-500 hover:bg-gray-700 cursor-pointer'
                    }`}
                  >
                    <div className="text-xs text-gray-500">#{level}</div>
                    <div className="text-sm font-bold mt-1">
                      {entry ? entry.bestScore.toLocaleString() : unlocked ? '—' : '🔒'}
                    </div>
                    <div className="text-[10px] mt-0.5">
                      {entry ? '✅' : unlocked ? 'Play' : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        );
      })}

      <div className="flex flex-col gap-3">
        <Button fullWidth variant="primary" onClick={() => router.push('/game')}>
          Next case
        </Button>
        <Button fullWidth variant="secondary" onClick={() => router.push('/leaderboard')}>
          Leaderboard
        </Button>
        <Button fullWidth variant="ghost" onClick={() => router.push('/')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { missionForLevel, arcForLevel } from '@/lib/game/arcs';

interface BriefingPanelProps {
  briefing: string;
  level: number;
  onBegin: () => void;
}

export function BriefingPanel({ briefing, level, onBegin }: BriefingPanelProps) {
  const router = useRouter();
  const mission = missionForLevel(level);
  const arc = arcForLevel(level);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-black text-white p-6 animate-fade-in">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push('/')}
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          &larr; Home
        </button>
      </div>
      <div className="max-w-md mx-auto text-center space-y-6">
        <div>
          <div className="text-sm text-yellow-400 font-mono uppercase tracking-widest">
            Case File #{level}
          </div>
          {mission && (
            <div className="mt-3 rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3 space-y-1">
              <div className="text-xs font-semibold uppercase tracking-widest text-yellow-300/80">
                Mission: {mission.name}
              </div>
              <div className="text-sm text-gray-300">{mission.desc}</div>
            </div>
          )}
          {arc && !mission && (
            <div className="mt-3 text-xs text-gray-500">{arc.label}</div>
          )}
        </div>
        <p className="text-lg leading-relaxed text-gray-200">
          {briefing}
        </p>
        <Button variant="primary" size="lg" onClick={onBegin}>
          Begin the hunt
        </Button>
      </div>
    </div>
  );
}

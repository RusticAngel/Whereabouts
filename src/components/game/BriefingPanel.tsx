'use client';

import { Button } from '@/components/ui/Button';

interface BriefingPanelProps {
  briefing: string;
  level: number;
  onBegin: () => void;
}

export function BriefingPanel({ briefing, level, onBegin }: BriefingPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-black text-white p-6 animate-fade-in">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="text-sm text-yellow-400 font-mono uppercase tracking-widest">
          Case File #{level}
        </div>
        <p className="text-lg leading-relaxed text-gray-200">
          {briefing}
        </p>
        <Button variant="primary" size="lg" onClick={onBegin}>
          Begin Investigation
        </Button>
      </div>
    </div>
  );
}

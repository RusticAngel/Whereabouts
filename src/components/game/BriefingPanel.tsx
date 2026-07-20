'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface BriefingPanelProps {
  briefing: string;
  level: number;
  onBegin: () => void;
}

export function BriefingPanel({ briefing, level, onBegin }: BriefingPanelProps) {
  const router = useRouter();

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
        <div className="text-sm text-yellow-400 font-mono uppercase tracking-widest">
          Case File #{level}
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

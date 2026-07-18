'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { getHint } from '@/lib/game/hints';
import { Confidence } from '@/types';

interface HintPanelProps {
  pinLat: number | null;
  pinLng: number | null;
  targetLat: number;
  targetLng: number;
  hintsUsed: number;
  confidence: Confidence;
  onHint: () => void;
}

const DELAYS = [300, 500, 900];
const MAX_HINTS = 3;

export function HintPanel({
  pinLat,
  pinLng,
  targetLat,
  targetLng,
  hintsUsed,
  confidence,
  onHint,
}: HintPanelProps) {
  const [thinking, setThinking] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAsk = () => {
    if (thinking || hintsUsed >= MAX_HINTS || pinLat === null || pinLng === null) return;

    setThinking(true);

    const delay = DELAYS[Math.min(hintsUsed, DELAYS.length - 1)];

    timerRef.current = setTimeout(() => {
      const hintText = getHint({
        pinLat,
        pinLng,
        targetLat,
        targetLng,
        hintsUsed,
        confidence,
      });
      setHints((prev) => [...prev, hintText]);
      setThinking(false);
      onHint();
    }, delay);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-400 font-medium">AI Assistant</p>
      {hints.map((hint, i) => (
        <div
          key={i}
          className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2 border-l-2 border-purple-500/70 ${
            i === hints.length - 1
              ? 'text-gray-300 bg-gray-800/50 animate-fade-in'
              : 'text-gray-500 bg-gray-800/20'
          }`}
        >
          <span className="text-purple-400 text-xs font-mono mt-0.5 shrink-0">AI</span>
          <span>{hint}</span>
        </div>
      ))}
      {thinking && (
        <div className="flex items-start gap-2 text-sm text-gray-500 bg-gray-800/30 rounded-lg px-3 py-2 border-l-2 border-purple-500/30">
          <span className="text-purple-400/50 text-xs font-mono mt-0.5 shrink-0">AI</span>
          <span className="animate-pulse">Thinking…</span>
        </div>
      )}
      {hintsUsed < MAX_HINTS && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAsk}
          disabled={thinking || pinLat === null}
          className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500/50"
        >
          {hintsUsed === 0 ? 'Ask AI' : `Ask AI (${MAX_HINTS - hintsUsed} left)`}
        </Button>
      )}
    </div>
  );
}

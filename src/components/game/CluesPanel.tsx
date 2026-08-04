'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { DynamicClue } from '@/lib/game/dynamicClues';

interface CluesPanelProps {
  clues: DynamicClue[];
  onClueUsed?: (count: number) => void;
}

/**
 * Progressively reveals the 3 dynamic clues (increasing specificity) within a
 * single game session. Tiers persist once revealed — consistent across re-asks.
 */
export function CluesPanel({ clues, onClueUsed }: CluesPanelProps) {
  const [revealed, setRevealed] = useState(0);
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

  const reveal = () => {
    if (revealed >= clues.length) return;
    const next = revealed + 1;
    setRevealed(next);
    onClueUsed?.(next);
  };

  const toggle = (index: number) => {
    setCollapsed((prev) => {
      const n = new Set(prev);
      if (n.has(index)) n.delete(index);
      else n.add(index);
      return n;
    });
  };

  if (!clues.length) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400 font-medium">Field Intel</p>
        {revealed > 0 && (
          <span className="text-xs text-cyan-400/70 font-mono">{revealed}/{clues.length} revealed</span>
        )}
      </div>

      {clues.slice(0, revealed).map((clue, i) => {
        const isNewest = i === revealed - 1;
        const isCollapsed = !isNewest && collapsed.has(i);
        const labels = ['Priority One', 'Priority Two', 'Priority Three'];

        if (isCollapsed) {
          return (
            <button
              key={clue.tier}
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-2 text-sm text-gray-500 bg-gray-800/20 rounded-lg px-3 py-1.5 border-l-2 border-cyan-500/30 hover:bg-gray-800/40 transition-colors text-left"
            >
              <span className="text-xs text-cyan-400/60 font-mono shrink-0">▶</span>
              <span className="truncate">{labels[i]}</span>
            </button>
          );
        }

        return (
          <div
            key={clue.tier}
            className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2 border-l-2 ${
              clue.tier === 1
                ? 'border-cyan-500/40 text-gray-400 bg-gray-800/20'
                : clue.tier === 2
                  ? 'border-cyan-400/60 text-gray-300 bg-gray-800/40'
                  : 'border-cyan-300 text-gray-200 bg-gray-800/60'
            } ${isNewest ? 'animate-fade-in' : ''}`}
          >
            <span className="text-cyan-400 text-xs font-mono mt-0.5 shrink-0">{labels[i]}</span>
            <span className="flex-1">{clue.text}</span>
            {!isNewest && (
              <button onClick={() => toggle(i)} className="text-gray-600 hover:text-gray-400 text-xs shrink-0 ml-1">−</button>
            )}
          </div>
        );
      })}

      {revealed < clues.length && (
        <Button
          variant="outline"
          size="sm"
          onClick={reveal}
          className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-500/50"
        >
          {revealed === 0 ? 'Request field intel' : `Escalate intel (${clues.length - revealed} remaining)`}
        </Button>
      )}
    </div>
  );
}
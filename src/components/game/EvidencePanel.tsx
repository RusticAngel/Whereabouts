'use client';

import { useState, useRef } from 'react';
import { EvidenceItem } from '@/types';
import { revealEvidence, getRevealedEvidence, MAX_EVIDENCE, EVIDENCE_COSTS } from '@/lib/game/evidence';
import { Button } from '@/components/ui/Button';

interface EvidencePanelProps {
  evidence: EvidenceItem[];
  onReveal: (count: number) => void;
}

export function EvidencePanel({ evidence, onReveal }: EvidencePanelProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canReveal = revealedCount < evidence.length && revealedCount < MAX_EVIDENCE;
  const revealed = getRevealedEvidence(evidence, revealedCount);

  const handleReveal = () => {
    if (confirming) {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
      setConfirming(false);
      const next = revealEvidence(evidence, revealedCount);
      if (next) {
        const newCount = revealedCount + 1;
        setRevealedCount(newCount);
        onReveal(newCount);
      }
    } else {
      setConfirming(true);
      confirmTimerRef.current = setTimeout(() => {
        setConfirming(false);
      }, 3000);
    }
  };

  const nextCost = canReveal ? EVIDENCE_COSTS[Math.min(revealedCount, EVIDENCE_COSTS.length - 1)] : 0;

  return (
    <div className="space-y-2">
      {revealed.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-2 text-sm text-gray-300 bg-gray-800/50 rounded-lg px-3 py-2"
        >
          <span className="text-yellow-400 mt-0.5 shrink-0">&#9679;</span>
          <span>{item.label}</span>
        </div>
      ))}
      {canReveal && (
        <Button
          variant={confirming ? 'primary' : 'outline'}
          size="sm"
          onClick={handleReveal}
        >
          {confirming
            ? `Tap again to confirm — -${nextCost} pts`
            : `Reveal Evidence (${revealedCount + 1}/${Math.min(evidence.length, MAX_EVIDENCE)}) — costs ${nextCost} pts`}
        </Button>
      )}
    </div>
  );
}

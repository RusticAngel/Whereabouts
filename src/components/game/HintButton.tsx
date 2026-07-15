'use client';

import { Button } from '@/components/ui/Button';

interface HintButtonProps {
  showHint: boolean;
  clue: string;
  onToggle: () => void;
}

export function HintButton({ showHint, clue, onToggle }: HintButtonProps) {
  return (
    <div className="space-y-2">
      <Button variant="ghost" size="sm" onClick={onToggle}>
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </Button>
      {showHint && (
        <p className="text-sm text-yellow-400 italic px-3">{clue}</p>
      )}
    </div>
  );
}

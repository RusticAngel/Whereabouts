'use client';

import { Difficulty } from '@/lib/game/scoring';
import { flags } from '@/lib/flags';

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; multiplier: string }[] = [
  { value: 'move', label: 'Move', multiplier: '1.0×' },
  { value: 'no-move', label: 'No Move', multiplier: '1.2×' },
  { value: 'nmpz', label: 'NMPZ', multiplier: '1.5×' },
];

export function DifficultySelector({ value, onChange, disabled = false }: DifficultySelectorProps) {
  if (!flags.DIFFICULTY_MODES) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">Difficulty</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as 'move' | 'no-move' | 'nmpz')}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M4%206l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right-3 pr-10"
      >
        {DIFFICULTY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} ({opt.multiplier})
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500">
        {value === 'move' && 'Drag to navigate, zoom, and rotate'}
        {value === 'no-move' && 'Pan and zoom only — no navigation'}
        {value === 'nmpz' && 'Static image only — no pan, zoom, or rotation'}
      </p>
    </div>
  );
}
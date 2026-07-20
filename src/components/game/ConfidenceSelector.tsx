'use client';

import { Confidence } from '@/types';

interface ConfidenceSelectorProps {
  value: Confidence;
  onChange: (value: Confidence) => void;
}

const OPTIONS: { value: Confidence; label: string; description: string }[] = [
  { value: 'low', label: 'Low', description: 'Safe bet — no risk, no bonus' },
  { value: 'medium', label: 'Medium', description: 'Moderate risk — ×1.2 if close' },
  { value: 'high', label: 'High', description: 'High stakes — ×1.5 or ÷2' },
];

export function ConfidenceSelector({ value, onChange }: ConfidenceSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-400 font-medium">Set your stakes</p>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          const colors: Record<string, string> = {
            low: selected ? 'bg-yellow-400 text-black border-yellow-400' : 'border-gray-600 text-gray-400 hover:border-gray-500',
            medium: selected ? 'bg-yellow-400 text-black border-yellow-400' : 'border-gray-600 text-gray-400 hover:border-gray-500',
            high: selected ? 'bg-yellow-400 text-black border-yellow-400' : 'border-gray-600 text-gray-400 hover:border-gray-500',
          };
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${colors[opt.value]}`}
              title={opt.description}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

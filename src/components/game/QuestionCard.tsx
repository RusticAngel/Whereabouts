'use client';

import { Step } from '@/types';

interface QuestionCardProps {
  step: Step;
  stepIndex: number;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

export function QuestionCard({ step, stepIndex, onAnswer, disabled }: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wider text-gray-500">
          Step {stepIndex + 1} — {step.type}
        </p>
        <h2 className="text-lg sm:text-xl font-semibold">{step.question}</h2>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {step.options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            disabled={disabled}
            className="w-full text-left px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 
              hover:border-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 active:scale-[0.99]"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

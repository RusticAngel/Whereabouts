'use client';

import { useState, useEffect } from 'react';

interface CoachMarkStep {
  title: string;
  body: string;
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';
}

interface CoachMarkProps {
  steps: CoachMarkStep[];
  storageKey: string;
  onComplete: () => void;
}

export function CoachMark({ steps, storageKey, onComplete }: CoachMarkProps) {
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem(storageKey);
    if (!seen && steps.length > 0) {
      setDismissed(false);
    }
  }, [steps.length, storageKey]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      sessionStorage.setItem(storageKey, '1');
      setDismissed(true);
      onComplete();
    }
  };

  const handleSkip = () => {
    sessionStorage.setItem(storageKey, '1');
    setDismissed(true);
    onComplete();
  };

  if (dismissed) return null;

  const current = steps[step];
  const total = steps.length;

  const positionClasses: Record<string, string> = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-24 left-4',
    'bottom-center': 'bottom-24 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-24 right-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 pointer-events-none" />
      <div className={`fixed z-[60] max-w-xs w-full ${positionClasses[current.position]}`}>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl pointer-events-auto">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-mono text-yellow-400 uppercase tracking-wider">
              Step {step + 1} of {total}
            </span>
            <button
              onClick={handleSkip}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Skip
            </button>
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">{current.title}</h3>
          <p className="text-xs text-gray-400 leading-relaxed">{current.body}</p>
          <button
            onClick={handleNext}
            className="mt-3 w-full py-2 rounded-lg bg-yellow-400 text-black text-sm font-semibold hover:bg-yellow-300 transition-colors active:scale-[0.98]"
          >
            {step < total - 1 ? 'Start searching' : 'Begin the hunt'}
          </button>
        </div>
      </div>
    </>
  );
}

import { getStepLabel } from '@/lib/game/engine';

interface StepIndicatorProps {
  steps: { type: string }[];
  currentStep: number;
  reachedStep: number;
}

export function StepIndicator({ steps, currentStep, reachedStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isDone = i < reachedStep;
        const stepNum = i + 1;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors
                ${isActive ? 'bg-white text-black' : ''}
                ${isDone ? 'bg-green-900/50 text-green-400' : ''}
                ${!isActive && !isDone ? 'bg-gray-800 text-gray-500' : ''}`}
            >
              <span>{isDone ? '✓' : stepNum}</span>
              <span className="hidden sm:inline">{getStepLabel(i)}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-4 h-px ${isDone ? 'bg-green-700' : 'bg-gray-800'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

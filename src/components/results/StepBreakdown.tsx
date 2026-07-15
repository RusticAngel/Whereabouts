import { Step, Clue } from '@/types';
import { getApplicableClues } from '@/lib/game/engine';
import { Badge } from '@/components/ui/Badge';

interface StepBreakdownProps {
  steps: Step[];
  clues: Clue[];
  stepReached: number;
}

export function StepBreakdown({ steps, clues, stepReached }: StepBreakdownProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Breakdown</h3>
      {steps.map((step, i) => {
        const isCorrect = i < stepReached;
        const stepClues = getApplicableClues(clues, step.type);

        return (
          <div
            key={i}
            className={`p-3 rounded-lg border ${
              isCorrect ? 'border-green-800 bg-green-900/20' : 'border-red-800 bg-red-900/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-300">{step.type}</span>
              <Badge variant={isCorrect ? 'success' : 'error'}>
                {isCorrect ? 'Correct' : 'Missed'}
              </Badge>
            </div>
            <p className="text-lg">{step.question}</p>
            <p className="text-sm text-gray-400 mt-1">
              Answer: <span className="text-white">{step.answer}</span>
            </p>
            {!isCorrect && stepClues.length > 0 && (
              <div className="mt-2 text-sm text-yellow-400">
                <p className="text-xs text-gray-500 mb-1">Clues:</p>
                {stepClues.map((c, j) => (
                  <p key={j} className="italic">— {c}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

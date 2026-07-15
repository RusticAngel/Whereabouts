interface ScoreDisplayProps {
  score: number;
  stepReached: number;
  totalSteps: number;
}

export function ScoreDisplay({ score, stepReached, totalSteps }: ScoreDisplayProps) {
  const labels = ['Country', 'Region', 'City', 'Area'];
  const stepLabel = labels[stepReached > 0 ? stepReached - 1 : 0] ?? 'Start';

  return (
    <div className="text-center space-y-2">
      <p className="text-5xl font-bold text-white">{score}</p>
      <p className="text-gray-400">points</p>
      <p className="text-lg text-gray-300">
        Reached <span className="text-white font-semibold">{stepLabel}</span> level
        {stepReached < totalSteps && (
          <span className="text-gray-500"> — missed {labels[stepReached]}</span>
        )}
      </p>
    </div>
  );
}

interface PercentileBadgeProps {
  percentile: number;
}

export function PercentileBadge({ percentile }: PercentileBadgeProps) {
  const color =
    percentile >= 90 ? 'text-yellow-400' :
    percentile >= 70 ? 'text-green-400' :
    percentile >= 50 ? 'text-blue-400' :
    'text-gray-400';

  return (
    <div className="text-center py-4">
      <p className={`text-2xl font-bold ${color}`}>
        Better than {percentile}% of players
      </p>
    </div>
  );
}

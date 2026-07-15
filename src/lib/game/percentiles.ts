export function calculatePercentile(score: number, allScores: number[]): number {
  if (allScores.length === 0) return 100;
  const worse = allScores.filter((s) => s < score).length;
  return Math.round((worse / allScores.length) * 100);
}

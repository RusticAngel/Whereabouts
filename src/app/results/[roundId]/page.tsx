import { ResultsScreen } from '@/components/results/ResultsScreen';

export default async function ResultsPage({ params }: { params: Promise<{ roundId: string }> }) {
  const { roundId } = await params;
  return <ResultsScreen roundId={roundId} />;
}

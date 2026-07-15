'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageData, Step, Clue } from '@/types';
import { calculatePercentile } from '@/lib/game/percentiles';
import { getRoundScores, getRound } from '@/app/actions';
import { ScoreDisplay } from './ScoreDisplay';
import { StepBreakdown } from './StepBreakdown';
import { PercentileBadge } from './PercentileBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ResultsScreenProps {
  roundId: string;
}

export function ResultsScreen({ roundId }: ResultsScreenProps) {
  const router = useRouter();
  const [data, setData] = useState<{
    score: number;
    stepReached: number;
    steps: Step[];
    clues: Clue[];
    imageUrl: string;
    totalSteps: number;
  } | null>(null);
  const [percentile, setPercentile] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const round = await getRound(roundId);
      if (!round) {
        router.push('/game');
        return;
      }

      const steps = (round.image_data.steps as unknown) as Step[];
      const clues = (round.image_data.clues as unknown) as Clue[];

      setData({
        score: round.total_score,
        stepReached: round.step_reached,
        steps,
        clues,
        imageUrl: round.image_data.imageUrl,
        totalSteps: steps.length,
      });

      const allScores = await getRoundScores();
      const p = calculatePercentile(round.total_score, allScores);
      setPercentile(p);
      setLoading(false);
    })();
  }, [roundId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-black text-white">
        <p className="text-gray-400">Loading results...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col min-h-dvh bg-black text-white">
      <div className="relative w-full aspect-[4/3] sm:aspect-video bg-gray-900 overflow-hidden">
        <img src={data.imageUrl} alt="Location" className="w-full h-full object-cover opacity-40" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="flex-1 -mt-16 sm:-mt-20 relative z-10 p-4 max-w-lg mx-auto w-full space-y-6">
        <Card>
          <ScoreDisplay
            score={data.score}
            stepReached={data.stepReached}
            totalSteps={data.totalSteps}
          />
        </Card>

        {percentile !== null && (
          <Card>
            <PercentileBadge percentile={percentile} />
          </Card>
        )}

        <Card>
          <StepBreakdown
            steps={data.steps}
            clues={data.clues}
            stepReached={data.stepReached}
          />
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button fullWidth variant="primary" onClick={() => router.push('/game')}>
            Play Again
          </Button>
          <Button fullWidth variant="secondary" onClick={() => router.push('/leaderboard')}>
            Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
}

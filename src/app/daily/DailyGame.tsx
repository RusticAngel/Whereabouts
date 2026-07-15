'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ImageData, Step, Clue } from '@/types';
import { evaluateAnswer, totalScoreForSteps, getApplicableClues, calculatePercentile } from '@/lib/game';
import { QuestionCard } from '@/components/game/QuestionCard';
import { StepIndicator } from '@/components/game/StepIndicator';
import { HintButton } from '@/components/game/HintButton';
import { CorrectFeedback } from '@/components/game/CorrectFeedback';
import { IncorrectFeedback } from '@/components/game/IncorrectFeedback';
import { ScoreDisplay } from '@/components/results/ScoreDisplay';
import { StepBreakdown } from '@/components/results/StepBreakdown';
import { PercentileBadge } from '@/components/results/PercentileBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { saveRound, upsertDailyScore, getRoundScores } from '@/app/actions';

interface DailyGameProps {
  image: ImageData;
  userId: string;
  date: string;
  existingScore: number | null;
}

type Phase = 'playing' | 'correct' | 'incorrect' | 'results';

export function DailyGame({ image, userId, date, existingScore }: DailyGameProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('playing');
  const [reachedStep, setReachedStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [percentile, setPercentile] = useState<number | null>(null);
  const roundEnding = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const steps = image.steps as Step[];
  const clues = image.clues as Clue[];

  const currentClue = getApplicableClues(clues, steps[currentStep]?.type ?? '')[0] ?? '';

  useEffect(() => {
    if (existingScore !== null) {
      setPhase('results');
      setScore(existingScore);
    }
  }, [existingScore]);

  const finishRound = useCallback(async (step: number, finalScore: number) => {
    await saveRound(userId, image.id, step, finalScore, step >= steps.length);
    await upsertDailyScore(userId, date, finalScore);
    const allScores = await getRoundScores();
    const p = calculatePercentile(finalScore, allScores);
    setPercentile(p);
    setPhase('results');
  }, [userId, image.id, date, steps.length]);

  const handleAnswer = useCallback(async (answer: string) => {
    if (phase !== 'playing' || roundEnding.current) return;
    const isCorrect = evaluateAnswer(steps[currentStep], answer);
    if (isCorrect) {
      setPhase('correct');
      setReachedStep(currentStep + 1);
      const newScore = totalScoreForSteps(currentStep + 1);
      setScore(newScore);
      setShowHint(false);
      timerRef.current = setTimeout(() => {
        if (currentStep + 1 >= steps.length) {
          finishRound(currentStep + 1, newScore);
        } else {
          setCurrentStep((s) => s + 1);
          setPhase('playing');
        }
      }, 800);
    } else {
      roundEnding.current = true;
      setPhase('incorrect');
      timerRef.current = setTimeout(async () => {
        await finishRound(currentStep, score);
        roundEnding.current = false;
      }, 1200);
    }
  }, [currentStep, phase, score, steps, finishRound]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  if (phase === 'results') {
    return (
      <div className="flex flex-col min-h-dvh bg-black text-white">
        <div className="relative w-full aspect-[4/3] sm:aspect-video bg-gray-900 overflow-hidden">
          <img src={image.image_url} alt="Location" className="w-full h-full object-cover opacity-40" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="flex-1 -mt-16 sm:-mt-20 relative z-10 p-4 max-w-lg mx-auto w-full space-y-6">
          <Card>
            <ScoreDisplay score={score} stepReached={reachedStep} totalSteps={steps.length} />
          </Card>
          {percentile !== null && (
            <Card>
              <PercentileBadge percentile={percentile} />
            </Card>
          )}
          <Card>
            <StepBreakdown steps={steps} clues={clues} stepReached={reachedStep} />
          </Card>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button fullWidth variant="primary" onClick={() => router.push('/game')}>
              Play More
            </Button>
            <Button fullWidth variant="secondary" onClick={() => router.push('/leaderboard')}>
              Leaderboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-black text-white">
      <div className="p-4 flex items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-yellow-400 font-semibold">Daily Challenge</span>
        <span className="text-xs text-gray-600">{date}</span>
      </div>

      <div className="relative w-full aspect-[4/3] sm:aspect-video bg-gray-900 overflow-hidden">
        <img src={image.image_url} alt="Location" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        <StepIndicator steps={steps} currentStep={currentStep} reachedStep={reachedStep} />

        <div className="flex-1">
          <QuestionCard
            step={steps[currentStep]}
            stepIndex={currentStep}
            onAnswer={handleAnswer}
            disabled={phase !== 'playing'}
          />
        </div>

        <div className="mt-4">
          <HintButton showHint={showHint} clue={currentClue} onToggle={() => setShowHint((s) => !s)} />
        </div>

        <div className="mt-2 text-center text-sm text-gray-500">Score: {score}</div>
      </div>

      {phase === 'correct' && <CorrectFeedback />}
      {phase === 'incorrect' && <IncorrectFeedback correctAnswer={steps[currentStep]?.answer ?? ''} />}
    </div>
  );
}

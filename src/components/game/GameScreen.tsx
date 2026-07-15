'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ImageData, Step, Clue } from '@/types';
import { evaluateAnswer, totalScoreForSteps, getApplicableClues } from '@/lib/game/engine';
import { QuestionCard } from './QuestionCard';
import { StepIndicator } from './StepIndicator';
import { HintButton } from './HintButton';
import { CorrectFeedback } from './CorrectFeedback';
import { IncorrectFeedback } from './IncorrectFeedback';
import { saveRound } from '@/app/actions';

interface GameScreenProps {
  image: ImageData;
  userId: string;
  isDaily?: boolean;
  date?: string;
}

export function GameScreen({ image, userId }: GameScreenProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [reachedStep, setReachedStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const roundEnding = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const steps = image.steps as Step[];
  const clues = image.clues as Clue[];

  const currentClue = getApplicableClues(clues, steps[currentStep]?.type ?? '')[0] ?? '';

  const finishRound = useCallback(async (step: number, finalScore: number) => {
    const roundId = await saveRound(userId, image.id, step, finalScore, step >= steps.length);
    if (roundId) {
      router.push(`/results/${roundId}`);
    } else {
      router.push('/game');
    }
  }, [userId, image.id, steps.length, router]);

  const handleAnswer = useCallback(async (answer: string) => {
    if (feedback !== null || roundEnding.current || currentStep >= steps.length) return;
    const isCorrect = evaluateAnswer(steps[currentStep], answer);
    if (isCorrect) {
      setFeedback('correct');
      setReachedStep(currentStep + 1);
      const newScore = totalScoreForSteps(currentStep + 1);
      setScore(newScore);
      setShowHint(false);
      timerRef.current = setTimeout(() => {
        setFeedback(null);
        if (currentStep + 1 >= steps.length) {
          finishRound(currentStep + 1, newScore);
        } else {
          setCurrentStep((s) => s + 1);
        }
      }, 800);
    } else {
      roundEnding.current = true;
      setFeedback('incorrect');
      timerRef.current = setTimeout(async () => {
        await finishRound(currentStep, score);
        if (roundEnding.current) {
          roundEnding.current = false;
        }
      }, 1200);
    }
  }, [currentStep, feedback, score, steps, finishRound]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-dvh bg-black text-white">
      <div className="relative w-full aspect-[4/3] sm:aspect-video bg-gray-900 overflow-hidden">
        <img
          src={image.image_url}
          alt="Location"
          className="w-full h-full object-cover" loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="flex-1 flex flex-col p-4 max-w-lg mx-auto w-full">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          reachedStep={reachedStep}
        />

        <div className="flex-1">
          {currentStep < steps.length && (
            <QuestionCard
              step={steps[currentStep]}
              stepIndex={currentStep}
              onAnswer={handleAnswer}
              disabled={feedback !== null}
            />
          )}
        </div>

        <div className="mt-4">
          <HintButton
            showHint={showHint}
            clue={currentClue}
            onToggle={() => setShowHint((s) => !s)}
          />
        </div>

        <div className="mt-2 text-center text-sm text-gray-500">
          Score: {score}
        </div>
      </div>

      {feedback === 'correct' && <CorrectFeedback />}
      {feedback === 'incorrect' && (
        <IncorrectFeedback correctAnswer={steps[currentStep]?.answer ?? ''} />
      )}
    </div>
  );
}

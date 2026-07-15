import { Step } from '@/types';

const SCORE_MULTIPLIERS = [100, 200, 400, 800];

export function scoreForStep(stepIndex: number): number {
  return SCORE_MULTIPLIERS[stepIndex] ?? 0;
}

export function totalScoreForSteps(correctCount: number): number {
  let total = 0;
  for (let i = 0; i < correctCount; i++) {
    total += scoreForStep(i);
  }
  return total;
}

export function evaluateAnswer(step: Step, answer: string): boolean {
  return step.answer === answer;
}

export function getStepLabel(index: number): string {
  const labels = ['Country', 'Region', 'City', 'Area'];
  return labels[index] ?? 'Unknown';
}

export function getApplicableClues(clues: { text: string; applies_to: string }[], stepType: string): string[] {
  return clues
    .filter((c) => c.applies_to === stepType)
    .map((c) => c.text);
}

'use client';

import { useReducer, useCallback } from 'react';
import { GameState, GamePhase, Step } from '@/types';
import { evaluateAnswer, totalScoreForSteps } from '@/lib/game/engine';

type GameAction =
  | { type: 'ANSWER'; payload: string }
  | { type: 'NEXT_STEP' }
  | { type: 'TOGGLE_HINT' }
  | { type: 'RESET'; payload: { totalSteps: number } };

function createInitialState(totalSteps: number): GameState {
  return {
    phase: 'playing',
    currentStep: 0,
    score: 0,
    answers: new Array(totalSteps).fill(null),
    showHint: false,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ANSWER': {
      const answer = action.payload;
      return state.phase === 'playing'
        ? { ...state, phase: 'playing' as GamePhase, answers: state.answers.map((a, i) => i === state.currentStep ? answer : a) }
        : state;
    }
    case 'NEXT_STEP': {
      const { currentStep, answers } = state;
      if (currentStep >= answers.length) return state;
      const isCorrect = evaluateAnswer(
        { type: 'country', question: '', answer: '', options: [] } as Step,
        answers[currentStep] ?? ''
      );
      return state;
    }
    case 'TOGGLE_HINT':
      return { ...state, showHint: !state.showHint };
    case 'RESET':
      return createInitialState(action.payload.totalSteps);
    default:
      return state;
  }
}

export function useGame(totalSteps: number) {
  const [state, dispatch] = useReducer(gameReducer, totalSteps, createInitialState);

  const handleAnswer = useCallback((answer: string) => {
    dispatch({ type: 'ANSWER', payload: answer });
  }, []);

  const toggleHint = useCallback(() => {
    dispatch({ type: 'TOGGLE_HINT' });
  }, []);

  const reset = useCallback((steps: number) => {
    dispatch({ type: 'RESET', payload: { totalSteps: steps } });
  }, []);

  return { state, handleAnswer, toggleHint, reset, dispatch };
}

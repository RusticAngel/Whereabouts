export interface Step {
  type: 'country' | 'region' | 'city' | 'area';
  question: string;
  answer: string;
  options: string[];
}

export interface Clue {
  text: string;
  applies_to: string;
}

export interface ImageData {
  id: string;
  image_url: string;
  steps: Step[];
  clues: Clue[];
}

export interface RoundResult {
  id: string;
  image_id: string;
  step_reached: number;
  total_score: number;
  completed: boolean;
  created_at: string;
}

export type GamePhase = 'playing' | 'correct' | 'incorrect' | 'results';

export interface GameState {
  phase: GamePhase;
  currentStep: number;
  score: number;
  answers: (string | null)[];
  showHint: boolean;
}

import { Confidence } from '@/types';
import { evidenceCost } from './evidence';

const CONFIDENCE_MULTIPLIERS: Record<Confidence, number> = {
  low: 1.0,
  medium: 1.2,
  high: 1.5,
};

const CONFIDENCE_PENALTY: Record<Confidence, number> = {
  low: 1.0,
  medium: 1.5,
  high: 2.0,
};

const HIGH_CONFIDENCE_THRESHOLD_KM = 100;

export function calculatePinScore(distanceKm: number): number {
  if (distanceKm < 1) return 5000;
  if (distanceKm < 10) return 4000;
  if (distanceKm < 50) return 3000;
  if (distanceKm < 200) return 2000;
  if (distanceKm < 1000) return 1000;
  return 0;
}

export function calculateFinalScore(
  distanceKm: number,
  evidenceRevealed: number,
  confidence: Confidence,
): number {
  const base = calculatePinScore(distanceKm);
  const deduction = evidenceCost(evidenceRevealed);
  const gross = Math.max(0, base - deduction);

  if (confidence === 'high' && distanceKm < HIGH_CONFIDENCE_THRESHOLD_KM) {
    return Math.round(gross * CONFIDENCE_MULTIPLIERS.high);
  }

  if (confidence === 'high' && distanceKm >= HIGH_CONFIDENCE_THRESHOLD_KM) {
    return Math.round(gross / CONFIDENCE_PENALTY.high);
  }

  if (confidence === 'medium') {
    return Math.round(gross * CONFIDENCE_MULTIPLIERS.medium);
  }

  return gross;
}

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
  if (distanceKm <= 10) return 5000;
  if (distanceKm > 10010) return 0;
  return Math.round(5000 - (distanceKm - 10) * 0.5);
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

import { Confidence } from '@/types';
import { evidenceCost } from './evidence';

export type Difficulty = 'move' | 'no-move' | 'nmpz';

export const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
  move: 1.0,
  'no-move': 1.2,
  nmpz: 1.5,
} as const;

export const CONFIDENCE_MULTIPLIERS: Record<Confidence, number> = {
  low: 1.0,
  medium: 1.2,
  high: 1.5,
} as const;

const CONFIDENCE_PENALTY: Record<Confidence, number> = {
  low: 1.0,
  medium: 1.5,
  high: 2.0,
} as const;

const HIGH_CONFIDENCE_THRESHOLD_KM = 100;
const EARTH_RADIUS_KM = 6371;

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export function computeMapDiagonal(locations: { lat: number; lng: number }[]): number {
  if (locations.length === 0) return 0;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const loc of locations) {
    minLat = Math.min(minLat, loc.lat);
    maxLat = Math.max(maxLat, loc.lat);
    minLng = Math.min(minLng, loc.lng);
    maxLng = Math.max(maxLng, loc.lng);
  }

  const latDist = haversineDistance(minLat, 0, maxLat, 0);
  const lngSpan = maxLng - minLng > 180 ? 360 - (maxLng - minLng) : maxLng - minLng;
  const lngDist = haversineDistance(0, minLng, 0, minLng + lngSpan);

  return Math.sqrt(latDist * latDist + lngDist * lngDist);
}

export function calculateGeoGuessrScore(distanceKm: number, mapDiagonalKm: number): number {
  const threshold = Math.max(0.025, mapDiagonalKm / 100000);
  if (distanceKm < threshold) return 5000;
  return Math.round(5000 * Math.exp(-10 * distanceKm / mapDiagonalKm));
}

export function calculateFinalScore(
  distanceKm: number,
  evidenceRevealed: number,
  confidence: Confidence,
  difficulty: Difficulty,
  mapDiagonalKm: number,
): number {
  const baseScore = calculateGeoGuessrScore(distanceKm, mapDiagonalKm);
  const deduction = evidenceCost(evidenceRevealed);
  const gross = Math.max(0, baseScore - deduction);

  let confidenceMultiplier = 1.0;
  if (confidence === 'high' && distanceKm < 100) {
    confidenceMultiplier = 1.5;
  } else if (confidence === 'high' && distanceKm >= 100) {
    confidenceMultiplier = 0.5;
  } else if (confidence === 'medium') {
    confidenceMultiplier = 1.2;
  }

  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty];

  return Math.round(gross * confidenceMultiplier * difficultyMultiplier);
}

export function applyStreakMultiplier(baseScore: number, streak: number): number {
  const cappedStreak = Math.min(streak, 5);
  return Math.round(baseScore * (1 + cappedStreak * 0.05));
}
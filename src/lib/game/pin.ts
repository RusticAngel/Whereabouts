const BASE_TIME = 30;
const TIME_PER_CORRECT = 5;
const TIME_MIN = 15;
const TIME_MAX = 60;
const TIME_BONUS_MULTIPLIER = 0.2;
const RECOVERY_DISTANCE_KM = 50;
const RECOVERY_FLAT_BONUS = 3000;

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getPinTime(correctCount: number): number {
  return Math.min(TIME_MAX, Math.max(TIME_MIN, BASE_TIME + correctCount * TIME_PER_CORRECT));
}

export function calculatePinScore(distanceKm: number): number {
  if (distanceKm < 1) return 5000;
  if (distanceKm < 10) return 4000;
  if (distanceKm < 50) return 3000;
  if (distanceKm < 200) return 2000;
  if (distanceKm < 1000) return 1000;
  return 0;
}

export function calculateRecoveryBonus(
  skippedQuestions: number,
  missedQuestionScore: number,
  distanceKm: number
): number {
  if (skippedQuestions === 0) return 0;
  if (distanceKm < RECOVERY_DISTANCE_KM) {
    return missedQuestionScore + RECOVERY_FLAT_BONUS;
  }
  return 0;
}

export function calculateTimeBonus(
  pinScore: number,
  timeRemaining: number,
  totalTime: number
): number {
  const ratio = timeRemaining / totalTime;
  return Math.round(pinScore * TIME_BONUS_MULTIPLIER * ratio);
}

export function getPinZoom(correctCount: number): number {
  return Math.min(6, 2 + correctCount);
}

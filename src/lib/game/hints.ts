import { Confidence } from '@/types';
import { calculateDistance } from './pin';

const PROXIMITY_THRESHOLDS = {
  VERY_FAR: 3000,
  FAR: 1000,
  MID: 200,
  CLOSE: 50,
  VERY_CLOSE: 0,
} as const;

type ProximityTier = keyof typeof PROXIMITY_THRESHOLDS;
type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

function getProximityTier(distanceKm: number): ProximityTier {
  if (distanceKm > 3000) return 'VERY_FAR';
  if (distanceKm > 1000) return 'FAR';
  if (distanceKm > 200) return 'MID';
  if (distanceKm > 50) return 'CLOSE';
  return 'VERY_CLOSE';
}

function getDirection(fromLat: number, fromLng: number, toLat: number, toLng: number): Direction {
  const dLat = toLat - fromLat;
  const dLng = toLng - fromLng;
  const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  if (angle < -157.5 || angle >= 157.5) return 'S';
  if (angle < -112.5) return 'SW';
  if (angle < -67.5) return 'W';
  if (angle < -22.5) return 'NW';
  if (angle < 22.5) return 'N';
  if (angle < 67.5) return 'NE';
  if (angle < 112.5) return 'E';
  return 'SE';
}

function directionWord(dir: Direction): string {
  const map: Record<Direction, string> = {
    N: 'north', NE: 'northeast', E: 'east', SE: 'southeast',
    S: 'south', SW: 'southwest', W: 'west', NW: 'northwest',
  };
  return map[dir];
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

const BROAD_HINTS: Record<ProximityTier, string[]> = {
  VERY_FAR: [
    "You're not even close to the right continent.",
    "That's not in the same hemisphere.",
    "You're further off than you realise.",
    'Not even in the same region.',
    "You've placed your pin on the other side of the world.",
  ],
  FAR: [
    "You're in the right part of the world. That's all I'll say.",
    'The general region is correct. The specifics are not.',
    'Somewhere in the neighbourhood — a very large neighbourhood.',
    "You've got the right continent. That's step one.",
    "Think bigger — you're looking at the wrong scale.",
  ],
  MID: [
    "You're in the right area, but not yet.",
    'Close, but not quite.',
    "You're getting warmer — but still not warm enough.",
    "You're circling the right spot.",
    "You're closer than most. That doesn't mean you're close.",
  ],
  CLOSE: [
    'You are very close. Keep looking.',
    'Nearly there. Adjust your pin.',
    'You can almost see it from here.',
    "You're in the vicinity — narrow it down.",
    "So close. Don't second-guess yourself.",
  ],
  VERY_CLOSE: [
    "You're practically on top of it.",
    "It's right there. Look again.",
    "You're steps away.",
    "You've found it — trust your eyes.",
    'Uncanny. You are almost exactly right.',
  ],
};

const DIRECTIONAL_HINTS: Record<ProximityTier, string[]> = {
  VERY_FAR: [
    "You're looking too far {D}.",
    'The target lies {D} of your guess.',
    'Try moving your pin {D}.',
    "You're {D} of the mark.",
    'Think {D}.',
  ],
  FAR: [
    "You're looking too far {D}.",
    'The target is {D} of here.',
    'Try shifting your pin {D}.',
    "You're {D} of the actual location.",
    'Go {D}.',
  ],
  MID: [
    "You're slightly too far {D}.",
    'Head {D} from your current pin.',
    'The target is {D} of your guess.',
    'Shift your pin {D}.',
    'Try {D} of where you are.',
  ],
  CLOSE: [
    'Just a bit {D}.',
    "You're almost there — go {D}.",
    'Move your pin slightly {D}.',
    'A touch {D}.',
    'Try just {D} of here.',
  ],
  VERY_CLOSE: [
    'You are right there — perhaps slightly {D}.',
    'Almost perfect. Just a nudge {D}.',
    "You're staring at it. Try {D}.",
    'Barely off. Adjust {D}.',
    'So close. Try a hair {D}.',
  ],
};

const META_HINTS: Record<Confidence, string[]> = {
  high: [
    "All that help… and you're certain?",
    'Confidence can be misleading.',
    "Interesting. Let's see if you're right.",
    'You sound sure. I hope you are.',
    'Certainty — the final illusion.',
  ],
  medium: [
    "You've narrowed it down… mostly.",
    'Not a bad read.',
    "You're closer than your confidence suggests.",
    'Reasonable guess. Reasonable doubt.',
    "You're on the right track, at least.",
  ],
  low: [
    'Three hints… and still unsure?',
    'You had everything you needed.',
    "Something didn't click, did it?",
    'You saw the clues. Did you trust them?',
    'Doubt can be useful. But so was your first instinct.',
  ],
};

export interface HintInput {
  pinLat: number;
  pinLng: number;
  targetLat: number;
  targetLng: number;
  hintsUsed: number;
  confidence?: Confidence;
}

export function getHint(input: HintInput): string {
  const { pinLat, pinLng, targetLat, targetLng, hintsUsed, confidence } = input;
  const distance = calculateDistance(pinLat, pinLng, targetLat, targetLng);
  const tier = getProximityTier(distance);
  const dir = getDirection(pinLat, pinLng, targetLat, targetLng);
  const dw = directionWord(dir);

  if (hintsUsed >= 2 && confidence) {
    return pickRandom(META_HINTS[confidence]);
  }

  if (hintsUsed >= 1) {
    const pool = DIRECTIONAL_HINTS[tier];
    return pickRandom(pool).replace(/\{D\}/g, dw);
  }

  return pickRandom(BROAD_HINTS[tier]);
}

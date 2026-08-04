import { Confidence } from '@/types';
import { calculateDistance } from './pin';

export interface HintContext {
  pinLat: number;
  pinLng: number;
  targetLat: number;
  targetLng: number;
  hintsUsed: number;
  confidence?: Confidence;
  cityName?: string | null;
  countryName?: string | null;
  landmarkName?: string | null;
}

export interface DynamicHint {
  text: string;
  tone: 'sarcastic' | 'playful' | 'supportive' | 'teasing' | 'gloating';
  tier: 'hot' | 'warm' | 'cold' | 'freezing';
}

/**
 * Personalized, flavoured templates — `{city}` / `{country}` / `{landmark}`
 * are only injected when the player is already close enough that naming the
 * location does not spoil the answer.
 */

type Tier = 'freezing' | 'cold' | 'warm' | 'hot';

// > 1000 km — over-the-top funny
const FREEZING: string[] = [
  'Are you sure that is even on Earth? Cipher is a continent away.',
  'Wrong hemisphere, wrong vibes, wrong everything. Go again.',
  'Cipher could file a time-zone change before you get closer.',
  'That guess is so far off it circled the planet twice in transit.',
  'You have found a very nice spot. Sadly Cipher is nowhere near it.',
];

// 100–1000 km — sarcastic, funny
const COLD: string[] = [
  'Wrong country, my friend. Start packing.',
  'Cipher is not here. They are some significant number of kilometres away.',
  'Theoretically correct hemisphere. Practically hopeless.',
  'If this were a dartboard you would be on the wrong wall.',
  'Close to a world record — for the wrong country.',
];

// 10–100 km — playful, teasing
const WARM: string[] = [
  'Getting warm... but not here. So close it hurts.',
  'Ooh, closer. You can almost smell the street food from the real spot.',
  'Not bad. Cipher is in the neighbourhood — a large neighbourhood.',
  'Warm! Now stop being brave and fine-tune that pin.',
  'You are circling the bullseye. Keep circling.',
];

// < 10 km — sarcastic, encouraging
const HOT: string[] = [
  "You're practically on top of Cipher! Shake hands from here.",
  'Painfully close. Like, within shouting distance.',
  "You're basically standing in their shadow. Look again.",
  'That is nearly a perfect hit. One more nudge.',
  'Cipher can hear you breathing. Final adjustment time.',
];

const META: Record<Confidence, string[]> = {
  high: [
    "So sure of yourself, and yet... the pin disagrees.",
    'Confidence is a wonderful thing to have in the wrong place.',
    'Bold. Let us see if the earth agrees.',
  ],
  medium: [
    'A cautious middle. The calm before the reveal.',
    'Splitting the difference — the diplomatic guess.',
    'Reasonable. Reasonable is rarely right enough.',
  ],
  low: [
    'Shooting in the dark with a blindfold. Cipher approves.',
    'That is one confident guess from a very unconfident you.',
    'Wild guess detected. We will not judge. Much.',
  ],
};

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getTier(distanceKm: number): Tier {
  if (distanceKm < 10) return 'hot';
  if (distanceKm < 100) return 'warm';
  if (distanceKm < 1000) return 'cold';
  return 'freezing';
}

export function getDynamicHint(input: HintContext): DynamicHint {
  const { pinLat, pinLng, targetLat, targetLng, hintsUsed, confidence, countryName, landmarkName } = input;
  const distance = calculateDistance(pinLat, pinLng, targetLat, targetLng);

  // After several hints, fall back to a confidence jab.
  if (hintsUsed >= 2 && confidence) {
    return { text: pickRandom(META[confidence]), tone: 'gloating', tier: getTier(distance) };
  }

  const tier = getTier(distance);
  const pool = tier === 'hot' ? HOT : tier === 'warm' ? WARM : tier === 'cold' ? COLD : FREEZING;
  let text = pickRandom(pool);

  // Personalize with the location name only when it does not spoil much — i.e.
  // once the player is genuinely in the right part of the world and seeking a
  // final lock rather than a lead.
  if ((tier === 'hot' || tier === 'warm') && countryName && hintsUsed >= 1) {
    const splice = pickRandom([
      ` (Yes, ${countryName} — you are nearly there.)`,
      ` (And for the record, you are in the right ${countryName}.)`,
    ]);
    text += splice;
  } else if (tier === 'hot' && landmarkName && hintsUsed >= 1) {
    const splice = pickRandom([
      ` (Look for ${landmarkName} — you are right there.)`,
      ` (That ${landmarkName} you keep seeing is the clue.)`,
    ]);
    text += splice;
  }

  return {
    text,
    tone: tier === 'warm' ? 'teasing' : tier === 'cold' ? 'gloating' : 'sarcastic',
    tier,
  } as DynamicHint;
}
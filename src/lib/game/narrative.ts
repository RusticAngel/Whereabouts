const FEEDBACK_TIERS: [number, string[]][] = [
  [50, [
    'Direct hit. Cipher was here.',
    'You found Cipher\'s trail. This is the place.',
    'Right on target. Cipher was in this very spot.',
  ]],
  [200, [
    'Close. You\'re picking up Cipher\'s trail.',
    'Good instincts. Cipher was nearby.',
    'You\'re getting warmer. Cipher isn\'t far.',
  ]],
  [1000, [
    'You\'re in the region, but missed key details.',
    'You have the right area. Look closer next time.',
    'Close, but Cipher slipped just beyond your reach.',
  ]],
  [Infinity, [
    'Cipher slipped through your fingers.',
    'You lost the trail. Cipher is far from here.',
    'The trail went cold. Better luck next time.',
  ]],
];

export function getNarrativeFeedback(distanceKm: number): string {
  for (const [threshold, variants] of FEEDBACK_TIERS) {
    if (distanceKm < threshold) {
      return variants[Math.floor(Math.random() * variants.length)];
    }
  }
  return FEEDBACK_TIERS[FEEDBACK_TIERS.length - 1][1][0];
}

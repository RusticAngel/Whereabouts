export function generateCaseSeed(): string {
  return crypto.randomUUID();
}

export function getImageIndexFromSeed(seed: string, totalImages: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % totalImages;
}

export function getTodayDate() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getDailyImageIndex(totalImages: number): number {
  const today = getTodayDate();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % totalImages;
}

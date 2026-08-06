import { db } from '@/db';
import { images, locationClues } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface DynamicClue {
  tier: 1 | 2 | 3;
  text: string;
  source: 'db' | 'wikipedia' | 'geonames' | 'fallback';
}

export interface ClueContext {
  countryName?: string | null;
  lat?: string | null;
  lng?: string | null;
}

interface RegionProfile {
  region: string;
  character: string;
  cityType: string;
}

// ---- Country -> coarse region profile (never names the country/city) ----

const COUNTRY_PROFILES: Record<string, RegionProfile> = {
  'USA': { region: 'North America', character: 'vast', cityType: 'metropolis' },
  'United States': { region: 'North America', character: 'vast', cityType: 'metropolis' },
  'UK': { region: 'Western Europe', character: 'maritime', cityType: 'capital' },
  'United Kingdom': { region: 'Western Europe', character: 'maritime', cityType: 'capital' },
  'England': { region: 'Western Europe', character: 'maritime', cityType: 'capital' },
  'Scotland': { region: 'Western Europe', character: 'nordic', cityType: 'capital' },
  'France': { region: 'Western Europe', character: 'elegant', cityType: 'capital' },
  'Ireland': { region: 'Western Europe', character: 'island', cityType: 'capital' },
  'Spain': { region: 'Southern Europe', character: 'mediterranean', cityType: 'old city' },
  'Portugal': { region: 'Southern Europe', character: 'atlantic coastal', cityType: 'port city' },
  'Italy': { region: 'Southern Europe', character: 'mediterranean', cityType: 'fashion capital' },
  'Greece': { region: 'Southern Europe', character: 'mediterranean', cityType: 'ancient capital' },
  'Turkey': { region: 'Eurasia', character: 'coastal', cityType: 'ancient capital' },
  'UAE': { region: 'Middle East', character: 'desert-edge', cityType: 'metropolis' },
  'United Arab Emirates': { region: 'Middle East', character: 'desert-edge', cityType: 'metropolis' },
  'India': { region: 'South Asia', character: 'tropical', cityType: 'metropolis' },
  'China': { region: 'East Asia', character: 'subtropical', cityType: 'harbour city' },
  'Taiwan': { region: 'East Asia', character: 'subtropical island', cityType: 'capital' },
  'Japan': { region: 'East Asia', character: 'island', cityType: 'metropolis' },
  'Vietnam': { region: 'Southeast Asia', character: 'tropical', cityType: 'metropolis' },
  'Morocco': { region: 'North Africa', character: 'desert-edge', cityType: 'old city' },
  'Egypt': { region: 'North Africa', character: 'desert', cityType: 'ancient capital' },
  'South Africa': { region: 'Southern Africa', character: 'ocean-facing', cityType: 'harbour city' },
  'Iceland': { region: 'Northern Europe', character: 'nordic island', cityType: 'capital' },
  'Norway': { region: 'Northern Europe', character: 'nordic fjord', cityType: 'capital' },
  'Sweden': { region: 'Northern Europe', character: 'nordic', cityType: 'capital' },
  'Denmark': { region: 'Northern Europe', character: 'nordic', cityType: 'capital' },
  'Finland': { region: 'Northern Europe', character: 'nordic', cityType: 'capital' },
  'Russia': { region: 'Eastern Europe', character: 'nordic-steppe', cityType: 'capital' },
  'Poland': { region: 'Central Europe', character: 'continental', cityType: 'capital' },
  'Germany': { region: 'Central Europe', character: 'continental', cityType: 'capital' },
  'Austria': { region: 'Central Europe', character: 'alpine', cityType: 'capital' },
  'Switzerland': { region: 'Central Europe', character: 'alpine', cityType: 'city' },
  'Hungary': { region: 'Central Europe', character: 'danubian', cityType: 'capital' },
  'Romania': { region: 'Eastern Europe', character: 'continental', cityType: 'capital' },
  'Belgium': { region: 'Western Europe', character: 'continental', cityType: 'capital' },
  'Canada': { region: 'North America', character: 'nordic', cityType: 'metropolis' },
  'Brazil': { region: 'South America', character: 'tropical', cityType: 'coastal metropolis' },
  'Peru': { region: 'South America', character: 'pacific coastal', cityType: 'capital' },
  'Chile': { region: 'South America', character: 'pacific coastal', cityType: 'capital' },
  'Ecuador': { region: 'South America', character: 'andean', cityType: 'capital' },
  'Argentina': { region: 'South America', character: 'continental', cityType: 'capital' },
};

// ---- Lat/lng -> coarse region (fallback when country name is missing) ----

interface RegionBox {
  north: number;
  south: number;
  east: number;
  west: number;
  profile: RegionProfile;
}

const REGION_BOXES: RegionBox[] = [
  { north: 71, south: 24, east: -52, west: -168, profile: { region: 'North America', character: 'vast', cityType: 'city' } },
  { north: -13, south: -56, east: -34, west: -82, profile: { region: 'South America', character: 'coastal', cityType: 'capital' } },
  { north: 71, south: 54, east: 40, west: -25, profile: { region: 'Northern Europe', character: 'nordic', cityType: 'capital' } },
  { north: 54, south: 40, east: 20, west: -11, profile: { region: 'Western Europe', character: 'continental', cityType: 'capital' } },
  { north: 54, south: 44, east: 27, west: 10, profile: { region: 'Central Europe', character: 'continental', cityType: 'capital' } },
  { north: 44, south: 30, east: 40, west: -10, profile: { region: 'Southern Europe', character: 'mediterranean', cityType: 'old city' } },
  { north: 33, south: 18, east: 35, west: -10, profile: { region: 'North Africa', character: 'desert-edge', cityType: 'old city' } },
  { north: 32, south: 12, east: 60, west: 35, profile: { region: 'Middle East', character: 'desert', cityType: 'metropolis' } },
  { north: 18, south: -35, east: 52, west: 10, profile: { region: 'Southern Africa', character: 'ocean-facing', cityType: 'city' } },
  { north: 35, south: 5, east: 90, west: 65, profile: { region: 'South Asia', character: 'tropical', cityType: 'metropolis' } },
  { north: 25, south: -11, east: 120, west: 95, profile: { region: 'Southeast Asia', character: 'tropical', cityType: 'metropolis' } },
  { north: 50, south: 20, east: 150, west: 100, profile: { region: 'East Asia', character: 'subtropical', cityType: 'metropolis' } },
];

function regionFromLatLng(lat: number, lng: number): RegionProfile | null {
  for (const box of REGION_BOXES) {
    if (lat <= box.north && lat >= box.south && lng <= box.east && lng >= box.west) {
      return box.profile;
    }
  }
  return null;
}

function profileForContext(ctx: ClueContext): RegionProfile | null {
  if (ctx.countryName) {
    const match = COUNTRY_PROFILES[ctx.countryName];
    if (match) return match;
  }
  if (ctx.lat && ctx.lng) {
    const lat = parseFloat(ctx.lat);
    const lng = parseFloat(ctx.lng);
    if (!isNaN(lat) && !isNaN(lng)) return regionFromLatLng(lat, lng);
  }
  return null;
}

// ---- Template pools (3-5 variations per tier, randomly selected) ----

const REGION_TEMPLATES = [
  'The trail leads somewhere in {region}.',
  'Somewhere in {region}, a city waits for you.',
  'Your destination sits in {region}.',
  'Cipher is laying low in {region} — narrow it down from there.',
  'Keep in mind: this hunt ends in {region}.',
];

const CHARACTER_TEMPLATES = [
  'Cipher chose a {character} city — you can feel it in the air.',
  'The scene speaks of a {character} place. Trust what you see.',
  'This is a {character} city. Watch for the details that give it away.',
  'A {character} setting — that much the intel confirms.',
];

const REGION_CHARACTER_TEMPLATES = [
  'A {character} {cityType} in {region}. That is where the trail rests.',
  'Think of a {character} {cityType} in {region} — Cipher is close.',
  'The answer: a {character} {cityType} somewhere in {region}.',
  'Lock your search onto a {character} {cityType} in {region}.',
];

const FALLBACK_TEMPLATES: Record<1 | 2 | 3, string[]> = {
  1: ['Somewhere far from home, a city waits to be found.'],
  2: ['Follow the details — the environment will tell you where this is.'],
  3: ['Trust what the scene shows you. Cipher picked this spot for a reason.'],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildTierText(profile: RegionProfile | null, tier: 1 | 2 | 3): DynamicClue {
  if (!profile) {
    return { tier, text: pickRandom(FALLBACK_TEMPLATES[tier]), source: 'fallback' };
  }
  if (tier === 1) {
    return { tier, text: pickRandom(REGION_TEMPLATES).replace('{region}', profile.region), source: 'db' };
  }
  if (tier === 2) {
    return { tier, text: pickRandom(CHARACTER_TEMPLATES).replaceAll('{character}', profile.character), source: 'db' };
  }
  return {
    tier,
    text: pickRandom(REGION_CHARACTER_TEMPLATES)
      .replace('{character}', profile.character)
      .replace('{cityType}', profile.cityType)
      .replace('{region}', profile.region),
    source: 'db',
  };
}

async function loadContext(imageId: string): Promise<ClueContext> {
  const [img] = await db
    .select({
      countryName: images.countryName,
      lat: images.lat,
      lng: images.lng,
    })
    .from(images)
    .where(eq(images.id, imageId))
    .limit(1);

  if (!img) return {};
  return {
    countryName: img.countryName,
    lat: img.lat,
    lng: img.lng,
  };
}

/**
 * Generates (or returns cached) 3 progressive region-based clues for an image.
 * Clues only ever reveal coarse region/character — never the country, city,
 * or a landmark name. Results are cached in `location_clues`.
 */
export async function getCluesForImage(imageId: string): Promise<DynamicClue[]> {
  const [cached] = await db
    .select({ clues: locationClues.clues })
    .from(locationClues)
    .where(eq(locationClues.imageId, imageId))
    .limit(1);

  const parsed = cached?.clues as DynamicClue[] | null;
  if (cached && Array.isArray(parsed) && parsed.length === 3) {
    return parsed;
  }

  const ctx = await loadContext(imageId);
  const profile = profileForContext(ctx);

  const clues: DynamicClue[] = [1, 2, 3].map((tier) => buildTierText(profile, tier as 1 | 2 | 3));

  try {
    await db
      .insert(locationClues)
      .values({ imageId, clues: clues as unknown as typeof locationClues.$inferInsert.clues })
      .onConflictDoNothing({ target: locationClues.imageId });
  } catch {
    // Cache write failures are non-fatal; we still return the clues.
  }

  return clues;
}

import { db } from '@/db';
import { images, locationClues } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface DynamicClue {
  tier: 1 | 2 | 3;
  text: string;
  source: 'db' | 'wikipedia' | 'geonames' | 'fallback';
}

export interface ClueContext {
  cityName?: string | null;
  countryName?: string | null;
  landmarkName?: string | null;
  funFact?: string | null;
  lat?: string | null;
  lng?: string | null;
}

// ---- Template pools (3-5 variations per tier, randomly selected) ----

const SUBTLE_TEMPLATES = [
  'The city you seek is in {country}.',
  'This trail leads to a city somewhere in {country}.',
  'The answer lies in {country}.',
  'Start your search in {country} — that much is certain.',
  'Someone here is painfully obvious about which {country} they are in.',
];

const MEDIUM_TEMPLATES = [
  'Keep an eye out for {landmark}.',
  'Cipher was seen near {landmark}.',
  'Before long, the street view will show {landmark}.',
  'If you spot {landmark}, you have the right neighbourhood.',
  'Legend says {landmark} is steps from the pin you are looking for.',
];

const DIRECT_TEMPLATES = [
  'You are in {city}, {country}. Cipher is right there.',
  'It is {city}, {country}. End of the line.',
  '{city}, {country} — that is where this trail dies.',
  'The trail ends in {city}, {country}.',
];

const FUN_FACT_TEMPLATES = [
  'Extra intel: {funFact}',
  'For the record: {funFact}',
  'One more thing: {funFact}',
  'Fun fact on record: {funFact}',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---- GeoNames (best-effort; requires GEONAMES_USERNAME; falls back gracefully) ----

async function geonamesName(lat: string, lng: string): Promise<{ city?: string; country?: string }> {
  const username = process.env.GEONAMES_USERNAME;
  if (!username) return {};
  try {
    const url =
      `https://api.geonames.org/findNearbyPlaceNameJSON?lat=${encodeURIComponent(lat)}` +
      `&lng=${encodeURIComponent(lng)}&username=${encodeURIComponent(username)}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!r.ok) return {};
    const j = await r.json();
    const top = j?.geonames?.[0];
    return {
      city: top?.name ?? top?.toponymName ?? undefined,
      country: top?.countryName ?? undefined,
    };
  } catch {
    return {};
  }
}

// ---- Wikipedia (best-effort fun fact; falls back gracefully) ----

async function wikipediaFunFact(
  cityName: string,
  countryName: string,
  landmarkName?: string | null,
): Promise<string | null> {
  const query = landmarkName && landmarkName !== cityName ? landmarkName : `${cityName}, ${countryName}`;
  try {
    const url =
      'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&exsentences=1' +
      '&format=json&origin=*&redirects=1&titles=' +
      encodeURIComponent(query);
    const r = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!r.ok) return null;
    const j = await r.json();
    const pages = j?.query?.pages ?? {};
    const page = Object.values(pages)[0] as { extract?: string } | undefined;
    if (!page?.extract) return null;
    const sentences = page.extract.split(/(?<=[.!?])\s+/);
    const intro = sentences[0] ?? page.extract;
    if (intro.length > 180) return intro.slice(0, 180).trimEnd() + '…';
    return intro.trim();
  } catch {
    return null;
  }
}

// ---- Tier construction ----

function buildTierText(
  ctx: ClueContext,
  tier: 1 | 2 | 3,
  funFact?: string | null,
): DynamicClue {
  if (tier === 1) {
    const country = ctx.countryName || ctx.cityName || 'a place you have visited before';
    return { tier, text: pickRandom(SUBTLE_TEMPLATES).replace('{country}', country), source: 'db' };
  }
  if (tier === 2) {
    const landmark = ctx.landmarkName || 'something unmistakable';
    return { tier, text: pickRandom(MEDIUM_TEMPLATES).replace('{landmark}', landmark), source: 'db' };
  }
  const city = ctx.cityName || 'here';
  const country = ctx.countryName || '';
  const base = pickRandom(DIRECT_TEMPLATES).replace('{city}', city).replace('{country}', country);
  const fact = funFact || ctx.funFact;
  if (fact) {
    return {
      tier,
      text: `${base} ${pickRandom(FUN_FACT_TEMPLATES).replace('{funFact}', fact)}`,
      source: funFact ? 'wikipedia' : 'db',
    };
  }
  return { tier, text: base, source: 'db' };
}

/**
 * Fetches the image's location context, enriching missing fields with
 * GeoNames (city/country) and Wikipedia (fun fact) where possible.
 */
async function loadContext(imageId: string): Promise<ClueContext> {
  const [img] = await db
    .select({
      cityName: images.cityName,
      countryName: images.countryName,
      landmarkName: images.landmarkName,
      funFact: images.funFact,
      lat: images.lat,
      lng: images.lng,
    })
    .from(images)
    .where(eq(images.id, imageId))
    .limit(1);

  if (!img) return {};

  const ctx: ClueContext = {
    cityName: img.cityName,
    countryName: img.countryName,
    landmarkName: img.landmarkName,
    funFact: img.funFact,
    lat: img.lat,
    lng: img.lng,
  };

  // Enrich missing city/country via GeoNames.
  if ((!ctx.cityName || !ctx.countryName) && ctx.lat && ctx.lng) {
    try {
      const g = await geonamesName(ctx.lat, ctx.lng);
      ctx.cityName = ctx.cityName || g.city || null;
      ctx.countryName = ctx.countryName || g.country || null;
    } catch {
      // noop
    }
  }

  return ctx;
}

/**
 * Generates (or returns cached) 3 progressive clues for an image.
 * Results are cached in `location_clues` so repeat requests avoid the network.
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

  // Wikipedia enrichment for a fun fact (only tiers 3 use it).
  let wikiFact: string | null = null;
  if (!ctx.funFact && ctx.cityName && ctx.countryName) {
    try {
      wikiFact = await wikipediaFunFact(ctx.cityName, ctx.countryName, ctx.landmarkName);
    } catch {
      wikiFact = null;
    }
  }

  const clues: DynamicClue[] = [1, 2, 3].map((tier) => buildTierText(ctx, tier as 1 | 2 | 3, wikiFact));

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
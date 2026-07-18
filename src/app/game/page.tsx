import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { profiles, images } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { LocationData, EvidenceItem } from '@/types';
import { InvestigationScreen } from '@/components/game/InvestigationScreen';

export const dynamic = 'force-dynamic';

const TOTAL_LEVELS = 28;
const REAL_LEVELS = 28;

export default async function NewGamePage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth');

  const [profile] = await db
    .select({ currentLevel: profiles.currentLevel })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  const level = profile?.currentLevel ?? 1;

  if (level > TOTAL_LEVELS) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-black text-white p-6">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h1 className="text-2xl font-bold text-yellow-400">Case Closed</h1>
          <p className="text-gray-400">You&apos;ve completed all known sightings of Cipher. The trail ends here — for now.</p>
          <div className="flex flex-col gap-3">
            <a href="/case-file" className="w-full block px-4 py-2.5 bg-white text-black rounded-lg font-medium text-center hover:bg-gray-200 transition-colors">
              View Case File
            </a>
            <a href="/leaderboard" className="w-full block px-4 py-2.5 bg-gray-800 text-white rounded-lg font-medium text-center hover:bg-gray-700 transition-colors">
              Leaderboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (level > REAL_LEVELS) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-black text-white p-6">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-yellow-400/10 flex items-center justify-center">
            <span className="text-3xl">&#128220;</span>
          </div>
          <h1 className="text-2xl font-bold text-yellow-400">New Intel Incoming</h1>
          <p className="text-gray-400 leading-relaxed">
            Cipher&apos;s trail continues…<br />
            We&apos;re still gathering intel for this location.
          </p>
          <a
            href="/case-file"
            className="inline-block px-6 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Return to Case File
          </a>
        </div>
      </div>
    );
  }

  const [image] = await db
    .select()
    .from(images)
    .where(and(eq(images.provider, 'mapillary'), eq(images.isPano, true), eq(images.levelOrder, level)))
    .limit(1);

  if (!image) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-black text-white">
        <p className="text-gray-400">No locations available.</p>
      </div>
    );
  }

  const locationData: LocationData = {
    id: image.id,
    image_url: image.imageUrl,
    lat: image.lat ?? null,
    lng: image.lng ?? null,
    briefing: image.briefing ?? '',
    evidence: (image.evidence ?? []) as EvidenceItem[],
    level_order: image.levelOrder ?? level,
    provider: image.provider ?? 'mapillary',
    mapillary_id: image.mapillaryId ?? null,
  };

  return (
    <InvestigationScreen
      location={locationData}
      userId={session.user.id}
      level={level}
    />
  );
}

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { profiles, images } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { LocationData, EvidenceItem } from '@/types';
import { InvestigationScreen } from '@/components/game/InvestigationScreen';
import { FinaleScreen } from '@/components/results/FinaleScreen';
import { getCampaignScores } from '@/app/actions';

export const dynamic = 'force-dynamic';

const TOTAL_LEVELS = 79;

export default async function NewGamePage({ searchParams }: { searchParams: Promise<{ level?: string; replay?: string }> }) {
  const { level: levelParam, replay } = await searchParams;

  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth');

  const [profile] = await db
    .select({ currentLevel: profiles.currentLevel })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  const level = levelParam ? parseInt(levelParam, 10) : (profile?.currentLevel ?? 1);

  if (level > TOTAL_LEVELS) {
    const entries = await getCampaignScores(session.user.id);
    const campaignTotal = entries.reduce((sum, e) => sum + e.bestScore, 0);
    const levelsCompleted = entries.filter((e) => e.completed).length;
    return (
      <FinaleScreen
        campaignTotal={campaignTotal}
        levelsCompleted={levelsCompleted}
        totalLevels={TOTAL_LEVELS}
      />
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
    city_name: image.cityName ?? null,
    country_name: image.countryName ?? null,
    landmark_name: image.landmarkName ?? null,
    fun_fact: image.funFact ?? null,
  };

  return (
    <InvestigationScreen
      location={locationData}
      userId={session.user.id}
      level={level}
      isReplay={replay === '1'}
    />
  );
}

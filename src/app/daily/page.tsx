import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { images, dailyScores } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { DailyGame } from './DailyGame';
import { LocationData, EvidenceItem } from '@/types';

export const dynamic = 'force-dynamic';

function getTodayDate() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function getDailyImageIndex(totalImages: number): number {
  const today = getTodayDate();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % totalImages;
}

export default async function DailyPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth');

  const today = getTodayDate();

  const allImages = await db
    .select()
    .from(images)
    .where(eq(images.provider, 'mapillary'));

  if (allImages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-black text-white">
        <p className="text-gray-400">No sightings available.</p>
      </div>
    );
  }

  const index = getDailyImageIndex(allImages.length);
  const dailyImage = allImages[index];

  const [existing] = await db
    .select()
    .from(dailyScores)
    .where(and(eq(dailyScores.userId, session.user.id), eq(dailyScores.date, today)))
    .limit(1);

  const locationData: LocationData = {
    id: dailyImage.id,
    image_url: dailyImage.imageUrl,
    lat: dailyImage.lat ?? null,
    lng: dailyImage.lng ?? null,
    briefing: dailyImage.briefing ?? '',
    evidence: (dailyImage.evidence ?? []) as EvidenceItem[],
    level_order: 0,
    provider: dailyImage.provider ?? 'mapillary',
    mapillary_id: dailyImage.mapillaryId ?? null,
  };

  return (
    <DailyGame
      location={locationData}
      userId={session.user.id}
      date={today}
      existingScore={existing?.totalScore ?? null}
    />
  );
}

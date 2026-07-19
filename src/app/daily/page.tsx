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
    .where(and(eq(images.provider, 'mapillary'), eq(images.isPano, true)));

  if (allImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-black text-white gap-4">
        <p className="text-gray-400">No sightings available.</p>
        <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors">Back to Home</a>
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

import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { images, profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { LocationData, EvidenceItem } from '@/types';
import { InvestigationScreen } from '@/components/game/InvestigationScreen';

export const dynamic = 'force-dynamic';

export default async function GamePage({ params, searchParams }: { params: Promise<{ imageId: string }>, searchParams: Promise<{ replay?: string }> }) {
  const { imageId } = await params;
  const { replay } = await searchParams;
  const { data: session } = await auth.getSession();
  const user = session?.user;
  if (!user) redirect('/auth');

  const [image] = await db
    .select()
    .from(images)
    .where(eq(images.id, imageId))
    .limit(1);

  if (!image) notFound();

  const [profile] = await db
    .select({ currentLevel: profiles.currentLevel })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  const level = image.levelOrder ?? profile?.currentLevel ?? 1;

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
      userId={user.id}
      level={level}
      isReplay={replay === '1'}
    />
  );
}

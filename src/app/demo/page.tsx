import { db } from '@/db';
import { images } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { DemoGame } from '@/components/demo/DemoGame';
import { LocationData, EvidenceItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DemoPage() {
  const [image] = await db
    .select()
    .from(images)
    .where(and(eq(images.provider, 'mapillary'), eq(images.isPano, true), eq(images.levelOrder, 1)))
    .limit(1);

  if (!image) {
    return (
      <div className="min-h-dvh bg-black text-white flex flex-col items-center justify-center p-6">
        <p className="text-gray-400">Demo unavailable.</p>
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
    level_order: image.levelOrder ?? 1,
    provider: image.provider ?? 'mapillary',
    mapillary_id: image.mapillaryId ?? null,
  };

  return <DemoGame location={locationData} />;
}

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { images, challenges } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { ChallengeScreen } from '@/components/challenge/ChallengeScreen';
import { DeepLinkBanner } from '@/components/challenge/DeepLinkBanner';
import { LocationData, EvidenceItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ChallengePage({ params }: { params: Promise<{ challengeId: string }> }) {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth');

  const { challengeId } = await params;

  const [challenge] = await db
    .select()
    .from(challenges)
    .where(eq(challenges.id, challengeId))
    .limit(1);

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-black text-white gap-4 p-4">
        <p className="text-gray-400">Challenge not found.</p>
        <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors">Back to Home</a>
      </div>
    );
  }

  const [image] = await db
    .select()
    .from(images)
    .where(and(eq(images.id, challenge.imageId), eq(images.isPano, true)))
    .limit(1);

  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-black text-white gap-4 p-4">
        <p className="text-gray-400">Location data unavailable.</p>
        <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors">Back to Home</a>
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
    level_order: 0,
    provider: image.provider ?? 'mapillary',
    mapillary_id: image.mapillaryId ?? null,
  };

  return (
    <>
      <DeepLinkBanner challengeId={challenge.id} />
      <ChallengeScreen
        challengeId={challenge.id}
        location={locationData}
        userId={session.user.id}
      />
    </>
  );
}

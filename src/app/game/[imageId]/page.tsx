import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth/server';
import { db } from '@/db';
import { images } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { GameScreen } from '@/components/game/GameScreen';

export const dynamic = 'force-dynamic';

export default async function GamePage({ params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = await params;
  const { data: session } = await auth.getSession();
  const user = session?.user;
  if (!user) redirect('/auth');

  const [image] = await db
    .select()
    .from(images)
    .where(eq(images.id, imageId))
    .limit(1);

  if (!image) notFound();

  const imageData = {
    id: image.id,
    image_url: image.imageUrl,
    steps: image.steps as unknown as any[],
    clues: image.clues as unknown as any[],
  };

  return (
    <GameScreen
      image={imageData}
      userId={user.id}
    />
  );
}

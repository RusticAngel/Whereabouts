import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { images, dailyScores } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { DailyGame } from './DailyGame';

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

  const allImages = await db.select().from(images);
  if (allImages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-black text-white">
        <p className="text-gray-400">No images available.</p>
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

  const imageData = {
    id: dailyImage.id,
    image_url: dailyImage.imageUrl,
    steps: dailyImage.steps as unknown as any[],
    clues: dailyImage.clues as unknown as any[],
  };

  return (
    <DailyGame
      image={imageData}
      userId={session.user.id}
      date={today}
      existingScore={existing?.totalScore ?? null}
    />
  );
}

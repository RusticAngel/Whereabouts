import { redirect } from 'next/navigation';
import { getRandomImage } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function NewGamePage() {
  const image = await getRandomImage();

  if (!image) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-black text-white">
        <p className="text-gray-400">No images available. Check back later.</p>
      </div>
    );
  }

  redirect(`/game/${image.id}`);
}

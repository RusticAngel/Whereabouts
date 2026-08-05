import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { FriendsPage } from '@/components/friends/FriendsPage';

export const dynamic = 'force-dynamic';

export default async function FriendsRoute() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect('/auth?redirect=/friends');

  return <FriendsPage userId={session.user.id} />;
}

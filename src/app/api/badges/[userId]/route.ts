import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { badges } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const rows = await db
    .select({ badgeId: badges.badgeId, unlockedAt: badges.unlockedAt })
    .from(badges)
    .where(eq(badges.userId, userId))
    .orderBy(badges.unlockedAt);

  return NextResponse.json({ userId, badges: rows });
}
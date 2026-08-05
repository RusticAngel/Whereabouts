'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPendingRequestsCount } from '@/app/actions';

interface NotificationBadgeProps {
  userId: string;
}

export function NotificationBadge({ userId }: NotificationBadgeProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { count } = await getPendingRequestsCount(userId);
      if (!cancelled) setCount(count);
    })();
    const interval = setInterval(async () => {
      const { count } = await getPendingRequestsCount(userId);
      if (!cancelled) setCount(count);
    }, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [userId]);

  return (
    <Link
      href="/friends"
      className="w-full sm:w-auto px-8 py-3 rounded-lg border border-gray-700 text-white font-semibold hover:bg-gray-900 transition-colors inline-flex items-center justify-center gap-2"
    >
      <span>Friends</span>
      {count > 0 && (
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-yellow-400 text-black text-xs font-bold">
          {count}
        </span>
      )}
    </Link>
  );
}
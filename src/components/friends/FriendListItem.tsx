'use client';

import { useRouter } from 'next/navigation';

export interface FriendListItemData {
  userId: string;
  username: string;
  level: number;
  title: string;
  lastActiveAt: Date | null;
}

function formatStatus(lastActiveAt: Date | null): { label: string; online: boolean } {
  if (!lastActiveAt) return { label: 'Offline', online: false };

  const diffMs = Date.now() - new Date(lastActiveAt).getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins < 5) return { label: 'Online', online: true };

  const hours = Math.floor(mins / 60);
  if (hours < 24) return { label: `${hours}h ago`, online: false };

  const days = Math.floor(hours / 24);
  if (days < 7) return { label: `${days}d ago`, online: false };

  return { label: 'Offline', online: false };
}

interface FriendListItemProps {
  friend: FriendListItemData;
}

export function FriendListItem({ friend }: FriendListItemProps) {
  const router = useRouter();
  const status = formatStatus(friend.lastActiveAt);

  return (
    <button
      onClick={() => router.push(`/profile/${friend.userId}`)}
      className="w-full flex items-center justify-between rounded-xl bg-gray-900 border border-gray-800 p-4 text-left hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center shrink-0">
          <span className="text-lg">⭐</span>
        </div>
        <div className="min-w-0">
          <div className="font-semibold truncate">{friend.username}</div>
          <div className="text-xs text-gray-400 truncate">{friend.title} · Level {friend.level}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-3">
        <span className={`w-2 h-2 rounded-full ${status.online ? 'bg-green-500' : 'bg-gray-600'}`} />
        <span className={`text-xs ${status.online ? 'text-green-400' : 'text-gray-500'}`}>{status.label}</span>
      </div>
    </button>
  );
}

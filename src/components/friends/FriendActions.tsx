'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { createChallenge, removeFriend } from '@/app/actions';
import { shareChallenge } from '@/lib/share';

interface FriendActionsProps {
  friendId: string;
  friendName: string;
}

export function FriendActions({ friendId, friendName }: FriendActionsProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleChallenge = useCallback(async () => {
    const newChallengeId = await createChallenge();
    if (!newChallengeId) return;

    const shareUrl = `${window.location.origin}/challenge/${newChallengeId}`;
    const shareText = `Think you can track Cipher? ${friendName} dared me — beat my challenge! 🌍`;
    await shareChallenge(shareText, shareUrl, setCopied);
  }, [friendName]);

  const handleRemove = async () => {
    if (!confirmingRemove) {
      setConfirmingRemove(true);
      return;
    }
    setBusy(true);
    await removeFriend(friendId);
    router.push('/friends');
  };

  return (
    <div className="space-y-3">
      <Button fullWidth variant="primary" onClick={handleChallenge} disabled={busy}>
        {copied ? 'Link copied — send it to ' + friendName : 'Challenge Friend'}
      </Button>
      <Button
        fullWidth
        variant={confirmingRemove ? 'outline' : 'ghost'}
        className={confirmingRemove ? '!border-red-500 !text-red-400' : '!text-red-400'}
        onClick={handleRemove}
        disabled={busy}
      >
        {confirmingRemove ? 'Tap again to confirm removal' : 'Remove Friend'}
      </Button>
      {!confirmingRemove && (
        <Button fullWidth variant="ghost" onClick={() => router.push('/friends')}>
          Back to Friends
        </Button>
      )}
    </div>
  );
}

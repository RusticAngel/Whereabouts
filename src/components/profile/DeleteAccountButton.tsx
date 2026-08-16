'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { deleteMyAccount } from '@/app/actions';

export function DeleteAccountButton() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 5000);
      return;
    }
    setBusy(true);
    setError(null);
    const result = await deleteMyAccount();
    if (result.success) {
      window.location.href = '/';
    } else {
      setBusy(false);
      setConfirming(false);
      setError('Could not delete your account. Please try again.');
    }
  };

  return (
    <div className="pt-4 border-t border-gray-800">
      <p className="text-sm text-gray-500 mb-3">
        Deleting your account permanently removes your profile, scores, badges, and progress.
      </p>
      <Button
        fullWidth
        variant="outline"
        onClick={handleClick}
        disabled={busy}
        className={confirming ? 'border-red-500 text-red-400 hover:bg-red-500/10' : 'border-red-900 text-red-400 hover:bg-red-900/20'}
      >
        {busy ? 'Deleting…' : confirming ? 'Tap again to confirm — irreversible' : 'Delete Account'}
      </Button>
      {error && <p className="text-sm text-red-400 mt-2 text-center">{error}</p>}
    </div>
  );
}
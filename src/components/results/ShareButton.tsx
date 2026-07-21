'use client';

import { useRef, useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/Button';

interface ShareButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  shareText: string;
  label?: string;
}

export function ShareButton({ targetRef, shareText, label = 'Share as Image' }: ShareButtonProps) {
  const [capturing, setCapturing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    if (!targetRef.current) return;
    setCapturing(true);

    try {
      const canvas = await html2canvas(targetRef.current, {
        background: '#0a0a0a',
        scale: 2,
        useCORS: true,
        logging: false,
      } as any);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png', 1)
      );

      if (!blob) throw new Error('Failed to generate image');

      const file = new File([blob], 'findme-result.png', { type: 'image/png' });

      if (typeof navigator.share === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'FindMe Result',
          text: shareText,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'findme-result.png';
        a.click();
        URL.revokeObjectURL(url);

        try {
          await navigator.clipboard.writeText(shareText);
          setCopied(true);
        } catch { }

        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
      } catch {
        alert(shareText);
      }
      setTimeout(() => setCopied(false), 2000);
    }

    setCapturing(false);
  }, [targetRef, shareText]);

  return (
    <Button fullWidth variant="primary" onClick={handleShare} disabled={capturing}>
      {capturing ? 'Generating…' : copied ? 'Copied!' : label}
    </Button>
  );
}

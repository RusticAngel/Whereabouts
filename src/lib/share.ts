import { Share } from '@capacitor/share';

export async function shareChallenge(
  text: string,
  url: string,
  setCopied: (v: boolean) => void,
) {
  try {
    await Share.share({ title: 'FindMe Challenge', text, url });
    return;
  } catch { }

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: 'FindMe Challenge', text, url });
      return;
    } catch { }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch {
    alert(`Share this link with your friends:\n\n${url}`);
  }
}

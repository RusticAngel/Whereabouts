import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function DeleteAccountPage() {
  return (
    <main className="flex flex-col min-h-dvh bg-black text-white">
      <div className="max-w-2xl mx-auto w-full px-6 py-12 space-y-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold">Delete Your FindMe Account</h1>
        <p className="text-sm text-gray-500">
          FindMe — delete your account and all associated data
        </p>

        <section className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            You can permanently delete your account and the data associated with it at any time.
            Deletion is <strong>immediate and irreversible</strong> — your progress, scores, and
            badges cannot be recovered.
          </p>

          <h2 className="text-lg font-semibold text-white pt-4">How to delete your account</h2>

          <div className="rounded-xl bg-gray-900 border border-gray-800 p-5 space-y-3">
            <p className="font-semibold text-white">Option A — In the app (recommended)</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Sign in to your FindMe account.</li>
              <li>Open your <strong>Agent Profile</strong> page.</li>
              <li>Scroll to the bottom and tap <strong>Delete Account</strong>.</li>
              <li>Confirm the deletion when prompted.</li>
            </ol>
            <p className="text-gray-400">
              Your account and data are removed immediately.
            </p>
          </div>

          <div className="rounded-xl bg-gray-900 border border-gray-800 p-5 space-y-3">
            <p className="font-semibold text-white">Option B — By email</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Email{' '}
                <a href="mailto:rustic.angel79@gmail.com" className="text-yellow-400 hover:underline">
                  rustic.angel79@gmail.com
                </a>{' '}
                from the email address registered to your account.</li>
              <li>Use the subject line <strong>Account deletion request</strong>.</li>
              <li>We will process your request within 30 days and confirm by reply.</li>
            </ol>
          </div>

          <h2 className="text-lg font-semibold text-white pt-4">Data that is deleted</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Profile and username</li>
            <li>XP, level, and title</li>
            <li>Badges</li>
            <li>Friends and friend requests</li>
            <li>Campaign progress and level history</li>
            <li>Rounds and scores (including daily challenge scores)</li>
            <li>Challenges you created and their results</li>
          </ul>

          <h2 className="text-lg font-semibold text-white pt-4">Data that is kept</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>No personal data is kept after deletion.</li>
            <li>
              Infrastructure backups may retain data for up to 30 days, after which they are
              purged. This data is never used for any purpose.
            </li>
            <li>
              Anonymous, aggregated statistics (for example, average scores) may remain, but
              cannot be linked back to you.
            </li>
          </ul>

          <p className="pt-2">
            Questions? Contact us at{' '}
            <a href="mailto:rustic.angel79@gmail.com" className="text-yellow-400 hover:underline">
              rustic.angel79@gmail.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  );
}
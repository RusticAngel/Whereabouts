import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function PrivacyPage() {
  return (
    <main className="flex flex-col min-h-dvh bg-black text-white">
      <div className="max-w-2xl mx-auto w-full px-6 py-12 space-y-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: July 19, 2026</p>

        <section className="space-y-4 text-sm text-gray-300 leading-relaxed">
          <p>
            FindMe (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the app&rdquo;) is a detective-style location
            deduction game. This policy explains what data we collect, how we use it, and your rights.
          </p>

          <h2 className="text-lg font-semibold text-white pt-4">1. Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account data:</strong> email address and nickname (provided at sign-up)</li>
            <li><strong>Game data:</strong> pin placements, scores, evidence reveals, hints used, and level progress</li>
            <li><strong>Daily challenge data:</strong> daily scores linked to your user ID and date</li>
          </ul>

          <h2 className="text-lg font-semibold text-white pt-4">2. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To authenticate you and maintain your session</li>
            <li>To display your scores and nickname on leaderboards</li>
            <li>To track your campaign progress through levels</li>
            <li>To enable daily challenge scoring</li>
          </ul>

          <h2 className="text-lg font-semibold text-white pt-4">3. Data Storage</h2>
          <p>
            Your data is stored in a Neon Postgres database hosted on AWS. Authentication is handled by
            Neon Auth. We implement industry-standard encryption for data in transit and at rest.
          </p>

          <h2 className="text-lg font-semibold text-white pt-4">4. Third-Party Services</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Neon (neon.tech)</strong> &mdash; database hosting and authentication</li>
            <li><strong>Mapillary (mapillary.com)</strong> &mdash; 360° Street View imagery (loaded client-side via their SDK)</li>
            <li><strong>Vercel (vercel.com)</strong> &mdash; application hosting</li>
          </ul>
          <p>
            We do not sell, share, or transfer your personal data to any third parties beyond what is
            strictly necessary to operate the application.
          </p>

          <h2 className="text-lg font-semibold text-white pt-4">5. Data Retention</h2>
          <p>
            We retain your account data and game history for as long as your account is active. If you
            wish to delete your account and associated data, contact us at the email below.
          </p>

          <h2 className="text-lg font-semibold text-white pt-4">6. Your Rights</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You can request access to the data we hold about you</li>
            <li>You can request correction or deletion of your data</li>
            <li>You can delete your nickname from the leaderboard at any time</li>
          </ul>

          <h2 className="text-lg font-semibold text-white pt-4">7. Contact</h2>
          <p>
            For privacy-related inquiries, open an issue at{' '}
            <a href="https://github.com/RusticAngel/Whereabouts/issues" className="text-yellow-400 hover:underline">
              github.com/RusticAngel/Whereabouts
            </a>.
          </p>
        </section>
      </div>
    </main>
  );
}

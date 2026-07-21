# Find Me

A detective-style location deduction game. Track a shadow operative named Cipher across 28 global locations using 360° Street View, environmental evidence, and your geographical intuition. Compete with friends via shareable challenges and climb the daily leaderboard.

## How it works

1. **Briefing** — Read the narrative briefing about Cipher's last known location
2. **Explore** — Full-screen 360° Street View. Drag to explore. Reveal evidence cards for sensory clues (each costs points).
3. **Pin** — Place your pin on a world map. Set your confidence level (Low safe, Medium ×1.2, High ×1.5 or ÷2).
4. **Results** — See your score, how far you were, staged map reveal (red pin → green pin → connecting line), and narrative feedback.

## Play with Friends

- **Challenges** — Share a link. Anyone with the link plays the same deterministic case. Inline leaderboard shows who scored highest.
- **Daily Challenge** — One case per day. Streak multiplier (up to 1.25×). Global leaderboard.
- **Rematch** — Generate a new seed and re-challenge the same opponents.

## Setup

```bash
# Install dependencies
npm install

# Environment variables (copy .env.local.example or create .env.local)
DATABASE_URL=postgres://...
NEON_AUTH_BASE_URL=...
NEON_AUTH_COOKIE_SECRET=...
NEXT_PUBLIC_MAPILLARY_ACCESS_TOKEN=...

# Run the dev server
npm run dev

# Network-accessible dev (for phone testing)
npm run dev:network
```

### Database

The project uses Neon Postgres with Drizzle ORM.

```bash
# Push schema changes to the DB
npx drizzle-kit push

# Or run a raw SQL migration
node --experimental-strip-types --env-file .env.local -e "import {neon} from '@neondatabase/serverless'; const sql = neon(process.env.DATABASE_URL!); await sql\`...\`;"
```

### Seed data

```bash
node --experimental-strip-types --env-file .env.local seed.ts
```

Creates 28 real Mapillary 360° locations with briefings and evidence.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind v4)
- **Database:** Neon Postgres via `@neondatabase/serverless`
- **ORM:** Drizzle ORM
- **Auth:** Neon Auth (email/password)
- **Street View:** Mapillary (`mapillary-js`)
- **Mapping:** Leaflet
- **Mobile:** Capacitor v8 (Android)

## How AI was used

### Codex (opencode CLI)

Codex was used throughout development as an interactive pair programmer. Every feature was built through conversational sessions with Codex, including:

- **Multiplayer system** — Codex designed and implemented the `challenges` and `challenge_results` database schema, server actions (`createChallenge`, `saveChallengeResult`, `getFocusedLeaderboard`), and the ChallengeScreen component with inline leaderboard, rematch flow, and relative performance feedback.
- **Daily challenge + streak system** — Codex built the DailyGame component, streak tracking logic, streak multiplier scoring.
- **Results screen redesign** — Codex created the shareable ResultCard component with `html2canvas` export for viral sharing.
- **Detective theme conversion** — Codex helped refactor from a quiz game to the Cipher-detective narrative, including briefings, evidence system, and narrative feedback.
- **Mobile responsiveness** — Codex handled viewport, responsive layouts, Leaflet resize handling, and deep linking configuration.

### GPT-5.6

GPT-5.6 was used for:

- **Game narrative** — Generated all 28 location briefings and 84 evidence items (3 per location) with a consistent detective-fiction tone, avoiding landmark names to prevent googling.
- **Game mechanics design** — Helped design the scoring formula (tiered pin scores, scaled evidence cost, confidence multipliers), the progression system, and the narrative feedback tiers.
- **UX copy** — Rewrote ~90 UI strings across the app to a mission-based detective tone.
- **Naming** — Generated the game name "Find Me" and the operative codename "Cipher."

## Project Structure

```
src/
├── app/              # Next.js App Router pages + API routes
│   ├── challenge/    # Shareable challenge route
│   ├── daily/        # Daily challenge
│   ├── game/         # Campaign game flow
│   └── results/      # Results page
├── components/       # React components
│   ├── challenge/    # ChallengeScreen, DeepLinkBanner
│   ├── game/         # StreetView, PinMap, EvidencePanel, etc.
│   └── results/      # ResultCard, ResultsMap, ShareButton
├── db/               # Schema + Drizzle client
├── lib/              # Game logic (scoring, evidence, narrative, pin)
└── types/            # TypeScript interfaces
```

## Live Demo

Try the tutorial at **https://whereabouts-navy.vercel.app/demo** — no signup required.

# Whereabouts — Session Memory

## Project
GeoGuess-style geography game. Players identify locations through progressive question chains (country→region→city→area) with cumulative scoring.

## Stack
- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind v4)
- **Database:** Neon Postgres via `@neondatabase/serverless` (pooled connection)
- **ORM:** Drizzle ORM (`drizzle-orm` + `drizzle-kit`)
- **Auth:** Neon Auth (email/password), wrapped in `@neondatabase/auth`
- **Mobile:** Capacitor v8 (`@capacitor/android`, `@capacitor/core`, `@capacitor/cli`)

## Project Location
`C:\Victor\Projects\whereabouts` (symlinked/networked from Z:\Victor\whereabouts or similar)

## Environment
- `.env.local` has: `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`
- Node 22, npm 10+
- Java 21 (Eclipse Adoptium), Gradle 9.2
- Android SDK at `C:\Users\willi\AppData\Local\Android\Sdk`
- C: drive is often critically low on space

## Database Schema (`src/db/schema.ts`)
- **images** — `id` (uuid, PK), `image_url`, `steps` (jsonb), `clues` (jsonb), `created_at`
- **rounds** — `id` (uuid, PK), `user_id`, `image_id` (FK → images, NO CASCADE), `step_reached`, `total_score`, `completed`, `created_at`
- **daily_scores** — `id` (uuid, PK), `user_id`, `date`, `total_score` — unique on (user_id, date)
- **profiles** — `id` (uuid, PK), `username`, `avatar_url`, `created_at`

## Auth
- Routes protected by `proxy.ts` middleware (Neon Auth middleware)
- Protected paths: `/game`, `/results`, `/leaderboard`, `/daily`
- Login page at `/auth`
- Server client: `src/lib/auth/server.ts`
- Client instance: `src/lib/auth/client.ts`

## Game Mechanics
- Flow: show image → ask sequential questions → stop on first wrong → save round → results
- Scoring: step 0=100, 1=200, 2=400, 3=800 (cumulative for correct steps only)
- Engine: `src/lib/game/engine.ts` — `evaluateAnswer()`, `totalScoreForSteps()`, `getApplicableClues()`
- Percentiles: `src/lib/game/percentiles.ts`

## Seed Data
- 20 images in `seed.ts` — all Unsplash URLs verified working (HTTP 200)
- Cleared and re-seeded (was duplicated from running seed twice)
- Run with: `node --experimental-strip-types --env-file .env.local seed.ts`
- Seed now truncates old data first: `DELETE FROM rounds`, `DELETE FROM daily_scores`, `DELETE FROM images`

## Key Files
| File | Purpose |
|---|---|
| `src/app/actions.ts` | Server actions (saveRound, getRound, getRoundScores, upsertDailyScore) |
| `src/components/game/GameScreen.tsx` | Core game loop |
| `src/components/game/QuestionCard.tsx` | Question with 4 answer options |
| `src/components/game/StepIndicator.tsx` | Shows step progress |
| `src/components/game/HintButton.tsx` | Clue toggle |
| `src/components/game/CorrectFeedback.tsx` | Green "Correct!" overlay |
| `src/components/game/IncorrectFeedback.tsx` | Red "Incorrect" overlay (blocks clicks) |
| `src/components/results/ResultsScreen.tsx` | End-of-round results |
| `src/app/daily/DailyGame.tsx` | Daily challenge (self-contained game + results) |
| `src/app/game/[imageId]/page.tsx` | Active game route |
| `proxy.ts` | Route guard middleware |
| `capacitor.config.ts` | Capacitor config (server URL, Android settings) |

## Mobile Responsiveness (applied)
- Viewport meta tag added to `layout.tsx`
- Responsive text: `text-lg sm:text-xl` on QuestionCard
- Responsive overlap: `-mt-16 sm:-mt-20` on results screens
- Button stacking: `flex-col sm:flex-row` on results
- `loading="lazy"` on all images
- Feedback overlays: responsive padding and text size

## Current Session Progress
- [x] Fixed 10 broken seed image URLs (were 404s)
- [x] Investigated image mismatches (Grand Canyon was ice cream sundae, New Orleans was person portrait)
- [x] Replaced Grand Canyon: `1755276263531-3e9fadeefaa6`
- [x] Replaced New Orleans: `1722285805560-744c39a064ef`
- [x] Cleared duplicate DB rows and re-seeded clean
- [x] Mobile responsive fixes (viewport, text scaling, button layout, lazy loading)
- [x] Installed Capacitor (`@capacitor/android`, `@capacitor/core`, `@capacitor/cli`)
- [x] Initial APK build (points to local dev server)
- [ ] Deploy to Vercel — user connects GitHub repo, sets env vars
- [ ] Rebuild APK pointing to Vercel URL
- [ ] Remove `cleartext`/`allowMixedContent` from capacitor config (HTTPS now)
- [ ] Convert APK to AAB for Play Store (optional)

## This Session (2026-07-15)
- Created GitHub repo: `https://github.com/RusticAngel/Whereabouts.git`
- git init, committed all files (108 files, 14,547 insertions)
- Pushed to GitHub (master branch)
- Deployed to Vercel at `https://whereabouts-navy.vercel.app`
- Rebuilt APK pointing to live Vercel URL
- Removed `cleartext`/`allowMixedContent` from capacitor config (HTTPS now)
- Pending: Convert APK to AAB for Play Store (optional)

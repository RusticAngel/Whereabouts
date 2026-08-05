import { neon } from '@neondatabase/serverless';

const directUrl = process.env.DATABASE_URL.replace('-pooler.', '.');
const sql = neon(directUrl);
console.log('using host:', new URL(directUrl).hostname);

await sql`
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0
`;
await sql`
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1
`;
await sql`
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Rookie Agent'
`;
await sql`
  CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS badges_user_idx ON badges(user_id)
`;
await sql`
  CREATE TABLE IF NOT EXISTS friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    friend_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, friend_user_id)
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS friends_user_idx ON friends(user_id)
`;

const tables = await sql`
  SELECT table_name FROM information_schema.tables WHERE table_name IN ('profiles','badges','friends') ORDER BY table_name
`;
console.log('tables now:', tables.map((r) => r.table_name).join(', '));

const cols = await sql`
  SELECT column_name FROM information_schema.columns WHERE table_name='profiles' AND column_name IN ('xp','level','title') ORDER BY column_name
`;
console.log('profiles cols:', cols.map((r) => r.column_name).join(', '));
console.log('done');
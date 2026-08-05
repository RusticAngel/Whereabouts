import { neon } from '@neondatabase/serverless';

const directUrl = process.env.DATABASE_URL.replace('-pooler.', '.');
const sql = neon(directUrl);
console.log('using host:', new URL(directUrl).hostname);

await sql`
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT now()
`;

await sql`
  CREATE TABLE IF NOT EXISTS friend_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(from_user_id, to_user_id)
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS friend_requests_to_idx ON friend_requests(to_user_id)
`;

const tables = await sql`
  SELECT table_name FROM information_schema.tables WHERE table_name IN ('profiles','friends','friend_requests') ORDER BY table_name
`;
console.log('tables now:', tables.map((r) => r.table_name).join(', '));

const cols = await sql`
  SELECT column_name FROM information_schema.columns WHERE table_name='profiles' AND column_name = 'last_active_at'
`;
console.log('profiles has last_active_at:', cols.length > 0);
console.log('done');

import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);

await sql`ALTER TABLE images ADD COLUMN IF NOT EXISTS is_pano BOOLEAN NOT NULL DEFAULT false`;

console.log('Column is_pano added successfully');

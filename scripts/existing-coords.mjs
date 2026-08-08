import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT level_order, lat, lng FROM images WHERE level_order BETWEEN 1 AND 79 ORDER BY level_order`;
for (const r of rows) console.log('L' + r.level_order + ' ' + r.lat + ',' + r.lng);
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const r = await sql`
  UPDATE images
  SET mapillary_id = '1139544569884411', lat = '53.476708988711', lng = '-2.2339103252713994'
  WHERE level_order = 45 AND mapillary_id = '127382756034213'
  RETURNING level_order, mapillary_id, lat, lng, is_pano, provider
`;
console.log('Updated level 45:', JSON.stringify(r, null, 2));

const verify = await sql`
  SELECT level_order, mapillary_id, lat, lng, is_pano
  FROM images
  WHERE level_order IN (44, 45, 46)
  ORDER BY level_order
`;
console.log(JSON.stringify(verify, null, 2));
console.log('Done.');
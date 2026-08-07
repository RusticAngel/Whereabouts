import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const briefing =
  'Day 122: It was not the end. A last faint thread pulls the chase to a quiet green southern coast, where the dark forest leans straight down to a wide still lagoon and the long pale sand. Cipher was seen crossing the wet spit at dusk, between the high green wall and the low hiss of the open sea, and gone before the dark.';

const evidence = [
  { type: 'visual', value: 'green_lagoon', label: 'A dark green forest drops straight to the water, its tall wet mass closing over a wide still lagoon, the pale line of the long sand low to the sea.' },
  { type: 'auditory', value: 'lagoon_boat', label: 'The low of a small boat and the lump of its wake, over the soft hiss of the long beach and the sharp calls of the birds in the deep green.' },
  { type: 'sensory', value: 'salt_moss', label: 'Salt and wet leaves hang thick in the warm air, the cool of the black lagoon rising off the water with the green close all around.' },
];

const levelOrder = 59;
const mapillaryId = '968800325769902';
const lat = '-34.185106';
const lng = '22.159379';

const existing = await sql`SELECT id FROM images WHERE level_order = ${levelOrder} LIMIT 1`;
if (existing.length > 0) {
  console.log('Level ' + levelOrder + ' already exists. Aborting to avoid duplicate.');
  process.exit(0);
}

await sql`
  INSERT INTO images (image_url, lat, lng, steps, clues, briefing, evidence, level_order, provider, mapillary_id, is_pano)
  VALUES (NULL, ${lat}, ${lng}, NULL, NULL, ${briefing}, ${JSON.stringify(evidence)}::jsonb, ${levelOrder}, 'mapillary', ${mapillaryId}, true)
`;

const rows = await sql`
  SELECT level_order, mapillary_id, lat, lng, is_pano, provider
  FROM images
  WHERE level_order IN (58, 59)
  ORDER BY level_order
`;
console.log(rows);
console.log('Inserted level ' + levelOrder);
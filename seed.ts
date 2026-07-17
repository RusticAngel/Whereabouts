import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const seedData = [
  // ── Arc 1: The Disappearance (Levels 1–4) ──
  {
    mapillary_id: '287153994441642',
    lat: '40.7580',
    lng: '-73.9855',
    provider: 'mapillary',
    level_order: 1,
    briefing: 'Day 1: Cipher was last seen in a bustling plaza surrounded by towering screens and neon lights. Witnesses report they were holding a folded newspaper and glanced up at the digital billboards before vanishing into the crowd.',
    evidence: [
      { type: 'driving_side', value: 'right', label: 'Traffic flows on the right side of the road' },
      { type: 'language', value: 'english', label: 'Billboards and signs are in English' },
      { type: 'climate', value: 'temperate', label: 'The skyline suggests a temperate climate with distinct seasons' },
    ],
  },
  {
    mapillary_id: '283854833998321',
    lat: '51.5033',
    lng: '-0.1195',
    provider: 'mapillary',
    level_order: 2,
    briefing: 'Day 3: A ticket stub was found in Cipher\'s last known location — a giant observation wheel on a riverbank. The trail leads across the Atlantic to a city of bridges and ancient streets.',
    evidence: [
      { type: 'driving_side', value: 'left', label: 'Vehicles drive on the left side of the road' },
      { type: 'language', value: 'english', label: 'Signage is in English with distinctive local spelling' },
      { type: 'architecture', value: 'historic', label: 'The area features a mix of historic and modern architecture' },
    ],
  },
  {
    mapillary_id: '1713009616372277',
    lat: '48.8584',
    lng: '2.2945',
    provider: 'mapillary',
    level_order: 3,
    briefing: 'Day 5: A discarded coffee cup with a cryptic note leads to a city of wide boulevards and an iconic iron lattice tower. Cipher was seen walking south along the river.',
    evidence: [
      { type: 'language', value: 'french', label: 'Street signs and advertisements are in French' },
      { type: 'architecture', value: 'haussmann', label: 'Uniform limestone buildings with wrought-iron balconies line the streets' },
      { type: 'driving_side', value: 'right', label: 'Traffic flows on the right' },
    ],
  },
  {
    mapillary_id: '764108845108405',
    lat: '35.6595',
    lng: '139.7004',
    provider: 'mapillary',
    level_order: 4,
    briefing: 'Day 7: Interpol intercepted a message from Cipher\'s burner phone. It contained a single photo of a famous scramble crossing, pedestrians flooding every direction. The language on the surrounding signs is unmistakable.',
    evidence: [
      { type: 'language', value: 'japanese', label: 'Signs contain Japanese characters alongside Roman text' },
      { type: 'driving_side', value: 'left', label: 'Traffic flows on the left side of the road' },
      { type: 'signage_style', value: 'neon', label: 'Vibrant neon and LED signage dominates the streetscape' },
    ],
  },

  // ── Arc 2: The False Trail (Levels 5–8) ──
  {
    mapillary_id: '1291770495674361',
    lat: '45.4340',
    lng: '12.3388',
    provider: 'mapillary',
    level_order: 5,
    briefing: 'Day 9: A false lead. Cipher\'s signature was forged on a postcard depicting a grand piazza with a towering campanile. The architecture is unmistakable — canals replace roads here.',
    evidence: [
      { type: 'language', value: 'italian', label: 'Signage and street names are in Italian' },
      { type: 'terrain', value: 'waterways', label: 'The street view shows canals instead of roads' },
      { type: 'architecture', value: 'renaissance', label: 'Buildings feature Renaissance and Gothic architectural details' },
    ],
  },
  {
    mapillary_id: '691124137135235',
    lat: '52.5163',
    lng: '13.3777',
    provider: 'mapillary',
    level_order: 6,
    briefing: 'Day 11: A witness spotted Cipher near a grand neoclassical gate in a city that was once divided. The gate has stood through war, reunification, and now serves as the backdrop for Cipher\'s next move.',
    evidence: [
      { type: 'language', value: 'german', label: 'Street signs and advertisements are in German' },
      { type: 'driving_side', value: 'right', label: 'Traffic flows on the right side of the road' },
      { type: 'architecture', value: 'neoclassical', label: 'The surrounding architecture is predominantly neoclassical' },
    ],
  },
  {
    mapillary_id: '170936311581040',
    lat: '41.8902',
    lng: '12.4922',
    provider: 'mapillary',
    level_order: 7,
    briefing: 'Day 13: Cipher was photographed outside an ancient amphitheatre, its arches lit golden in the evening sun. The city has stood for nearly three millennia. Someone fitting Cipher\'s description bought a train ticket north.',
    evidence: [
      { type: 'language', value: 'italian', label: 'Signage is in Italian' },
      { type: 'climate', value: 'mediterranean', label: 'The vegetation suggests a Mediterranean climate' },
      { type: 'architecture', value: 'ancient', label: 'Ancient Roman ruins and structures are visible in the vicinity' },
    ],
  },
  {
    mapillary_id: '676783557714753',
    lat: '52.3731',
    lng: '4.8923',
    provider: 'mapillary',
    level_order: 8,
    briefing: 'Day 15: The trail takes an unexpected turn. Cipher was seen cycling through a city of narrow houses and concentric canals. Bicycles outnumber cars here, and the buildings lean at precarious angles.',
    evidence: [
      { type: 'language', value: 'dutch', label: 'Street signs and shop fronts are in Dutch' },
      { type: 'terrain', value: 'flat', label: 'The landscape is remarkably flat' },
      { type: 'signage_style', value: 'bicycle', label: 'Bicycle lanes and traffic signals are prominently featured' },
    ],
  },

  // ── Arc 3: The Network (Levels 9–12) ──
  {
    mapillary_id: '1064045931510215',
    lat: '50.0909',
    lng: '14.4013',
    provider: 'mapillary',
    level_order: 9,
    briefing: 'Day 17: Cipher\'s network is active. A source reported seeing them near a castle complex that overlooks a city of spires. The river below winds through a medieval heart. Cipher is making contact with someone.',
    evidence: [
      { type: 'language', value: 'czech', label: 'Signage is primarily in Czech' },
      { type: 'driving_side', value: 'right', label: 'Traffic flows on the right side of the road' },
      { type: 'architecture', value: 'gothic', label: 'Gothic spires and baroque domes define the skyline' },
    ],
  },
  {
    mapillary_id: '2198133100699671',
    lat: '1.2835',
    lng: '103.8587',
    provider: 'mapillary',
    level_order: 10,
    briefing: 'Day 19: A money trail leads east. Cipher was spotted near a futuristic hotel shaped like a ship, overlooking a bay of cargo vessels and gleaming towers. The humidity is intense. This is a city of the future.',
    evidence: [
      { type: 'climate', value: 'tropical', label: 'The climate is humid and tropical — palm trees are abundant' },
      { type: 'language', value: 'english', label: 'English is widely used on signs alongside local languages' },
      { type: 'architecture', value: 'modern', label: 'Ultra-modern skyscrapers and futuristic architecture dominate' },
    ],
  },
  {
    mapillary_id: '2033649574156006',
    lat: '37.8080',
    lng: '-122.4177',
    provider: 'mapillary',
    level_order: 11,
    briefing: 'Day 21: A break in the case. Cipher\'s encrypted messages reveal they\'re heading to a coastal city with a famous orange bridge. The waterfront smells of sea salt and clam chowder. Fishermen report seeing someone matching the description.',
    evidence: [
      { type: 'language', value: 'english', label: 'Signage is in English' },
      { type: 'climate', value: 'mediterranean', label: 'The climate is mild with coastal fog and Mediterranean vegetation' },
      { type: 'terrain', value: 'hilly', label: 'The city is built on steep hills overlooking the bay' },
    ],
  },
  {
    mapillary_id: '1120640203960574',
    lat: '53.3455',
    lng: '-6.2628',
    provider: 'mapillary',
    level_order: 12,
    briefing: 'Day 23: Cipher\'s trail crosses the Atlantic again. A pub owner in a historic cultural quarter remembers serving someone fitting the description. The city is known for its literary history and lively music pubs.',
    evidence: [
      { type: 'driving_side', value: 'left', label: 'Traffic flows on the left side of the road' },
      { type: 'language', value: 'english', label: 'Signage is in English with distinctive local spelling' },
      { type: 'signage_style', value: 'pub', label: 'Traditional pub signs and historic street lanterns line the streets' },
    ],
  },

  // ── Arc 4: The Hideout (Levels 13–14) ──
  {
    mapillary_id: '799670289187352',
    lat: '40.4169',
    lng: '-3.7038',
    provider: 'mapillary',
    level_order: 13,
    briefing: 'Day 25: It\'s all been leading here. Cipher\'s final known location before disappearing entirely is a central square in a sun-drenched capital. The pavement is bustling with pedestrians, street performers, and the sound of flamenco guitar drifting from a nearby plaza.',
    evidence: [
      { type: 'language', value: 'spanish', label: 'Street signs and advertisements are in Spanish' },
      { type: 'climate', value: 'mediterranean', label: 'The climate is dry and sunny with Mediterranean vegetation' },
      { type: 'architecture', value: 'european', label: 'Classic European architecture with wide boulevards and grand plazas' },
    ],
  },
  {
    mapillary_id: '100237832970644',
    lat: '25.1972',
    lng: '55.2744',
    provider: 'mapillary',
    level_order: 14,
    briefing: 'Day 30: The final signal. Cipher was seen near the tallest structure on Earth, a needle of glass and steel piercing the desert sky. The heat is oppressive. Beyond the gleaming towers, the desert stretches endlessly. This is where the trail ends.',
    evidence: [
      { type: 'climate', value: 'arid', label: 'The climate is extremely hot and arid — desert landscape visible in the distance' },
      { type: 'language', value: 'arabic', label: 'Signage is in Arabic and English' },
      { type: 'architecture', value: 'ultramodern', label: 'Futuristic skyscrapers and cutting-edge architecture surround the area' },
    ],
  },
];

async function main() {
  // ── Placeholder levels (15-28) for future content — keep commented until Mapillary IDs are sourced ──
//
// const placeholderData = [
//   // Arc 5: Ghost Trail (Levels 15-18)
//   {
//     mapillary_id: 'TODO_MAPILLARY_ID_15',
//     lat: null, lng: null,
//     provider: 'mapillary',
//     level_order: 15,
//     briefing: '[PLACEHOLDER] Arc 5 — Ghost Trail begins here.',
//     evidence: [],
//   },
//   ... 13 more entries
// ];

console.log('Clearing existing data...');
  await sql`DELETE FROM rounds`;
  await sql`DELETE FROM daily_scores`;
  await sql`DELETE FROM images`;
  console.log('Seeding locations...');
  for (const item of seedData) {
    await sql`
      INSERT INTO images (image_url, lat, lng, steps, clues, briefing, evidence, level_order, provider, mapillary_id)
      VALUES (NULL, ${item.lat}, ${item.lng}, NULL, NULL, ${item.briefing}, ${JSON.stringify(item.evidence)}::jsonb, ${item.level_order}, ${item.provider}, ${item.mapillary_id})
    `;
    console.log(`  Inserted level ${item.level_order}: ${item.briefing.slice(0, 50)}...`);
  }
  console.log('Done!');
}

main().catch(console.error);

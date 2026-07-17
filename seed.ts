import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const seedData = [
  // ── Arc 1: The Disappearance (Levels 1–4) ──
  {
    mapillary_id: '1060833364525771',
    lat: '40.758724811031',
    lng: '-73.985468706767',
    provider: 'mapillary',
    is_pano: true,
    level_order: 1,
    briefing: 'Day 1: Cipher was last seen in a district where daylight barely reaches the street — the glow of towering screens outshines the sun. Witnesses report they held a folded newspaper, glanced up at cascading digital billboards, and vanished into a crowd that never thins.',
    evidence: [
      { type: 'visual', value: 'vertical_canyons', label: 'Looking up, the buildings rise sheer and windowed, blocking the horizon. The sky is a narrow blue strip between cliffs of glass and steel.' },
      { type: 'auditory', value: 'urban_roar', label: 'The crowd is dense at all hours — a river of people flowing between subway entrances and crosswalks. Taxi horns and the rumble of buses form a constant, unbroken backdrop.' },
      { type: 'visual', value: 'yellow_taxis', label: 'Yellow cabs dominate the street, their roofs glowing with orange destination signs. The traffic grid here runs perfectly perpendicular — a surveyor\'s dream imposed on an island of granite.' },
    ],
  },
  {
    mapillary_id: '1059286335336578',
    lat: '51.503756647023',
    lng: '-0.11876275963309',
    provider: 'mapillary',
    is_pano: true,
    level_order: 2,
    briefing: 'Day 3: A ticket stub was found in Cipher\'s last known location — a riverside promenade dominated by a massive slow-turning structure of glass and steel. The trail crosses grey-green waters to a city of layered history and ancient street lines.',
    evidence: [
      { type: 'sensory', value: 'river_smell', label: 'The river here is wide and tidal — a cold breeze carries the smell of brackish water. The stone embankment is stained dark where the tide has reached for centuries.' },
      { type: 'visual', value: 'double_decker', label: 'Red double-decker buses and boxy black taxis navigate streets that follow Roman lines. Traffic lights are mounted sideways on poles at every junction, their sequence unhurried.' },
      { type: 'visual', value: 'layered_architecture', label: 'The architecture spans centuries within a single view: honey-coloured Victorian stonework, Brutalist concrete blocks, and sleek glass facades stacked like geological strata.' },
    ],
  },
  {
    mapillary_id: '3889604161259055',
    lat: '48.859111845585',
    lng: '2.2937318513486',
    provider: 'mapillary',
    is_pano: true,
    level_order: 3,
    briefing: 'Day 5: A discarded coffee cup with a cryptic note leads to a city of wide boulevards and uniform cream-coloured buildings. Cipher was seen walking south along the river, past green bookstalls and beneath the shade of linden trees.',
    evidence: [
      { type: 'visual', value: 'uniform_facades', label: 'The buildings here are remarkably consistent — six stories of cream limestone, each with black wrought-iron balconies and steep slate mansard roofs with dormer windows.' },
      { type: 'sensory', value: 'tree_canopy', label: 'The boulevard is lined with plane trees planted at precise intervals. Light filters through their canopy in dappled patterns across wide pavements. The air smells of coffee and fresh bread.' },
      { type: 'visual', value: 'river_quays', label: 'The river is edged with stone quays where green boxes sit along the parapet — open-air stalls selling old books and prints. Pedestrians stroll at a leisurely pace.' },
    ],
  },
  {
    mapillary_id: '764108845108405',
    lat: '35.659445488659',
    lng: '139.70072348321',
    provider: 'mapillary',
    is_pano: true,
    level_order: 4,
    briefing: 'Day 7: Interpol intercepted a message from Cipher\'s burner phone — a single photo taken from above a sprawling intersection where pedestrians flood the crossing from every direction at once. The density is staggering.',
    evidence: [
      { type: 'visual', value: 'scramble_crossing', label: 'When the signal changes, a wave of pedestrians pours across the striped asphalt from all sides, converging at the centre and dispersing like a living current. The order within the chaos is mesmerising.' },
      { type: 'auditory', value: 'electronic_chimes', label: 'Above street level, the city is a vertical labyrinth of glowing signs. Vending machines line every wall, and the air hums with electronic chimes and melodies from unseen speakers.' },
      { type: 'visual', value: 'immaculate_streets', label: 'The streets are spotless despite the crowds. Manhole covers are decorated with intricate local patterns. Overhead, power lines and signboards cluster on poles in a dense tangle.' },
    ],
  },

  // ── Arc 2: The False Trail (Levels 5–8) ──
  {
    mapillary_id: '1291770495674361',
    lat: '45.434203546748',
    lng: '12.339246958254',
    provider: 'mapillary',
    is_pano: true,
    level_order: 5,
    briefing: 'Day 9: A false lead. Cipher\'s signature was forged on a postcard depicting a grand square with a towering bell tower. The architecture is unmistakable — but here, water has replaced asphalt, and boats are the only transport.',
    evidence: [
      { type: 'auditory', value: 'silence', label: 'The most notable absence is engine noise. No cars, no buses — just the gentle lap of water against stone, the creak of wooden moorings, and footsteps echoing off narrow walls.' },
      { type: 'visual', value: 'canals', label: 'At every turn a canal appears — green water reflecting centuries-old facades that rise directly from the waterline. Stairs descend into the water, and wooden poles stand worn by ropes.' },
      { type: 'sensory', value: 'tide_marks', label: 'The stonework at every building\'s base tells a story — dark green staining marks where high tide has reached. The air carries a distinctive scent of salt, damp stone, and distant coffee.' },
    ],
  },
  {
    mapillary_id: '691124137135235',
    lat: '52.516403875383',
    lng: '13.377415340724',
    provider: 'mapillary',
    is_pano: true,
    level_order: 6,
    briefing: 'Day 11: A witness spotted Cipher near a monumental stone gateway in a city that once stood divided. The structure has seen war, reunification, and now serves as the backdrop for their next move. The streets here tell a story of fracture and rebirth.',
    evidence: [
      { type: 'visual', value: 'architectural_fracture', label: 'The architecture is a conversation between eras — ornate 19th-century facades sit beside stark post-war concrete. Scars of history appear in almost every building: bullet marks preserved, walls rebuilt in different brick.' },
      { type: 'visual', value: 'cycling_infrastructure', label: 'Cycling infrastructure dominates: dedicated red lanes separate bikes from traffic, and pedestrian signals feature a distinctive walking-man icon. Rows of bicycles crowd every corner.' },
      { type: 'sensory', value: 'wide_sky', label: 'The streets are wide and the sky feels open — this city sprawls under a vast, often grey horizon. Lime trees line the avenues, and the pavement is a mix of modern slabs and original stone.' },
    ],
  },
  {
    mapillary_id: '170936311581040',
    lat: '41.890438888889',
    lng: '12.492942777778',
    provider: 'mapillary',
    is_pano: true,
    level_order: 7,
    briefing: 'Day 13: Cipher was photographed before a massive ancient amphitheatre, its arched facade lit golden in the evening sun. The city has stood for nearly three millennia — every street here is layered with centuries. Someone fitting the description bought a train ticket north.',
    evidence: [
      { type: 'visual', value: 'warm_stone', label: 'The stone of the city glows warm in the afternoon light — a golden travertine that gives every building a timeless quality. Umbrella pines dot the skyline, their silhouettes distinctive against the blue.' },
      { type: 'visual', value: 'ancient_and_modern', label: 'Ancient and modern coexist without apology. A two-thousand-year-old structure stands at the end of a street lined with motor scooters and boutique shops. The past is simply part of the furniture.' },
      { type: 'auditory', value: 'scooters_and_cafes', label: 'Scooters weave between cars at every traffic light. The road surface alternates between worn stone cobbles and patched asphalt. Café tables spill onto pavements, and the air smells of espresso and exhaust.' },
    ],
  },
  {
    mapillary_id: '676783557714753',
    lat: '52.370066509815',
    lng: '4.8947893854366',
    provider: 'mapillary',
    is_pano: true,
    level_order: 8,
    briefing: 'Day 15: The trail takes an unexpected turn. Cipher was seen cycling through a city of narrow gabled houses rising from concentric waterways. Bicycles outnumber people here, and the buildings lean forward at angles that defy modern engineering.',
    evidence: [
      { type: 'visual', value: 'canals_and_bridges', label: 'The city is laced with concentric canals lined by slender trees. Houseboats line the banks, their roofs adorned with potted plants. Every bridge arches over a new waterway with a fresh perspective.' },
      { type: 'visual', value: 'leaning_gables', label: 'The buildings are impossibly narrow and tall, their gabled facades leaning forward over the street. Hooks protrude from every peak — remnants of a time when all cargo was hoisted through upper windows.' },
      { type: 'visual', value: 'bicycle_culture', label: 'Cyclists rule the roads. Bike lanes are clearly marked in red asphalt, and the traffic hierarchy is unambiguous: bicycles, then trams, then cars. The city moves at a human pace, quietly humming.' },
    ],
  },

  // ── Arc 3: The Network (Levels 9–12) ──
  {
    mapillary_id: '1064045931510215',
    lat: '50.09131329464',
    lng: '14.40312816507',
    provider: 'mapillary',
    is_pano: true,
    level_order: 9,
    briefing: 'Day 17: Cipher\'s network is active. A source reported seeing them near a hilltop castle complex that watches over a city of countless spires. The river below curls through the old town in a sweeping arc. Cipher is making contact.',
    evidence: [
      { type: 'visual', value: 'spire_forest', label: 'The skyline is a forest of spires — Gothic needles and Baroque onion domes rise above a sea of red-tiled roofs. The view from the high ground reveals a city that has grown organically over a millennium.' },
      { type: 'visual', value: 'cobblestone_streets', label: 'The old-town streets are paved with uneven cobblestones worn smooth by centuries of footsteps. Street lamps are ornate black iron, and shop signs hang from wrought-iron brackets above doorways.' },
      { type: 'auditory', value: 'tram_clatter', label: 'Trams clatter along tracks embedded in the cobblestones, their overhead wires weaving a web above the narrow streets. The river is crossed by a magnificent stone bridge lined with statues of saints.' },
    ],
  },
  {
    mapillary_id: '2198133100699671',
    lat: '1.2817608427242',
    lng: '103.85693561353',
    provider: 'mapillary',
    is_pano: true,
    level_order: 10,
    briefing: 'Day 19: A money trail leads east. Cipher was spotted near a spectacular hotel that resembles a ship balanced on three towers, overlooking a bay of cargo vessels and gleaming skyscrapers. The humidity is intense — this city breathes the future.',
    evidence: [
      { type: 'sensory', value: 'tropical_heat', label: 'The heat wraps around you like a blanket — humid and heavy. Tropical foliage bursts from every available space: vertical gardens climb skyscraper facades, and palm fronds overhang the walkways.' },
      { type: 'visual', value: 'futuristic_skyline', label: 'The skyline is a showcase of audacious architecture — buildings with curves, angles, and forms that defy gravity. Elevated walkways connect the towers, keeping pedestrians above the traffic and the heat.' },
      { type: 'sensory', value: 'clean_future', label: 'The streets are immaculate. Multi-lingual signs guide visitors towards the waterfront. The air hums with the sound of air conditioning units working ceaselessly. The future, it seems, is air-conditioned.' },
    ],
  },
  {
    mapillary_id: '2033649574156006',
    lat: '37.807898535116',
    lng: '-122.41807522548',
    provider: 'mapillary',
    is_pano: true,
    level_order: 11,
    briefing: 'Day 21: A break in the case. Cipher\'s encrypted messages reveal they\'re heading to a coastal city with a celebrated suspension bridge painted in striking vermilion. The waterfront smells of salt and seafood. The hills here are legendary.',
    evidence: [
      { type: 'visual', value: 'steep_hills', label: 'The city is built on a series of steep hills that rise dramatically from the bay. Streets climb at almost impossible gradients, offering sudden glimpses of sparkling blue water between the buildings.' },
      { type: 'visual', value: 'painted_ladies', label: 'The housing stock is a colourful patchwork — ornate Victorian houses with intricate wooden detailing, painted in pastel shades, line streets that roller-coaster up and down the hillsides.' },
      { type: 'sensory', value: 'fog_and_breeze', label: 'A persistent cool breeze blows in from the bay, often carrying a blanket of fog that rolls over the western hills. The air temperature can swing ten degrees in a single afternoon.' },
    ],
  },
  {
    mapillary_id: '1421655535210037',
    lat: '53.342169163137',
    lng: '-6.2670085665432',
    provider: 'mapillary',
    is_pano: true,
    level_order: 12,
    briefing: 'Day 23: Cipher\'s trail crosses the Atlantic again. A pub owner in a historic cultural quarter remembers serving someone fitting the description. This city is known for its literary soul — music spills from every door, and a river splits it in two.',
    evidence: [
      { type: 'auditory', value: 'pub_music', label: 'Traditional music drifts from open pub doors — fiddles, tin whistles, and bodhráns playing reels passed down for generations. The streets grow louder as evening approaches, alive with conversation and song.' },
      { type: 'visual', value: 'georgian_doors', label: 'The architecture here is Georgian — elegant red-brick townhouses with colourful doors painted in vivid shades: canary yellow, emerald green, cobalt blue. Each door has a fanlight window above.' },
      { type: 'visual', value: 'river_bridges', label: 'The river is spanned by graceful bridges, each with its own character. Stone quays line both banks, and gulls perch on railings, watching passersby with practiced indifference.' },
    ],
  },

  // ── Arc 4: The Hideout (Levels 13–14) ──
  {
    mapillary_id: '2946638345612696',
    lat: '40.416960519364',
    lng: '-3.7037490174974',
    provider: 'mapillary',
    is_pano: true,
    level_order: 13,
    briefing: 'Day 25: It\'s all been leading here. Cipher\'s final known location before disappearing entirely is a grand central square in a sun-drenched capital where life happens outdoors. The sound of strummed guitars drifts from a terrace nearby.',
    evidence: [
      { type: 'sensory', value: 'sharp_sun', label: 'The sun is relentless here — sharp shadows cut across the paved square even in late afternoon. The sky is a deep, cloudless blue. Locals seek shade beneath the covered colonnades that frame the square.' },
      { type: 'visual', value: 'uniform_plaza', label: 'The square is a perfect rectangle surrounded by uniform white facades with continuous balconies. At its centre, a monumental equestrian figure sits atop a grand fountain.' },
      { type: 'sensory', value: 'outdoor_life', label: 'The pace of life is unhurried. People sit at outdoor cafés for hours, nursing small cups of dark coffee. The air smells of tobacco, cologne, and something savoury frying in olive oil.' },
    ],
  },
  {
    mapillary_id: '1119466215218870',
    lat: '25.198184108224',
    lng: '55.27289976169',
    provider: 'mapillary',
    is_pano: true,
    level_order: 14,
    briefing: 'Day 30: The final signal. Cipher was seen near the tallest structure ever built by human hands — a needle of glass and steel that pierces the desert sky. Beyond the gleaming towers, the heat shimmers over endless sand. This is where the trail ends.',
    evidence: [
      { type: 'sensory', value: 'wall_of_heat', label: 'The heat is staggering — a wall of warmth that hits you the moment you step from the air conditioning. The air shimmers above the asphalt, and even the shadows offer little respite.' },
      { type: 'visual', value: 'audacious_architecture', label: 'The architecture here defies belief — buildings twist, lean, and spiral in impossible forms. Glass facades reflect the sky and each other, creating a kaleidoscope of light and colour.' },
      { type: 'visual', value: 'imported_greenery', label: 'Despite the desert setting, the streets are lined with imported palm trees, their fronds irrigated by an elaborate underground system. The contrast between arid sand and this oasis of glass and steel is stark.' },
    ],
  },
];

async function main() {
  console.log('Clearing existing data...');
  await sql`DELETE FROM rounds`;
  await sql`DELETE FROM daily_scores`;
  await sql`DELETE FROM images`;
  console.log('Seeding locations...');
  for (const item of seedData) {
    await sql`
      INSERT INTO images (image_url, lat, lng, steps, clues, briefing, evidence, level_order, provider, mapillary_id, is_pano)
      VALUES (NULL, ${item.lat}, ${item.lng}, NULL, NULL, ${item.briefing}, ${JSON.stringify(item.evidence)}::jsonb, ${item.level_order}, ${item.provider}, ${item.mapillary_id}, ${item.is_pano})
    `;
    console.log(`  Inserted level ${item.level_order}: ${item.briefing.slice(0, 60)}...`);
  }
  console.log('Done!');
}

main().catch(console.error);

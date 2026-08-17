import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Levels 130-139 (verified 2026-08-17 via headless Edge viewer harness, all LOADED).
const LEVELS = [
  {
    level_order: 130,
    mapillary_id: '854278233147067',
    lat: '39.46314677004099',
    lng: '-0.35219026065641007',
    briefing: "Day 264: The trail turns to a bright city on a calm sea, where a great garden snakes through the bed of a river long since turned away. Cipher was seen on the arched bridge at dusk, past the white sail-shaped towers by the water, then vanished into the lanes of the old quarter.",
    evidence: [{ type: 'visual', value: 'sail_towers_garden', label: 'A futuristic cluster of white sail-shaped towers and ribbed halls rises beside a broad riverbed garden of palms and pools. Beyond it, a warm old town of narrow lanes, orange trees, and a gothic bell tower.' }, { type: 'auditory', value: 'turron_crowd', label: 'The splash of fountains in the long park, bicycle bells on the arched bridges, the murmur of the evening crowds, and the deep bells of the old cathedral.' }, { type: 'sensory', value: 'orange_sea_breeze', label: 'Warm sea air heavy with the scent of orange blossom, the smell of the paella pans from the seafront kitchens, and the cool of the shaded lanes.' }],
  },
  {
    level_order: 131,
    mapillary_id: '2748324645367350',
    lat: '43.26124911912',
    lng: '-2.9299780325358005',
    briefing: "Day 266: The hunt moves to a green city in a rainy valley, where a great twisted sculpture of shimmering metal sits beside the river. Cipher was seen at the foot of its gleaming curves at noon, then crossed the footbridge into the steep lanes of the old town.",
    evidence: [{ type: 'visual', value: 'metal_curves_river', label: 'A colossal building of undulating titanium curves and glass, half-hidden by the fog and rain, standing beside a broad river spanned by iron bridges. Green hillsides of old houses climb the valley walls behind.' }, { type: 'auditory', value: 'rain_tram', label: 'The patter of rain on the metal roof, the rattle and bell of the tram on the riverside avenue, and the low murmur of the museum crowds.' }, { type: 'sensory', value: 'rain_valley_air', label: 'Damp cool air with the smell of the river and wet stone, the mineral tang of the metal facade, and the warmth of the pintxos bars spilling onto the street.' }],
  },
  {
    level_order: 132,
    mapillary_id: '4513210758694944',
    lat: '46.058836729811',
    lng: '14.502298590937999',
    briefing: "Day 268: The signal surfaces in a small green capital wrapped around a gentle river, overlooked by a castle on a hill. Cipher was seen crossing the three bridges that meet in the old square at golden hour, then slipped away along the leafy embankment.",
    evidence: [{ type: 'visual', value: 'three_bridges_castle', label: 'A pastel old town of baroque facades beside a calm green river, where a cluster of stone bridges meets at a single point. A pale castle and bell tower crown the wooded hill above the rooftops.' }, { type: 'auditory', value: 'river_dragon', label: 'The murmur of the river over a low weir, bicycle bells on the bridges, the chatter of the open-air market, and the chime of the hilltop tower.' }, { type: 'sensory', value: 'linden_market', label: 'Fresh air with the sweet green scent of linden trees, the smell of the market flowers and fresh bread, and the soft evening light on the pastel walls.' }],
  },
  {
    level_order: 133,
    mapillary_id: '808083831412437',
    lat: '48.155627644979994',
    lng: '17.124748105545',
    briefing: "Day 270: The trail rises to a small white city beneath a castle on a hill, spread along a great river. Cipher was seen in the old square at noon, beneath the fountain and the pastel rows, then disappeared into the alleys that wind toward the footbridge.",
    evidence: [{ type: 'visual', value: 'white_castle_pastel', label: 'A hill crowned by a gleaming white castle with red roofs looks over a compact old town of pastel houses and a broad cobbled square. A wide river flows along the edge of the historic core.' }, { type: 'auditory', value: 'square_carillon', label: 'The carillon of bells from the old town hall, the clink of café tables on the square, and the low flow of the river below.' }, { type: 'sensory', value: 'warm_cobble_air', label: 'Warm dry air on the sun-warmed cobbles, the smell of the Danube water and of coffee from the arcades, and the quiet of the narrow lanes.' }],
  },
  {
    level_order: 134,
    mapillary_id: '976304155306301',
    lat: '40.658592283221004',
    lng: '22.942782719665995',
    briefing: "Day 272: The signal appears in a sprawling port city beneath a ring of hazy hills, where a white tower stands sentinel at the water's edge. Cipher was seen strolling the long seafront promenade at sunset, then melted into the crush of the market streets.",
    evidence: [{ type: 'visual', value: 'white_tower_sea', label: 'A long seafront esplanade lined with palms and cafés stretching along a calm bay. A tall white tower rises at the shore, and dense streets of old apartment blocks climb the hills behind.' }, { type: 'auditory', value: 'sea_bouzouki', label: 'The lapping of the bay, seagulls, a guitar drifting from a waterfront café, and the distant horns of the port traffic.' }, { type: 'sensory', value: 'salt_oregano', label: 'Warm salty air with a hint of oregano and grilled meat from the tavernas, the smell of the sea, and the golden light of sunset over the water.' }],
  },
  {
    level_order: 135,
    mapillary_id: '286736073508380',
    lat: '29.948240006591007',
    lng: '-90.075598962673',
    briefing: "Day 274: The trail sinks into a low-lying city of wrought iron and palmettos, where music spills from every doorway. Cipher was seen on the corner beneath the lampposts at dusk, past the balconies draped in greenery, then vanished into the humid night.",
    evidence: [{ type: 'visual', value: 'iron_balconies_palms', label: 'Narrow streets of tall old houses with lacy wrought-iron balconies and shuttered windows, draped with vines and beads. Palms and grand oaks line the sidewalks; a cable car glides along the main avenue.' }, { type: 'auditory', value: 'jazz_quarter', label: 'The low wail of a brass band from a bar, the rattle of the streetcar, laughter and shouts from the balconies, and the thick drone of evening insects.' }, { type: 'sensory', value: 'humid_gulf', label: 'Thick warm humidity heavy with the sweetness of the river and the magnolias, the smell of gumbo from the kitchens, and the flicker of lamplight on the ironwork.' }],
  },
  {
    level_order: 136,
    mapillary_id: '730831466357468',
    lat: '1.3197291079380002',
    lng: '103.81708600967',
    briefing: "Day 276: The hunt swings east to a flawless island city of glass towers and hanging gardens, where the streets gleam and the air is thick with heat. Cipher was seen crossing the wide boulevard at night, beneath the giant trees of light, then gone into the shining arcades.",
    evidence: [{ type: 'visual', value: 'glass_gardens', label: 'Gleaming towers of glass and steel wrapped in cascading greenery, lining immaculate wide boulevards with tropical planters. Covered walkways and elevated gardens thread between the buildings.' }, { type: 'auditory', value: 'tropical_hum', label: 'The hum of the air-conditioning vents, the chirp of the crossing signals, the soft roar of the expressway overhead, and the murmur of the evening crowds.' }, { type: 'sensory', value: 'equatorial_heat', label: 'Warm equatorial humidity with the scent of frangipani and rain, the chill of conditioned air at every doorway, and the constant glitter of the city lights.' }],
  },
  {
    level_order: 137,
    mapillary_id: '1124964618610305',
    lat: '28.645550825714995',
    lng: '77.170110955401',
    briefing: "Day 278: The trail arrives in a vast capital of red sandstone and teeming avenues, where the heat shimmers over the endless traffic. Cipher was seen at the great ceremonial crossing at midday, past the columns and the dusty gardens, then swallowed by the crowd.",
    evidence: [{ type: 'visual', value: 'red_sandstone', label: 'Broad avenues of warm red sandstone and pale cream buildings, with wide lawns and formal columns stretching to the horizon. A great arch of stone rises at the end of the ceremonial vista.' }, { type: 'auditory', value: 'city_roar', label: 'The constant roar and horns of the traffic, the caw of crows in the trees, the rattle of the auto-rickshaws, and the calls of the street vendors.' }, { type: 'sensory', value: 'dust_heat', label: 'Dry shimmering heat with the dust of the roads, the scent of diesel and marigold garlands, and the dusty green shade of the lawns.' }],
  },
  {
    level_order: 138,
    mapillary_id: '1354301232877436',
    lat: '51.457958502182',
    lng: '-2.5659139778755',
    briefing: "Day 280: The signal moves to a hilly port city of brick and iron, where a great chain of a bridge strides across a deep gorge. Cipher was seen by the old docks at dusk, among the cranes and the painted terraces, then climbed the hill toward the bridge.",
    evidence: [{ type: 'visual', value: 'gorge_bridge_docks', label: 'A deep river gorge spanned by a delicate iron bridge of slender cables and tall stone towers. Below, an old harbour of brick warehouses, cranes, and moored boats; steep streets of coloured terraced houses climb the hillsides.' }, { type: 'auditory', value: 'harbour_gulls', label: 'The cries of the gulls over the docks, the clank of the cranes, the rumble of traffic crossing the high bridge, and the murmur of the harbour cafés.' }, { type: 'sensory', value: 'harbour_steam', label: 'Cool damp air with a hint of the sea and the harbour, the smell of coffee and fresh bread from the dockside cafés, and the golden dusk light on the water.' }],
  },
  {
    level_order: 139,
    mapillary_id: '685326988848028',
    lat: '43.947881632303',
    lng: '4.803269253775801',
    briefing: "Day 282: The final signal rests in a walled city of golden stone beneath a blazing sun, where a vast fortress of towers guards the old town. Cipher was seen on the broken bridge over the wide river at dusk, then walked the ramparts back toward the palace gates.",
    evidence: [{ type: 'visual', value: 'fortress_bridge', label: 'A ring of golden stone walls and towers enclosing a medieval town of narrow lanes. A colossal fortress-palace with crenellated towers crowns the hill; a stone bridge of arches strides across the wide river.' }, { type: 'auditory', value: 'river_bells', label: 'The slow swirl of the river beneath the arches, the chime of the palace bells, cicadas in the plane trees, and the murmur of the café terraces.' }, { type: 'sensory', value: 'lavender_heat', label: 'Dry lavender-scented heat of the Provençal summer, the smell of the river and the plane trees, and the warm golden light of dusk on the stone.' }],
  },
];

for (const lv of LEVELS) {
  const existing = await sql`SELECT id FROM images WHERE level_order = ${lv.level_order} LIMIT 1`;
  if (existing.length > 0) {
    console.log('Level ' + lv.level_order + ' already exists. Skipping.');
    continue;
  }
  await sql`
    INSERT INTO images (image_url, lat, lng, steps, clues, briefing, evidence, level_order, provider, mapillary_id, is_pano)
    VALUES (NULL, ${lv.lat}, ${lv.lng}, NULL, NULL, ${lv.briefing}, ${JSON.stringify(lv.evidence)}::jsonb, ${lv.level_order}, 'mapillary', ${lv.mapillary_id}, true)
  `;
  console.log('Inserted level ' + lv.level_order + ' (' + lv.mapillary_id + ')');
}

console.log('Done.');
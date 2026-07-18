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
  // ── Arc 5: Ghost Trail (Levels 15–18) ──
  {
    mapillary_id: '239972525593009',
    lat: '-33.861320190627',
    lng: '151.20973349721',
    provider: 'mapillary',
    is_pano: true,
    level_order: 15,
    briefing: 'Day 33: The trail heads south across the Pacific. Cipher was seen near a gleaming white landmark that resembles giant shells clustered at the edge of a deep blue harbour. The air carries the tang of salt and the creak of rigging from the marina nearby.',
    evidence: [
      { type: 'visual', value: 'harbour_icon', label: 'A cluster of white curved forms rises at the water\'s edge, their rooflines resembling overlapping shells. Beyond them, a single-arch steel bridge spans the harbour mouth.' },
      { type: 'sensory', value: 'salt_breeze', label: 'The air is clean and briny — the harbour opens to the ocean just beyond the headland. Seagulls wheel overhead, and ferries churn across the blue water.' },
      { type: 'visual', value: 'parkland_waterfront', label: 'Expansive parkland lines the shore, dotted with mature fig trees and jogging paths. The skyline beyond is a mix of historic sandstone and glass towers.' },
    ],
  },
  {
    mapillary_id: '678750739635564',
    lat: '13.757760075281',
    lng: '100.49742158301',
    provider: 'mapillary',
    is_pano: true,
    level_order: 16,
    briefing: 'Day 35: Cipher\'s trail vanishes into a labyrinth of narrow alleys filled with the scent of sizzling food and incense. Guesthouses and street stalls line every corridor. The air is thick with humidity and the chatter of a hundred languages.',
    evidence: [
      { type: 'auditory', value: 'street_chaos', label: 'The street is alive with noise — tuk-tuk engines buzzing, vendors calling out prices, and music spilling from open doorways. The energy is relentless and intoxicating.' },
      { type: 'sensory', value: 'humidity_and_smells', label: 'The heat clings to your skin, heavy with humidity. The air is a complex perfume of frying garlic, lemongrass, incense smoke, and exhaust fumes.' },
      { type: 'visual', value: 'tangled_wires', label: 'Above the street, a dense web of power lines and cables hangs between buildings. Shop signs in a looping script project from every facade, some illuminated, some hand-painted.' },
    ],
  },
  {
    mapillary_id: '1264577028921728',
    lat: '18.92206551523',
    lng: '72.833977888963',
    provider: 'mapillary',
    is_pano: true,
    level_order: 17,
    briefing: 'Day 37: A break in communications. Cipher\'s last signal pinged from a bustling archway overlooking a vast expanse of sea. The city sprawls along the coast, a chaotic symphony of colonial grandeur and modern ambition.',
    evidence: [
      { type: 'visual', value: 'triumphal_arch', label: 'A massive stone archway stands at the water\'s edge, its Indo-Saracenic design a relic of empire. Beyond it, the sea stretches to the horizon, dotted with fishing boats.' },
      { type: 'visual', value: 'colonial_architecture', label: 'The buildings nearby blend Gothic spires, domed cupolas, and pointed arches — a distinct colonial style found only in this corner of the world. Palm trees line the promenade.' },
      { type: 'sensory', value: 'coastal_humidity', label: 'The heat is intense but tempered by a sea breeze. The air smells of salt, diesel, and something spicy cooking nearby. Crows perch on the archway, watching the crowds.' },
    ],
  },
  {
    mapillary_id: '424745323849102',
    lat: '22.293972638325',
    lng: '114.17311746975',
    provider: 'mapillary',
    is_pano: true,
    level_order: 18,
    briefing: 'Day 39: Cipher has gone to ground in one of the densest urban landscapes on Earth. The skyline is a vertical forest of glass and steel — towers rise so close together they seem to touch. A famous harbour separates two distinct worlds.',
    evidence: [
      { type: 'visual', value: 'vertical_skyline', label: 'The skyline is a wall of skyscrapers climbing the hillside, each competing for height. The buildings are impossibly thin, rising straight up from the water\'s edge without apology.' },
      { type: 'sensory', value: 'harbour_ferries', label: 'The harbour is alive with boat traffic — green-and-white ferries crisscross the water, their wakes rippling past ancient junks and modern cargo ships.' },
      { type: 'visual', value: 'funicular_hills', label: 'The streets climb steeply from the waterfront. Trams glide along tracks embedded in the road, and overhead, a web of neon signs in dense characters hangs above the pavement.' },
    ],
  },

  // ── Arc 6: Deep Cover (Levels 19–22) ──
  {
    mapillary_id: '794803960188498',
    lat: '41.0056961',
    lng: '28.976628',
    provider: 'mapillary',
    is_pano: true,
    level_order: 19,
    briefing: 'Day 41: The trail crosses continents. Cipher was spotted near a grand domed structure that has stood at the crossroads of civilisations for over a millennium. Two continents face each other across a narrow strait of deep blue water.',
    evidence: [
      { type: 'visual', value: 'domed_skyline', label: 'The skyline is defined by a succession of domes and minarets. A massive central dome rises above the rooftops, flanked by four slender towers that pierce the sky.' },
      { type: 'sensory', value: 'east_west_crossroads', label: 'The air carries competing smells: roasting chestnuts, fresh bread, and the faint brine of the sea. The call to prayer echoes across the square from a nearby minaret.' },
      { type: 'visual', value: 'cobbled_plaza', label: 'The plaza is paved with worn stone slabs. Tram lines run along one edge, and a fountain sits at the centre. Cats nap in patches of sunlight, indifferent to the flow of tourists and locals.' },
    ],
  },
  {
    mapillary_id: '837818513527088',
    lat: '30.044236703476',
    lng: '31.236196257079',
    provider: 'mapillary',
    is_pano: true,
    level_order: 20,
    briefing: 'Day 43: Cipher has moved deeper into the old world. The city is a sprawling metropolis where the desert meets the river. Ancient history rises from the sands within sight of modern high-rises. The air is dry and tastes of dust.',
    evidence: [
      { type: 'visual', value: 'river_city', label: 'A broad brown river flows through the heart of the city, its banks lined with high-rise hotels and government buildings. Beyond the skyline, the desert haze blurs the horizon.' },
      { type: 'sensory', value: 'dust_and_exhaust', label: 'The air is dry and filled with a fine dust that settles on everything. Car horns blare in a constant symphony, and the smell of diesel and grilled meat mingles in the heat.' },
      { type: 'visual', value: 'bridges_over_nile', label: 'Multiple bridges span the river, carrying traffic in endless streams. On the far bank, a distinctive tower with a lotus-shaped crown rises above the city.' },
    ],
  },
  {
    mapillary_id: '360478600440276',
    lat: '-6.8161512045217',
    lng: '39.280395149582',
    provider: 'mapillary',
    is_pano: true,
    level_order: 21,
    briefing: 'Day 45: A source in the shipping industry spotted Cipher boarding a vessel bound for the east African coast. The destination is a port city where the Indian Ocean meets a mix of Swahili, Arabic, and colonial influences.',
    evidence: [
      { type: 'visual', value: 'indian_ocean_port', label: 'The harbour is a forest of cargo cranes and container ships. Palm trees line the waterfront boulevard, and the architecture blends Arab-style balconies with colonial verandas.' },
      { type: 'sensory', value: 'tropical_coast', label: 'The heat is thick and humid, tempered only by the breeze off the ocean. The air smells of salt, diesel, and cloves — a spice that seems to permeate everything in this region.' },
      { type: 'auditory', value: 'coastal_hum', label: 'The city hums with the sound of daladala minibuses, harbour horns, and the distant rhythm of taarab music drifting from a open-windowed café.' },
    ],
  },
  {
    mapillary_id: '319571033009445',
    lat: '-33.917774787178',
    lng: '18.42301428176',
    provider: 'mapillary',
    is_pano: true,
    level_order: 22,
    briefing: 'Day 47: Cipher was photographed in a city nestled between a flat-topped mountain and two oceans. The landscape is dramatic — rugged peaks rise behind colonial-era buildings, and the air is fresh with the promise of wind.',
    evidence: [
      { type: 'visual', value: 'flat_topped_mountain', label: 'A distinctive flat-topped mountain dominates the horizon, its summit often draped in a white cloth of cloud. The lower slopes are covered in fynbos — a unique scrubland vegetation.' },
      { type: 'visual', value: 'victorian_streets', label: 'The streets are lined with Victorian and Cape Dutch buildings, their gables painted in soft pastels. The pavements are wide, and the mountain provides a constant, looming backdrop.' },
      { type: 'sensory', value: 'windy_and_bright', label: 'A persistent wind blows from the ocean, carrying the smell of salt and kelp. The light is sharp and clear — the southern hemisphere sun feels different here, more direct, more golden.' },
    ],
  },

  // ── Arc 7: Final Trace (Levels 23–28) ──
  {
    mapillary_id: '2870346366470808',
    lat: '-34.61165360257',
    lng: '-58.362223842962',
    provider: 'mapillary',
    is_pano: true,
    level_order: 23,
    briefing: 'Day 49: The chase crosses the Atlantic once more. Cipher was seen in a city of wide avenues and European elegance, rebuilt from the ashes of its former self. The river here is so wide it looks like a sea.',
    evidence: [
      { type: 'visual', value: 'wide_river', label: 'The river is impossibly wide — the far bank is barely visible on the horizon. A modern footbridge with a distinctive white mast spans a channel near the waterfront.' },
      { type: 'visual', value: 'european_flair', label: 'The surrounding architecture is unapologetically European — ornate Beaux-Arts buildings, wide boulevards, and formal gardens. This could be Paris or Madrid, but the river tells you otherwise.' },
      { type: 'sensory', value: 'evening_passion', label: 'As evening approaches, the city comes alive. The smell of grilled meat drifts from parrillas, and the sounds of tango music echo from doorways. The pace is unhurried, passionate.' },
    ],
  },
  {
    mapillary_id: '1343675416290061',
    lat: '-13.516980610787',
    lng: '-71.977761558629',
    provider: 'mapillary',
    is_pano: true,
    level_order: 24,
    briefing: 'Day 51: Cipher has climbed high into the Andes. The air is thin and the sun is fierce at this altitude. A colonial city nestles in a valley, its red-tiled roofs and whitewashed walls a stark contrast to the green peaks that surround it.',
    evidence: [
      { type: 'sensory', value: 'thin_air', label: 'The altitude is unmistakable — every step requires a little more effort. The sun burns bright and hot, but the air is cool. The sky is a shade of blue only found at three thousand metres.' },
      { type: 'visual', value: 'colonial_plaza', label: 'The central square is a masterpiece of colonial architecture: a stone fountain, arched walkways, and a cathedral with a ornate facade. Red-tiled roofs stretch in every direction.' },
      { type: 'visual', value: 'incan_legacy', label: 'The stonework at the base of many walls tells a deeper story — massive, perfectly fitted blocks that predate the Spanish by centuries. The past is literally layered beneath your feet.' },
    ],
  },
  {
    mapillary_id: '3452209061771014',
    lat: '31.625628409206',
    lng: '-7.9886631712151',
    provider: 'mapillary',
    is_pano: true,
    level_order: 25,
    briefing: 'Day 53: The trail leads back to Africa. Cipher was seen in a North African city where the Sahara meets the sea. The old city is a maze of red-walled alleys, the air thick with the smell of spices and the sound of bargaining.',
    evidence: [
      { type: 'auditory', value: 'medina_sounds', label: 'The square is a swirling carnival of sound: snake charmers\' flutes, drummers, horse-drawn carriages clip-clopping on stone, and the ceaseless hum of a thousand negotiations.' },
      { type: 'sensory', value: 'spice_and_leather', label: 'The air is a potent blend of saffron, cumin, leather, and cedar. Stalls overflow with colourful textiles, brass lanterns, and mounds of spices in every shade of red and yellow.' },
      { type: 'visual', value: 'red_walls', label: 'The buildings are all the same warm terracotta red — walls, archways, and ramparts glow in the afternoon sun. Beyond the rooftops, a snow-capped mountain range defies the heat.' },
    ],
  },
  {
    mapillary_id: '1372243943327258',
    lat: '64.14679478369',
    lng: '-21.943444573256',
    provider: 'mapillary',
    is_pano: true,
    level_order: 26,
    briefing: 'Day 55: An unexpected detour north. Cipher was spotted in a city built on volcanic rock at the edge of the Arctic. The landscape is otherworldly — steam rises from geothermal vents, and the sun never quite sets this time of year.',
    evidence: [
      { type: 'visual', value: 'volcanic_landscape', label: 'The ground is black volcanic rock, punctuated by patches of bright green moss. In the distance, snow-capped mountains rise above a plain of lava fields. This is a landscape still being born.' },
      { type: 'sensory', value: 'geothermal_steam', label: 'Plumes of steam rise from vents in the pavement and drift across the streets. The air carries a faint scent of sulphur, and the buildings are heated by water drawn from deep within the earth.' },
      { type: 'visual', value: 'nordic_design', label: 'The architecture is clean and modern — corrugated iron roofs in bold reds and blues, concrete buildings with large windows. The city is small against the vast, open sky.' },
    ],
  },
  {
    mapillary_id: '1119483681880931',
    lat: '55.754124921531',
    lng: '37.620002451891',
    provider: 'mapillary',
    is_pano: true,
    level_order: 27,
    briefing: 'Day 57: Cipher\'s trail leads east through Europe, stopping in a capital where onion domes rise above the skyline. The architecture is a statement of power — grand avenues, monumental squares, and a fortress at its heart.',
    evidence: [
      { type: 'visual', value: 'red_fortress', label: 'A massive fortress with distinctive red battlements and green spires dominates the centre. Its walls have witnessed parades, revolutions, and the changing tides of history.' },
      { type: 'visual', value: 'soviet_legacy', label: 'The architecture is a study in contrasts: ornate 19th-century facades sit beside stark Soviet-era blocks. Wide avenues radiate from the centre like spokes of a wheel.' },
      { type: 'sensory', value: 'northern_cold', label: 'The light here has a distinct quality — low-angled and pale even at midday. The air is cold and clean, and the city feels vast, built on a scale that dwarfs the individual.' },
    ],
  },
  {
    mapillary_id: '495180960257314',
    lat: '-23.5500413',
    lng: '-46.633233',
    provider: 'mapillary',
    is_pano: true,
    level_order: 28,
    briefing: 'Day 60: The final piece of the puzzle. Cipher has been tracked to the largest city in the southern hemisphere — a sprawling megacity of concrete and glass, where skyscrapers stretch to the horizon and the traffic never stops. This is where the trail ends.',
    evidence: [
      { type: 'visual', value: 'vertical_sprawl', label: 'The skyline is a breathtaking wall of towers — thousands of them, stretching in every direction as far as the eye can see. This city doesn\'t end; it simply continues.' },
      { type: 'sensory', value: 'urban_jungle', label: 'The heat is contained between concrete canyons. Helicopters buzz between rooftops, and the sound of traffic is a constant, low-frequency hum that vibrates through the pavement.' },
      { type: 'visual', value: 'mural_streets', label: 'Despite the grey concrete, colour breaks through everywhere — massive murals cover entire building facades, and the streets are lined with jacaranda trees that explode in purple bloom.' },
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

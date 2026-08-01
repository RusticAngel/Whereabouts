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
    mapillary_id: '783786032678261',
    lat: '18.921983',
    lng: '72.834655',
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
    mapillary_id: '486944587562168',
    lat: '37.550392',
    lng: '126.973565',
    provider: 'mapillary',
    is_pano: true,
    level_order: 18,
    briefing: 'Day 39: Cipher has been tracked to a city where ancient palace gates open onto sprawling modern plazas. The contrast between the mountain-backed skyline of traditional wooden architecture and soaring glass towers creates a timeline etched in urban form. A grand gate, once the entrance to a royal dynasty, now faces a sea of protesters and commuters alike.',
    evidence: [
      { type: 'visual', value: 'palace_gate', label: 'The palace sits at the foot of a mountain, its grand main gate opening onto a vast plaza. Beyond the stone walls and ornate roofs, the modern city rises in glass and steel — two Koreas compressed into one skyline.' },
      { type: 'sensory', value: 'mountain_air', label: 'The air is crisp and cool, carrying the scent of pine from the mountains that ring the city. The streets are immaculate, and the rhythm of the city moves between serene temple courtyards and bustling commercial avenues.' },
      { type: 'visual', value: 'hanok_houses', label: 'The streets are lined with Ginkgo trees. Traditional hanok houses with curved tile roofs sit in the shadows of sleek high-rises, connected by a maze of narrow alleyways.' },
    ],
  },

  // ── Arc 6: Deep Cover (Levels 19–22) ──
  {
    mapillary_id: '340615280898022',
    lat: '41.018919',
    lng: '28.869198',
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
    mapillary_id: '1381897719782917',
    lat: '37.97057',
    lng: '23.72455',
    provider: 'mapillary',
    is_pano: true,
    level_order: 20,
    briefing: 'Day 43: Cipher has slipped across the Aegean. The city sprawls beneath a rocky hill crowned with ancient columns, its streets a maze of narrow lanes and sudden plazas. The Mediterranean light is sharp, and the scent of the sea mingles with the aroma of grilling fish and wild oregano.',
    evidence: [
      { type: 'visual', value: 'ancient_citadel', label: 'A massive rocky hill rises at the city\'s centre, its summit crowned with marble columns. The ruins glow golden in the afternoon light and stand floodlit against the dark sky at night.' },
      { type: 'sensory', value: 'mediterranean_light', label: 'The light is crystalline — a sharp Mediterranean clarity that makes every whitewashed wall blaze under the sun. The shadows are deep and cool, offering relief from the midday heat.' },
      { type: 'visual', value: 'labyrinthine_streets', label: 'Below the hill, the streets narrow into a labyrinth of pedestrian lanes. Bougainvillea spills over whitewashed walls, and café tables line every alley. Rooftop terraces offer views of the ancient silhouette above.' },
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
    mapillary_id: '2227826774646118',
    lat: '50.065227',
    lng: '19.946722',
    provider: 'mapillary',
    is_pano: true,
    level_order: 22,
    briefing: 'Day 47: Cipher has resurfaced in a city that has stood at the crossroads of Central Europe for a thousand years. A medieval square, one of the largest on the continent, anchors a warren of cobblestone streets. A castle watches from a hill above the winding river.',
    evidence: [
      { type: 'visual', value: 'market_square', label: 'The main square is a vast expanse of cobblestones bounded by elegant townhouses with painted facades. At its centre, a Renaissance cloth hall stands beneath a towering Gothic basilica with an uneven spire.' },
      { type: 'auditory', value: 'trumpet_call', label: 'The air is filled with the sound of horse-drawn carriages on stone, the distant trumpet call from the basilica tower marking each hour, and the smell of roasting cheese from market stalls.' },
      { type: 'visual', value: 'wawel_hill', label: 'A hill rises above the river, crowned with a cathedral whose golden dome and fortified walls have witnessed centuries of coronations. The river curves lazily through the city below.' },
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
    mapillary_id: '968273834003120',
    lat: '31.619194',
    lng: '-7.987344',
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
    mapillary_id: '861499737779183',
    lat: '64.148131',
    lng: '-21.941139',
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
    mapillary_id: '846806025906372',
    lat: '55.753301',
    lng: '37.621834',
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

  // ── Arc 8: The Escape (Levels 29–33) ──
  {
    mapillary_id: '1435433820363165',
    lat: '59.914429742799',
    lng: '10.743207146712',
    provider: 'mapillary',
    is_pano: true,
    level_order: 29,
    briefing: 'Day 62: Cipher slipped through your fingers in the megacity. A garbled message surfaces from a Nordic capital — a city of fjords and forest, where the streets run straight to a royal palace and the air is clean and cold. The chase is far from over.',
    evidence: [
      { type: 'visual', value: 'royal_boulevard', label: 'A wide boulevard runs arrow-straight toward a stately palace on a low rise at its end. Bronze lions and horsemen guard the approach, their patina green with northern rain.' },
      { type: 'sensory', value: 'crisp_nordic_air', label: 'The air is crisp and dry, carrying the faint scent of the fjord and the cool of pine forests. The light is clear and even — a northern sun that lingers low on the horizon.' },
      { type: 'visual', value: 'tram_streets', label: 'Trams glide silently along rails set into the cobblestones, their bells ringing softly. The streets are immaculate, the buildings a restrained palette of brick, stone, and pastel plaster.' },
    ],
  },
  {
    mapillary_id: '912845668480564',
    lat: '52.231445463254',
    lng: '21.014582305765',
    provider: 'mapillary',
    is_pano: true,
    level_order: 30,
    briefing: 'Day 64: A tip from a travel agent places Cipher in a capital rebuilt from ashes. A grand avenue of elegant facades leads toward the heart of the old city — a place where history was flattened and painstakingly reconstructed, block by block.',
    evidence: [
      { type: 'visual', value: 'rebuilt_facades', label: 'The avenue is lined with ornate facades that look centuries old — but the eye for proportion is too perfect. This elegance was rebuilt after the city was reduced to rubble, a monument to reconstruction.' },
      { type: 'auditory', value: 'tram_rattle', label: 'Trams rattle past on embedded tracks, and the street hums with a determined, forward-moving energy. Everywhere there is the sense of a city that refuses to be defined by its scars.' },
      { type: 'visual', value: 'palace_skyline', label: 'At the end of the avenue, a towering column rises against the sky, crowned with a winged figure. The streets radiate outward, wide and unapologetic, built on a grand continental scale.' },
    ],
  },
  {
    mapillary_id: '1310993664042893',
    lat: '41.404120016399',
    lng: '2.1740529398393',
    provider: 'mapillary',
    is_pano: true,
    level_order: 31,
    briefing: 'Day 66: The trail curves south through Europe. Cipher was spotted in a sun-drenched city of honey-stone avenues, where the grid of the modern town collides with the tangled lanes of the old quarter. The Mediterranean sun beats down, and the sound of castanets drifts from a courtyard.',
    evidence: [
      { type: 'sensory', value: 'sharp_mediterranean_sun', label: 'The sun is brilliant and the shadows are hard-edged. Palm trees line the broad avenues, and the warm stone radiates heat long after midday. The light is so clear it feels like a filter.' },
      { type: 'visual', value: 'curvilinear_modernism', label: 'The architecture is a riot of curves and mosaic — balconies that undulate like waves, ceramic tiles in blues and greens, and rooftops that bristle with fantastical chimneys.' },
      { type: 'visual', value: 'grid_meets_labyrinth', label: 'The streets here are a perfect grid of wide, sunlit avenues — but glance down any side passage and the medieval city reappears: shadowed lanes, hanging laundry, and the smell of cooking oil.' },
    ],
  },
  {
    mapillary_id: '1876545883114519',
    lat: '43.64264574721',
    lng: '-79.381416883012',
    provider: 'mapillary',
    is_pano: true,
    level_order: 32,
    briefing: 'Day 68: Cipher has crossed the Atlantic again — this time to a gleaming lakeside metropolis. The downtown is a canyon of glass and steel, and a slender tower with a rotating pod pierces the sky. Streetcars run along the wide avenues, their bells ringing over the traffic.',
    evidence: [
      { type: 'visual', value: 'glass_canyon', label: 'The streets are deep canyons of reflective glass. Towers rise on every side, their facades mirroring each other in a kaleidoscope of blue and grey. The scale is overwhelming — human beings are reduced to specks below.' },
      { type: 'visual', value: 'streetcars', label: 'Red-and-white streetcars rumble along dedicated lanes, their overhead wires crisscrossing the sky. Every few blocks, a curved bridge swoops over the canyon, carrying pedestrians between towers.' },
      { type: 'sensory', value: 'lake_presence', label: 'The water is never far away — a vast freshwater sea whose shore is lined with parkland. On clear days the air carries a cool, clean breath off the lake, cutting through the heat of the concrete.' },
    ],
  },
  {
    mapillary_id: '1028057648155164',
    lat: '-12.05982653704',
    lng: '-77.034487164982',
    provider: 'mapillary',
    is_pano: true,
    level_order: 33,
    briefing: 'Day 70: A hard turn south. Cipher has been seen in a colonial city built on the edge of a desert coast, wrapped in a sea mist that never quite becomes rain. Ornate wooden balconies overhang the old streets, and the ghosts of empires echo in the plazas.',
    evidence: [
      { type: 'visual', value: 'carved_balconies', label: 'The old buildings are wrapped in intricate wooden balconies — carved screens and latticework that overhang the narrow streets. The craftsmanship is Moorish and Andalusian, transplanted to the new world.' },
      { type: 'sensory', value: 'grey_garua', label: 'A grey coastal mist hangs in the air — not rain, but a fine damp that settles on every surface. The sky is a uniform pearl, and the sun is a pale disc behind the overcast. The air smells of damp stone and sea salt.' },
      { type: 'visual', value: 'colonial_plazas', label: 'Grand plazas open between the narrow streets, ringed by arcaded walkways and cathedral facades. Fountains murmur in the centre, and the architecture spans three centuries of colonial rule.' },
    ],
  },

  // ── Arc 9: The Final Trace (Levels 34–38) ──
  {
    mapillary_id: '1849867198514817',
    lat: '41.888806890672',
    lng: '-87.620611712309',
    provider: 'mapillary',
    is_pano: true,
    level_order: 34,
    briefing: 'Day 72: The net tightens. Cipher was photographed beside a river that has been turned around and made to flow backwards — its green water lined with skyscrapers and crossed by bascule bridges. The city is a showcase of bold, brash, American ambition.',
    evidence: [
      { type: 'visual', value: 'reversed_river', label: 'The river runs straight through the heart of the city, dyed a vivid green, its banks lined with walkways and the towers rising sheer from the water\'s edge. It flows away from the great lake — a river made to run backwards.' },
      { type: 'visual', value: 'bascule_bridges', label: 'Double-deck bascule bridges span the water at regular intervals, their leaves rising with a groan to let tall-masted boats through. Above, an elevated railway snakes between the buildings, its carriages rumbling past.' },
      { type: 'auditory', value: 'elevated_train', label: 'The constant companion of this city is the elevated train — a steel serpent that circles the downtown on a high track, screeching around corners and rattling the windows of every office it passes.' },
    ],
  },
  {
    mapillary_id: '1114035679097190',
    lat: '25.033116119466',
    lng: '121.56400248505',
    provider: 'mapillary',
    is_pano: true,
    level_order: 35,
    briefing: 'Day 74: The trail flies east to an island metropolis of soft mountains and dense urban sprawl. Cipher was seen near a tower that rises in stacked, eight-sided tiers — a bamboo shoot of glass and steel against the humid sky. Night markets glow along every street.',
    evidence: [
      { type: 'visual', value: 'tiered_tower', label: 'Above the rooftops, a tower climbs in eight distinct, flaring segments, each tier a fraction smaller than the last — a stalk of green glass that tapers toward the clouds. It is unlike any other skyscraper on earth.' },
      { type: 'sensory', value: 'humid_subtropics', label: 'The air is warm and thick with humidity. Green mountains ring the city, their slopes fading into mist. Palm trees and dense subtropical foliage line the streets, a lush counterpoint to the concrete.' },
      { type: 'visual', value: 'night_market_glow', label: 'As dusk falls, the streets come alive with the glow of markets and food stalls. Motorbikes filter through the crowds with practiced patience, and the air fills with the scent of grilling skewers and simmering broths.' },
    ],
  },
  {
    mapillary_id: '1156128369023100',
    lat: '55.676884180934',
    lng: '12.57825479859',
    provider: 'mapillary',
    is_pano: true,
    level_order: 36,
    briefing: 'Day 76: A detour north to a city of copper spires and bicycles. Cipher was seen strolling a pedestrian-only thoroughfare — one of the longest in Europe — where pastel facades lean over the cobblestones and the smell of fresh pastry fills the air. The harbour glitters just beyond.',
    evidence: [
      { type: 'visual', value: 'pastel_facades', label: 'The old facades are painted in soft, cheerful tones — ochre, teal, terracotta — with gables and dormer windows and ornate iron shop signs. The street is closed to cars, given over entirely to foot traffic.' },
      { type: 'sensory', value: 'pastry_and_harbour', label: 'The air carries a comforting blend of fresh cinnamon, warm bread, and the salt of the nearby harbour. There is an almost fairytale quality to the streets — tidy, colourful, and unashamedly cosy.' },
      { type: 'visual', value: 'bicycle_armada', label: 'Bicycles are everywhere — racks overflowing with them, riders weaving through the crowds. In the distance, the spires of a grand tower rise above the rooftops, their slender silhouettes unmistakably northern.' },
    ],
  },
  {
    mapillary_id: '947237610705874',
    lat: '43.642430481946',
    lng: '-79.381318693964',
    provider: 'mapillary',
    is_pano: true,
    level_order: 37,
    briefing: 'Day 78: Cipher doubles back to the lakeside metropolis — perhaps to slip the net, perhaps to retrieve something. The canyon of glass looms again, and the streetcars ring their bells at every crossing. This is a city of plans and grids; every corner feels deliberate.',
    evidence: [
      { type: 'visual', value: 'grid_avenues', label: 'The avenues run in a rigid grid, wide and straight, numbered and predictable. At their crossings, elegant street lamps and signage frame the glass towers — order imposed on a grand scale.' },
      { type: 'visual', value: 'green_roofs', label: 'Amid the grey and blue glass, flashes of green appear — rooftop gardens, trees in planter boxes, a park carved into the vertical landscape. The city has learned to grow upward as well as build.' },
      { type: 'auditory', value: 'bell_and_rumble', label: 'The soundtrack is urban and layered: the ding-ding of streetcar bells, the low rumble of traffic, and the occasional helicopter beating overhead. Time seems to move faster in these canyons.' },
    ],
  },
  {
    mapillary_id: '163868632672339',
    lat: '-12.059847429784',
    lng: '-77.034614190444',
    provider: 'mapillary',
    is_pano: true,
    level_order: 38,
    briefing: 'Day 80: The long chase finally ends where it was always going to — in the mist-wrapped colonial city on the desert coast. Cipher has gone to ground in the maze of carved balconies and arcaded plazas. One last sweep of the old quarter will decide everything.',
    evidence: [
      { type: 'visual', value: 'arcaded_walkways', label: 'The old quarter is a network of arcaded walkways — covered colonnades that shelter the pavement from the perpetual drizzle. Between the arches, glimpses of ornate courtyards and hanging gardens appear.' },
      { type: 'visual', value: 'dusty_avenues', label: 'Broad avenues carry a steady flow of boxy, colourful buses through the historic centre. The facades bear the patina of centuries — colonial grandeur layered with the grit of a working city.' },
      { type: 'sensory', value: 'mist_and_incense', label: 'The perpetual garúa keeps the streets damp and cool. In the market lanes, the mist mingles with woodsmoke, incense, and the earthy scent of the highlands — potatoes, coca leaves, and queso fresco.' },
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

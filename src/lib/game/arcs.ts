export interface Arc {
  label: string;
  levels: string;
  start: number;
  end: number;
}

export const ARCS: Arc[] = [
  { label: 'The Disappearance', levels: '1–4', start: 1, end: 4 },
  { label: 'The False Trail', levels: '5–8', start: 5, end: 8 },
  { label: 'The Network', levels: '9–12', start: 9, end: 12 },
  { label: 'The Hideout', levels: '13–14', start: 13, end: 14 },
  { label: 'Ghost Trail', levels: '15–18', start: 15, end: 18 },
  { label: 'Deep Cover', levels: '19–22', start: 19, end: 22 },
  { label: 'Final Trace', levels: '23–28', start: 23, end: 28 },
  { label: 'The Escape', levels: '29–33', start: 29, end: 33 },
  { label: 'The Final Lead', levels: '34–38', start: 34, end: 38 },
  { label: 'The New Chapter', levels: '39–43', start: 39, end: 43 },
  { label: 'The Continental', levels: '44–48', start: 44, end: 48 },
  { label: 'Deep Waters', levels: '49–53', start: 49, end: 53 },
  { label: 'The Closed Circle', levels: '54–59', start: 54, end: 59 },
  { label: 'The Long Road', levels: '60–69', start: 60, end: 69 },
  { label: 'The Final Signal', levels: '70–79', start: 70, end: 79 },
  { label: 'The Open Circuit', levels: '80–89', start: 80, end: 89 },
  { label: 'The Closing Net', levels: '90–99', start: 90, end: 99 },
  { label: 'The Eastern Net', levels: '100–105', start: 100, end: 105 },
  { label: 'The Southern Cross', levels: '106–108', start: 106, end: 108 },
  { label: 'The Northern Return', levels: '109–113', start: 109, end: 113 },
  { label: 'The Final Chase', levels: '114–119', start: 114, end: 119 },
  { label: 'The Wide World', levels: '120–129', start: 120, end: 129 },
  { label: 'The Final Map', levels: '130–139', start: 130, end: 139 },
  { label: 'The Home Islands', levels: '140–144', start: 140, end: 144 },
  { label: 'The Western Reaches', levels: '145–149', start: 145, end: 149 },
  { label: 'The Southern Sun', levels: '150–154', start: 150, end: 154 },
  { label: 'The Last Light', levels: '155–159', start: 155, end: 159 },
  { label: 'The Open Road', levels: '160–164', start: 160, end: 164 },
  { label: 'The Deep Current', levels: '165–169', start: 165, end: 169 },
  { label: 'The Hidden Hand', levels: '170–174', start: 170, end: 174 },
  { label: 'The Final Dawn', levels: '175–179', start: 175, end: 179 },
  { label: 'The New World', levels: '180–184', start: 180, end: 184 },
  { label: 'The Northern Thread', levels: '185–189', start: 185, end: 189 },
  { label: 'The Far Horizon', levels: '190–194', start: 190, end: 194 },
  { label: 'The Final Meridian', levels: '195–199', start: 195, end: 199 },
  { label: 'The New Frontier', levels: '200–204', start: 200, end: 204 },
  { label: 'The Gulf Stream', levels: '205–209', start: 205, end: 209 },
  { label: 'The Silk Road', levels: '210–214', start: 210, end: 214 },
  { label: 'The Final Compass', levels: '215–219', start: 215, end: 219 },
  { label: 'The Rust Heart', levels: '220–224', start: 220, end: 224 },
  { label: 'The River Roads', levels: '225–229', start: 225, end: 229 },
  { label: 'The Northern Reach', levels: '230–234', start: 230, end: 234 },
  { label: 'The Southern Tier', levels: '235–239', start: 235, end: 239 },
  { label: 'The Old Ways', levels: '240–244', start: 240, end: 244 },
  { label: 'The Small Lights', levels: '245–249', start: 245, end: 249 },
  { label: 'The Coastal Ring', levels: '250–254', start: 250, end: 254 },
  { label: 'The Stone Heart', levels: '255–259', start: 255, end: 259 },
  { label: 'The Eastern Gate', levels: '260–264', start: 260, end: 264 },
  { label: 'The Old Compass', levels: '265–269', start: 265, end: 269 },
  { label: 'The Sand Line', levels: '270–274', start: 270, end: 274 },
  { label: 'The Last Thread', levels: '275–279', start: 275, end: 279 },
  { label: 'The Quiet Shores', levels: '280–284', start: 280, end: 284 },
  { label: 'The Island Way', levels: '285–289', start: 285, end: 289 },
  { label: 'The Eastern Reach', levels: '290–294', start: 290, end: 294 },
  { label: 'The Crossroads', levels: '295–299', start: 295, end: 299 },
  { label: 'The Southern Gate', levels: '300–304', start: 300, end: 304 },
  { label: 'The Last Signal', levels: '305–310', start: 305, end: 310 },
];

export interface Mission {
  name: string;
  desc: string;
  start: number;
  end: number;
}

export const MISSIONS: Mission[] = [
  { name: 'The First Trail', desc: 'Cipher vanished without a trace. Every lead starts here.', start: 1, end: 28 },
  { name: 'The Continental Net', desc: 'Cipher is moving through Europe\'s old roads.', start: 29, end: 59 },
  { name: 'The Old World', desc: 'Leads surface across the industrial heart of Europe.', start: 60, end: 89 },
  { name: 'The Eastern Net', desc: 'Cipher has crossed into the Far East.', start: 90, end: 119 },
  { name: 'The Far Horizon', desc: 'The trail stretches across distant continents.', start: 120, end: 159 },
  { name: 'The New World', desc: 'Cipher crossed the Atlantic.', start: 160, end: 199 },
  { name: 'The Deep Current', desc: 'Every ocean hides a secret crossing.', start: 200, end: 249 },
  { name: 'The Final Circle', desc: 'The last leads close in. Cipher is running out of places to hide.', start: 250, end: 310 },
];

export function missionForLevel(level: number): Mission | null {
  return MISSIONS.find((m) => level >= m.start && level <= m.end) ?? null;
}

export function arcForLevel(level: number): Arc | null {
  return ARCS.find((a) => level >= a.start && level <= a.end) ?? null;
}

const convert = require('color-convert');

const OPENINGS = {
  warm: ['Solar', 'Sunset', 'Golden', 'Daybreak', 'Radiant', 'Ember', 'Sundown', 'Solstice', 'Summer', 'Dawn', 'Fireside', 'Gilded', 'Aureate', 'Firefly', 'Halcyon', 'Apricity'],
  green: ['Wildflower', 'Meadow', 'Verdant', 'Willow', 'Clover', 'Evergreen', 'Spring', 'Canopy', 'Fernlight', 'Garden', 'Rainfall', 'Dewdrop', 'Woodland', 'Juniper', 'Botanic', 'Daydream'],
  blue: ['Ocean', 'Tidal', 'Lunar', 'Moonlit', 'Bluehour', 'Seabound', 'Driftwood', 'Lagoon', 'Moonrise', 'Starlit', 'Coastal', 'Rainwashed', 'Deepwater', 'Evening', 'Celestial', 'Nightfall'],
  violet: ['Velvet', 'Afterhours', 'Twilight', 'Dreamscape', 'Lunar', 'Indigo', 'Amethyst', 'Moonlit', 'Midnight', 'Dusk', 'Astral', 'Nightfall', 'Silken', 'Lucid', 'Dusklight', 'Vesper'],
  rose: ['Roseglass', 'Velvet', 'Roseate', 'Petal', 'Afterglow', 'Blush', 'Silken', 'Crimson', 'Dream', 'Fable', 'Scarlet', 'Roselight', 'Wildrose', 'Satin', 'Hibiscus', 'Blooming'],
  spectrum: ['Prism', 'Opal', 'Aurora', 'Kaleido', 'Chroma', 'Mosaic', 'Daydream', 'Afterimage', 'Lucid', 'Wonder', 'Spectral', 'Prismatic', 'Wildflower', 'Daybreak', 'Mirage', 'Iridescent'],
};
const ENDINGS = ['Echo', 'Reverie', 'Chorus', 'Bloom', 'Stereo', 'Daydream', 'Frequency', 'Horizon', 'Drift', 'Overture', 'Nocturne', 'Resonance', 'Rhapsody', 'Serenade', 'Tide', 'Prelude', 'Parade', 'Interlude', 'Sonata', 'Refrain', 'Cadence', 'Haze', 'Wavelength', 'Sway', 'Duet', 'Reverb', 'Mixtape', 'Wander', 'Daylight', 'Afterglow', 'Anthem', 'Lullaby'];

const fingerprint = (text) => {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.codePointAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
};
const hueGap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

// A repeatable creative title for a music/palette combination, not a mood claim.
// The same input keeps its name; distinct mixes can occasionally share a title.
export const getAuraName = ({ auraColor, palette = [], songs = [] }) => {
  const [hue] = convert.hex.hsl(auraColor.replace('#', ''));
  const hues = palette.map((color) => convert.hex.hsl(color.replace('#', ''))[0]);
  const broadPalette = hues.some((a) => hues.some((b) => hueGap(a, b) > 95));
  const family = broadPalette ? 'spectrum' : hue < 65 ? 'warm' : hue < 165 ? 'green' : hue < 245 ? 'blue' : hue < 295 ? 'violet' : 'rose';
  const seed = fingerprint(JSON.stringify([
    auraColor.toLowerCase(), palette.map((color) => color.toLowerCase()),
    songs.slice(0, 12).map((song) => song.id || `${song.name}|${song.artists?.[0]?.name || ''}`),
  ]));
  const opening = OPENINGS[family][seed % OPENINGS[family].length];
  let endingIndex = (seed >>> 12) % ENDINGS.length;
  if (ENDINGS[endingIndex].toLowerCase() === opening.toLowerCase()) endingIndex = (endingIndex + 1) % ENDINGS.length;
  return `${opening} ${ENDINGS[endingIndex]}`;
};

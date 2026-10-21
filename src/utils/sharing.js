export const TIME_RANGES = [
  { value: 'short_term', label: 'Last month' },
  { value: 'medium_term', label: 'Last 6 months' },
  { value: 'long_term', label: 'All time' },
];

export const getTimeRangeLabel = (value) => TIME_RANGES.find((range) => range.value === value)?.label || 'Last month';

const isHex = (value) => typeof value === 'string' && /^#?[a-f\d]{6}$/i.test(value);
const asHex = (value) => `#${value.replace('#', '').toLowerCase()}`;

export const buildShareUrl = (result, origin = window.location.origin) => {
  const params = new URLSearchParams({
    aura: result.auraColor.replace('#', ''),
    aura_name: result.auraName,
    range: result.timeRange,
    palette: result.top3Colors.map((color) => color.replace('#', '')).join('-'),
    palette_names: JSON.stringify(result.top3Names || []),
    songs: JSON.stringify(result.topSongs.slice(0, 5).map((song) => ({
      ...(typeof song.id === 'string' && /^[a-zA-Z0-9]{22}$/.test(song.id) ? { id: song.id } : {}),
      name: song.name,
      artist: song.artists?.[0]?.name || 'Unknown artist',
    }))),
  });
  return `${origin}/?${params.toString()}`;
};

export const readSharedAura = (search) => {
  const params = new URLSearchParams(search);
  if (!isHex(params.get('aura'))) return null;

  const auraColor = asHex(params.get('aura'));
  const palette = (params.get('palette') || '').split('-').filter(isHex).slice(0, 3).map(asHex);
  const range = params.get('range');
  let paletteNames = [];
  try {
    const names = JSON.parse(params.get('palette_names') || '[]');
    if (Array.isArray(names)) paletteNames = names.slice(0, 3).map((name) => typeof name === 'string' ? name.slice(0, 80) : 'Color');
  } catch { /* Older links did not include palette names. */ }
  const rawSongs = (params.get('songs') || '').slice(0, 6000);
  let songs;
  try {
    songs = JSON.parse(rawSongs);
    if (!Array.isArray(songs)) songs = [];
  } catch {
    // Also accept links produced by the previous dashboard.
    songs = rawSongs.split(' | ').filter(Boolean).map((song) => {
      const [name, ...artist] = song.split(' - ');
      return { name, artist: artist.join(' - ') };
    });
  }

  return {
    auraColor,
    auraName: (params.get('aura_name') || 'Music aura').slice(0, 80),
    timeRange: TIME_RANGES.some((item) => item.value === range) ? range : 'short_term',
    top3Colors: palette.length ? palette : [auraColor],
    top3Names: paletteNames,
    topSongs: songs.filter((song) => song && typeof song.name === 'string').slice(0, 5).map((song, index) => ({
      id: typeof song.id === 'string' && /^[a-zA-Z0-9]{22}$/.test(song.id) ? song.id : `shared-${index}`,
      ...(typeof song.id === 'string' && /^[a-zA-Z0-9]{22}$/.test(song.id) ? { external_urls: { spotify: `https://open.spotify.com/track/${song.id}` } } : {}),
      name: song.name.slice(0, 150),
      artists: [{ name: typeof song.artist === 'string' ? song.artist.slice(0, 150) : 'Unknown artist' }],
    })),
  };
};

export const copyText = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // Some browsers expose clipboard access but reject the permission.
  }
  const previousFocus = document.activeElement;
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.cssText = 'position:fixed;left:-9999px;top:0';
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();
  previousFocus?.focus();
  if (!copied) throw new Error('Copy is unavailable. Select and copy the text manually.');
};

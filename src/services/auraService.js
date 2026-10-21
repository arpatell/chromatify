import { fetchTopSongs, getSongColors, getSongListenCounts } from './spotifyService';
import { calculateAuraColor, getTop3Colors, arrayToHex } from './colorService';
import { getColorNames } from './colorNamesService';
import { getAuraName } from './auraNaming';
import { fetchDisplayName } from './profileService';

// Keep the existing count-weighted calculation, with track rank as its fallback.
const weightedColors = (songs, colors, counts) => {
  const hasCounts = Object.values(counts).some((count) => Number(count) > 0);
  const maxCount = Math.max(...songs.map((song) => counts[song.id] ?? 0), 1);
  const pool = [];
  songs.forEach((song, index) => {
    const color = colors[index];
    if (!Array.isArray(color) || color.length !== 3) return;
    const repeats = hasCounts
      ? Math.max(1, Math.round(((counts[song.id] ?? 0) / maxCount) * 5))
      : Math.max(1, songs.length - index);
    for (let repeat = 0; repeat < repeats; repeat += 1) pool.push(color);
  });
  return pool.length ? pool : colors;
};

const rankedColors = (songs, colors, counts) => {
  const ranked = songs.map((song, index) => ({ color: colors[index], count: counts[song.id] ?? 0, index }))
    .filter((entry) => Array.isArray(entry.color) && entry.color.length === 3)
    .sort((a, b) => b.count - a.count || a.index - b.index);
  const selected = [];
  const seen = new Set();
  ranked.forEach(({ color }) => {
    const hex = arrayToHex(color);
    if (selected.length >= 3 || seen.has(hex)) return;
    seen.add(hex);
    selected.push(color);
  });
  return selected;
};

export const generateAura = async (accessToken, timeRange) => {
  const songs = await fetchTopSongs(accessToken, timeRange);
  if (!songs.length) return null;
  const [colors, counts, ownerName] = await Promise.all([
    getSongColors(accessToken, songs),
    getSongListenCounts(accessToken, songs, timeRange).catch(() => Object.fromEntries(songs.map((song) => [song.id, 0]))),
    fetchDisplayName(accessToken),
  ]);
  const pool = weightedColors(songs, colors, counts);
  const aura = calculateAuraColor(pool);
  const ranked = rankedColors(songs, colors, counts);
  const palette = ranked.length ? ranked : await getTop3Colors(pool);
  return {
    ownerName,
    createdAt: new Date().toISOString(),
    auraColor: arrayToHex(aura),
    auraName: getAuraName({ auraColor: arrayToHex(aura), palette: palette.map(arrayToHex), songs }),
    timeRange,
    top3Colors: palette.map(arrayToHex),
    top3Names: await getColorNames(palette.map(arrayToHex)),
    topSongs: songs,
    songColors: Object.fromEntries(songs.map((song, index) => [song.id, arrayToHex(colors[index])])),
  };
};

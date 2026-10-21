import { buildShareUrl, readSharedAura } from './sharing';

const result = {
  auraColor: '#ac86ed',
  auraName: 'Vivid Violet',
  timeRange: 'medium_term',
  top3Colors: ['#ac86ed', '#ed997e', '#8fc4b0'],
  topSongs: [{ id: 'private-track-id', name: 'A song | with - punctuation & more', artists: [{ name: 'Artist & friends' }], album: { images: [{ url: 'private-art-url' }] } }],
};

test('share links preserve song punctuation without exposing tokens or album URLs', () => {
  const url = buildShareUrl(result, 'https://chromatify.example');
  const restored = readSharedAura(new URL(url).search);
  expect(restored.auraColor).toBe(result.auraColor);
  expect(restored.top3Colors).toEqual(result.top3Colors);
  expect(restored.topSongs[0].name).toBe(result.topSongs[0].name);
  expect(restored.topSongs[0].artists).toEqual(result.topSongs[0].artists);
  expect(restored.timeRange).toBe('medium_term');
  expect(url).not.toContain('private-track-id');
  expect(url).not.toContain('private-art-url');
});

test('invalid shared colors do not become CSS values', () => {
  expect(readSharedAura('?aura=red;display:none')).toBeNull();
  const restored = readSharedAura('?aura=abc123&palette=bad-ff2233-ffffff&range=unknown&songs=null');
  expect(restored.top3Colors).toEqual(['#ff2233', '#ffffff']);
  expect(restored.timeRange).toBe('short_term');
  expect(restored.topSongs).toEqual([]);
});

test('old shared links still render their song list', () => {
  const restored = readSharedAura('?aura=ac86ed&songs=First%20-%20Artist%20%7C%20Second%20-%20Another');
  expect(restored.topSongs.map((song) => song.name)).toEqual(['First', 'Second']);
  expect(restored.top3Colors).toEqual(['#ac86ed']);
});

test('public Spotify IDs round-trip for artwork lookup while arbitrary URLs stay out', () => {
  const id = '4uLU6hMCjMI75M1A2tKUQC';
  const url = buildShareUrl({ ...result, topSongs: [{ ...result.topSongs[0], id }] }, 'https://chromatify.example');
  const song = readSharedAura(new URL(url).search).topSongs[0];
  expect(song.id).toBe(id);
  expect(song.external_urls.spotify).toBe(`https://open.spotify.com/track/${id}`);
  expect(song.album).toBeUndefined();
  expect(url).not.toContain('private-art-url');
});

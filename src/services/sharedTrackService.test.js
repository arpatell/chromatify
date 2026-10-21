import { loadSharedTrackArtwork } from './sharedTrackService';
const originalFetch = global.fetch;
afterAll(() => { global.fetch = originalFetch; });
const song = (id) => ({ id, name: 'Track', artists: [{ name: 'Artist' }] });

test('shared public track IDs resolve official artwork without authentication', async () => {
  const thumbnail = 'https://image-cdn-fa.spotifycdn.com/image/abc123';
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ thumbnail_url: thumbnail }) });
  const input = song('4uLU6hMCjMI75M1A2tKUQC');
  const [resolved] = await loadSharedTrackArtwork([input]);
  expect(resolved.album.images[0].url).toBe(thumbnail);
  expect(resolved.name).toBe(input.name);
  const [url, options] = fetch.mock.calls[0];
  expect(url).toContain('https://open.spotify.com/oembed?url=');
  expect(decodeURIComponent(url)).toContain(input.id);
  expect(options.credentials).toBe('omit');
  expect(options.headers).toBeUndefined();
  await loadSharedTrackArtwork([input]);
  expect(fetch).toHaveBeenCalledTimes(1);
});

test('missing IDs, unavailable tracks and untrusted image URLs keep the original tracks', async () => {
  const legacy = song('shared-0');
  global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
  expect(await loadSharedTrackArtwork([legacy])).toEqual([legacy]);
  expect(fetch).not.toHaveBeenCalled();
  const unavailable = song('1234567890123456789012');
  expect(await loadSharedTrackArtwork([unavailable])).toEqual([unavailable]);
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ thumbnail_url: 'https://untrusted.example/image.jpg' }) });
  expect(await loadSharedTrackArtwork([unavailable])).toEqual([unavailable]);
});

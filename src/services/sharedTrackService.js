const artwork = new Map();
const isTrackId = (id) => typeof id === 'string' && /^[a-zA-Z0-9]{22}$/.test(id);

export async function loadSharedTrackArtwork(songs) {
  return Promise.all(songs.map(async (song) => {
    if (!isTrackId(song.id)) return song; // Older links contain names only.
    if (!artwork.has(song.id)) {
      const request = (async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        try {
          const url = `https://open.spotify.com/track/${song.id}`;
          const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`, { signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
          if (!response.ok) return null;
          const { thumbnail_url: thumbnail } = await response.json();
          if (typeof thumbnail !== 'string') return null;
          const parsed = new URL(thumbnail);
          return parsed.protocol === 'https:' && /(^|\.)(scdn\.co|spotifycdn\.com)$/.test(parsed.hostname) ? thumbnail : null;
        } catch { return null; }
        finally { clearTimeout(timer); }
      })();
      artwork.set(song.id, request);
      request.then((image) => {
        if (!image) artwork.delete(song.id);
        if (artwork.size > 100) artwork.delete(artwork.keys().next().value);
      });
    }
    const image = await artwork.get(song.id);
    return image ? { ...song, album: { images: [{ url: image }] } } : song;
  }));
}

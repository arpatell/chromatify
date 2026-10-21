import vocabulary from '../data/abstractColorVocabulary.json';
const convert = require('color-convert');

// Only hex values are sent to Color.pizza. Never send Spotify or account data.
const names = new Map();
const pending = new Map();
const abstractWords = new Set(vocabulary);
let catalogPromise;
const normalize = (value) => typeof value === 'string' && /^#?[0-9a-f]{6}$/i.test(value.trim()) ? `#${value.trim().replace('#', '').toUpperCase()}` : null;

export const getCachedColorName = (color) => names.get(normalize(color));
export const isAbstractColorName = (name) => {
  if (typeof name !== 'string' || !name.trim() || name.length > 100) return false;
  const words = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().match(/[a-z]+/g);
  return Boolean(words?.length && words.every((word) => abstractWords.has(word)));
};

async function closestAbstractName(hex) {
  // Lazy-load a broad, vetted subset of the same provider's full catalog.
  if (!catalogPromise) catalogPromise = import('../data/abstractColorNames.json').then(({ default: catalog }) => catalog.map(([name, color]) => ({ name, lab: convert.hex.lab.raw(color.slice(1)) })));
  const catalog = await catalogPromise;
  const lab = convert.hex.lab.raw(hex.slice(1));
  let closest;
  let bestDistance = Infinity;
  catalog.forEach((entry) => {
    const distance = entry.lab.reduce((sum, channel, index) => sum + (channel - lab[index]) ** 2, 0);
    if (distance < bestDistance) { bestDistance = distance; closest = entry.name; }
  });
  return closest || hex;
}

const cacheName = (hex, name) => {
  names.set(hex, name);
  if (names.size > 256) names.delete(names.keys().next().value);
};

export async function getColorNames(colors) {
  const normalized = colors.map(normalize);
  const missing = [...new Set(normalized.filter((hex) => hex && !names.has(hex)))].sort();
  if (missing.length) {
    const key = missing.join(',');
    if (!pending.has(key)) {
      const request = (async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        try {
          const response = await fetch(`https://api.color.pizza/v1/?values=${missing.map((hex) => hex.slice(1)).join(',')}`, {
            signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer',
          });
          if (!response.ok) return;
          const data = await response.json();
          if (!Array.isArray(data.colors)) return;
          data.colors.forEach(({ requestedHex, name }) => {
            const hex = normalize(requestedHex);
            if (missing.includes(hex) && isAbstractColorName(name)) {
              cacheName(hex, name.trim());
            }
          });
        } catch {
          // The local provider catalog also supports offline naming.
        } finally {
          clearTimeout(timer);
          await Promise.all(missing.filter((hex) => !names.has(hex)).map(async (hex) => {
            try { cacheName(hex, await closestAbstractName(hex)); }
            catch { /* Keep the exact hex if the catalog chunk is unavailable too. */ }
          }));
        }
      })();
      pending.set(key, request);
      request.finally(() => pending.delete(key));
    }
    await pending.get(key);
  }
  return normalized.map((hex) => names.get(hex) || hex || 'Unknown');
}

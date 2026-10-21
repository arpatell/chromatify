const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { metadata, pickSiteUrl, toSiteUrl } = require('./metadata');
const { generateSeoAssets } = require('../generate-seo-assets');

test('production canonicals never use ephemeral Vercel preview hosts', () => {
  assert.equal(pickSiteUrl({ REACT_APP_VERCEL_URL: 'random-preview.vercel.app' }), 'https://chromatify.vercel.app');
  assert.equal(pickSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'custom-production.vercel.app' }), 'https://custom-production.vercel.app');
  assert.equal(pickSiteUrl({ REACT_APP_SITE_URL: 'https://custom.example/path?x=1', SITE_URL: 'fallback.example' }), 'https://custom.example');
  assert.equal(toSiteUrl('https://user:secret@example.com'), null);
});

test('canonical, social image and structured graph agree on the production identity', () => {
  for (const about of [false, true]) {
    const html = metadata('https://music.example', { about });
    const url = `https://music.example/${about ? 'about/' : ''}`;
    assert(html.includes(`<link rel="canonical" href="${url}"`));
    assert(html.includes('content="https://music.example/image.png"'));
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    assert.equal(graph.find((item) => item['@type'] === 'WebSite').url, 'https://music.example/');
    assert.equal(graph.at(-1).url, url);
    assert.equal(graph.at(-1)['@type'], about ? 'AboutPage' : 'WebPage');
    assert(!html.includes('aggregateRating'));
    assert(!html.includes('name="keywords"'));
  }
});

test('generation is deterministic and includes useful static content for ordinary visitors', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'chromatify-seo-'));
  try {
    generateSeoAssets({ publicDir: temp, siteUrl: 'https://music.example', env: { GOOGLE_SITE_VERIFICATION: 'proof" /><script>bad</script>' } });
    const home = fs.readFileSync(path.join(temp, 'index.html'), 'utf8');
    const about = fs.readFileSync(path.join(temp, 'about/index.html'), 'utf8');
    assert(home.includes('Your music.<br />In full color.'));
    assert(home.includes('Spotify listening history'));
    assert(!home.includes('href="/about/"'));
    assert(!home.includes('<script>bad</script>'));
    assert(home.includes('proof&quot; /&gt;&lt;script&gt;'));
    assert(about.includes('How your Spotify colors are made'));
    assert(about.includes('Share your music colors with friends'));
    const sitemap = fs.readFileSync(path.join(temp, 'sitemap.xml'), 'utf8');
    assert.equal((sitemap.match(/<loc>/g) || []).length, 2);
    assert(sitemap.includes('https://music.example/about/'));
    assert(!sitemap.includes('?aura='));
    generateSeoAssets({ publicDir: temp, siteUrl: 'https://music.example', env: { GOOGLE_SITE_VERIFICATION: 'proof" /><script>bad</script>' } });
    assert.equal(fs.readFileSync(path.join(temp, 'sitemap.xml'), 'utf8'), sitemap);
    assert.equal(fs.readFileSync(path.join(temp, 'index.html'), 'utf8'), home);
  } finally {
    // This exact mkdtemp target was created above, inside the OS temp directory.
    assert(path.dirname(temp) === os.tmpdir() && path.basename(temp).startsWith('chromatify-seo-'));
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('OAuth callbacks and aura snapshots are noindex; the public homepage stays indexable', () => {
  const template = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf8');
  const script = [...template.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
  for (const [pathname, search, expected] of [['/', '', 'index,follow'], ['/', '?aura=112233', 'noindex,follow'], ['/callback', '?code=private', 'noindex,follow'], ['/', '?utm_source=friend', 'index,follow']]) {
    const tag = { content: 'index,follow' };
    vm.runInNewContext(script, { location: { pathname, search }, document: { querySelector: () => tag } });
    assert.equal(tag.content, expected);
  }
});

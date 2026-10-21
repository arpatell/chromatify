const config = require('../../src/config/seo.json');

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const jsonLd = (value) => JSON.stringify(value, null, 2).replace(/</g, '\\u003c');

const toSiteUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.origin : null;
  } catch { return null; }
};

const pickSiteUrl = (env = process.env) => [env.REACT_APP_SITE_URL, env.SITE_URL, env.REACT_APP_VERCEL_PROJECT_PRODUCTION_URL, env.VERCEL_PROJECT_PRODUCTION_URL, config.defaultOrigin].map(toSiteUrl).find(Boolean);

function metadata(siteUrl, { about = false } = {}) {
  const url = `${siteUrl}${about ? '/about/' : '/'}`;
  const title = about ? config.aboutTitle : config.title;
  const description = about ? config.aboutDescription : config.description;
  const image = `${siteUrl}/image.png`;
  const graph = [
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: config.name, description: config.description, inLanguage: 'en' },
    { '@type': ['SoftwareApplication', 'WebApplication'], '@id': `${siteUrl}/#app`, name: config.name, url: `${siteUrl}/`, applicationCategory: 'MultimediaApplication', operatingSystem: 'Web', browserRequirements: 'Requires JavaScript and a Spotify connection to generate an aura.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, description: config.description, image, featureList: ['Spotify top tracks for three time ranges', 'Album-art color palettes and a personal music aura', 'Named colors with exact hex values', 'Downloadable aura images', 'Public aura links to share with friends', 'Dark and light themes'] },
    { '@type': about ? 'AboutPage' : 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'en', isPartOf: { '@id': `${siteUrl}/#website` }, about: { '@id': `${siteUrl}/#app` } },
  ];
  return `<title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="application-name" content="Chromatify" />
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
  <link rel="canonical" href="${escapeHtml(url)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta property="og:site_name" content="Chromatify" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Chromatify: turn Spotify music into a personal color aura" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
  <meta name="twitter:image:alt" content="Chromatify: turn Spotify music into a personal color aura" />
  <script type="application/ld+json">${jsonLd({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

module.exports = { metadata, pickSiteUrl, toSiteUrl, escapeHtml };

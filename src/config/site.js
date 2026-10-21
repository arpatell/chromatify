import seo from './seo.json';

// Build-time production identity; shared links use their current deployment origin.
const configured = process.env.REACT_APP_SITE_URL || seo.defaultOrigin;
const productionUrl = (() => {
  try {
    const url = new URL(/^https?:\/\//i.test(configured) ? configured : `https://${configured}`);
    if (['http:', 'https:'].includes(url.protocol) && !url.username && !url.password) return url;
  } catch { /* Fall back to the established production site. */ }
  return new URL(seo.defaultOrigin);
})();

export const PRODUCTION_SITE_HOST = productionUrl.host;

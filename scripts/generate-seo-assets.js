const fs = require('fs');
const path = require('path');
const config = require('../src/config/seo.json');
const { metadata, pickSiteUrl, escapeHtml } = require('./seo/metadata');

function generateSeoAssets({ publicDir = path.resolve(__dirname, '../public'), siteUrl = pickSiteUrl(), env = process.env } = {}) {
  const sourceDir = path.join(__dirname, 'seo');
  const verification = env.GOOGLE_SITE_VERIFICATION || env.REACT_APP_GOOGLE_SITE_VERIFICATION;
  const homeMetadata = metadata(siteUrl) + (verification ? `
  <meta name="google-site-verification" content="${escapeHtml(verification)}" />` : '');
  const template = fs.readFileSync(path.join(sourceDir, 'index.template.html'), 'utf8');
  const fallback = fs.readFileSync(path.join(sourceDir, 'fallback.html'), 'utf8');
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'index.html'), template.replace('{{METADATA}}', homeMetadata).replace('{{FALLBACK}}', fallback));

  const aboutBody = fs.readFileSync(path.join(sourceDir, 'about-body.html'), 'utf8');
  const about = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#121719" />
  <link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/fonts/fonts.css" />
  <link rel="stylesheet" href="/about.css" />
  <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg" />
  ${metadata(siteUrl, { about: true })}
</head>
<body>${aboutBody}</body>
</html>
`;
  fs.mkdirSync(path.join(publicDir, 'about'), { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'about/index.html'), about);
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`);
  const urls = ['/', '/about/'].map((route) => `  <url>
    <loc>${escapeHtml(siteUrl + route)}</loc>
    <lastmod>${config.contentUpdated}</lastmod>
  </url>`).join(String.fromCharCode(10));
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`);
  return siteUrl;
}

if (require.main === module) console.log(`[seo] Prepared crawlable home/about pages, metadata, structured data, robots and sitemap for ${generateSeoAssets()}`);
module.exports = { generateSeoAssets };

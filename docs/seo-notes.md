# Chromatify search discoverability

## Scope and truthful search intent

Target natural intent around Chromatify, Spotify colors/colours, Spotify music aura, music color palettes, and sharing music with friends. The app generates colors from album artwork and shares images/links. It does not offer friend discovery, compatibility scoring, or official Spotify mood analysis; copy must reflect the actual features.

Keep the main app compact. Search metadata lives in the HTML head. Longer explanatory content lives on `/about/` as a standalone reference document listed in the sitemap. The main app has no About link. The homepage contains a visible static fallback for every visitor before React mounts, matching the actual login heading and description. No bot-specific output, hidden keyword blocks, fake reviews, or keyword meta tags.

## Sources of truth

- `src/config/seo.json`: brand, search titles, descriptions and meaningful content update date.
- `scripts/seo/metadata.js`: canonical URLs, absolute social images, and connected WebSite/WebApplication/WebPage or AboutPage JSON-LD.
- `scripts/seo/index.template.html`: app document and query/callback noindex handling.
- `scripts/seo/fallback.html`: semantic initial homepage content; React replaces it with the interactive app for everyone.
- `scripts/seo/about-body.html`: standalone explanatory content, available without JavaScript or Spotify login.
- `scripts/generate-seo-assets.js`: generates public HTML, robots.txt and sitemap.xml before each build. Do not edit generated public HTML directly.
- `public/favicon.svg`: a C inside the approved orange/blue/purple aura circle. The plain `brand-aura.png` image is shared by the app and export to preserve the same rendering.

## Canonical domain and dates

Prefer `REACT_APP_SITE_URL=https://chromatify.vercel.app`, or `SITE_URL`. Otherwise use the Vercel production-domain environment variable, then the default production origin. Ephemeral preview hosts never become canonical just because a preview URL exists. Canonical, Open Graph, JSON-LD, robots and sitemap URLs share one domain.

The sitemap lists only `/` and `/about/`. Set `contentUpdated` in config when the public content meaningfully changes; builds do not invent a new modification date. Shared aura query URLs and OAuth responses get `noindex,follow` in the document head. They remain usable by people; the canonical homepage stays indexable.

## Google Search Console: deployment follow-through

No connected Search Console account was available in this workspace. After publishing:

1. Add the production property at https://search.google.com/search-console and verify ownership. DNS verification is preferred if you own a custom domain. For this Vercel subdomain, use a URL-prefix property and Google's HTML-tag method.
2. Put Google's exact tag value into `GOOGLE_SITE_VERIFICATION` (or `REACT_APP_GOOGLE_SITE_VERIFICATION`) in the deployment environment, then rebuild. The generator emits the verification tag without hardcoding an unverified value.
3. Submit `https://chromatify.vercel.app/sitemap.xml`.
4. Use URL Inspection on the homepage and `/about/`; inspect the rendered page, check the selected canonical and request indexing.
5. Review performance by query/page over time. Refine real copy and earn relevant links from music projects, directories, and people sharing the app. Never manufacture backlinks or make claims about guaranteed positions.

## Validation

Run `npm run test:seo`, `npm test -- --watchAll=false --runInBand`, and `npm run build`. Check built HTML with JavaScript disabled, confirm both public routes return useful content, test phone widths and confirm the main app has no About link, and parse the JSON-LD. Use Google's Rich Results Test for syntax/eligibility; application markup does not promise a rich result and intentionally has no invented rating.

## Primary guidance

- https://developers.google.com/search/docs/essentials
- https://developers.google.com/search/docs/essentials/spam-policies
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

No implementation can guarantee first place. Indexing, relevance, authority, and competition determine results after deployment and recrawling.

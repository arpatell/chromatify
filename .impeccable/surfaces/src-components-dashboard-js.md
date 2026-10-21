---
version: 1
slug: "src-components-dashboard-js"
primary_target: "src/components/Dashboard.js"
related_targets: ["src/components/Login.js","src/App.css","src/components/AuraSleeve.js"]
---

# Chromatify redesign

Scope: login, dashboard, shared aura, support, and responsive themes. Mode: Operate for the dashboard and shared aura; Persuade for login. The user confirmed image-first sharing, full scope, and code-first implementation. They selected Spectrum sleeve with one explicit amendment: blend Listening room's mixed aura colors inside the rectangular sleeve, and show the actual top three swatches below. Preserve Spotify authentication, calculations, and hidden listen counts.

User corrections: no sample aura on the signed-in initial screen; remove “Example aura · your music makes the mix”; show a direct Disconnect button instead of an account icon/menu. Login may retain the clearly marked preview.

Further user decisions: the brand mark is a small blended orange/blue/purple circle; aura titles are creative names based on the full palette/track mix, not a single color label; song-link affordances use Spotify logos; crypto support includes real QR codes styled within both themes. Detailed swatch names use Color.pizza after explicit user approval, with closest applicable abstract names in place of food names; original hex values remain unchanged.

## Direction contract

THESIS: A personal music aura becomes a collectible color sleeve; music and color lead, with a direct path to a shareable image.

OWN-WORLD: Matte charcoal, warm white, peach actions, sage selected controls, condensed sleeve typography, generous rectangular blended-color fields, and compact album-art rows. Light mode uses pale neutral surfaces with the same color roles.

STORY: Connect Spotify, choose a range, generate, understand the aura and its source tracks, then share, save, or copy a working public link. Coffee reveals the verified Ko-fi and seven crypto networks.

FIRST VIEWPORT: Quiet brand/utility header, strong page heading and range controls, one dominant mixed-color sleeve with oversized ink-colored aura name, then three named swatches. Desktop pairs the sleeve and compact track list; mobile stacks them. Inline share preview and actions follow; mobile has a reachable share shortcut. The sleeve colors flow slowly in place without rotation, and reduced motion removes animation.

FORM: Spectrum sleeve, grounded candidate 5, seed daed09f8; user-approved hybrid with Listening room's blend, 2026-10-21. Code-first remains the confirmed build path. Spectrum and Listening room decision comps are references, with the user's amendment taking priority.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Public shared links carry public Spotify track IDs and resolve album artwork through the credential-free Spotify oEmbed service. Legacy name-only links remain readable; recopying a link adds the required IDs. The header and export share one orange/blue/purple vector aura mark.

Shared aura attribution: include only the original creator’s Spotify display name and the original creation date in the public result. Re-sharing keeps those values in copied links, native share titles, and exported images; it never substitutes the viewer’s profile or the current date. Older links remain anonymous/undated. Keep re-sharing available alongside Make your aura.

# Chromatify

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Turn Spotify top tracks and their album artwork into a personal color aura, palette, and shareable image.

## Users

Inferred from the existing app: Spotify listeners exploring their music taste and sharing it with friends, often on a phone.

## Operating Context

Connect Spotify, choose Last Month, Last 6 Months, or All Time, generate an aura, review top songs and colors, and share the result.

## Capabilities and Constraints

Existing React 18 and MUI web app with Spotify PKCE authentication, album-art color extraction, Color.pizza swatch naming, aura weighting, and html2canvas image export. Preserve the calculation and authentication behavior. Listen counts remain hidden until further instruction. The user requests easier sharing, mobile support, dark mode by default, a theme toggle, and a coffee support entry using the exact Ko-fi and crypto details from https://ragnarok-reader.vercel.app/.

## Brand Commitments

Keep the Chromatify name and Spotify attribution. Dark mode is the default; light mode remains available. Support links belong to arpatell.

## Evidence on Hand

Existing product code and Spotify logos under public/. Reference support details verified from the reference site's public JavaScript on 2026-10-21. No customer claims, testimonials, or usage metrics are supplied.

## Product Principles

- Music and its resulting colors lead the experience.
- Sharing must remain useful without native share support.
- Mobile controls and dialogs must fit small screens and support touch and keyboard use.
- User theme preference persists across visits.

## Confirmed Redesign Scope

The user confirmed a complete login/dashboard redesign and image-first sharing with download and copy-link options.

The user selected Spectrum sleeve's layout and typography, amended to use Listening room's blended aura colors inside the rectangular sleeve. The top three color swatches appear below. Implementation remains code-first.

Later confirmed requirements: slow, nonrotating aura movement; no sample aura on the initial signed-in page; a direct Disconnect button; an orange/blue/purple circular aura mark beside Chromatify; stable creative aura names distinct from descriptive swatch names; Spotify logos on track links; and theme-matched wallet QR codes. Detailed swatch names use Color.pizza after user approval on 2026-10-21. Only color hex values are sent. Food-related or non-abstract names select the closest match from a vetted subset of the same full catalog; provider failures also use that local catalog. Actual swatch hex values never change.

Public shared links carry public Spotify track IDs and resolve album artwork through the credential-free Spotify oEmbed service. Legacy name-only links remain readable; recopying a link adds the required IDs. The header and export share one orange/blue/purple vector aura mark.

Search discoverability: keep the main app compact, with descriptive head metadata, a crawlable initial homepage, and a standalone About reference page listed in the sitemap. Target the actual Spotify color/aura and music-sharing features without hidden keyword text, false social features, or ranking guarantees. Header/export use the same pre-rendered darker orb artwork; the favicon adds a white C.

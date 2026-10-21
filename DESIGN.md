---
name: Chromatify
description: Personal music translated into collectible color sleeves.
colors:
  background: "#121719"
  surface: "#1c2427"
  surface-hover: "#283337"
  ink: "#edf0e8"
  muted: "#aebbbd"
  line: "#374348"
  peach: "#edac8d"
  peach-hover: "#f6bd9e"
  sage: "#a8c7bc"
  button-ink: "#16201e"
  error: "#ffb9a9"
  light-background: "#f0f0e9"
  light-surface: "#fafaf5"
  light-surface-hover: "#e5e9df"
  light-ink: "#172125"
  light-muted: "#546467"
  light-line: "#c9d1c8"
  light-peach-hover: "#e59c7a"
  light-sage: "#abcabe"
  light-error: "#a63720"
  mui-light-primary: "#8a4429"
  orb-purple: "#8456b5"
  orb-purple-deep: "#3b315e"
  orb-blue: "#7995e6"
  orb-orange: "#eeb27d"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(76px,7.4vw,96px)"
    fontWeight: 900
    lineHeight: 0.91
    letterSpacing: "-.025em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(32px, 3.5vw, 48px)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-.04em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    letterSpacing: "-.03em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    lineHeight: 1.65
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.5
rounded:
  tight: "3px"
  control-small: "7px"
  small: "8px"
  control: "10px"
  group: "12px"
  sleeve: "14px"
  dialog: "16px"
spacing:
  micro: "4px"
  small: "8px"
  compact: "12px"
  base: "16px"
  control: "20px"
  section: "24px"
  generous: "28px"
  wide: "40px"
components:
  button-primary:
    backgroundColor: "{colors.peach}"
    textColor: "{colors.button-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.peach-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-hover}"
  utility-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px"
    width: "44px"
    height: "44px"
  link-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control-small}"
    padding: "10px"
  network-option:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control-small}"
    padding: "8px 13px"
  network-option-selected:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.button-ink}"
  aura-sleeve:
    textColor: "{colors.background}"
    rounded: "{rounded.sleeve}"
  status-container:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "16px 20px"
---

# Design System: Chromatify

## Overview

**Creative North Star: "Spectrum sleeve"**

Music becomes a collectible color sleeve: a generous rectangular field of softly blended album-art colors, carrying a large condensed name. Matte charcoal and warm white give those personal colors space; peach actions and sage selections keep the interface calm and direct. Light mode preserves the same relationships on pale neutral surfaces.

Manrope provides clear, compact controls and supporting text. Barlow Condensed gives the sleeve its distinctive scale and character. Utility surfaces stay quiet so the listener's music and generated colors provide the variation.

**Key Characteristics:**
- Rectangular blended color fields with oversized condensed names.
- Charcoal by default, with a persistent light preference.
- Peach actions, sage selections, and restrained tonal surfaces.
- Compact artwork rows and a consistent orange/blue/purple vector brand orb.
- Slow translation and scaling, with reduced motion respected.

## Colors

The fixed interface palette is subdued and warm; generated music colors remain data, not permanent brand tokens. Frontmatter values describe the dark default; `light-*` values replace the matching semantic roles in light mode.

### Primary

- **Peach:** primary actions, keyboard focus, and text selection. The action background stays peach in both themes; its hover shade changes by theme.
- **MUI Light Primary:** the deeper warm primary used by the MUI light theme; it does not replace custom peach action backgrounds.

### Secondary

- **Sage:** selected listening ranges and wallet networks, paired with button ink.

### Tertiary

- **Orb Purple, Deep Purple, Blue, and Orange:** the shared vector brand mark. Use the existing AuraMark asset in headers and exports to retain the same blend.

### Neutral

- **Background / Surface / Surface Hover:** charcoal canvas, raised tonal areas, and interactive hover areas; pale neutral equivalents in light mode.
- **Ink / Muted:** primary and supporting text, with theme-specific equivalents.
- **Line:** quiet borders and dividers, with a lighter equivalent on pale surfaces.
- **Button Ink:** dark lettering on peach and sage controls in both themes.
- **Error:** legible warm error text, with a deeper equivalent on pale surfaces.

**The Actual Color Rule.** Preserve generated swatch hex values. Descriptive names come from Color.pizza or the closest vetted abstract catalog match; the creative aura title is a separate name for the whole mix.

**The Readable Sleeve Rule.** Use dark sleeve ink over the actual blended palette with the implemented adaptive white wash. The wash is computed from the darkest possible channel mixture, targets at least 4.7:1 contrast, and ranges from .23 to .55; swatch chips retain their original colors.

## Typography

**Display Font:** Barlow Condensed, sans-serif.
**Body Font:** Manrope, sans-serif.

The pairing combines a bold sleeve identity with compact, readable interface text. Condensed display type belongs to aura names; Manrope carries page headings, navigation, track metadata, and controls.

### Hierarchy

- **Display:** the frontmatter display role names the desktop sleeve. Long words use a smaller responsive size; mobile names scale with viewport width, and exports use a fixed compact treatment.
- **Headline:** strong page introductions use the headline role. Login uses a larger range (48–76px), with tight leading (1.04).
- **Title:** section headings use the title role; mobile track headings increase to 24px.
- **Body:** supporting dashboard prose uses the body role, with muted color and line lengths up to 64ch. Login introductory copy grows to 16px.
- **Label:** primary controls use the label role. Metadata uses 11–13px; names in track rows use 13px on desktop and 14px on mobile. Numeric ranks and hex labels use tabular numerals.

**The Two Voices Rule.** Keep the condensed voice on the color sleeve and use Manrope for the surrounding interface.

## Layout

The shared shell centers content at a maximum width of 1184px. Desktop gutters are 40px; below 1000px they become 24px, below 760px they become 18px, and below 360px they become 14px. Reused spacing favors 4px increments with compact optical adjustments for metadata and artwork.

The current dashboard pairs the sleeve and tracks in a 1.35:1 grid with a 44px gap; below 1000px this tightens to 1.2:1 with a 28px gap. At 760px it stacks into one column with a 40px gap. This composition describes the dashboard, rather than prescribing every future screen. Login likewise changes from a two-column introduction/preview to a single column.

Controls wrap on mobile; the range group and initial generate action fill the available width. Preserve reachable touch targets: primary actions are at least 48px high, utilities 44px square, and network options at least 44px high. Supporting text and track titles truncate or wrap according to their role, while sleeves allow long names to wrap.

## Elevation & Depth

Depth primarily comes from tonal layering, borders, and the softly mixed sleeve field. The inline image preview uses a diffuse shadow (`0 12px 25px rgba(0,0,0,.18)`). Dialogs retain MUI's modal elevation and backdrop; the theme removes its paper background image. Do not turn the preview shadow into a universal card treatment.

The sleeve's blended layers translate and scale on alternating 22s and 29s ease-in-out loops, without rotation. Controls transition background and border colors over 160ms. Reduced-motion preference disables animation, transitions, and smooth scrolling; exported sleeves are still.

## Shapes

Soft rectangles carry the interface. Controls use the control radius; smaller range/network selections and fields use tighter corners, while sleeves and dialogs use their larger dedicated radii. Borders are thin and quiet. Album artwork is square with gently rounded corners. The small circular aura orb is an identity asset, rather than a container shape to repeat across the UI.

## Components

### Buttons

Solid peach actions feel direct and warm; outlined secondary actions are quieter. Both have a 1px border, a minimum 48px height, and the padding recorded in frontmatter. Primary hover uses the theme's peach-hover token; secondary hover uses surface-hover and strengthens the border to muted. Focus-visible uses a 2px peach outline offset by 4px. Disabled controls use .55 opacity and a wait cursor.

### Navigation

The header pairs a bold Manrope wordmark with the shared pre-rendered orb. Theme and coffee controls are transparent square icon buttons with tonal hover feedback. A connected listener gets a directly labeled Disconnect control with a small outlined shape. Icons use SVG; accessible labels remain attached to icon-only controls.

### Range and Network Options

Range buttons sit within a bordered, softly rounded group. Selected buttons use sage, dark ink, and stronger type. Wallet networks use individual bordered buttons with the same selected color relationship. Keep pressed state available through `aria-pressed`, and retain the common keyboard outline.

### Cards / Containers

Status messages use surface color, the control radius, and compact horizontal padding. Wallet QR blocks use the background tone inside a dialog, with a group radius. QR artwork has a light ink-colored backing and dark marks in both themes to preserve scan contrast.

### Inputs / Fields

Share links use a compact read-only surface field with a line border. Wallet addresses use a read-only background-tone textarea, smaller rounded corners, and wrapping suitable for long addresses. Both retain visible focus; errors use the semantic error color and actionable retry text.

### Color Sleeve and Swatches

The signature sleeve clips overlapping radial and linear gradients within a soft rectangle. The large name sits above a bordered metadata line. Use the adaptive wash from AuraSleeve rather than assuming a palette will be bright enough. Three actual swatches follow with descriptive names and hex labels. Copyable swatches gain an offset outline on hover and the shared keyboard focus treatment.

### Track Rows

Compact track links combine a rank, square album art, a two-line title/artist block, and Spotify attribution. Rows use thin separators and tonal hover feedback. Artwork is 46px on desktop and 48px on mobile. Shared track IDs hydrate public artwork through Spotify oEmbed; placeholder artwork remains a fallback.

### Image Sharing

The portrait card is a fixed dark composition in both themes. Its 360×640 CSS canvas renders at scale 3 to a 1080×1920 PNG. It repeats the shared pre-rendered orb, a still sleeve, actual swatches, three track names, and Spotify attribution. Maintain the white Spotify treatment against the dark export footer regardless of application theme. Pair the preview with image sharing/saving and a public link fallback.

## Do's and Don'ts

### Do:

- **Do** keep theme roles consistent across controls, dialogs, and supporting text.
- **Do** preserve actual swatch hex values and use the adaptive sleeve wash for readable names.
- **Do** reuse AuraMark and its shared transparent raster for the same orange/blue/purple identity in the interface and export. The favicon adds a white C.
- **Do** preserve visible keyboard focus and reduce motion when requested by the system.
- **Do** retain Spotify attribution and artwork-led track rows where tracks appear.

### Don't:

- **Don't** rotate the aura field or animate exported sleeves.
- **Don't** replace real palette colors with a fixed decorative brand palette.
- **Don't** use descriptive swatch names as the creative aura title.
- **Don't** make the signed-in initial state display sample results; the login preview remains clearly presented as a preview.
- **Don't** let the light theme change the export's dark composition or obscure its Spotify logo.

The standalone About page extends the same charcoal, Manrope, peach-action and reading-spacing system. The main app keeps the About link out of its interface; the page remains available as a standalone reference. The homepage preview computes its aura hex from its sample palette with the same calculation as signed-in results.

# Kalari Studio — Coming Soon

A minimal "coming soon" landing page for Kalari Studio. Static site, no
build step, no framework — just open `index.html`.

## Structure

```
index.html          markup
style.css            design tokens + layout
main.js              gallery drag/wheel-scroll, cart stub, signup form
public/
  fonts/
    Monotonia.otf    unused — from an earlier design direction, kept in case it's wanted again
    Eskool.ttf       unused — same
  audio/
    zen.mp3          unused — music was dropped from this design
  img/
    linen.jpg        unused — background is flat cream now, not a photo texture
    linen-tile.jpg   unused, same reason
```

## Design direction

This replaced an earlier embroidery/linen-texture aesthetic (stitched
borders, wrinkled-fabric animations, a photo-tiled background — see git
history if any of that is wanted back). The current direction is
intentionally plain and minimal:

- **Font:** Jost, loaded from Google Fonts — the same open-source
  typeface (SIL OFL licensed) used on a reference site the design was
  modeled after. Using the same freely-licensed font isn't the same as
  copying that site's content or design; it's a font choice anyone can
  make. `--font-body` in `style.css`.
- **Background:** flat cream (`--color-bg`), no texture or photo.
- **Buttons/inputs:** sharp corners (no `border-radius`), flat — no
  shadows, no gradients, no glassmorphism.
- **Header:** wordmark + a single flat cart icon button (`.icon-btn`).
  No background music, so no mute control either.

## The gallery

`.gallery-track` (in `index.html`) holds three images, pure visuals, no
text overlay — copy lives in the `.signup` section below it, not on
top of the images.

**Desktop (≥750px):** the track is a horizontal flex row, full
viewport height minus the header, with `overflow-x: auto` and native
scroll snapping disabled — `initGallery` in `main.js` adds drag-to-
scroll (pointer events, with a 6px threshold so a click still works as
a click) and maps vertical wheel/trackpad motion to horizontal scroll,
so it behaves like a horizontally-scrollable filmstrip whether you
drag or scroll.

**Mobile (<750px):** no JS involved — `.gallery-track` just becomes a
plain vertical flex column, each image full-width, in the normal
document flow.

**Placeholder images:** the three `<img>` tags currently point to
inline SVG data URIs (labeled "Photo 1/2/3") sized to a 3:4 portrait
aspect ratio. Swapping in real photos is a one-line change per image —
just replace the `src`, no structural changes needed. If the real
photos have a different aspect ratio, the layout adapts automatically
since image width is `auto` at a fixed height (desktop) or width
`100%` at auto height (mobile) — no hardcoded dimensions to update.

## Text to update

| What | Where |
|---|---|
| Gallery images | `src` on the three `.gallery-item img` tags in `index.html` |
| Launch date | `.launch-date` text in `index.html` |
| Tagline | `.tagline` text in `index.html` |
| Instagram / social links | `.site-footer` in `index.html` |
| Email signup endpoint | `initForm()` in `main.js` — currently a stub that just shows a confirmation message |
| Cart behavior | `initCart()` in `main.js` — currently just a toast stub |

## Colors (`style.css` `:root`)

| Variable | Current value |
|---|---|
| `--color-accent` | `#C8511E` burnt terracotta |
| `--color-hover` | `#F5C518` golden yellow |
| `--color-bg` | `#F7F2E6` flat cream |

## Running locally

Just open `index.html` in a browser.

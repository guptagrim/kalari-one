# Kalari Studios — Coming Soon

A minimal "coming soon" landing page for Kalari Studios. Static site, no
build step, no framework — just open `index.html`.

## Structure

```
index.html   markup
style.css    design tokens + layout
main.js      backdrop reveal, email signup form, footer year
public/
  img/
    backdrops/
      backdrop-eyes.svg   placeholder background art (see below)
```

## The backdrop layer

The faint art behind the page is a real `<img>`, not a CSS background —
it sits in a fixed, full-viewport layer behind all page content
(`.backdrop-layer` / `.backdrop-img` in `style.css`), gets preloaded via
a `<link rel="preload">` in `<head>`, and animates in on load: it starts
scaled up 4x, rotated 40°, and invisible, then eases down to its resting
scale/rotation/opacity (`main.js` → `initBackdrop`).

`public/img/backdrops/backdrop-eyes.svg` is a **placeholder** — scattered,
muted eye motifs in the style of Rajasthani miniature painting. Swap it
for real artwork whenever you have it; any raster or vector image works,
since it's rendered with `object-fit: cover`. If the real art has a very
different tonal range, revisit the `opacity` (`.12`–`.16`) and
`filter: saturate() brightness()` values on `.backdrop-img` in `style.css`.

## Text to update

| What | Where |
|---|---|
| Launch date | `.launch-date` text in `index.html` |
| Tagline | `.tagline` text in `index.html` |
| Instagram / social links | `.site-footer` in `index.html` |
| Email signup endpoint | `initForm()` in `main.js` — currently a stub that just shows a confirmation message |

## Colors (`style.css` `:root`)

| Variable | Current value |
|---|---|
| `--color-accent` | `#C8511E` burnt terracotta |
| `--color-hover` | `#F5C518` golden yellow |
| `--color-section` | `#6B9976` aloe green |
| `--color-bg` | `#F4E9D8` parchment |

## Running locally

Just open `index.html` in a browser.

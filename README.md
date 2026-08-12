# Kalari Studios — Coming Soon

A minimal "coming soon" landing page for Kalari Studios. Static site, no
build step, no framework — just open `index.html`.

## Structure

```
index.html          markup
style.css            design tokens + layout
main.js              hand-stitch renderer, music, cart stub, signup form
public/
  fonts/
    Monotonia.otf    wordmark display font (user-supplied)
    Eskool.ttf       body/display font, used everywhere else (user-supplied)
  audio/
    zen.mp3          background music (user-supplied)
```

## Fonts

`.wordmark` (top-left "KALARI STUDIOS") uses Monotonia. Everything else
on the page uses Eskool, all-caps. The all-caps is `text-transform:
uppercase` on `html`, not the actual text content — except it doesn't
fully cascade for free: browser UA stylesheets reset `text-transform` on
form controls (`<button>`, `<input>`, `<select>`), so `.notify-form
input` and `.notify-form button` both need their own explicit
`text-transform: uppercase` to actually pick it up. If you add new
buttons/inputs/selects later, they'll need the same override or they'll
silently render in mixed case despite `html`'s rule.

## The linen background

`html`'s `background-image` (`--linen-fabric` in `:root`) is a
**procedurally generated** SVG tile — alternating warp/weft bars faking
a woven over/under pattern, plus the same fiber-grain noise filter used
on the notify input, so the whole page reads as one fabric system.

This is a placeholder for a real reference photo that couldn't be turned
into a file across several attempts: it kept getting pasted inline into
the conversation rather than uploaded as an attachment, and this
environment doesn't save pasted images to disk the way it does file
attachments (only the latter get a path I can read) — there's no way for
me to extract it from here. I also tried sourcing a licensed replacement
online; every external image host this session tried (ShareTextures,
Negative Space, Wikimedia Commons, CadNav, Fuzzimo) came back blocked by
the environment's network egress policy. The most reliable path for a
real photo: commit it straight into this repo (e.g. via the GitHub web
UI into `public/img/`) rather than pasting it into chat.

**Swapping in a real photo:** replace `--linen-fabric`'s value with
`url("your-image.jpg")` and add `background-size: <tile-px>` alongside
`background-repeat: repeat` on `html`. It needs to be an actual seamless
tile (no visible edge when repeated) — a plain crop of a fabric photo
usually shows a seam. Vector textures like the current one tile perfectly
at any resolution for free; a raster photo needs to be prepared for
seamless tiling first (most photo editors have a "make seamless" /
offset-and-heal workflow for this).

## The hand-stitched email input

`.stitch-wrap` (wraps the `<input>` in the notify form) is outlined by
`initHandStitch` in `main.js` — **not** a CSS `border`. A native
`border: dashed` is mathematically perfect (identical dash length,
identical gap, every time), which reads as printed rather than sewn.
Real stitching wanders: length varies, spacing varies, the needle angle
wobbles slightly off-perpendicular. To get that, each stitch is drawn
individually as an SVG `<line>` with randomized length, spacing, angle,
and position jitter, walking two rings around the input's rounded-pill
outline (outer ring in `--color-thread`, inner ring in `--color-accent`,
at a different perimeter so their spacing falls out of phase — like two
separate passes of hand-stitching rather than one repeating pattern).

Since a fixed-size SVG or `border-image` can't track a responsive
width, and a plain CSS border can't be made irregular, this redraws on
a `ResizeObserver` bound to `.stitch-wrap` — it regenerates a fresh
random pattern any time the input's rendered size changes.

The fill texture (`--fabric-grain` in `:root`) is separately generated —
an SVG `feTurbulence` noise filter, thresholded for visible cellular
structure, flooded with the thread color. Same "couldn't reach a real
texture photo" situation as the background above.

**First-load intro:** the field starts as wrinkled fabric — `.fabric-
wrinkle`, a `feDisplacementMap` SVG filter (`#wrinkle-filter` in
`index.html`) warping the fabric fill, plus layered radial-gradient
shadow/highlight bands for fold depth — and a small SVG needle
(`.needle-svg`) travels the outline, revealing each stitch as it passes
that stitch's position. The wrinkle fades out on its own CSS transition
running concurrently with the needle's pass, rather than being tied
segment-by-segment to the needle's exact position — a simpler "global
crossfade" version of the effect vs. a fully-synced one, by design.

This only plays once, on the very first draw. `ResizeObserver`-triggered
redraws after that (window resize, orientation change) skip straight to
the finished state — replaying the full wrinkle→sew→flatten sequence on
every resize would get old fast on a page people revisit before launch.

## Header toolbar (mute + cart)

Both buttons use `.glass-btn` — a frosted-glass treatment
(`backdrop-filter: blur() saturate()`, translucent white fill, a light
inset highlight) similar to Apple's UI glass. The mute button's icon is
`.eq-bars` — four CSS-animated equalizer bars with staggered durations/
delays so they don't bounce in unison. They animate continuously from
page load regardless of whether the browser actually let the audio
autoplay (a "this is live" signal, same idea as a real player's meter),
and freeze flat via `[aria-pressed="true"] .eq-bar` when muted.

`#cart-btn` is currently a stub: there's no live storefront yet, so it
just shows a toast ("Cart opens at launch…") rather than opening
anything. Wire it to a real cart once there's something to sell.

## Background music

`#bg-music` autoplays best-effort on load. Browsers block unmuted
autoplay without a prior user gesture, so if that's blocked, playback
starts on the very first interaction anywhere on the page instead
(`initMusic` in `main.js`). `#mute-btn` toggles `.muted` independently
of whether playback has actually started — if someone mutes before
audio has unlocked, it'll start silently once it does.

## Text to update

| What | Where |
|---|---|
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
| `--color-section` | `#6B9976` aloe green |
| `--color-bg` | `#E7DCC5` linen base tone |
| `--color-thread` | `#5C2A1E` embroidery thread |

## Running locally

Just open `index.html` in a browser.

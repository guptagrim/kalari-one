# Kalari Studios — Coming Soon

A minimal "coming soon" landing page for Kalari Studios. Static site, no
build step, no framework — just open `index.html`.

## Structure

```
index.html   markup — includes the backdrop SVG inline (see below)
style.css    design tokens + layout
main.js      backdrop reveal, eye blink loop, email signup form, footer year
```

## The backdrop layer

The faint art behind the page is an inline `<svg class="backdrop-img">`
inside `.backdrop-layer` in `index.html` — not a CSS background, and not
a separate `<img src="...">` file. It's inlined on purpose: it's a real
part of the page DOM, which is what lets `main.js` reach into it and
drive the blink animation. (An SVG loaded via `<img src>` is opaque to
the parent page's script — no DOM access, no way to trigger anything on
a timer.)

It's currently **two placeholder eyes**, mirrored to flank the hero copy,
drawn in the style of Rajasthani miniature painting — muted linework,
winged outer-corner lashes, a lid crease, an iris highlight. Each eye is
a `.eye-group` containing a static `.brow` + `.lid-crease` and a `.eye`
group (outline, iris, pupil, lashes) that's the part that actually blinks.

**Reveal:** on load it starts scaled up 4x, rotated 40°, and invisible,
then eases down to resting scale/rotation/opacity (`initBackdrop` in
`main.js`).

**Blink:** once the reveal settles, `.eye` gets a `.blink` class added,
which plays the `eye-blink` keyframes in `style.css` (a quick vertical
squash — the brow/crease don't move, only the eyeball does). After that
animation ends, JS picks a fresh random delay between 5.0 and 10.0
seconds and schedules the next blink, indefinitely.

**Swapping in real artwork:** if the real art doesn't need to blink, you
can go back to a plain `<img src="...">` in `.backdrop-layer` (simpler,
and it can be a raster photo). If it *does* need to blink, it'll need the
same inline-and-scriptable treatment — e.g. two SVG/PNG layers (open eye
+ closed eye) cross-faded by the same timer logic, since a single flat
raster image can't squash itself.

## The stitched email input

`.stitch-wrap` (wraps the `<input>` in the notify form) draws an **open**
running-stitch border — real dashed gaps, not a solid line — using two
layers:

- The input's own `border: 3px dashed var(--color-thread)` — native CSS
  dashes round cleanly around the pill radius, unlike `border-image`
  (which doesn't bend around `border-radius` reliably) or a fixed-size
  SVG path (which wouldn't stay correct if the input's width changes
  responsively).
- `.stitch-wrap::before`, a second inset dashed ring in the accent color.
  Its perimeter differs slightly from the outer ring's, so the two rings'
  dash phases fall out of sync — closer to how a real second pass of
  hand-stitching looks than one perfectly repeating pattern.

The fill texture (`--fabric-grain` in `:root`) is **procedurally
generated**, not a photo: an SVG `feTurbulence` noise filter, thresholded
through a `discrete` alpha transfer to get visible cellular/woven
structure, then flooded with the thread color. This was a deliberate
fallback — I looked for a genuinely licensed (CC0/public-domain) thread
or linen texture photo to use instead, but every external image host this
session tried (ShareTextures, Negative Space, Wikimedia Commons) came
back blocked by the environment's network egress policy. If you have a
licensed texture image on hand, swapping it in is straightforward: it just
needs to be a **repeating tile** (set as `background-image` alongside
`background-repeat`), not a single image stretched across the input,
since the input's width is responsive.

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

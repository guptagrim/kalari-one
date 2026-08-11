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

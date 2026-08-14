# Kalari Studios — Coming Soon

A minimal "coming soon" landing page for Kalari Studios. Static site, no
build step, no framework — just open `index.html`.

## Structure

```
index.html          markup
style.css            design tokens + layout
main.js              music, cart stub, signup form
public/
  fonts/
    Monotonia.otf    wordmark display font (user-supplied)
    Eskool.ttf       body/display font, used everywhere else (user-supplied)
  audio/
    zen.mp3          background music (user-supplied)
  img/
    linen.jpg        linen reference photo, as supplied (user-supplied)
    linen-tile.jpg   linen.jpg, prepared for seamless tiling (generated — see below)
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

`html`'s `background-image` (`--linen-fabric` in `:root`) is the real
supplied photo — `public/img/linen-tile.jpg`, not `linen.jpg` directly.
The raw photo doesn't loop cleanly on its own (repeating a flat product
shot straight shows a visible seam at every tile edge, since it wasn't
shot/prepared as a seamless texture). `linen-tile.jpg` is a 2x2 mirrored
composite generated from it — each quadrant is flipped so it's a mirror
image of its neighbors, which makes every shared edge identical by
construction, with no visible seam. Tiled via `background-repeat: repeat`
+ `background-size` on `html`.

If you get a new/different reference photo later, regenerate the tile
rather than pointing `--linen-fabric` straight at it:

```python
from PIL import Image, ImageOps
img = Image.open('public/img/linen.jpg').convert('RGB')
w, h = img.size
tile = Image.new('RGB', (w * 2, h * 2))
tile.paste(img, (0, 0))
tile.paste(ImageOps.mirror(img), (w, 0))
tile.paste(ImageOps.flip(img), (0, h))
tile.paste(ImageOps.flip(ImageOps.mirror(img)), (w, h))
tile.save('public/img/linen-tile.jpg', quality=90)
```

## The email input

Plain and functional right now — white fill, a thin solid border, a
visible focus outline — while waiting on a supplied PNG "frame" asset
to replace it (a rectangular fabric swatch with frayed fringe on the
short ends).

**This used to be different, and it broke the input.** There was a
hand-stitched-border system here (individually-jittered SVG stitches,
plus a wrinkled-fabric-to-flat intro animation) that got scrapped for
two reasons: it wasn't the desired look, and — this is the important
part — `.fabric-wrinkle`, one of its overlay layers, was positioned
directly on top of the `<input>` without `pointer-events: none`. That
silently absorbed every click, so the field couldn't be focused or
typed into at all. It's a good example of why a decorative overlay
positioned over a real form control always needs an explicit
`pointer-events: none` — the browser doesn't know the layer is "just
visual," it just sees the topmost element in the stack. If you add any
future overlay inside `.stitch-wrap`, give it `pointer-events: none`
unless it genuinely needs to catch clicks.

**Once the PNG frame asset is in hand:** the right tool is CSS
`border-image`, not `background-image`. The photo has fixed detail at
the two short ends (fringe) that shouldn't stretch, with a plain
stretchable middle — exactly what `border-image-slice` /
`border-image-repeat` are for (3-slice horizontally: left cap, middle,
right cap), and it stays correct at any input width without distorting
the fringe, which a stretched `background-image` would.

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
autoplay without a prior user gesture — genuinely no exceptions; scroll
doesn't count as a gesture either, only click/tap/keydown do — so if
autoplay is blocked, playback starts on the very first qualifying
interaction anywhere on the page instead (`initMusic` in `main.js`).
`#mute-btn` toggles `.muted` independently of whether playback has
actually started — if someone mutes before audio has unlocked, it'll
start silently once it does.

**Nudge:** if autoplay was blocked, `#mute-btn` gets `.is-nudging` ~1.2s
after load, which plays a soft ring pulsing outward from the button
(`nudge-ring` keyframes in `style.css`) — an invitation to click, not
an instruction. It's capped at 3 cycles even if ignored, and stops
immediately either when playback actually starts or the button gets
clicked at all (`stopNudge` in `main.js`) — it's inviting one specific
gesture, not a permanent fixture competing with the signup form, which
is the page's actual job.

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

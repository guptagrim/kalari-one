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
    ClarendonMT.otf  body/display font (user-supplied)
    Monotonia.otf    unused — from an earlier design direction, kept in case it's wanted again
    Eskool.ttf       unused — same
  audio/
    zen.mp3          unused — music was dropped from this design
  img/
    gallery-1.jpg    gallery photo 1 (user-supplied, was DSC02083.JPG)
    gallery-2.jpg    gallery photo 2 (user-supplied, was number2.png)
    gallery-3.jpg    gallery photo 3 (user-supplied, was number3.png)
    linen.jpg        unused — background is flat cream now, not a photo texture
    linen-tile.jpg   unused, same reason
```

## Design direction

This replaced an earlier embroidery/linen-texture aesthetic (stitched
borders, wrinkled-fabric animations, a photo-tiled background — see git
history if any of that is wanted back). It briefly went through a
Jost/sans-serif phase too (also in git history) before landing here.
Current direction:

- **Font:** Clarendon MT Std (user-supplied), a serif — `--font-body`
  in `style.css`.
- **Background:** flat off-white (`--color-bg: #FFFBF4`), no texture
  or photo.
- **Buttons/inputs:** sharp corners (no `border-radius` on
  inputs/buttons — `.icon-btn` is the one deliberate exception, a
  circular hover halo behind the cart icon, a different and common
  convention for icon buttons specifically, not a contradiction of
  the sharp-corners rule for text buttons/inputs). Flat fills, no
  shadows/gradients/glassmorphism. Hover states are a soft charcoal
  shift (`#38302A`) rather than a full color invert, and button labels
  are sentence case at a normal reading size rather than tiny
  tracked-out uppercase — both changes from an earlier pass that read
  as too harsh against a serif typeface.
- **Header:** logo mark + wordmark (`.brand`) + a single flat cart icon
  button. No background music, so no mute control either.

## The logo mark

`.logo-mark` in `index.html` is a placeholder — a GIF linked directly
from an external URL (`https://thrly.github.io/img/warping_circle.gif`)
rather than committed into `public/img/`, per direction. Two
consequences of that:

- The header depends on that external host staying up. If it goes
  down, the `<img>` just fails quietly (no `width`/`height` attribute
  is set, since the GIF's real dimensions couldn't be confirmed from
  this environment — see below — so there's nothing to reserve layout
  space with) and the header falls back to showing the wordmark alone,
  rather than a broken-image icon. That's a reasonable degrade for a
  placeholder, but worth knowing before launch.
- I was never able to actually see this GIF render — this environment's
  network egress policy blocks essentially all external domains
  (confirmed it's a blanket policy, not specific to this URL: even
  google.com gets rejected the same way), so I could neither fetch its
  dimensions nor visually confirm it looks right. `.logo-mark` is
  styled `height: 32px; width: auto` to preserve whatever its real
  aspect ratio turns out to be rather than risk distorting it with a
  guessed fixed size — check that it actually looks right once you
  open the page yourself.

When a final logo is ready, swap the `src` for a local file in
`public/img/` and commit it — that removes the external dependency
entirely.

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

**Images:** `gallery-1/2/3.jpg` in `public/img/`, as supplied (originally
`DSC02083.JPG`, `number2.png`, `number3.png` — renamed for clarity, and
each processed before committing):

- `DSC02083.JPG` was a 14.7MB, 6000×4000 camera original with an EXIF
  rotation tag (`Orientation: 6`) rather than upright pixels — some
  viewers respect that tag and some don't, so rather than gamble on
  every browser/context rendering it correctly, the rotation was baked
  into the actual pixels (`ImageOps.exif_transpose`) before resizing.
- All three were resized to a 2200px long edge and re-saved as
  optimized JPEGs (quality 85) — combined they went from ~20MB to
  ~1MB. `number2.png`/`number3.png` were RGBA but fully opaque (no
  actual transparency in use), so converting PNG → JPEG lost nothing
  visible while cutting file size dramatically.

If a future photo has a different aspect ratio than these, the layout
adapts automatically since image width is `auto` at a fixed height
(desktop) or width `100%` at auto height (mobile) — no hardcoded
dimensions to update either way.

## The footer

Three-column layout: placeholder utility links (left, all `href="#"` —
no real pages exist yet), wordmark + copyright (center, text only —
no logo file yet), Instagram (right).

There's deliberately only **one** email signup on the page, not two.
An earlier pass had a second "10% off" newsletter form here in the
footer alongside the mid-page "Notify me" one — same stub handler,
different pitch — which turned out to be redundant, and "10% off your
first order" doesn't really make sense pre-launch anyway (there's no
first order yet to discount). The incentive copy now lives on the one
remaining form in `.signup`, and the footer is back to just links/
wordmark/social. `bindSignupForm` in `main.js` is still written as a
reusable helper in case a second form is ever wanted again.

The three-column structure was modeled on a footer from another real
Shopify store — structure only, never its content. That reference's
actual code wasn't reusable regardless of style: its form posted to
that business's live Klaviyo mailing list (a hardcoded list ID tied to
their account), its newsletter image was hotlinked from their CDN, it
displayed a B-Corp certification badge (a real audited status, not
decoration), and its nav/social links and copyright all pointed at
their business. None of that is in this version — go check that
reference yourself if you want confirmation it wasn't just superficial
theme boilerplate anyway.

## Text to update

| What | Where |
|---|---|
| Gallery images | `src` on the three `.gallery-item img` tags in `index.html` |
| Launch date / incentive copy | `.launch-date` text in `index.html` |
| Tagline | `.tagline` text in `index.html` |
| Footer links (Sizing/Returns/Shipping/FAQ) | `.footer-col-left` in `index.html` — currently all `href="#"` |
| Instagram / social links | `.footer-col-right` in `index.html` |
| Email signup endpoint | `bindSignupForm('notify-form', ...)` call in `main.js` — currently a stub that just shows a confirmation message |
| Cart behavior | `initCart()` in `main.js` — currently just a toast stub |

## Colors (`style.css` `:root`)

| Variable | Current value |
|---|---|
| `--color-accent` | `#C8511E` burnt terracotta |
| `--color-hover` | `#F5C518` golden yellow (currently unused after the button-hover redesign — was the old invert-hover color) |
| `--color-bg` | `#FFFBF4` flat off-white |

## Running locally

Just open `index.html` in a browser.

# Kalari Studio — Exhibition Website

A single-page exhibition site inspired by the MSCHF Material Values format.

## Where to drop your media files

```
public/
  img/
    hero-bg.jpg        ← background image shown through the cursor blob
    logo.svg           ← your logo mark (used in top-right corner)
    animorph.png       ← wide horizontal image for the shop scrolling strip
    sculpture.gif      ← optional floating object over the shop section
    shop/
      item1.png        ← Kalari Long Sleeve product image
      item2.png        ← Kalari Tee
      item3.png        ← Studio Hoodie
      item4.png        ← Art Print
      item5.png        ← Kalari Zine
  video/
    hero.mp4           ← autoplay muted loop video (bottom-left panel)
```

## Text to replace in index.html

Search for `[` — every bracketed placeholder needs your real content:

| Placeholder | Replace with |
|---|---|
| `[DATE]`, `[TIME]` | e.g. `Oct. 5th, 6–10PM` |
| `[MONTH] [DAY] [YEAR]` | e.g. `OCTOBER 05 2025` |
| `[Your Venue Name]` | your gallery / space name |
| `[City, Country]` | e.g. `New Delhi, India` |
| `[Full Address, City, Country]` | full postal address |

## Colors (style.css `:root`)

| Variable | Current value | Change to |
|---|---|---|
| `--color-accent` | `#FF6B00` saffron | your brand primary |
| `--color-hover` | `#FFD700` gold | your hover/highlight |
| `--color-section` | `#1A3A3A` deep teal | shop section background |
| `--color-preloader` | `#C04000` deep saffron | preloader background |

## Hindi / Punjabi text

Current text uses **Hindi (Devanagari)**. To switch to **Punjabi (Gurmukhi)**:

1. In `index.html` replace:
   - `कलारी स्टूडियो` → `ਕਲਾਰੀ ਸਟੂਡੀਓ`
   - `कलारी स्टूडियो की पहली प्रदर्शनी` → `ਕਲਾਰੀ ਸਟੂਡੀਓ ਦੀ ਪਹਿਲੀ ਪ੍ਰਦਰਸ਼ਨੀ`
   - `कलारी स्टूडियो` / `प्रदर्शनी शुरू होती है।` → your Punjabi equivalents

2. In `style.css`, change `.devanagari` class font to:
   ```css
   font-family: var(--font-gurmukhi);
   ```

## Running locally

Just open `index.html` in a browser — no build step needed.

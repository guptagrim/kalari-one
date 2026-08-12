/* Kalari Studios — main.js */

// ── Hand-stitched border ──────────────────────────────────
// A native `border: dashed` is mathematically perfect — identical dash
// length, identical gap, every time. That reads as printed, not sewn.
// Real hand stitching wanders: length varies, spacing varies, the
// needle angle wobbles slightly off-perpendicular. This draws two rings
// of individually-jittered stitch marks around the input, redrawn to
// match its live rendered size (a fixed-size SVG or border-image can't
// track a responsive width; a plain CSS border can't be irregular).
(function initHandStitch() {
  const wrap = document.querySelector('.stitch-wrap');
  const input = wrap && wrap.querySelector('input');
  const svg = wrap && wrap.querySelector('.stitch-svg');
  if (!wrap || !input || !svg) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const THREAD_OUTER = '#5C2A1E';
  const THREAD_INNER = '#C8511E';

  // Point + tangent angle at arc-length `t` around a pill (stadium)
  // outline sized w×h, inset by `inset` on all sides.
  function pillPoint(t, w, h, inset) {
    const width = w - inset * 2;
    const height = h - inset * 2;
    const r = height / 2;
    const straight = Math.max(0, width - height);
    const halfArc = Math.PI * r;
    const total = 2 * straight + 2 * halfArc;
    t = ((t % total) + total) % total;
    const ox = inset, oy = inset;

    if (t < straight) {
      return { x: ox + r + t, y: oy, angle: 0 };
    }
    t -= straight;
    if (t < halfArc) {
      const theta = -Math.PI / 2 + t / r;
      return {
        x: ox + (width - r) + r * Math.cos(theta),
        y: oy + r + r * Math.sin(theta),
        angle: theta + Math.PI / 2,
      };
    }
    t -= halfArc;
    if (t < straight) {
      return { x: ox + (width - r) - t, y: oy + height, angle: Math.PI };
    }
    t -= straight;
    const theta = Math.PI / 2 + t / r;
    return {
      x: ox + r + r * Math.cos(theta),
      y: oy + r + r * Math.sin(theta),
      angle: theta + Math.PI / 2,
    };
  }

  function perimeter(w, h, inset) {
    const width = w - inset * 2;
    const height = h - inset * 2;
    const r = height / 2;
    const straight = Math.max(0, width - height);
    return 2 * straight + Math.PI * height;
  }

  function drawRing(w, h, inset, baseSpacing, color, widthRange, lenRange) {
    const total = perimeter(w, h, inset);
    let t = Math.random() * baseSpacing;
    while (t < total) {
      const spacing = baseSpacing * (0.75 + Math.random() * 0.6); // irregular gaps
      const p = pillPoint(t, w, h, inset);
      const len = lenRange[0] + Math.random() * (lenRange[1] - lenRange[0]);
      const strokeW = widthRange[0] + Math.random() * (widthRange[1] - widthRange[0]);
      const wobble = (Math.random() - 0.5) * 0.3; // radians, off-perpendicular needle angle
      const a = p.angle + Math.PI / 2 + wobble;

      // small random hand-wobble off the path itself
      const cx = p.x + (Math.random() - 0.5) * 1.2;
      const cy = p.y + (Math.random() - 0.5) * 1.2;
      const dx = (Math.cos(a) * len) / 2;
      const dy = (Math.sin(a) * len) / 2;

      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', (cx - dx).toFixed(2));
      line.setAttribute('y1', (cy - dy).toFixed(2));
      line.setAttribute('x2', (cx + dx).toFixed(2));
      line.setAttribute('y2', (cy + dy).toFixed(2));
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', strokeW.toFixed(2));
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('opacity', (0.8 + Math.random() * 0.2).toFixed(2));
      svg.appendChild(line);

      t += spacing;
    }
  }

  function redraw() {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (!w || !h) return;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = '';
    drawRing(w, h, 3, 12, THREAD_OUTER, [1.3, 2.1], [5, 7.5]);
    drawRing(w, h, 8, 14, THREAD_INNER, [1.1, 1.7], [4, 6]);
  }

  redraw();

  let raf;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(redraw);
  });
  ro.observe(wrap);
})();

// ── Background music ──────────────────────────────────────
// Browsers block unmuted autoplay without a prior user gesture, so this
// tries immediately on load and, if blocked, starts on the very first
// interaction anywhere on the page instead. The mute button just toggles
// `.muted` independently of whether playback has actually started yet.
(function initMusic() {
  const audio = document.getElementById('bg-music');
  const muteBtn = document.getElementById('mute-btn');
  if (!audio || !muteBtn) return;

  audio.volume = 0.5;

  function updateButton() {
    const muted = audio.muted;
    muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    muteBtn.setAttribute('aria-label', muted ? 'Unmute background music' : 'Mute background music');
  }

  function tryPlay() {
    audio.play().catch(() => {
      const startOnGesture = () => audio.play().catch(() => {});
      document.addEventListener('pointerdown', startOnGesture, { once: true });
      document.addEventListener('keydown', startOnGesture, { once: true });
    });
  }

  tryPlay();
  updateButton();

  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    updateButton();
    if (audio.paused) tryPlay();
  });
})();

// ── Cart (stub — no live storefront yet) ──────────────────
(function initCart() {
  const btn = document.getElementById('cart-btn');
  const toast = document.getElementById('toast');
  if (!btn || !toast) return;

  let hideTimer;
  btn.addEventListener('click', () => {
    toast.textContent = 'Cart opens at launch — Sept 14, 2026.';
    toast.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  });
})();

// ── Notify form ───────────────────────────────────────────
(function initForm() {
  const form = document.getElementById('notify-form');
  if (!form) return;

  const status = document.getElementById('notify-status');
  const input = form.querySelector('input[type="email"]');
  const button = form.querySelector('button');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email) return;

    button.disabled = true;
    status.textContent = 'Submitting…';

    // TODO: replace with your actual signup endpoint
    await new Promise(resolve => setTimeout(resolve, 600));

    status.textContent = "You're on the list.";
    input.value = '';
    button.disabled = false;
  });
})();

// ── Footer year ───────────────────────────────────────────
(function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* Kalari Studios — main.js */

// ── Hand-stitched border ──────────────────────────────────
// A native `border: dashed` is mathematically perfect — identical dash
// length, identical gap, every time. That reads as printed, not sewn.
// Real hand stitching wanders: length varies, spacing varies, the
// needle angle wobbles slightly off-perpendicular. This draws two rings
// of individually-jittered stitch marks around the input, redrawn to
// match its live rendered size (a fixed-size SVG or border-image can't
// track a responsive width; a plain CSS border can't be irregular).
//
// On first paint only, it also plays an intro: the field starts as
// wrinkled fabric (a CSS-filter displacement, see .fabric-wrinkle), a
// needle travels the outline revealing stitches as it passes, and the
// wrinkle fades out on its own timer roughly matched to the needle's
// lap (the "simple" global-crossfade version, not a per-segment flatten
// tied exactly to needle position). Resize-triggered redraws afterward
// skip straight to the finished state — replaying the intro every time
// someone resizes the window would get old fast on a page people revisit.
(function initHandStitch() {
  const wrap = document.querySelector('.stitch-wrap');
  const input = wrap && wrap.querySelector('input');
  const svg = wrap && wrap.querySelector('.stitch-svg');
  const wrinkle = wrap && wrap.querySelector('.fabric-wrinkle');
  const needleSvg = wrap && wrap.querySelector('.needle-svg');
  if (!wrap || !input || !svg || !wrinkle || !needleSvg) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const THREAD_OUTER = '#5C2A1E';
  const THREAD_INNER = '#C8511E';
  const INTRO_MS = 1600;

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

  // Builds stitch geometry for one ring without touching the DOM, so the
  // intro can reveal each stitch's element individually as the needle
  // reaches its position (`fraction`, 0-1 along this ring's own perimeter).
  function buildStitches(w, h, inset, baseSpacing, widthRange, lenRange) {
    const total = perimeter(w, h, inset);
    const stitches = [];
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

      stitches.push({
        x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy,
        strokeW, opacity: 0.8 + Math.random() * 0.2,
        fraction: t / total,
      });
      t += spacing;
    }
    return stitches;
  }

  function makeStitchLine(s, color) {
    const line = document.createElementNS(SVG_NS, 'line');
    line.setAttribute('x1', s.x1.toFixed(2));
    line.setAttribute('y1', s.y1.toFixed(2));
    line.setAttribute('x2', s.x2.toFixed(2));
    line.setAttribute('y2', s.y2.toFixed(2));
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', s.strokeW.toFixed(2));
    line.setAttribute('stroke-linecap', 'round');
    return line;
  }

  function makeNeedle() {
    const g = document.createElementNS(SVG_NS, 'g');
    g.innerHTML =
      '<line x1="-1" y1="-11" x2="1" y2="10" stroke="#C7C7C7" stroke-width="1.6" stroke-linecap="round"/>' +
      '<line x1="-1.6" y1="-9" x2="-1" y2="7" stroke="#F2F2F2" stroke-width=".6" stroke-linecap="round"/>' +
      '<ellipse cx="0" cy="-9" rx="1" ry="1.6" fill="none" stroke="#9A9A9A" stroke-width=".6"/>';
    return g;
  }

  function redraw(playIntro) {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (!w || !h) return;

    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = '';
    needleSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    needleSvg.innerHTML = '';

    const outer = buildStitches(w, h, 3, 12, [1.3, 2.1], [5, 7.5]);
    const inner = buildStitches(w, h, 8, 14, [1.1, 1.7], [4, 6]);
    const outerEls = outer.map(s => makeStitchLine(s, THREAD_OUTER));
    const innerEls = inner.map(s => makeStitchLine(s, THREAD_INNER));
    outerEls.forEach(el => svg.appendChild(el));
    innerEls.forEach(el => svg.appendChild(el));

    if (!playIntro) {
      wrinkle.classList.add('is-flat');
      needleSvg.classList.add('is-done');
      return;
    }

    outerEls.forEach(el => { el.style.opacity = 0; });
    innerEls.forEach(el => { el.style.opacity = 0; });
    wrinkle.classList.remove('is-flat');
    needleSvg.classList.remove('is-done');

    const needle = makeNeedle();
    needleSvg.appendChild(needle);
    const outerPerimeter = perimeter(w, h, 3);
    const start = performance.now();

    // Kick off the wrinkle's own CSS transition now, concurrent with the
    // needle/stitch reveal below — that's the "simple" global crossfade.
    requestAnimationFrame(() => wrinkle.classList.add('is-flat'));

    function frame(now) {
      const raw = Math.min(1, (now - start) / INTRO_MS);
      const progress = 1 - Math.pow(1 - raw, 3); // ease-out cubic

      outer.forEach((s, i) => { if (s.fraction <= progress) outerEls[i].style.opacity = s.opacity; });
      inner.forEach((s, i) => { if (s.fraction <= progress) innerEls[i].style.opacity = s.opacity; });

      const p = pillPoint(progress * outerPerimeter, w, h, 3);
      needle.setAttribute('transform', `translate(${p.x.toFixed(2)},${p.y.toFixed(2)}) rotate(${(p.angle * 180 / Math.PI + 90).toFixed(1)})`);

      if (raw < 1) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => needleSvg.classList.add('is-done'), 250);
      }
    }
    requestAnimationFrame(frame);
  }

  let firstRun = true;
  let roCallCount = 0;
  let raf;

  function start() {
    redraw(firstRun);
    firstRun = false;
    const ro = new ResizeObserver(() => {
      roCallCount++;
      if (roCallCount === 1) return; // the observe() call below fires once immediately; skip it, already drawn
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => redraw(false));
    });
    ro.observe(wrap);
  }

  // Wait for the custom fonts to settle first — a layout shift mid-intro
  // (e.g. Eskool swapping in) would desync the needle from the input's
  // actual size.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    start();
  }
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
  let nudgeTimer;

  function updateButton() {
    const muted = audio.muted;
    muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    muteBtn.setAttribute('aria-label', muted ? 'Unmute background music' : 'Mute background music');
  }

  function stopNudge() {
    clearTimeout(nudgeTimer);
    muteBtn.classList.remove('is-nudging');
  }

  // Only worth inviting the gesture if autoplay actually got blocked —
  // give the initial play() a moment to resolve/reject before deciding.
  function scheduleNudge() {
    nudgeTimer = setTimeout(() => {
      if (audio.paused) muteBtn.classList.add('is-nudging');
    }, 1200);
  }

  function tryPlay(isInitial) {
    audio.play().then(stopNudge).catch(() => {
      if (isInitial) scheduleNudge();
      const startOnGesture = () => audio.play().then(stopNudge).catch(() => {});
      document.addEventListener('pointerdown', startOnGesture, { once: true });
      document.addEventListener('keydown', startOnGesture, { once: true });
    });
  }

  tryPlay(true);
  updateButton();

  muteBtn.addEventListener('click', () => {
    stopNudge(); // clicking the control at all means the nudge did its job
    audio.muted = !audio.muted;
    updateButton();
    if (audio.paused) tryPlay(false);
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

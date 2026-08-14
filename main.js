/* Kalari Studios — main.js */

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

/* Kalari Studio — main.js */

// ── Gallery: drag-to-scroll + wheel-to-horizontal (desktop only) ──
// Mobile stacks the images vertically via CSS alone, no JS needed there.
(function initGallery() {
  const track = document.querySelector('.gallery-track');
  if (!track) return;

  const MQ = window.matchMedia('(min-width: 750px)');
  const DRAG_THRESHOLD = 6; // px, before a pointerdown counts as a drag not a click

  let isDown = false;
  let moved = false;
  let startX = 0;
  let startScrollLeft = 0;

  track.addEventListener('pointerdown', e => {
    if (!MQ.matches || (e.pointerType === 'mouse' && e.button !== 0)) return;
    isDown = true;
    moved = false;
    startX = e.clientX;
    startScrollLeft = track.scrollLeft;
    track.classList.add('is-dragging');
  });

  track.addEventListener('pointermove', e => {
    if (!MQ.matches || !isDown) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > DRAG_THRESHOLD) moved = true;
    if (moved) {
      e.preventDefault();
      track.scrollLeft = startScrollLeft - dx;
    }
  });

  function endDrag() {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('is-dragging');
    track.dataset.drag = moved ? '1' : '0';
    setTimeout(() => { track.dataset.drag = '0'; }, 100);
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // Wheel/trackpad vertical motion becomes horizontal scroll on desktop.
  track.addEventListener('wheel', e => {
    if (!MQ.matches) return;
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 0) return;

    const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (!raw) return;

    const prev = track.scrollLeft;
    const atStart = prev <= 1;
    const atEnd = prev >= max - 1;
    if ((raw < 0 && atStart) || (raw > 0 && atEnd)) return; // let the page scroll at the edges

    e.preventDefault();
    track.scrollLeft = Math.max(0, Math.min(max, prev + raw * 0.35));
  }, { passive: false });
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

// ── Email signup forms (main "Notify me" + footer newsletter) ──────
// Both forms are stubs pointing at the same TODO — wire up a real
// endpoint (Klaviyo, Mailchimp, your own API, whatever) in one place
// once you have one, rather than two separate integrations.
function bindSignupForm(formId, statusId, successMessage) {
  const form = document.getElementById(formId);
  if (!form) return;

  const status = document.getElementById(statusId);
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

    status.textContent = successMessage;
    input.value = '';
    button.disabled = false;
  });
}
bindSignupForm('notify-form', 'notify-status', "You're in — check your inbox for your code.");

// ── Footer year ───────────────────────────────────────────
(function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

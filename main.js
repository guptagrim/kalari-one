/* Kalari Studios — main.js */

// ── Backdrop reveal ────────────────────────────────────────
(function initBackdrop() {
  const img = document.querySelector('.backdrop-img');
  if (!img) return;
  const reveal = () => requestAnimationFrame(() => img.classList.add('is-visible'));
  if (img.complete) reveal();
  else img.addEventListener('load', reveal, { once: true });
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

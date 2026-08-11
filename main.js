/* Kalari Studios — main.js */

// ── Backdrop reveal + eye blink ──────────────────────────────
(function initBackdrop() {
  const svg = document.querySelector('.backdrop-img');
  const eyes = document.querySelectorAll('.eye');
  if (!svg) return;

  // Random delay in [5.0, 10.0], to one decimal place.
  function randomBlinkDelay() {
    return Math.round((5 + Math.random() * 5) * 10) / 10;
  }

  function doBlink() {
    eyes.forEach(eye => {
      eye.classList.remove('blink');
      void eye.getBoundingClientRect(); // force reflow so the animation restarts
      eye.classList.add('blink');
    });
  }

  function blinkLoop() {
    if (!eyes.length) return;
    doBlink();
    eyes[0].addEventListener('animationend', () => {
      setTimeout(blinkLoop, randomBlinkDelay() * 1000);
    }, { once: true });
  }

  requestAnimationFrame(() => {
    svg.classList.add('is-visible');
    // First blink once the entrance animation settles, then loop on
    // a fresh random 5.0–10.0s delay chosen after each blink.
    svg.addEventListener('transitionend', blinkLoop, { once: true });
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

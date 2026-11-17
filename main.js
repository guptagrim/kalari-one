/* Kalari Studio — main.js */

// ── Waitlist signup form ──────────────────────────────────
// Stub — wire up a real endpoint (Klaviyo, Mailchimp, your own API)
// at the TODO below once you have one.
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
bindSignupForm('notify-form', 'notify-status', "You're on the waitlist — we'll be in touch.");

// ── Rotating phrases ("Made for …" / "Inspired by …") ─────
// Each .rotator cycles its data-phrases every data-interval ms, starting
// data-offset ms late. With 2800 / 4200 (a 2:3 rhythm) and a 700 ms
// offset, the two lines never swap at the exact same instant, though
// their animations may overlap now and then. Each phrase gets the next
// colour from PHRASE_COLORS (data-color-start picks where a line begins);
// the prefix keeps the body colour.
const PHRASE_COLORS = [
  '#B4461A', // terracotta
  '#3F7350', // aloe green
  '#3B4FA0', // indigo
  '#A3336A', // magenta
  '#8A6200', // turmeric
]; // all ≥ 5:1 contrast on the cream background

(function initRotators() {
  const OUT_MS = 300; // ch-out duration + ripple, see style.css
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Split a phrase into word spans (so lines wrap between words) holding
  // one span per letter, each with its index for the staggered animation.
  function renderPhrase(el, text) {
    el.textContent = '';
    let i = 0;
    text.split(' ').forEach((word, w) => {
      if (w) el.append(' ');
      const wordEl = document.createElement('span');
      wordEl.className = 'w';
      for (const char of word) {
        const ch = document.createElement('span');
        ch.className = 'ch';
        ch.textContent = char;
        ch.style.setProperty('--i', i++);
        wordEl.append(ch);
      }
      el.append(wordEl);
    });
    // Keep the whole ripple around 400 ms, however long the phrase is.
    el.style.setProperty('--step', Math.min(18, 400 / Math.max(i, 1)) + 'ms');
  }

  document.querySelectorAll('.rotator').forEach(rotator => {
    const line = rotator.querySelector('.rotator-line');
    const phraseEl = rotator.querySelector('.rotator-phrase');
    let phrases;
    try { phrases = JSON.parse(rotator.dataset.phrases); } catch { return; }
    if (!line || !phraseEl || !phrases || phrases.length < 2) return;

    const interval = Number(rotator.dataset.interval) || 3000;
    const offset = Number(rotator.dataset.offset) || 0;
    const colorStart = Number(rotator.dataset.colorStart) || 0;
    const prefix = line.firstChild.textContent; // e.g. "Made for "

    // Invisible copies of every version reserve the tallest height.
    phrases.forEach(p => {
      const ghost = document.createElement('span');
      ghost.className = 'rotator-ghost';
      ghost.setAttribute('aria-hidden', 'true');
      ghost.textContent = prefix + p;
      rotator.append(ghost);
    });

    let index = 0;
    let colorIndex = colorStart % PHRASE_COLORS.length;
    // Step to the next colour, skipping any another line is showing right
    // now, so the two lines never wear the same colour at once.
    const nextColor = () => {
      const inUse = new Set(
        [...document.querySelectorAll('.rotator-phrase')]
          .filter(el => el !== phraseEl)
          .map(el => el.dataset.color)
      );
      do {
        colorIndex = (colorIndex + 1) % PHRASE_COLORS.length;
      } while (inUse.has(PHRASE_COLORS[colorIndex]) && inUse.size < PHRASE_COLORS.length);
      return PHRASE_COLORS[colorIndex];
    };
    const setColor = c => { phraseEl.style.color = c; phraseEl.dataset.color = c; };
    renderPhrase(phraseEl, phrases[0]);
    setColor(PHRASE_COLORS[colorIndex]);

    function next() {
      if (document.hidden) return; // don't churn in a background tab
      index = (index + 1) % phrases.length;
      const swap = () => {
        renderPhrase(phraseEl, phrases[index]);
        setColor(nextColor());
        phraseEl.classList.remove('is-out');
        phraseEl.classList.remove('is-in');
        void phraseEl.offsetWidth; // restart the in-animation
        phraseEl.classList.add('is-in');
      };
      if (reduceMotion.matches) { swap(); return; }
      phraseEl.classList.remove('is-in');
      phraseEl.classList.add('is-out');
      setTimeout(swap, OUT_MS);
    }

    setTimeout(() => {
      next();
      setInterval(next, interval);
    }, interval + offset);
  });
})();

// ── Footer year ───────────────────────────────────────────
(function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

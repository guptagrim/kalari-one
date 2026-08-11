/* Kalari Studio — main.js */

// ── Backdrop reveal ────────────────────────────────────────
(function initBackdrop() {
  const img = document.querySelector('.backdrop-img');
  if (!img) return;
  const reveal = () => requestAnimationFrame(() => img.classList.add('is-visible'));
  if (img.complete) reveal();
  else img.addEventListener('load', reveal, { once: true });
})();

// ── Preloader ──────────────────────────────────────────────
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 700);
  }, 1200);
});

// ── Cursor blob ────────────────────────────────────────────
(function initBlob() {
  // Blob floats on its own — no cursor tracking
})();

// ── RSVP form ─────────────────────────────────────────────
(function initForm() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value.trim();
    if (!email) return;

    const btn = form.querySelector('button');
    const label = btn.querySelector('.inner-primary');
    const original = label.textContent;
    label.textContent = '...';
    btn.disabled = true;

    // Replace with your actual endpoint
    await new Promise(r => setTimeout(r, 800));
    label.textContent = 'Done!';
    form.querySelector('input[type="email"]').value = '';
    setTimeout(() => { label.textContent = original; btn.disabled = false; }, 3000);
  });

  // Float label behaviour
  const input = form.querySelector('input[type="email"]');
  const labelTitle = form.querySelector('.field-label-title');
  if (input && labelTitle) {
    input.addEventListener('focus', () => { labelTitle.style.opacity = '0'; });
    input.addEventListener('blur',  () => {
      if (!input.value) labelTitle.style.opacity = '1';
    });
  }
})();

// ── Shop tiles ────────────────────────────────────────────
(function initShop() {
  // Shop data — swap out titles, prices, and image paths
  const items = [
    {
      id: 'item-1',
      title: 'Harem Pants',
      price: null,
      img: 'public/img/shop/item1.png',
      variants: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      id: 'item-2',
      title: 'Scarf',
      price: null,
      img: 'public/img/shop/item2.png',
      variants: ['Item'],
    },
    {
      id: 'item-3',
      title: 'त-Shirt',
      price: null,
      img: 'public/img/shop/item3.png',
      variants: ['XS', 'S', 'M', 'L', 'XL'],
    },
  ];

  window.__KALARI_SHOP__ = { items };

  // Tile click → modal (stub — wire to your Shopify/store)
  document.querySelectorAll('[data-shop-item]').forEach(tile => {
    tile.addEventListener('click', e => {
      const id = tile.dataset.shopItem;
      const item = items.find(i => i.id === id);
      if (!item) return;
      if (item.external) { window.open(item.external, '_blank'); return; }
      // TODO: open product modal
      console.log('Open product:', item);
    });
  });
})();

// ── Lazy image loading ────────────────────────────────────
(function initLazy() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const src = img.dataset.src;
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
      img.closest('.tile-image')?.classList.add('loaded');
      o.unobserve(img);
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(img => obs.observe(img));
})();

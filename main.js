/* Kalari Studio — main.js */

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
  const blob = document.querySelector('.blob');
  if (!blob) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx, cy = my;
  let raf;

  function update() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    blob.style.setProperty('--bx', Math.round(cx));
    blob.style.setProperty('--by', Math.round(cy));
    raf = requestAnimationFrame(update);
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (!blob.classList.contains('blob-active')) {
      blob.classList.add('blob-active');
    }
  });

  document.addEventListener('mouseleave', () => {
    blob.classList.remove('blob-active');
  });

  update();
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
      title: 'Kalari Long Sleeve',
      price: 65,
      img: 'public/img/shop/item1.png',
      variants: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 'item-2',
      title: 'Kalari Tee',
      price: 45,
      img: 'public/img/shop/item2.png',
      variants: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 'item-3',
      title: 'Studio Hoodie',
      price: 85,
      img: 'public/img/shop/item3.png',
      variants: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 'item-4',
      title: 'Art Print',
      price: 40,
      img: 'public/img/shop/item4.png',
      variants: ['Item'],
    },
    {
      id: 'item-5',
      title: 'Kalari Zine',
      price: 20,
      img: 'public/img/shop/item5.png',
      external: '#',
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

/* ============================================================
   Letícia Peixoto · Mantist Design System
   script.js
   ============================================================ */

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(
        entry.target.closest('[class]')?.querySelectorAll('.reveal') || [entry.target]
      );
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(idx * 0.08, 0.4)}s`;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObs.observe(el));

// ── TESTIMONIALS CAROUSEL ──
(function () {
  const track = document.getElementById('testi-track');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testi-card'));
  const dotsWrap = document.getElementById('testi-dots');
  let current = 0;
  let autoTimer;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function getCardW() {
    const card = cards[0];
    const gap = 20;
    return card.offsetWidth + gap;
  }

  function goTo(idx) {
    current = idx;
    track.style.transform = `translateX(-${current * getCardW()}px)`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() {
    goTo((current + 1) % cards.length);
  }

  // Auto-advance
  function startAuto() {
    autoTimer = setInterval(next, 4500);
  }
  function stopAuto() {
    clearInterval(autoTimer);
  }

  startAuto();
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Touch/drag
  let startX = 0, dragging = false;
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    dragging = true;
    stopAuto();
  }, { passive: true });
  track.addEventListener('touchend', e => {
    if (!dragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0
        ? goTo(Math.min(current + 1, cards.length - 1))
        : goTo(Math.max(current - 1, 0));
    }
    dragging = false;
    startAuto();
  }, { passive: true });

  window.addEventListener('resize', () => goTo(current));
})();

// ── GALLERY LIGHTBOX ──
(function () {
  const lb     = document.getElementById('lightbox');
  const lbImg  = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  const items = Array.from(document.querySelectorAll('.gallery-item'));
  let current = 0;

  function open(idx) {
    current = (idx + items.length) % items.length;
    const img = items[current].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
  });

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lbPrev.addEventListener('click', e => { e.stopPropagation(); open(current - 1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); open(current + 1); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   open(current - 1);
    if (e.key === 'ArrowRight')  open(current + 1);
  });
})();

// ── SUBTLE PARALLAX (desktop) ──
if (window.innerWidth > 1024) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.querySelectorAll('.mesh-blob').forEach((b, i) => {
      const speed = 0.04 + i * 0.02;
      b.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });
}

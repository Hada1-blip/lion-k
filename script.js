/* ═══════════════════════════════════════════
   LION KEY — JS PRINCIPAL
   ═══════════════════════════════════════════ */
'use strict';

/* ── COOKIE BANNER ── */
(function () {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  if (!localStorage.getItem('lk_cookies')) {
    setTimeout(() => banner.classList.add('show'), 1200);
  }
})();
function acceptCookies() {
  localStorage.setItem('lk_cookies', 'accepted');
  document.getElementById('cookieBanner').classList.remove('show');
}
function refuseCookies() {
  localStorage.setItem('lk_cookies', 'refused');
  document.getElementById('cookieBanner').classList.remove('show');
}

/* ── HEADER SCROLL ── */
(function () {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── HAMBURGER ── */
(function () {
  const burger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('mobileClose');
  if (!burger || !overlay) return;
  burger.addEventListener('click', () => {
    const open = overlay.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  if (closeBtn) closeBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    overlay.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();

/* ── REVEAL ON SCROLL ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

/* ── COUNTER ANIMATION ── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      const run = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const value = target % 1 === 0 ? Math.round(ease * target) : (ease * target).toFixed(1);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => io.observe(el));
})();

/* ── CAROUSEL (différenciateurs) ── */
(function () {
  const track = document.getElementById('diffTrack');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.diff-card'));
  const dotsWrap = document.getElementById('diffDots');
  const total = cards.length;
  let current = 0;
  let autoTimer = null;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'diff-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  });

  function getOffset() {
    const outer = track.parentElement;
    const outerW = outer.offsetWidth;
    const cardW = cards[0].offsetWidth + 28; // gap
    const centerCard = outerW / 2 - cards[current].offsetWidth / 2;
    return -(current * cardW) + centerCard;
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    track.style.transform = `translateX(${getOffset()}px)`;
    cards.forEach((c, i) => c.classList.toggle('active', i === current));
    dotsWrap.querySelectorAll('.diff-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 3600); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  const prevBtn = document.getElementById('diffPrev');
  const nextBtn = document.getElementById('diffNext');
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // Touch
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; clearInterval(autoTimer); }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); }
    resetAuto();
  });

  goTo(0);
  startAuto();
  window.addEventListener('resize', () => goTo(current));
})();

/* ── CONTACT FORM ── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';
    setTimeout(() => {
      form.style.display = 'none';
      const ok = document.getElementById('formSuccess');
      if (ok) ok.style.display = 'block';
    }, 1400);
  });
})();

/* ── ACTIVE NAV ── */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
})();

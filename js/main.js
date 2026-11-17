(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  const list = document.getElementById('navList');
  const links = document.querySelectorAll('.nav-link');
  const themeBtn = document.getElementById('themeToggle');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Theme toggle (independent of navigation, remembered in localStorage) */
  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    const dark = theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  };
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (err) { /* storage unavailable */ }
  });

  /* Mobile menu */
  const setMenu = (open) => {
    list.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!list.classList.contains('open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => {
    if (list.classList.contains('open') && !header.contains(e.target)) setMenu(false);
  });

  /* Smooth in-page navigation (no reload, no redirect) */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (window.history && history.replaceState) history.replaceState(null, '', '#' + id);
    });
  });

  /* Active nav link based on the section in view */
  const sections = document.querySelectorAll('main section[id], footer[id]');
  const setActive = (id) => {
    links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  };
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* Header shadow once the page scrolls */
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Scroll-triggered reveal */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* Hero stat count-up */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) return;
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  /* Show more toggles */
  document.querySelectorAll('.toggle-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const open = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Show less' : 'Show more';
    });
  });

  /* Family flip cards (tap / keyboard friendly) */
  document.querySelectorAll('.flip').forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); }
    });
  });

  /* Hobby lightbox */
  const box = document.getElementById('lightbox');
  const title = document.getElementById('lightboxTitle');
  const text = document.getElementById('lightboxText');
  const closeBtn = document.getElementById('lightboxClose');
  let opener = null;
  const closeBox = () => {
    box.classList.remove('open');
    if (opener) opener.focus();
  };
  document.querySelectorAll('.hobby').forEach((card) => {
    card.addEventListener('click', () => {
      opener = card;
      title.textContent = card.dataset.title;
      text.textContent = card.dataset.text;
      box.classList.add('open');
      closeBtn.focus();
    });
  });
  closeBtn.addEventListener('click', closeBox);
  box.addEventListener('click', (e) => { if (e.target === box) closeBox(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && box.classList.contains('open')) closeBox();
  });

  /* Footer */
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('toTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();

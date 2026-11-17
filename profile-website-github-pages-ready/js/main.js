(() => {
  'use strict';

  const toggle = document.getElementById('navToggle');
  const list = document.getElementById('navList');
  const links = document.querySelectorAll('.nav-link');

  /* Mobile menu */
  const setMenu = (open) => {
    list.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setMenu(!list.classList.contains('open')));
  links.forEach((link) => link.addEventListener('click', () => setMenu(false)));

  /* Active nav link based on the section in view */
  const sections = document.querySelectorAll('main section[id]');
  const setActive = (id) => {
    links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
  };
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

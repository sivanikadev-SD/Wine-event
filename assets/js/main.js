/* ===================== MAIN.JS — Public Site ===================== */
'use strict';

// ---- THEME TOGGLE ----
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const saved = localStorage.getItem('wineTheme');
if (saved === 'light') html.classList.add('light-mode');

function toggleTheme() {
  html.classList.toggle('light-mode');
  localStorage.setItem('wineTheme', html.classList.contains('light-mode') ? 'light' : 'dark');
}
if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

// ---- RTL / LTR TOGGLE ----
const dirBtn = document.getElementById('dir-toggle');
const savedDir = localStorage.getItem('wineDir');
if (savedDir === 'rtl') html.setAttribute('dir', 'rtl');

function toggleDir() {
  const isRtl = html.getAttribute('dir') === 'rtl';
  html.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
  localStorage.setItem('wineDir', isRtl ? 'ltr' : 'rtl');
}
if (dirBtn) dirBtn.addEventListener('click', toggleDir);

// ---- NAVBAR SCROLL ----
const navbar = document.querySelector('.navbar');
function onScroll() {
  if (window.scrollY > 60) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', onScroll, { passive: true });

// ---- MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
}

// ---- ACTIVE NAV LINK ----
(function setActiveLink() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href')?.split('/').pop();
    if (href === path) a.classList.add('active');
  });
})();

// ---- HERO CAROUSEL ----
(function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const cards = Array.from(track.children);
  let current = 0;
  let cols = getColCount();
  let total = Math.ceil(cards.length / cols);
  let autoTimer;

  function getColCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }

  function goTo(idx) {
    current = (idx + total) % total;
    const offset = current * (100 / cols) * cols;
    track.style.transform = `translateX(-${current * (100 / cols)}%)`;
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  document.getElementById('carousel-prev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.getElementById('carousel-next')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  window.addEventListener('resize', () => {
    cols = getColCount();
    total = Math.ceil(cards.length / cols);
    goTo(0);
  });

  startAuto();
})();

// ---- SCROLL REVEAL ----
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
})();

// ---- NEWSLETTER FORM ----
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const msg = form.querySelector('.form-msg');
    if (!input?.value.trim()) return;
    if (msg) {
      msg.textContent = '🥂 Thank you! You\'re on the list.';
      msg.style.color = '#C9A84C';
    }
    form.reset();
  });
});

// ---- CONTACT FORM ----
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('contact-msg');
    if (msg) {
      msg.textContent = '✅ Your message has been sent! We\'ll be in touch soon.';
      msg.style.color = '#22c55e';
    }
    contactForm.reset();
  });
}

// ---- LOGIN / REGISTER TABS ----
(function initAuthTabs() {
  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-panel');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
})();

// ---- GALLERY LIGHTBOX ----
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
})();

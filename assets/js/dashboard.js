/* ===================== DASHBOARD.JS ===================== */
'use strict';

// ---- THEME ----
const html = document.documentElement;
const saved = localStorage.getItem('wineTheme');
if (saved === 'light') html.classList.add('light-mode');

const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        html.classList.toggle('light-mode');
        localStorage.setItem('wineTheme', html.classList.contains('light-mode') ? 'light' : 'dark');
    });
}

// ---- RTL / LTR TOGGLE ----
const dirBtn = document.getElementById('dir-toggle');
const savedDir = localStorage.getItem('wineDir');
if (savedDir === 'rtl') html.setAttribute('dir', 'rtl');
if (dirBtn) {
    dirBtn.addEventListener('click', () => {
        const isRtl = html.getAttribute('dir') === 'rtl';
        html.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
        localStorage.setItem('wineDir', isRtl ? 'ltr' : 'rtl');
    });
}

// ---- SIDEBAR TOGGLE ----
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');

function openSidebar() {
    sidebar?.classList.add('open');
    sidebarOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    sidebar?.classList.remove('open');
    sidebarOverlay?.classList.remove('open');
    document.body.style.overflow = '';
}

sidebarToggle?.addEventListener('click', openSidebar);
sidebarOverlay?.addEventListener('click', closeSidebar);

// ---- ACTIVE LINK ----
(function setActiveLink() {
    const path = location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
        const href = a.getAttribute('href')?.split('/').pop();
        if (href === path) a.classList.add('active');
    });
})();

// ---- COUNTER ANIMATION ----
function animateCounters() {
    document.querySelectorAll('.stat-widget-value[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1200;
        const start = performance.now();
        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(ease * target);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// Trigger on page load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateCounters, 400);
});

// ---- SCROLL REVEAL ----
(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
        });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
})();

// ---- LOGOUT CONFIRMATION ----
(function initLogout() {
    const logoutLink = document.querySelector('.sidebar-footer a');
    if (!logoutLink) return;
    logoutLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = this.getAttribute('href');
        }
    });
})();

// ---- SIDEBAR LOGO CLICK (navigate home) ----
(function initSidebarLogo() {
    const header = document.querySelector('.sidebar-header:not(a)');
    if (!header) return;
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
})();

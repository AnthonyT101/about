// ================================
// Dark Mode (apply before paint)
// ================================
const html = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Respect saved preference, then system preference
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (saved === 'dark' || (!saved && prefersDark)) {
  html.setAttribute('data-theme', 'dark');
}

themeToggle?.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  applyTheme(isDark ? 'light' : 'dark');
});

// ================================
// Mobile Hamburger
// ================================
const hamburger = document.querySelector('.hamburger');
const linksMenu = document.querySelector('.links');

hamburger?.addEventListener('click', () => {
  const isOpen = linksMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close menu on nav link click
linksMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    linksMenu.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (
    linksMenu?.classList.contains('open') &&
    !linksMenu.contains(e.target) &&
    !hamburger?.contains(e.target)
  ) {
    linksMenu.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  }
});

// ================================
// Scroll Fade-in
// ================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

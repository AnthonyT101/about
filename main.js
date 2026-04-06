// ================================
// Theme — dark is default (no attribute)
//         light = data-theme="light"
// ================================
const html = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');

// Restore saved light-mode preference
if (localStorage.getItem('theme') === 'light') {
  html.setAttribute('data-theme', 'light');
}

themeToggle?.addEventListener('click', () => {
  const isLight = html.getAttribute('data-theme') === 'light';
  if (isLight) {
    html.removeAttribute('data-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
});

// ================================
// Mobile hamburger
// ================================
const hamburger = document.querySelector('.hamburger');
const linksMenu = document.querySelector('.links');

hamburger?.addEventListener('click', () => {
  const open = linksMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
});

linksMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    linksMenu.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', e => {
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
// Scroll fade-in
// ================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

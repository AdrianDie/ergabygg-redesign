/* Mark JS as available so CSS can enable the reveal animation.
   If JS fails to run, .reveal elements stay fully visible (opacity 1). */
document.documentElement.classList.add('js');

const burgerBtn = document.getElementById('burgerBtn');
const menuCloseBtn = document.getElementById('menuCloseBtn');
const mobileMenu = document.getElementById('mobileMenu');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileMenu.style.right = '0';
  burgerBtn.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.style.right = '';
  burgerBtn.setAttribute('aria-expanded', 'false');
}

burgerBtn.addEventListener('click', openMenu);
menuCloseBtn.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

/* Scroll reveals via native IntersectionObserver (no external dependency).
   Reduced-motion users and unsupported browsers get instant visibility. */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');

function revealAll() { reveals.forEach(el => el.classList.add('in')); }

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealAll();
} else {
  let ioRan = false;
  const io = new IntersectionObserver((entries, obs) => {
    ioRan = true;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach(el => io.observe(el));

  /* Safety net: if the observer never runs (broken/stubbed environment),
     reveal everything so content can never stay hidden. */
  setTimeout(() => { if (!ioRan) revealAll(); }, 800);
}

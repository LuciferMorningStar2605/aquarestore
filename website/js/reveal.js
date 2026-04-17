/* =========================================================
   AquaRestore — Reveal on Scroll
   IntersectionObserver-based entrance animations
   ========================================================= */

(function () {
  'use strict';

  const ELEMENTS = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!ELEMENTS.length) return;

  let observed = 0;
  const total = ELEMENTS.length;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
          observed++;

          // Disconnect when all elements revealed
          if (observed >= total) {
            observer.disconnect();
          }
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  ELEMENTS.forEach((el) => observer.observe(el));
})();

/* ── Nav scroll class ── */
(function () {
  'use strict';

  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  function check() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', check, { passive: true });
  check();
})();

/* =========================================================
   AquaRestore — Submarine Scroll Scene
   Scroll-driven animation across a 400vh sticky container
   ========================================================= */

(function () {
  'use strict';

  const container = document.getElementById('submarine-scroll');
  if (!container) return;

  const scene       = container.querySelector('.submarine-scene');
  const sub         = document.getElementById('submarine-svg');
  const beam        = document.getElementById('sub-beam');
  const waterOverlay= scene.querySelector('.scene-water-overlay');
  const textEls     = scene.querySelectorAll('.scene-text');
  const resultEl    = scene.querySelector('.scene-result');

  // Sub is ~780px wide. Center it: left = (100vw - 780px) / 2.
  // On any viewport, 50vw - 390px = center. We'll compute in JS.
  function getCenterX() {
    const subW = sub.offsetWidth || 780;
    const vw   = window.innerWidth;
    // Return % of vw so the sub center is at 50% of viewport
    return ((vw / 2 - subW / 2) / vw) * 100;
  }

  function ease(t) {
    // smooth cubic ease-in-out
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function onScroll() {
    const rect       = container.getBoundingClientRect();
    const containerH = container.offsetHeight;
    const viewH      = window.innerHeight;
    const scrollable = containerH - viewH;

    let progress = -rect.top / scrollable;
    progress = Math.max(0, Math.min(1, progress));

    const centerX = getCenterX();

    // ── Phase 1 (0–30%): Enter from right ──
    if (progress < 0.30) {
      const p  = ease(progress / 0.30);
      const subX = 105 - p * (105 - centerX); // off-right → center
      sub.style.transform   = `translateX(${subX}vw) translateY(-50%)`;
      sub.style.opacity     = Math.min(1, p * 2.5);
      beam.style.opacity    = 0;
      waterOverlay.style.opacity = 0.65;
      textEls.forEach(t => t.style.opacity = 0);
      if (resultEl) resultEl.style.opacity = 0;
    }

    // ── Phase 2 (30–55%): Sub centred, beam on, text 1 ──
    else if (progress < 0.55) {
      const p = ease((progress - 0.30) / 0.25);
      sub.style.transform   = `translateX(${centerX}vw) translateY(-50%)`;
      sub.style.opacity     = 1;
      beam.style.opacity    = 0.12 + p * 0.28;
      waterOverlay.style.opacity = 0.65;
      textEls[0].style.opacity = p;
      if (textEls[1]) textEls[1].style.opacity = 0;
      if (resultEl) resultEl.style.opacity = 0;
    }

    // ── Phase 3 (55–75%): Water clears, swap text ──
    else if (progress < 0.75) {
      const p = ease((progress - 0.55) / 0.20);
      sub.style.transform   = `translateX(${centerX}vw) translateY(-50%)`;
      sub.style.opacity     = 1;
      beam.style.opacity    = 0.40 + p * 0.30;
      waterOverlay.style.opacity = 0.65 - p * 0.65; // fully clear
      textEls[0].style.opacity   = Math.max(0, 1 - p * 4);
      if (textEls[1]) textEls[1].style.opacity = Math.max(0, (p - 0.35) / 0.65);
      if (resultEl) resultEl.style.opacity = 0;
    }

    // ── Phase 4 (75–100%): Exit left, result card ──
    else {
      const p    = ease((progress - 0.75) / 0.25);
      const subX = centerX - p * (centerX + 110); // center → off-left
      sub.style.transform   = `translateX(${subX}vw) translateY(-50%)`;
      sub.style.opacity     = Math.max(0, 1 - p * 2);
      beam.style.opacity    = Math.max(0, 0.7 - p * 2);
      waterOverlay.style.opacity = 0;
      if (textEls[1]) textEls[1].style.opacity = Math.max(0, 1 - p * 3);
      if (resultEl)   resultEl.style.opacity   = Math.min(1, p * 2);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

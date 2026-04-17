/* =========================================================
   AquaRestore — Particle Field
   Canvas particle system that forms a scuba diver on scroll
   ========================================================= */

(function () {
  'use strict';

  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let particles = [];
  let scrollProgress = 0;
  let animFrameId;

  // ── Scuba diver target coordinates (normalized 0–1, ~80 points) ──
  // Designed as a side-view diver silhouette within a 0.3 × 0.5 bounding box centered on canvas
  const DIVER_RAW = [
    // Head (helmet)
    [0.48,0.18],[0.50,0.16],[0.52,0.15],[0.54,0.16],[0.56,0.18],[0.55,0.21],[0.52,0.22],[0.49,0.22],[0.47,0.20],
    // Mask
    [0.57,0.17],[0.59,0.18],[0.60,0.19],
    // Snorkel / regulator
    [0.46,0.15],[0.45,0.13],[0.44,0.12],[0.44,0.14],
    // Neck
    [0.51,0.24],[0.53,0.24],
    // Tank (on back)
    [0.46,0.26],[0.45,0.28],[0.44,0.31],[0.44,0.34],[0.44,0.37],[0.45,0.39],[0.46,0.40],
    [0.47,0.27],[0.47,0.30],[0.47,0.33],[0.47,0.36],
    // Torso
    [0.50,0.26],[0.52,0.27],[0.54,0.28],[0.55,0.30],[0.55,0.33],[0.54,0.36],[0.53,0.38],[0.52,0.40],
    [0.50,0.29],[0.51,0.32],[0.51,0.35],[0.50,0.38],
    // Left arm (reaching forward)
    [0.56,0.28],[0.58,0.27],[0.60,0.26],[0.62,0.26],[0.64,0.27],[0.65,0.28],
    // Right arm (back)
    [0.48,0.28],[0.46,0.30],
    // BCD / Vest
    [0.49,0.27],[0.48,0.32],[0.49,0.36],
    // Hips
    [0.51,0.41],[0.53,0.42],[0.50,0.42],
    // Left leg (extended back, with fin)
    [0.54,0.44],[0.56,0.46],[0.58,0.49],[0.60,0.52],[0.62,0.54],[0.64,0.55],[0.66,0.56],[0.68,0.57],[0.70,0.58],
    // Right leg (slightly bent, with fin)
    [0.50,0.44],[0.49,0.47],[0.48,0.50],[0.47,0.53],[0.46,0.56],[0.44,0.58],[0.42,0.60],[0.40,0.61],[0.38,0.62],
    // Fin tips (left)
    [0.71,0.57],[0.73,0.58],[0.72,0.60],
    // Fin tips (right)
    [0.37,0.63],[0.36,0.62],[0.35,0.64],
    // Bubbles rising from regulator
    [0.58,0.13],[0.60,0.10],[0.61,0.07],[0.59,0.05],
  ];

  const PARTICLE_COUNT = 220;

  const COLORS = [
    'rgba(8, 145, 178, 0.7)',   // teal
    'rgba(8, 145, 178, 0.4)',
    'rgba(26, 58, 92, 0.5)',    // navy
    'rgba(26, 58, 92, 0.3)',
    'rgba(10, 22, 40, 0.35)',   // deep
    'rgba(143, 163, 177, 0.3)', // muted
  ];

  function resize() {
    W = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    H = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
  }

  function init() {
    resize();

    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const diverPt = DIVER_RAW[i % DIVER_RAW.length];
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        targetX: diverPt[0] * W,
        targetY: diverPt[1] * H,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        radius: Math.random() * 1.8 + 1.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Ease-in-out cubic
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // scrollProgress: 0 = random, 1 = formed diver shape
    const progress = easeInOutCubic(Math.min(scrollProgress / 0.3, 1));

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Free-floating movement
      if (progress < 1) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      // Lerp toward target
      const drawX = lerp(p.x, p.targetX, progress);
      const drawY = lerp(p.y, p.targetY, progress);

      // Draw dot
      ctx.beginPath();
      ctx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Draw connections when forming (progress > 0.3)
      if (progress > 0.3) {
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const qx = lerp(q.x, q.targetX, progress);
          const qy = lerp(q.y, q.targetY, progress);
          const dx = drawX - qx;
          const dy = drawY - qy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 60 + (1 - progress) * 60;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(qx, qy);
            ctx.strokeStyle = `rgba(8, 145, 178, ${0.12 * (1 - dist / maxDist) * progress})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    animFrameId = requestAnimationFrame(draw);
  }

  function onScroll() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const heroH = hero.offsetHeight;
    // 0 at top, 1 when hero is fully scrolled past
    scrollProgress = Math.max(0, Math.min(1, -rect.top / heroH));
  }

  // Visibility API — pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrameId);
    } else {
      draw();
    }
  });

  window.addEventListener('resize', () => {
    canvas.width = 0;
    canvas.height = 0;
    init();
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  init();
  draw();
})();

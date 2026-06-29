/* =========================================================
   Neurova Labs — interactions
   - Nav background on scroll
   - Scroll-reveal for sections
   - "Thought capture" particle field in the hero
   All effects respect prefers-reduced-motion.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Nav: solid background once scrolled ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero particle field ---------- */
  var canvas = document.getElementById('field');
  if (!canvas || reduceMotion) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var dpr = 1;
  var w = 0, h = 0;
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var rafId = null;
  var canvasRect = null;

  function size() {
    var rect = canvas.getBoundingClientRect();
    canvasRect = rect;
    dpr = Math.min(window.devicePixelRatio || 1, 2); // re-read so zoom / display changes stay crisp
    w = rect.width;
    h = rect.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    // density scales with area, capped for performance
    var count = Math.min(110, Math.floor((w * h) / 14000));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.5 + 0.2
      });
    }
  }

  var LINK_DIST = 130;
  var LINK_DIST2 = LINK_DIST * LINK_DIST;

  function frame() {
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // gentle drift
      p.x += p.vx;
      p.y += p.vy;

      // soft pull toward the cursor — ideas gathering
      var dxm = mouse.x - p.x;
      var dym = mouse.y - p.y;
      var dm = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < 160 && dm > 0) {
        var pull = (160 - dm) / 160 * 0.04;
        p.x += (dxm / dm) * pull;
        p.y += (dym / dm) * pull;
      }

      // wrap around the edges
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + p.a + ')';
      ctx.fill();
    }

    // connecting threads
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var pa = particles[a], pb = particles[b];
        var dx = pa.x - pb.x, dy = pa.y - pb.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST2) {
          var dist = Math.sqrt(d2); // only pay for sqrt on pairs that actually connect
          var alpha = (1 - dist / LINK_DIST) * 0.14;
          ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }
    }

    rafId = requestAnimationFrame(frame);
  }

  function start() { if (rafId == null) frame(); }
  function stop() { if (rafId != null) { cancelAnimationFrame(rafId); rafId = null; } }

  // Only run the loop when the hero is on-screen AND the tab is visible.
  // Track both reasons separately so returning to the tab doesn't restart
  // the loop while the hero is still scrolled out of view.
  var heroVisible = true, pageVisible = !document.hidden;
  function resume() { (heroVisible && pageVisible) ? start() : stop(); }

  if ('IntersectionObserver' in window) {
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { heroVisible = e.isIntersecting; });
      resume();
    }, { threshold: 0 });
    heroObserver.observe(canvas);
  }
  document.addEventListener('visibilitychange', function () {
    pageVisible = !document.hidden;
    resume();
  });

  window.addEventListener('pointermove', function (e) {
    if (!canvasRect) return;
    mouse.x = e.clientX - canvasRect.left;
    mouse.y = e.clientY - canvasRect.top;
  }, { passive: true });
  window.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });

  // the hero scrolls with the page, so refresh the cached rect on scroll
  window.addEventListener('scroll', function () { canvasRect = canvas.getBoundingClientRect(); }, { passive: true });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(size, 150);
  });

  size();
  start();
})();

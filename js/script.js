/* =========================================
   Emmanuella Olamiposi Afolabi — Personal Brand
   Interactions: mobile nav + scroll reveal + sparkle canvas
   ========================================= */

(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Mobile nav toggle ---------- */
  var hamburger = document.getElementById('hamburger');
  var menu = document.getElementById('nav-menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a nav link is clicked
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Scroll reveal (animate-fade) ---------- */
  var revealEls = document.querySelectorAll('.animate-fade, .reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---------- Sparkle canvas ---------- */
  var canvas = document.getElementById('sparkle-canvas');

  // Respect reduced motion preference
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext('2d');
    var sparkles = [];
    var sparkleCount = 40;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createSparkle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.6 + 0.2,
        speedY: Math.random() * 0.3 + 0.05,
        speedX: (Math.random() - 0.5) * 0.15,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2
      };
    }

    function initSparkles() {
      sparkles = [];
      for (var i = 0; i < sparkleCount; i++) {
        sparkles.push(createSparkle());
      }
    }

    function drawSparkles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < sparkles.length; i++) {
        var s = sparkles[i];

        // Twinkle
        s.phase += s.twinkleSpeed;
        var twinkle = 0.6 + Math.sin(s.phase) * 0.4;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          'rgba(201, 162, 39,' + (s.alpha * twinkle).toFixed(3) + ')';
        ctx.fill();

        // Drift upward
        s.y -= s.speedY;
        s.x += s.speedX;

        // Wrap around edges
        if (s.y < -5) {
          s.y = canvas.height + 5;
          s.x = Math.random() * canvas.width;
        }
        if (s.x < -5) s.x = canvas.width + 5;
        if (s.x > canvas.width + 5) s.x = -5;
      }

      requestAnimationFrame(drawSparkles);
    }

    resizeCanvas();
    initSparkles();
    drawSparkles();

    window.addEventListener('resize', function () {
      resizeCanvas();
      initSparkles();
    });
  }

  /* ---------- WhatsApp float (pause on reduced motion) ---------- */
  // No JS needed — handled purely in CSS.

  /* ---------- Smooth internal anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();
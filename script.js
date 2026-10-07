(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('mainNav');

  // Mobile menu
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
  });

  // Dropdowns (click/tap/keyboard)
  var subItems = document.querySelectorAll('.has-sub');
  subItems.forEach(function (item) {
    var btn = item.querySelector('.sub-btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = !item.classList.contains('open');
      subItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.sub-btn').setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', function () {
    subItems.forEach(function (item) {
      item.classList.remove('open');
      item.querySelector('.sub-btn').setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      subItems.forEach(function (item) { item.classList.remove('open'); });
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = 'Menu';
    }
  });

  // Close mobile menu after choosing an on-page link
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = 'Menu';
    }
  });

  // Header shadow on scroll
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Number counters (run once when visible)
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animate(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduce) { el.textContent = target; return; }
    var start = null, duration = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(animate);
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

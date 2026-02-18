(function () {
  'use strict';

  // Smooth scroll for anchor links
  function smoothScrollTo(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === '#') return;
    var id = href.slice(1);
    link.addEventListener('click', function (e) {
      if (document.getElementById(id)) {
        e.preventDefault();
        smoothScrollTo(id);
      }
    });
  });

  // Nav bar "ניווט בעמוד" scrolls to about section
  var navBtn = document.querySelector('.nav-page-btn');
  if (navBtn) {
    navBtn.addEventListener('click', function () { smoothScrollTo('about-full'); });
  }

  // Mobile hamburger: toggle nav
  var navToggle = document.getElementById('nav-toggle-btn');
  var mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Escape: close hamburger menu or open FAQ panel (keyboard trap prevention)
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (mainNav && mainNav.classList.contains('is-open')) {
      mainNav.classList.remove('is-open');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
      return;
    }
    var openFaq = document.querySelector('.faq-question[aria-expanded="true"]');
    if (openFaq) {
      var panel = document.getElementById(openFaq.getAttribute('aria-controls'));
      if (panel) panel.hidden = true;
      openFaq.setAttribute('aria-expanded', 'false');
      openFaq.focus();
    }
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      btn.setAttribute('aria-expanded', !expanded);
      panel.hidden = expanded;
    });
  });

  // Contact form: submitted to Netlify Forms (no client-side handler needed)
})();

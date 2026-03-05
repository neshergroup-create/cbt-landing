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

  // Contact form: submit via Google Apps Script (replace with your deployed script URL)
  var CONTACT_FORM_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9V17_HTiGVYRwEwqZIaxUl90rCZZ_IYsFzAB9CbOZupaX2aubozpJXpIS13uTuGhN8g/exec';
  var contactForm = document.getElementById('contact-form-form');
  var successMessage = document.getElementById('form-success');
  var formError = document.getElementById('form-error');
  var submitBtn = document.getElementById('contact-submit-btn');

  function showSuccessIfHash() {
    if (window.location.hash === '#form-success' && contactForm && successMessage) {
      contactForm.hidden = true;
      successMessage.hidden = false;
      if (formError) formError.hidden = true;
    }
  }
  showSuccessIfHash();
  window.addEventListener('hashchange', showSuccessIfHash);

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (formError) {
        formError.hidden = true;
        formError.textContent = '';
      }
      var botField = document.getElementById('bot-field');
      if (botField && botField.value.trim() !== '') {
        if (formError) {
          formError.textContent = 'לא ניתן לשלוח את הטופס. נא לנסות שוב.';
          formError.hidden = false;
        }
        return;
      }
      var fd = new FormData(contactForm);
      var body = new URLSearchParams(fd);
      var originalBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.classList.add('is-loading');
      submitBtn.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span> שולח...';
      fetch(CONTACT_FORM_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(function () {
        window.location.hash = 'form-success';
        showSuccessIfHash();
      }).catch(function () {
        if (formError) {
          formError.textContent = 'שגיאה בשליחת הפניה. נא לבדוק את החיבור ולנסות שוב.';
          formError.hidden = false;
        }
      }).finally(function () {
        submitBtn.disabled = false;
        submitBtn.setAttribute('aria-busy', 'false');
        submitBtn.classList.remove('is-loading');
        submitBtn.innerHTML = originalBtnContent;
      });
    });
  }

  // Sticky CTA on mobile: show after scrolling past hero
  var stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    function onScrollSticky() {
      var mq = window.matchMedia('(max-width: 768px)');
      if (!mq.matches) {
        stickyCta.hidden = true;
        stickyCta.setAttribute('aria-hidden', 'true');
        return;
      }
      if (window.scrollY > 320) {
        stickyCta.hidden = false;
        stickyCta.setAttribute('aria-hidden', 'false');
      } else {
        stickyCta.hidden = true;
        stickyCta.setAttribute('aria-hidden', 'true');
      }
    }
    window.addEventListener('scroll', onScrollSticky, { passive: true });
    window.addEventListener('resize', onScrollSticky);
    onScrollSticky();
  }
})();

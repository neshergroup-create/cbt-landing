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

  // Nav bar "ניווט בעמוד" scrolls to profile
  var navBtn = document.querySelector('.nav-page-btn');
  if (navBtn) {
    navBtn.addEventListener('click', function () { smoothScrollTo('profile'); });
  }

  // Contact form: open mailto with subject and body
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name="name"]') || {}).value || '';
      var phone = (form.querySelector('[name="phone"]') || {}).value || '';
      var email = (form.querySelector('[name="email"]') || {}).value || '';
      var body = (form.querySelector('[name="body"]') || {}).value || '';
      var subject = 'פניה מהאתר - אורנית שטרנהיים מידאני';
      var bodyText = 'שם: ' + name + '\nטלפון: ' + phone + '\nאימייל: ' + email + '\n\nתוכן הפניה:\n' + body;
      var mailto = 'mailto:ornitsm@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyText);
      window.location.href = mailto;
    });
  }
})();

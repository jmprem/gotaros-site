/**
 * TAROS site — minimal JS
 * - Mobile navigation toggle
 * - Lazy-load TAROS intro iframe when section enters viewport (performance)
 */
(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('#main-nav');

  if (toggle && nav) {
    function setOpen(open) {
      nav.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function syncFromViewport() {
      if (window.matchMedia('(min-width: 769px)').matches) {
        setOpen(true);
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    window.addEventListener('resize', syncFromViewport);
    syncFromViewport(); // initial state for desktop
  }

  // Lazy-load intro animation iframe when section is in view (avoids loading ~300KB until needed)
  var introSection = document.getElementById('taros-intro');
  var introIframe = introSection ? introSection.querySelector('.intro-animation__iframe[data-src]') : null;

  if (introIframe && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        var entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        var src = introIframe.getAttribute('data-src');
        if (src) {
          introIframe.setAttribute('src', src);
          introIframe.removeAttribute('data-src');
        }
        observer.disconnect();
      },
      { rootMargin: '100px', threshold: 0 }
    );
    observer.observe(introSection);
  } else if (introIframe) {
    // Fallback: load iframe immediately if no IntersectionObserver
    var src = introIframe.getAttribute('data-src');
    if (src) {
      introIframe.setAttribute('src', src);
      introIframe.removeAttribute('data-src');
    }
  }
})();

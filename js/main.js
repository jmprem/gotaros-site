/**
 * TAROS site — minimal JS
 * Handles mobile navigation toggle only.
 */
(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('#main-nav');

  if (!toggle || !nav) return;

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
})();

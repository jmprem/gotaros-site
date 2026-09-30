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

  // Size the intro frame so the whole animation is visible at every screen size.
  // Wide screens render the desktop composition at DESKTOP_WIDTH and scale it down to fit;
  // narrower screens use the animation's own single-column layout at full size (no scaling).
  // The animation reports the height its tallest scene needs via postMessage.
  var introWrapper = introSection ? introSection.querySelector('.intro-animation__wrapper') : null;
  var introScale = introSection ? introSection.querySelector('.intro-animation__scale') : null;
  var DESKTOP_WIDTH = 1280;
  var SCALE_FROM_WIDTH = 900;
  var MIN_DESKTOP_HEIGHT = 720;
  var reportedHeight = 0;

  function layoutIntro() {
    if (!introWrapper || !introScale) return;
    var width = introWrapper.clientWidth;
    if (!width) return;
    var desktop = width >= SCALE_FROM_WIDTH;
    var frameWidth = desktop ? Math.max(width, DESKTOP_WIDTH) : width;
    var scale = width / frameWidth;
    var frameHeight = reportedHeight || (desktop ? 800 : 1200);
    if (desktop) frameHeight = Math.max(frameHeight, MIN_DESKTOP_HEIGHT);

    introScale.style.width = frameWidth + 'px';
    introScale.style.height = frameHeight + 'px';
    introScale.style.transform = scale === 1 ? 'none' : 'scale(' + scale + ')';
    introWrapper.style.height = Math.ceil(frameHeight * scale) + 'px';
  }

  if (introIframe) {
    window.addEventListener('message', function (event) {
      var data = event.data;
      if (event.source !== introIframe.contentWindow || !data || data.type !== 'taros-intro:size') return;
      if (data.height > 0 && data.height !== reportedHeight) {
        reportedHeight = data.height;
        layoutIntro();
      }
    });

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layoutIntro, 100);
    });
    layoutIntro();
  }

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

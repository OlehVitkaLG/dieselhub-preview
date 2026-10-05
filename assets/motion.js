/* DieselHub Service — scroll reveal.

   Deliberately built so that a failure reveals the content rather than hiding
   it. An earlier version used IntersectionObserver alone; in an environment
   where the compositor is idle the observer never fires, and 42 elements sit
   at opacity 0 — the page looks empty. So the geometry sweep below is the
   primary mechanism and it depends on nothing but getBoundingClientRect.

   Four guards:
     1. prefers-reduced-motion  -> no hiding at all
     2. ?static in the URL      -> no hiding at all (use when capturing to Figma)
     3. JS blocked or throws    -> .js-motion never gets added, nothing hides
     4. a 3s watchdog           -> anything still hidden and on screen is shown */
(function () {
  try {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (/[?&]static\b/.test(location.search)) {
      // ?static also un-sticks the header: position:sticky captures at the wrong
      // offset in html.to.figma, so the page has to be flat for a capture.
      document.documentElement.classList.add('is-static');
      return;
    }
    if (reduced) return;

    var SELECTORS = [
      '.section-head', '.why-card', '.svc-group', '.svc-note',
      '.rv-head', '.rv-card', '.gal-grid img', '.team-photo',
      '.wedge-copy', '.wedge-media', '.fleet-copy', '.fleet-media',
      '.stat', '.loc-info', '.loc-map', '.map-embed',
      '.ctaband .wrap > *', '.cols > *', '.chips', '.jobs'
    ].join(',');

    var pending = [].slice.call(document.querySelectorAll(SELECTORS));
    if (!pending.length) return;

    document.documentElement.classList.add('js-motion');
    pending.forEach(function (n) { n.setAttribute('data-reveal', ''); });

    function show(n) { n.classList.add('is-in'); }
    function onScreen(n) {
      var r = n.getBoundingClientRect();
      return r.top < window.innerHeight * 0.92 && r.bottom > 0;
    }
    function sweep() {
      for (var i = pending.length - 1; i >= 0; i--) {
        if (onScreen(pending[i])) { show(pending[i]); pending.splice(i, 1); }
      }
      if (!pending.length) teardown();
    }
    function revealAll() {
      pending.forEach(show);
      pending.length = 0;
      teardown();
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; sweep(); });
    }
    function teardown() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('beforeprint', revealAll);

    sweep();                               // whatever is on screen at load
    setTimeout(sweep, 400);                // after webfonts settle the layout
    setTimeout(function () {               // watchdog: never leave on-screen content hidden
      for (var i = pending.length - 1; i >= 0; i--) {
        if (onScreen(pending[i])) { show(pending[i]); pending.splice(i, 1); }
      }
    }, 3000);

    // expose for testing only
    window.__reveal = { sweep: sweep, revealAll: revealAll, pending: pending };
  } catch (e) {
    document.documentElement.classList.remove('js-motion');
  }
})();

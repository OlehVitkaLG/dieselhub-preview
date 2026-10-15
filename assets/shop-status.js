/* Two small things that make the hero badge read as live rather than as a
   leftover caption:

     1. "Open now / Closed" worked out from the posted hours in the shop's own
        timezone, so a driver at 7 PM is not left guessing.
     2. The review count counts up once, the first time it is seen.

   Both degrade quietly. The status element starts hidden and only appears if
   this runs; the count sits in the HTML at its final value, so a reader with no
   JS sees the right number, just without the motion. Reduced-motion skips the
   animation but keeps the status, because the status is content, not decoration. */
(function () {
  'use strict';
  try {
    var TZ = 'America/Chicago';
    /* day -> [open, close] in minutes from midnight. 0 = Sunday. */
    var HOURS = { 1: [480, 1020], 2: [480, 1020], 3: [480, 1020], 4: [480, 1020],
                  5: [480, 1020], 6: [480, 840], 0: null };
    var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    function shopNow() {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var got = {};
      parts.forEach(function (p) { got[p.type] = p.value; });
      var h = parseInt(got.hour, 10) % 24;
      return { day: DAYS.indexOf(got.weekday), mins: h * 60 + parseInt(got.minute, 10) };
    }

    function clock(mins) {
      var h = Math.floor(mins / 60), m = mins % 60;
      var suffix = h >= 12 ? 'PM' : 'AM';
      var h12 = h % 12 === 0 ? 12 : h % 12;
      return h12 + (m ? ':' + (m < 10 ? '0' + m : m) : '') + ' ' + suffix;
    }

    function nextOpening(day, mins) {
      for (var i = 0; i < 8; i++) {
        var d = (day + i) % 7, win = HOURS[d];
        if (!win) continue;
        if (i === 0 && mins >= win[0]) continue;      /* today already past opening */
        return (i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[d]) + ' at ' + clock(win[0]);
      }
      return null;
    }

    var box = document.querySelector('[data-shop-status]');
    if (box) {
      var t = shopNow(), win = HOURS[t.day], open = !!win && t.mins >= win[0] && t.mins < win[1];
      var txt = box.querySelector('.st-txt');
      if (open) {
        box.className = 'status is-open';
        txt.textContent = 'Open now · until ' + clock(win[1]);
      } else {
        var next = nextOpening(t.day, t.mins);
        box.className = 'status is-closed';
        txt.textContent = next ? 'Closed · opens ' + next : 'Closed';
      }
      box.removeAttribute('hidden');
    }

    var n = document.querySelector('[data-count]');
    if (n) {
      var target = parseInt(n.getAttribute('data-count'), 10);
      var skip = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
                 || document.documentElement.classList.contains('is-static')
                 || !isFinite(target);
      if (!skip) {
        var from = Math.max(0, target - 24), started = null, DUR = 900, done = false;
        var land = function () { done = true; n.textContent = String(target); };
        var step = function (ts) {
          if (done) return;
          if (started === null) started = ts;
          var p = Math.min(1, (ts - started) / DUR);
          p = 1 - Math.pow(1 - p, 3);                  /* ease out, lands softly */
          n.textContent = String(Math.round(from + (target - from) * p));
          if (p < 1) window.requestAnimationFrame(step); else land();
        };
        /* The low number is never written until a frame has actually been painted.
           Where the compositor is idle - a background tab, a capture, a headless
           run - requestAnimationFrame never fires, and an animation that started
           by writing its first value would leave a WRONG count on screen for as
           long as the page sat there. The watchdog is the same belt-and-braces as
           the scroll reveal: whatever happens, the real number wins. */
        window.requestAnimationFrame(function (ts) {
          if (done) return;
          n.textContent = String(from);
          started = ts;
          window.requestAnimationFrame(step);
        });
        window.setTimeout(land, DUR + 700);
      }
    }
  } catch (e) { /* the HTML already carries the right number and the week's hours */ }
})();

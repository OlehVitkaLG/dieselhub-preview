/* DieselHub Service — the location map.

   Why not Google: the free Google embed renders every business around us,
   including four competing shops within a few hundred metres, and it offers no
   parameter to suppress them. Hiding them on Google needs a Maps Platform API
   key, which this account does not have. Carto's Positron basemap carries roads
   and street names but no business pins, so the only marker on it is ours.

   Loaded on demand: Leaflet is ~45 KB and the map is far below the fold, so
   nothing is fetched until the block is close to the viewport. */
(function () {
  var el = document.getElementById('map');
  if (!el) return;

  var CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
  var JS  = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
  var loading = false;

  function near() {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 2.5 && r.bottom > -window.innerHeight;
  }

  function draw() {
    var lat = parseFloat(el.dataset.lat), lon = parseFloat(el.dataset.lon);
    var map = L.map(el, { scrollWheelZoom: false, attributionControl: true })
               .setView([lat, lon], 16);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);

    // brand-coloured pin drawn inline rather than shipping an image
    var pin = L.divIcon({
      className: 'map-pin',
      html: '<svg viewBox="0 0 24 34" width="30" height="42" aria-hidden="true">' +
            '<path d="M12 33s11-12.2 11-20A11 11 0 1 0 1 13c0 7.8 11 20 11 20Z" ' +
            'fill="#ED7002" stroke="#0D0D0F" stroke-width="1.6"/>' +
            '<circle cx="12" cy="13" r="4.3" fill="#0D0D0F"/></svg>',
      iconSize: [30, 42], iconAnchor: [15, 42], popupAnchor: [0, -38]
    });
    L.marker([lat, lon], { icon: pin, title: 'DieselHub Service' })
     .addTo(map)
     .bindPopup('<b>DieselHub Service</b><br>252 Patricia Ln<br>East Dundee, IL 60118');

    // a map that swallows the page scroll is a mobile trap; click to enable
    map.on('click', function () { map.scrollWheelZoom.enable(); });
  }

  function load() {
    if (loading) return;
    loading = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = CSS;
    document.head.appendChild(link);
    var s = document.createElement('script');
    s.src = JS; s.async = true;
    s.onload = draw;
    s.onerror = function () {
      // never leave an empty grey box: fall back to a plain link
      el.innerHTML = '<a class="map-fallback" href="https://www.google.com/maps/place/?q=place_id:ChIJk8-gBfYPD4gRhEBMLS6MnRE">' +
                     'Open the map on Google</a>';
    };
    document.head.appendChild(s);
  }

  function check() { if (near()) { load(); window.removeEventListener('scroll', check); } }
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check, { passive: true });
  check();
  setTimeout(check, 1200);
})();

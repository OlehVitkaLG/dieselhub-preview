# DieselHub Service — site build

Static HTML/CSS mockup of the full site, built to be captured into Figma with the
**html.to.figma** browser extension and then handed to a developer.

**28 pages, no build step, no server needed.** Every path is **relative**, so you can
double-click `index.html` and it just opens — stylesheet, images, navigation and all.

---

## Open it

**Simplest:** double-click `index.html`. Works straight off the disk over `file://`.

**Or serve it**, if you prefer clean URLs while reviewing:

```bash
npx --yes serve dieselhub-site -l 5178
```

Then open `http://localhost:5178`. Both routes work — relative paths resolve either way.

> **Note for the developer:** links point at explicit `foo/index.html` rather than `foo/`
> so that `file://` navigation works for the client's review. On the live site switch
> them to clean directory URLs (`/services/`) — the `<link rel="canonical">` on every
> page already declares the clean form, so that is the intended shape.

---

## Capturing into Figma

1. Install the **HTML to Figma** browser extension.
2. Open the page you want — double-clicking the file is enough.
3. Set the browser window to **1440px** wide for the desktop frame, **390px** for mobile.
4. Capture with the extension → it downloads a JSON file.
5. In Figma, run the **html.to.figma** plugin → import that JSON.
6. Fonts: **Bahnschrift ships with Windows**, so a Windows Figma desktop app finds it
   with nothing to install. **Figma in a browser, or Figma on a Mac, will not have it**
   and will substitute — so capture and open the file on Windows desktop Figma. The
   fallbacks (**Barlow Condensed**, **Inter**) are free Google Fonts already in Figma's
   list, in case anyone opens the file elsewhere.

The CSS was written around the extension's known limitations, and these constraints
are load-bearing — if you edit the CSS, keep them:

| Avoided | Why |
|---|---|
| `position: sticky` / `fixed` | capture at the wrong offset |
| `::before` / `::after` content | pseudo-elements are dropped on import |
| `clip-path`, `mask` | not supported, silently lost |
| CSS animation / transition states | only the resting state captures |
| CSS Grid where flexbox would do | grid produces messier Figma layers |
| Icon fonts, background-image text | everything visible is a real `<img>` or a real text node |
| Google Maps `iframe` | imports as an empty rectangle — a static `map.jpg` stands in |

The reviews carousel and the FAQ accordion are rendered in their **static open state**
on purpose, so the Figma frame shows the real content. The developer implements the
interaction.

---

## Deploying the preview

The staging copy at `https://olehvitkalg.github.io/dieselhub-preview/` is built
from this folder, not served from it. Three things are applied on the way out:

1. `<meta name="robots" content="noindex, …">` on every page, `robots.txt` with
   `Disallow: /`, and `sitemap.xml` removed. GitHub Pages cannot send an
   `X-Robots-Tag` header, so the meta tag is the only control that works.
2. `.nojekyll`, so GitHub serves the files as-is.
3. **`python tools/version-assets.py <deploy-dir>`** — stamps `?v=<content hash>`
   onto every local CSS, JS, image and icon reference.

Step 3 is not cosmetic. GitHub Pages serves everything with
`Cache-Control: max-age=600`, so anyone who opened the page in the last ten
minutes keeps the old stylesheet and photos after a deploy and reports that
nothing changed. Hashing the URL makes a changed file a different URL.

**Run it on the deploy copy only.** This folder stays unstamped because it is
reviewed by double-clicking `index.html`, and a query string on a `file://` URL
is not reliably handled.

---

## Page map

| URL | Purpose |
|---|---|
| `/` | Home — the full flow |
| `/services/` | Hub for all 21 services + "what we don't do" |
| `/services/<slug>/` | 21 pages, one per service, each with a **Symptoms** block |
| `/pricing/` | Published shop rates — labor, PM, inspections, tires |
| `/carb-clean-truck-check/` | The wedge page — no local competitor has this |
| `/fleet-services/` | Written to the fleet manager, not the driver |
| `/about/` | History, rebrand, Greg |
| `/contact/` | Request-service form + map |
| `/careers/` | Technician recruiting |
| `/privacy-policy/` | Plain-language draft |
| `/sitemap.xml`, `/robots.txt` | Generated, 28 URLs |

Service slugs: `dot-inspection` · `computer-diagnostic` · `electrical-systems` ·
`engine-overhaul` · `fuel-systems` · `valve-adjustment` · `dpf-aftertreatment-repair` ·
`exhaust-systems` · `radiator-cooling-systems` · `ac-systems` · `transmission-repair` ·
`clutch-replacement` · `brake-repair` · `abs-systems` · `suspension-systems` ·
`tire-service` · `preventive-maintenance` · `tow-bar-rental` · `trailer-repair` · `welding` ·
`collision-repair`

---

## Design tokens

All in `assets/site.css` on `:root`. Never hard-code a brand colour twice.

```css
--orange:      #ED7002;   /* sampled pixel-for-pixel from the logo */
--orange-dark: #C25A01;   /* hover */
--orange-text: #B05201;   /* small orange TEXT on light backgrounds — see below */
--ink:         #0D0D0F;
--ink-2:       #17171A;
--paper:       #FFFFFF;
--paper-2:     #F4F4F5;
--txt-mid:     #55555E;
```

### The one colour rule that must not be "cleaned up"

**`#ED7002` on white is 3.03:1. That fails WCAG AA for text.** So:

- Small orange text on a light background uses `--orange-text` (5.2:1).
- Orange **buttons carry near-black labels, never white** (6.9:1). This also happens to
  echo the logo's own black-and-orange pairing, so it reads as deliberate.
- On dark backgrounds `--orange` is used directly (7.7:1) and is fine.

Verified: **0 contrast failures across 1,264 text nodes on 12 page templates.**
If someone "fixes" the buttons back to white text, that number goes to zero-compliant.

### Type: Bahnschrift, and what that costs

```css
--font-display: "Bahnschrift Condensed", "Bahnschrift", "DIN Alternate",
                "Barlow Condensed", "Roboto Condensed", sans-serif;
--font-body:    "Bahnschrift", "DIN Alternate", "Inter",
                -apple-system, "Segoe UI", Roboto, sans-serif;
```

Headings are `--font-display` 700 uppercase. Body is `--font-body` 400.

**Bahnschrift is Microsoft's DIN 1451 and it is a Windows *system* font.** It is not on
Google Fonts, there is no webfont to self-host, and it does not exist on macOS, iOS,
Android or Linux. So on the live site **most visitors — including drivers on phones —
will see the fallback, not Bahnschrift.** That is a deliberate accepted trade-off, not
an oversight. If the shop wants the DIN look to reach everyone, the developer needs a
licensed DIN webfont; the fallback chain is where it would be swapped in.

Measured in the browser, only these instances actually resolve:

| Family | Width | Notes |
|---|---|---|
| `Bahnschrift` | 604 | weights 400 and 700 both render |
| `Bahnschrift Condensed` | 501 | weights 400 and 700 both render |
| `Bahnschrift Light` | 604 | lighter, normal width |
| `Bahnschrift SemiCondensed` | 501 | resolves to the **same face** as Condensed |
| `Bahnschrift SemiBold` | 604 | **ignores `font-weight`** — don't use it |
| `Bahnschrift SemiLight`, and every combined name like `Bahnschrift SemiBold Condensed` | — | **do not resolve at all** |

Two consequences baked into the CSS:

- **No italic exists.** The browser fakes a slant if asked, and the fake does not survive
  an html.to.figma capture. So every heading is **upright** — the design no longer echoes
  the logo's italic slant. Upright condensed DIN is road-signage type, which suits a
  diesel shop, but it is a real change from the first version.
- **Max weight is 700.** Nothing asks for 800, because Bahnschrift would synthesize it.
  Headings read lighter than Barlow Condensed 800 did (measured ink: 14012 vs 17411 px).

**Display sizes were scaled down ~13%** because Bahnschrift Condensed runs wider than
Barlow Condensed at the same px. Without it the hero `h1` wrapped to 5 lines instead of
3, and the fleet `h1` to 3 instead of 1. `h1` 74→64, `h2` 50→44, `h3` 26→24, page-hero
`h1` 58→50, plus matching steps at the 1080 and 620 breakpoints. If anyone changes the
font family again, **re-check heading wrap** before anything else.

---

## What the developer still has to wire up

1. **The request-service form** (`/contact/`) — `action="#"` right now. Point it at
   Netlify Forms, Formspree or a small serverless handler delivering to
   `service@dieselhubservice.com`. Keep the honeypot field. **Do not add a CAPTCHA** —
   in this niche it costs more conversions than it saves in spam.
2. ~~Google Maps embed~~ — **done.** Both `/` and `/contact/` now carry a live
   keyless Google Maps iframe in a `.map-embed` wrapper. Note it imports into Figma
   as an empty rectangle.
3. **Sticky header + mobile call bar** — currently static so they capture into Figma
   correctly. On the live site the header should be `position: sticky; top: 0` and the
   call bar `position: fixed; bottom: 0` under 900px (add matching `padding-bottom` to
   `body` so it doesn't cover the footer).
4. **Reviews carousel** — three static cards now; make it a carousel if desired.
5. **Analytics + call tracking** — `tel:` links are in place so call clicks are
   measurable. Add GA4 and, if channel attribution matters, a tracking number.
6. ~~Favicon set~~ — **done.** `favicon.ico` (16/32/48), PNGs, an apple-touch icon,
   192/512 PWA icons and `site.webmanifest`, all wired into every page.
7. **`logo.svg`** — we only have raster. `assets/logo-white.png` and `logo-dark.png`
   were generated from the JPG by knocking out the white background; they're clean but
   they are not vector. Get the real SVG from whoever made the logo.

---

### Motion

Hover feedback plus a one-time reveal as sections scroll in. Short and flat —
0.2-0.5s, ease-out, no bounce. `assets/motion.js` drives the reveal.

**It is built so that a failure shows the content rather than hiding it.** An earlier
version used `IntersectionObserver` alone; where the compositor is idle the observer
never fires and 42 elements sit at `opacity: 0` — the page looks empty. The reveal is
now a geometry sweep that depends on nothing but `getBoundingClientRect`, with four
guards:

| Guard | Effect |
|---|---|
| `prefers-reduced-motion` | nothing is ever hidden |
| **`?static` in the URL** | nothing is ever hidden — **use this when capturing to Figma** |
| JS blocked or throwing | `.js-motion` never gets added, so the CSS never hides anything |
| 3s watchdog | anything still hidden and on screen is shown regardless |

If you change the reveal, keep that shape: the hiding must be applied *by* the script,
never sitting in the HTML.

---

## ⚠️ Must be resolved before this goes live

Everything below is marked with a `⚠️` HTML comment at the exact spot in the markup.

| # | Item | Where | What's needed |
|---|---|---|---|
| 1 | **The reviews section has no quotes** | `/` reviews section | The three invented reviews were removed. What is left is real and verifiable — 4.7 stars, 101 reviews, and a link to Google. Paste in three real reviews from the Google Business Profile when you have them; the `.rv-card` styles are still in the CSS waiting. |
| 2 | **Founding story unconfirmed** | `/about/`, `/fleet-services/` | "Opened in 2016 as the maintenance shop for our own trucking operation" is flagged in the master listing copy §10 as needing Greg's confirmation. If it's wrong, swap in the alternate paragraph kept in that file. |
| 3 | **Turnaround statements** | all 20 service pages | Deliberately conservative and generic ("most PM services are same-day"), not invented shop-specific promises. Have Greg confirm or tighten each. |
| 4 | **Career openings** | `/careers/` | The three invented roles were removed. The page now says the shop is always open to a good technician, which is true and needs no confirming. Add real roles with real pay ranges when there are any. |
| 5 | **Google Place ID** | footer + reviews link on every page | `ChIJk8-gBfYPD4gRhEBMLS6MnRE` was derived from a third-party map listing, not read out of the Google Business Profile. Verify it resolves to DieselHub before launch. |
| 6 | **The team photo is a 360x640 social export** | `/about/` | It is upscaled roughly 2x on desktop and looks soft. `.team-photo` caps its drawn width to limit that. Replace `assets/img/team.jpg` with the original file and the cap can go. |
| 7 | **CARB credential** | `/carb-clean-truck-check/` | The page states DieselHub is a credentialed Clean Truck Check tester. Confirm the credential is current; it's the site's main claim. |
| 8 | **Privacy policy** | `/privacy-policy/` | Plain-language draft, not legal advice. Have it reviewed, and update it to match whichever analytics and form handler actually get installed. |

### Never appears on this site — and must not be added

From the master listing copy §11, as confirmed with the shop on 2026-10-05.
**Collision repair was on this list and is not any more** — the shop does it at
$180/hr. That change has to be carried into the master copy and into Google
Business Profile, where `Truck Collision Repair` was previously removed.

- Mobile repair, roadside, towing, OTR service
- Hydraulics, refrigeration / reefer units, liftgates
- Truck or trailer rental (tow **bar** rental is a different thing and is on the site)
- Cat / Cummins / Paccar "certified" without an OEM certificate in hand

The site says these out loud on `/services/` and `/fleet-services/` as a trust play.
Don't let a future edit quietly re-add them.

---

## The October 2026 review pass

Thirty points came back from a reviewer plus the shop. The ones that changed how
the site is built, rather than just its wording:

**Rates are published.** `/pricing/` carries the whole sheet — labor, PM by make,
inspections, diagnostics, tires. Competitors nearby publish nothing, so this is the
strongest single differentiator on the site. A four-card summary sits on the
homepage under the services list.

**Service names and counts are no longer hard-coded.** "Twenty services" was wrong
the moment Collision Repair was added, so the copy now says "All services". If you
add a service, nothing in the prose has to be hunted down.

**Nine service groups, not ten.** Ten groups left an orphan card alone on the last
row of a three-column grid. Nine fills exactly three rows. Tow Bar Rental came out
of the grid entirely — it is equipment rental, not repair, and it was the reason
the count never matched.

**CARB wording is operational, not legal.** The programme follows where a truck
*runs*, not where it is registered, and the page said the opposite. EPA disapproved
the out-of-state extension in January 2026 and CARB kept enforcing it anyway, so
"if your truck runs in California" is the phrasing that survives whichever way that
dispute lands.

**One name per thing.** `CARB Clean Truck Check` in full, `CARB Test` where space is
tight — the site previously used four variants, one of which ("California CARB
Test") was a tautology. `Computer Diagnostics` is plural everywhere, which also
matches what the directories already publish.

**Hours had eight different formats**, including `Sun Closed` and `Sun closed` in
the same block on different pages. Two forms now: compact where space is tight,
a table where there is room.

**The map is OpenStreetMap, not Google.** The free Google embed renders every
business nearby, including the direct competitor 1.5 km away. There is no parameter
to suppress that, and a styled Google map needs an API key the shop did not want.
OSM shows roads and street names and no business pins.

**Control boundaries are audited now, not just text.** The first contrast pass only
measured text, which is why an orange button on an orange band shipped with a
1.6:1 border. The audit now checks the fill *or* border of every button and form
field against the background behind it; four more failures turned up and were
fixed. `--line-control` exists specifically for control edges — do not swap it for
`--line-light`, which is decorative and has no contrast duty.

---

## Photos

All fifteen images are real shop photos, generated from the September shoot.

**Every source photo is portrait**, which decided the layout rather than the other
way round. A 4:3 crop was tried first and rejected — it cut technicians' heads and
the tops of the cabs. So:

| Slot | Shape | Why |
|---|---|---|
| Hero | native portrait, 1200x1600 | the hero container is already portrait (770x952), so `cover` trims only 7% |
| Gallery, CARB, fleet, careers | **1:1 square**, 1000x1000 | square keeps every subject intact where 4:3 did not, and does not make the sections absurdly tall the way 3:4 would |
| Team band | 3:2, capped at 760px wide | see the blocker table — the source is a small social export |
| OG image | 1200x630 | bay photo, darkened at the bottom, logo over it |

Total image weight is about 2.9 MB across the whole site, hero 421 KB. Everything
below the fold is `loading="lazy" decoding="async"`; the hero is not, deliberately.

`width`/`height` on every `<img>` match the file exactly, so nothing shifts as
images arrive. If you replace a photo, **update those attributes too**.

### Shots that still do not exist

Nothing in the set covers these, so they are not on the site at all rather than
being faked with something adjacent:

- **trailer repair** — no photo of a trailer anywhere in the shoot
- **welding** — none
- the exterior with the **new DieselHub sign**
- a **scanner plugged into a truck** for the CARB page

## Verified

Checked in a real browser against a local server, not by inspection:

- 28 pages, all returning 200
- 45 internal links and assets crawled — **0 broken**, 0 dead `href="#"`
- 0 duplicate `<title>`, all titles under 70 characters
- 0 contrast failures across 1,264 text nodes (desktop) and 1,156 (mobile), 12 templates
- 0 horizontal overflow at 1440px and at 390px
- 0 broken images, 0 images missing `alt`, all with `width`/`height`
- Exactly one `<h1>` per page, heading levels in order
- Every tap target ≥ 44px at both 1440px and 390px
- Mobile at 390px: nav and top bar collapse, call bar appears
- Every heading measured as actually rendering in Bahnschrift, not a fallback;
  0 italic elements anywhere; no heading wraps past its intended `<br>` structure
- `AutoRepair` JSON-LD on `/` parses, with all 20 services in `hasOfferCatalog`;
  `Service` JSON-LD on each service page
- 8 `tel:` links on the home page alone

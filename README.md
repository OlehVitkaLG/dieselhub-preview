# DieselHub Service — staging preview

Static site, 28 pages, no build step. Published with GitHub Pages.

## ⚠️ Staging, not the live site

Every page carries `<meta name="robots" content="noindex, nofollow, noarchive,
nosnippet, noimageindex">` and `robots.txt` blocks all crawling. **Both must be
removed before these files go to the production domain.**

`<link rel="canonical">` on every page points at `https://dieselhubservice.com/`.
That is correct and should stay.

## Still not final

- **The team photo is a 360x640 social export** — it is upscaled about 2x on
  desktop and looks soft. The CSS caps how wide it may be drawn to limit that.
  Replace `assets/img/team.jpg` with the original file.
- **The reviews section carries no quotes.** The rating and count (4.7, 101
  reviews) are real; three real reviews still have to be pasted in.
- The contact form is not wired to an inbox.

## Motion

`assets/motion.js` reveals sections on scroll. Append **`?static`** to any URL to
disable it — needed when capturing a page into Figma.

# DieselHub Service — staging preview

Static site, 28 pages, no build step. Published with GitHub Pages.

## ⚠️ This is a staging preview, not the live site

Every page carries `<meta name="robots" content="noindex, nofollow, noarchive,
nosnippet, noimageindex">` and `robots.txt` blocks all crawling. **Both must be
removed before these files go to the production domain**, or the real site stays
out of Google.

GitHub Pages cannot send HTTP headers, so `X-Robots-Tag` is unavailable here and
the meta tag is the only working control.

`<link rel="canonical">` on every page points at `https://dieselhubservice.com/`.
That is correct and should stay.

## Not final content

- **Every photo is a labelled placeholder.** Real shop photos exist but are not
  placed yet, and two gallery slots have no source photo at all — nothing for
  trailer repair and nothing for welding.
- **The reviews section carries no quotes.** The rating and count shown (4.7,
  101 reviews) are real; three real reviews still have to be pasted in.
- The contact form is not wired to an inbox.

## Motion

`assets/motion.js` reveals sections on scroll. Append **`?static`** to any URL to
disable it — needed when capturing a page into Figma, otherwise off-screen
sections import at opacity 0.

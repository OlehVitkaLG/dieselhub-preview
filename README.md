# DieselHub Service — staging preview

Static site, 28 pages, no build step. Published with GitHub Pages.

## ⚠️ This is a staging preview, not the live site

Every page carries `<meta name="robots" content="noindex, nofollow">` and
`robots.txt` blocks all crawling. **Both must be removed before these files go to
the production domain** — otherwise the real site stays out of Google.

GitHub Pages cannot send HTTP headers, so `X-Robots-Tag` is unavailable here; the
meta tag is the only working control. That is why it is in the HTML rather than in
an `_headers` or `.htaccess` file.

The `<link rel="canonical">` on every page points at `https://dieselhubservice.com/`.
That is correct and should stay.

## Not final content

- The three reviews on the homepage are **sample text**, marked with a visible
  warning. Replace with real Google reviews before launch.
- Every photo is a labelled placeholder at final dimensions.

## Local preview

Paths are relative, so opening `index.html` from disk works. No server needed.

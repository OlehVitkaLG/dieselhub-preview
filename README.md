# DieselHub Service — staging preview

Static site, 30 pages, no build step. Published with GitHub Pages.

## ⚠️ Staging, not the live site

Every page carries `<meta name="robots" content="noindex, …">` and `robots.txt`
blocks all crawling. **Both must be removed before these files go to the
production domain.** The canonical on every page points at
`https://dieselhubservice.com/`, which is correct and should stay.

## Still not final

- **Nine photos are labelled placeholders** — the entrance, the facade with the
  new sign, trailer repair, welding, a scanner on a truck, two before/after
  pairs and six team portraits. Each one has the shot written on it.
- **The team names and roles are blank.** Reviews name Christina at the front
  desk, so the people matter here.
- **The team group photo is a 360×640 social export** and looks soft.
- The contact form is not wired to an inbox.

## Motion

`assets/motion.js` reveals sections on scroll and the header is sticky. Append
**`?static`** to any URL to switch both off — needed when capturing into Figma.

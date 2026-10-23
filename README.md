# Thirst Games Studio — website

Static site served by GitHub Pages from the `main` branch root. No build step.

- `index.html` — studio page: hero (live water + logo), manifesto with the team notes, HOPE: Survival
  over trailer footage, feature loops, expertise, contacts.
- `ru/index.html` — Russian version; shares `assets/` with the English page. A text change goes into both.
- `404.html` — self-contained "not found" page (no relative assets on purpose).
- `assets/js/site.js` — **all outbound links** (`LINKS`: game site, press kit, Steam, Discord,
  trailer, business email). An empty value renders the control as "coming soon"; fill it in and it
  goes live everywhere. On the Russian page, links to the game site and press kit point at its `/ru/`.
  Also the hero water (canvas: a drop under the logo every few seconds, light rain, ripples from the
  pointer, a big one on click), the manifesto words that light up on scroll, and on-screen-only video
  playback. With reduced motion the water is a still set of rings, the words are lit and videos stay
  on posters (also on data-saver or 2G/3G).
- `assets/video/` — `game*.mp4` (trailer at half speed, AV1 + H.264, behind the game block) and the
  four `feature-*.mp4` loops, each with a `.webp` poster; copied from the game site.
- `assets/img/` — `hope-logo.webp` (the game logo); `og-studio.jpg` is the 1200×630 social card
  (studio logo on the hero glow; renamed rather than overwritten so link previews do not serve a
  cached copy). The studio logo (`studio-logo.png` — full lockup, `studio-wordmark.png` — drop +
  THIRST for the header, `icon.png` / `apple-touch-icon.png`) is cut from the official YouTube
  channel avatar (900×900, light on black → transparent PNG). Replace with the vector source when it
  turns up. The site palette (`--accent` etc.) follows the logo's ice-blue on near-black.
- `assets/fonts/` — Jost (headings, buttons, menu: thin, widely tracked caps to match the logo) and
  Inter (body), latin + cyrillic subsets, self-hosted (SIL Open Font License).
- `.nojekyll` — tells Pages to serve files as-is.

## Content rules

Texts about HOPE: Survival state only what is in the build (same rules as the game site). Team
background comes from the studio's own pitch materials; no names are published.

## Cache busting

Every page links `style.css?v=…` and `site.js?v=…`; after changing either file, bump the version:

```
V=$(date +%Y%m%d%H%M); sed -i -E "s#(style\.css|site\.js)\?v=[0-9]+#\1?v=$V#" index.html ru/index.html
```

## Local preview

```
python -m http.server 8766
```

then open http://localhost:8766/.

## Custom domain

Set in **Settings → Pages → Custom domain**; GitHub then commits a `CNAME` file here. Then replace
`https://vargdevelopment.github.io/ThirstGamesStudioWebsite/` with the domain in both pages (canonical,
hreflang, og/twitter tags, JSON-LD), `sitemap.xml` and `robots.txt`, and drop the `repo` prefix check
in `404.html`.

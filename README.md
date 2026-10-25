# Thirst Games Studio — website

Static site served by GitHub Pages from the `main` branch root. No build step.

- `index.html` — studio page, games and contacts only (like a publisher's studio page, no mission
  statements): hero (live water + studio logo), the HOPE: Survival card (trailer loop with a strip of
  screenshots, status pills, facts, Steam / game site buttons), contact cards.
- `ru/index.html` — Russian version; shares `assets/` with the English page. A text change goes into both.
- `404.html` — self-contained "not found" page (no relative assets on purpose).
- `assets/js/site.js` — **all outbound links** (`LINKS`: game site, press kit, Steam, Discord, trailer,
  YouTube channel, business email). An empty value renders the control as "coming soon"; fill it in
  and it goes live everywhere. On the Russian page, links to the game site and press kit point at its
  `/ru/`. Also the hero water (canvas: a drop under the logo every few seconds, light rain, ripples
  from the pointer, a big one on click), the game card thumbnails, and on-screen-only video playback.
  With reduced motion the water is a still set of rings and videos stay on posters (also on
  data-saver or 2G/3G).
- `assets/video/` — `game*.mp4` (trailer at half speed, AV1 + H.264) with its `.webp` poster, copied
  from the game site.
- `assets/img/hope/` — HOPE: Survival screenshots for the game card (`NN-name.webp` 1920×1080 and
  `-thumb.webp` 800×450, copied from the game site); `hope-logo.webp` — the game logo.
- `assets/img/` — `og-studio.jpg` is the 1200×630 social card (studio logo on the hero glow; renamed
  rather than overwritten so link previews do not serve a cached copy). The studio logo
  (`studio-logo.png` — full lockup, `studio-wordmark.png` — drop + THIRST for the header and footer,
  `icon.png` / `apple-touch-icon.png`) is cut from the official YouTube channel avatar (900×900,
  light on black → transparent PNG). Replace with the vector source when it turns up.
- Palette: dark base with a faint grid and film grain; accents lime + violet, in tokens
  (`--accent`, `--accent-2`, `--rgb-1/2`, `--ring-1..3`) at the top of `style.css`.
- `assets/fonts/` — Jost (headings, buttons, labels; one variable file covers weights 300–700) and
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

The site is served at **https://thirst.games/** (`CNAME` file, set in **Settings → Pages → Custom
domain**). DNS at GoDaddy:

- apex: `A` records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  (GoDaddy's "Parked" / "WebsiteBuilder Site" A record and domain forwarding must stay off)
- `www`: `CNAME` → `vargdevelopment.github.io`
- `TXT` `_github-pages-challenge-VARGDevelopment` — the domain is verified on the VARGDevelopment
  account (github.com/settings/pages), so no other account can claim it. Keep the record.

Absolute URLs in both pages (canonical, hreflang, og/twitter tags, JSON-LD), `sitemap.xml` and
`robots.txt` point at the domain. The old `vargdevelopment.github.io/ThirstGamesStudioWebsite/`
address redirects to it.

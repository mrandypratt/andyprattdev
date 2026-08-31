# Architecture

Code-level inventory of the portfolio app. For "why this exists" see `north-star.md`. For hosting and deploys see `infrastructure.md`. For local development see `development.md`.

## Tech stack

| Area | Tool | Version | Notes |
|------|------|---------|-------|
| React | react / react-dom | 18.3.x | `createRoot` in `src/index.tsx`; StrictMode on |
| TypeScript | typescript | 5.x | `tsconfig` target `es2020` |
| Build | Vite + @vitejs/plugin-react | 6.x | Config in `vite.config.ts`; dev server on `:3000`, prod output to `build/` |
| Routing | react-router-dom | 7.x | `react-router-hash-link` works against RR7 with no shim |
| UI | @mui/material, @mui/icons-material | 7.x | Used mainly for icons; `ButtonTheme.tsx` augmentation is dead code (compiles, unused) |
| Styling | Emotion + plain CSS | 11.8.x | Per-component `.css` files in `src/styles/` |
| Testing | — | — | No test framework. CRA's Jest/testing-library deps were removed in the Vite migration; Vitest is a deferred follow-up |

`tsconfig.json` has `strict: true`.

> **Stack upgrade complete (2026-06):** migrated CRA → Vite and bumped React 17→18, TS 4.6→5, MUI 5→7, React Router 6→7 on a single branch. The `fs.F_OK` and `caniuse-lite` build warnings are gone with CRA. Decisions, audit, and smoke-test checklist live in [`plans/stack-upgrade.md`](plans/stack-upgrade.md). Note: image assets that were loaded via CommonJS `require(...)` (a CRA idiom Vite doesn't support) are now ESM `import`s in the `Version1/2/3.tsx` files.

## Directory map

```
andyprattdev/
├── index.html                         # Vite entry HTML (repo root); loads Roboto, scripts /src/index.tsx
├── vite.config.ts                     # Vite config — dev :3000, build.outDir 'build'
├── public/                            # Served at site root by Vite (favicon, manifest, robots)
│   ├── APDevFaviconColorized.png
│   ├── manifest.json                  # PWA placeholder
│   └── robots.txt
├── src/
│   ├── index.tsx                      # Entry point (createRoot)
│   ├── Routes.tsx                     # All routes defined here (BrowserRouter)
│   ├── global.d.ts                    # Module declarations for .pdf / .jpg
│   ├── vite-env.d.ts                  # /// <reference types="vite/client" />
│   ├── assets/
│   │   ├── Profile.jpg                # ★ Profile picture (slated for replacement)
│   │   ├── UnderConstruction.jpg      # Placeholder for unbuilt project detail pages
│   │   ├── AndyPrattResume.pdf        # Linked from Navbar / Home / Resume
│   │   ├── APDevLogo.tsx              # Inline SVG, props: { format: "mobile" | "desktop" }
│   │   ├── CWFLogo.tsx                # Inline SVG, props: { className }
│   │   └── Project/
│   │       ├── V1/V1-Mockup.png
│   │       ├── V2/V2-Mockup.png, V2-Sessions-Mockup.png, V2-User-Flows.png, V2-End-Game-Buttons.png
│   │       └── V3/V3-Mockup.png
│   ├── components/
│   │   ├── Navbar.tsx                 # DesktopNavbar + MobileNavbar (breakpoint 1000px); flat links: HOME / PROJECTS / LIBRARY / RESUME / ABOUT
│   │   ├── Sidebar.tsx                # In-page nav on CWF deep-dive (HashLink to /projects/#...)
│   │   ├── ProjectsSection.tsx        # "Explore" section rendered on Home (id="projects"); hosts the three cards
│   │   ├── ProjectCard.tsx            # Reusable card; internal `href`, external `externalHref` (new tab), custom `cta`; live vs coming-soon state
│   │   ├── CodeSnippets.tsx           # Rendered code blocks used inside the CWF version components
│   │   └── Footer.tsx                 # Email / GitHub / LinkedIn icons + "looking for SWE opportunities" copy
│   ├── views/                         # Page-level components
│   │   ├── Home.tsx                   # Hero + 2 CTAs (Resume, About Me); renders <ProjectsSection/> below the hero
│   │   ├── About.tsx                  # Two-column essay + profile pic
│   │   ├── Library.tsx                # Reading history at /library — bookshelf of spines, catalog card, ranking
│   │   ├── Resume.tsx                 # ⚠ NOT routed — dead code
│   │   ├── Error.tsx                  # Error boundary view (also not currently routed)
│   │   └── Projects/
│   │       ├── CardsWithFriends.tsx   # Deep-dive page at /projects (formerly Portfolio.tsx)
│   │       ├── Version1.tsx, Version2.tsx, Version3.tsx  # Rendered inside CardsWithFriends.tsx
│   │       ├── v1.md                  # ★ MVP writeup (142 lines) — NOT RENDERED IN UI
│   │       ├── v2.md                  # ★ Multi-device writeup (281 lines) — NOT RENDERED IN UI
│   │       └── v3.md                  # ★ Single-player writeup — NOT RENDERED IN UI
│   ├── styles/
│   │   ├── App.css                    # Global: #292929 bg, white text, Roboto
│   │   ├── Navbar.css, Home.css, About.css, Portfolio.css, Sidebar.css, Projects.css, Library.css, Footer.css
│   │   └── ButtonTheme.tsx            # MUI theme augmentation (primary/neutral/danger)
│   ├── constants/
│   │   └── views.tsx                  # VIEWS enum — defined but unused
│   └── data/
│       └── books.ts                   # ★ The shelf — single source of truth for /library (title, author, rating, finished, optional take)
├── package.json
├── tsconfig.json
└── README.md                          # Only contains deploy instructions
```

## Routes (`src/Routes.tsx`)

| Path | Component |
|------|-----------|
| `/` | Home (hero + "Explore" section anchored at `#projects`) |
| `/about` | About |
| `/library` | Library (reading history) |
| `/projects` | CardsWithFriends (CWF deep-dive) |
| `/projects/cards-with-friends` | `<Navigate to="/projects" replace />` — retired path, preserves inbound links |
| `/portfolio` | `<Navigate to="/projects" replace />` — preserves inbound links |

There is no `/projects` index page. Cards with Friends is the only project write-up, so it *is* `/projects`. If a second live project ever lands, `/projects` becomes an index and CWF moves back to its own child path.

Deep links into the CWF page use hash anchors (`/projects/#version-2-tools`) driven by `Sidebar.tsx`. The old `/projects/cards-with-friends/#...` anchors still land on the right page via the redirect, but the hash is dropped by `<Navigate>`.

No catch-all / 404 route. `Error.tsx` exists but isn't wired up.

## Design system

Ad-hoc. No design tokens. Recurring values appear inconsistently across CSS files:

- **Background:** `#292929`
- **Text:** `white`, `#8f8f8f` (muted), `#b3b3b3` / `#c7c7c7` (hover)
- **Accent orange** (name highlight): `#ffbd59`
- **Accent cyan** (tagline highlight, navbar glow): `#5ce1e6`
- **MUI primary** (`ButtonTheme.tsx`): `#0971f1` — a different blue from the cyan, inconsistent
- **Font:** Roboto (loaded from Google Fonts in `index.html`)
- **Breakpoints** are inlined per CSS file and not consistent across components: Navbar 1000px, Home 1100px / 502px, About 880px / 410px, Portfolio 681px.

## Cards with Friends content

The flagship portfolio entry. Live site: http://www.cardswithfriendsgame.com (linked from Home and Portfolio).

- **Writeups (high-value, currently unrendered):**
  - `src/views/Projects/v1.md` — MVP, single-device gameplay, pseudocode, data structures
  - `src/views/Projects/v2.md` — Multi-device version, Node/Express/Socket.io/TS/EC2/PM2, architecture decisions
- **Mockup images:** `src/assets/Project/V1/`, `V2/`, `V3/` (PNGs only)
- **Logo:** `src/assets/CWFLogo.tsx` (inline SVG)
- **⚠ Videos:** The markdown writeups contain *commented-out* video embed placeholders (e.g. `Create-Game-Phase.mp4`) but **no actual video files exist in this repo**. Either the videos live elsewhere or they were planned but never produced.

The deep-dive lives at `/projects`. The three version sections (`Version1.tsx`, `Version2.tsx`, `Version3.tsx`) are rendered inline on that single page; the markdown writeups (`v1.md`, `v2.md`, `v3.md`) sit unused on disk and remain candidates for future restructure.

## Home page "Explore" section

The Home page surfaces its three destinations via a `<ProjectsSection/>` rendered below the hero (anchor `id="projects"`, kept for inbound links; the visible header reads "Explore"). Each is a `<ProjectCard/>`:

| Card | Link | CTA |
|------|------|-----|
| Cards with Friends | `href="/projects"` | Deep dive → |
| The Library | `href="/library"` | Browse the shelf → |
| Résumé | `externalHref={AndyPrattResume.pdf}` (new tab) | Open the résumé → |

`ProjectCard` states:

- **Live** — clickable (`Link` for `href`, `<a target="_blank">` for `externalHref`), with a CTA that defaults to "Deep dive" and is overridable via `cta`.
- **Coming soon** — no `href`/`externalHref`; title displays `(Coming soon)`, card is muted, no CTA, not wrapped in a link. No cards currently use this state.

The Game Set Book and AI Assistant coming-soon cards were removed in 2026-08 — the site highlights one project deeply rather than teasing unbuilt ones.

## The Library (`/library`)

Reading history: a wooden bookcase of clickable spines, a paper catalog card for the selected book, and a full ranking sorted by score.

- **Data:** `src/data/books.ts` — the only file to edit when adding a book. Shelf order is array order; the ranking sorts by `rating` on its own. Spine color, height, and width are assigned automatically from the index. A book with no `take` still shelves and ranks; its card says the write-up isn't done yet.
- **View:** `src/views/Library.tsx`. Six books per shelf. Spine selection is a single piece of local state (`selected`), which the shelf, the card, and the ranking all read from.
- **Browsing model** — the page is meant to feel like handling books, so nothing jumps:
  - Click a spine to pull it (gold edge, lifted out of the shelf); click it again, press Esc, hit "Reshelve", or click anywhere outside the shelf/card/ranking to put it back. Esc and "Reshelve" return focus to the spine.
  - `←` / `→` arrow keys and the card's arrow buttons walk the shelf in place. They stop at the ends rather than wrapping.
  - The page scrolls **only** when the card is entirely off-screen — so the desktop layout never scrolls while browsing, and jumps from the ranking still land on the card.
- **Layout — two modes, split at 900px** (`COMPACT_QUERY` in `Library.tsx` must stay in sync with the media queries in `Library.css`):
  - **≥900px — pinned column.** `.library-browse` is a two-column grid; the bookcase sizes to its own content (`width: fit-content`) in an `auto` track and the card column pins beside it with `position: sticky`. A dashed resting panel holds the card slot open so the grid doesn't reflow on the first click. ⚠ First pass: the case is a tall narrow column and hasn't been tuned for wide viewports.
  - **<900px — modal bottom sheet.** The card goes `position: fixed` over the shelf (z-index 1100, above the 1000 navbar) with a scrim and a grab handle. Body scroll is locked while it's up, focus moves into the sheet, Tab is trapped, and the scrim closes it. Nothing scrolls the page.
- **Fixed card height / static controls.** The card is a flex column in both modes: `.library-card-head` is a fixed-size item and `.library-card-body` (identity + stamp + take) is the scroll container, so the arrows and Reshelve never move. The sheet takes an explicit `height: var(--lib-sheet-height)` (78dvh — roughly three quarters of the screen, leaving the shelf visible above it — with a 78vh fallback) rather than a max-height: a content-sized sheet is anchored to the bottom of the screen, so its top edge and controls shifted every time you stepped to a book with a different-length take. Longer takes (the longest is The Fountainhead at ~630 chars) scroll inside the body; a bottom fade signals the overflow. On desktop the same mechanism caps a pinned card at `100vh - nav clearance` so a long take can't be clipped below the fold.
  - The card is one component in one place in the DOM; `isOverlay` only swaps a class and adds the scrim/handle plus dialog semantics. `--lib-card-pad-x` exists so the sticky sheet head can bleed to the card's gutter at either breakpoint.
- **Shelf clearance.** `.library-books` reserves ~96px above the spines so a hover tip has room, because `overflow-x: auto` on the case forces `overflow-y: auto` and clips anything taller. That reserve is only needed at widths where the case actually scrolls, so from 721px up the case switches to `overflow: visible` (it's ~350px wide, far narrower than the viewport) and the clearance drops to 32px — the tip escapes the case instead. Below 721px tips are hidden entirely and the clearance is 26px.
- **Styles:** `src/styles/Library.css`. Library texture (wood planks, gilded spine bands, cream ruled card, wax-stamp score) sits on the site palette — `#292929` ground, `#ffbd59` gold, `#5ce1e6` cyan focus rings, Roboto only. Component-scoped CSS variables are declared on `.library-container`. Spine dimensions come from JS as `--spine-h` / `--spine-w` custom properties so CSS can shrink the whole case with one `--spine-scale` factor (0.74 below 720px); hover tips are hidden on touch.
- Originated as a standalone HTML mock (`andy-library.html`, since deleted) reworked into the site theme.

## Known code-level issues

- **Dead code:** `Resume.tsx`, `Error.tsx`, and the `VIEWS` enum in `constants/views.tsx` are unused.
- **Missing 404 route.**
- **Accessibility gaps:** images lack descriptive `alt` text; mobile menu toggle in `Navbar.tsx` has no ARIA labels.
- **Two competing blues** (`#5ce1e6` cyan vs `#0971f1` MUI primary).
- **Inline style** in `Footer.tsx` (`style={{margin: 10}}`) should be a CSS class.
- **Breakpoints scattered** across CSS files with inconsistent values.
- **No code splitting** or lazy loading.
- **All pages mount Navbar + Footer directly** rather than via a layout component.

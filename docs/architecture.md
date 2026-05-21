# Architecture

Code-level inventory of the portfolio app. For "why this exists" see `north-star.md`. For hosting and deploys see `infrastructure.md`. For local development see `development.md`.

## Tech stack

| Area | Tool | Version | Notes |
|------|------|---------|-------|
| React | react / react-dom | 17.0.2 | Outdated — current is 18.x |
| TypeScript | typescript | 4.6.2 | Outdated — current is 5.x |
| Build | react-scripts (CRA) | 5.0.0 | CRA is deprecated by the React team; consider Vite migration |
| Routing | react-router-dom | 6.4.3 | |
| UI | @mui/material, @mui/icons-material | 5.5.x | Used mainly for icons + button theme |
| Styling | Emotion + plain CSS | 11.8.x | Per-component `.css` files in `src/styles/` |
| Testing | @testing-library/react | 12.1.4 | No test files currently exist |

`tsconfig.json` has `strict: true`.

## Directory map

```
andyprattdev/
├── public/
│   ├── index.html                     # Loads Roboto from Google Fonts
│   ├── APDevFaviconColorized.png
│   ├── manifest.json                  # PWA placeholder (default CRA)
│   └── robots.txt
├── src/
│   ├── index.tsx                      # Entry point
│   ├── Routes.tsx                     # All routes defined here (BrowserRouter)
│   ├── global.d.ts                    # Module declarations for .pdf / .jpg
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
│   │   ├── Navbar.tsx                 # DesktopNavbar + MobileNavbar (breakpoint 1000px)
│   │   └── Footer.tsx                 # Email / GitHub / LinkedIn icons + "looking for SWE opportunities" copy
│   ├── views/                         # Page-level components
│   │   ├── Home.tsx                   # Hero w/ name, tagline, 4 CTAs (Portfolio, Resume, About, Play Card Game)
│   │   ├── About.tsx                  # Two-column essay + profile pic
│   │   ├── Portfolio.tsx              # Cards with Friends hub — title, link to live game, 3 version cards
│   │   ├── Project.tsx                # Currently a placeholder for all 3 project detail routes
│   │   ├── Resume.tsx                 # ⚠ NOT routed — dead code
│   │   ├── Error.tsx                  # Error boundary view (also not currently routed)
│   │   └── Projects/
│   │       ├── v1.md                  # ★ MVP writeup (142 lines) — NOT RENDERED IN UI
│   │       └── v2.md                  # ★ Multi-device writeup (281 lines) — NOT RENDERED IN UI
│   ├── styles/
│   │   ├── App.css                    # Global: #292929 bg, white text, Roboto
│   │   ├── Navbar.css, Home.css, About.css, Portfolio.css, Project.css, Footer.css
│   │   └── ButtonTheme.tsx            # MUI theme augmentation (primary/neutral/danger)
│   └── constants/
│       └── views.tsx                  # VIEWS enum — defined but unused
├── package.json
├── tsconfig.json
└── README.md                          # Only contains deploy instructions
```

## Routes (`src/Routes.tsx`)

| Path | Component |
|------|-----------|
| `/` | Home |
| `/about` | About |
| `/portfolio` | Portfolio |
| `/portfolio/project-v1` | Project (placeholder) |
| `/portfolio/project-v2` | Project (placeholder) |
| `/portfolio/project-v3` | Project (placeholder) |

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

The project detail pages (`/portfolio/project-v1`, `v2`, `v3`) all currently render the same `Project.tsx` "under construction" placeholder — the writeups sit unused on disk.

## Known code-level issues

- **Dead code:** `Resume.tsx`, `Error.tsx`, and the `VIEWS` enum in `constants/views.tsx` are unused.
- **Missing 404 route.**
- **Accessibility gaps:** images lack descriptive `alt` text; mobile menu toggle in `Navbar.tsx` has no ARIA labels.
- **Two competing blues** (`#5ce1e6` cyan vs `#0971f1` MUI primary).
- **Inline style** in `Footer.tsx` (`style={{margin: 10}}`) should be a CSS class.
- **Breakpoints scattered** across CSS files with inconsistent values.
- **No code splitting** or lazy loading.
- **All pages mount Navbar + Footer directly** rather than via a layout component.

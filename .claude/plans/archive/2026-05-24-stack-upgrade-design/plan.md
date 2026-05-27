**board**: Dependency + build-tool upgrade plan

# Dependency + Build-Tool Upgrade — Design Doc

## Overview

Decide the upgrade path for the portfolio's frontend stack before any new UI work lands on top of it. **Output of this plan is a design doc only — no application code changes.** The doc spawns concrete migration cards on the board.

**Working recommendation** (to be ratified or revised by writing this doc):

- **Build tool**: CRA (`react-scripts` 5.0.0) → **Vite** + `@vitejs/plugin-react`
- **React**: 17.0.2 → **18** (stable, broad ecosystem compat; defer 19 until a feature wants it)
- **TypeScript**: 4.6.2 → **5.x**
- **MUI**: 5.5.x → **7** (surface is tiny — icons + `ButtonTheme.tsx`)
- **React Router**: 6.4.3 → **7** (mostly a rename)
- **Execution**: one focused branch, not phased

Rationale: CRA is officially deprecated; phasing React separately from CRA does the same work twice. Two existing board cards (`browserslist caniuse-lite`, `fs.F_OK deprecation`) auto-resolve when CRA leaves. App is small (~15 components, no tests, no SSR, static S3 hosting), so a single-branch migration is lower total risk than incremental.

## Phase 1: Audit current stack

- [x] Catalog every CRA-specific touchpoint
  - [x] `public/index.html` template variables (`%PUBLIC_URL%`, etc.) — 3 uses (favicon, apple-touch-icon, manifest) + comment block; must strip for Vite
  - [x] Any `process.env.REACT_APP_*` usage in `src/` — **none**
  - [x] Asset imports that rely on CRA loaders (PDF, images, markdown) — `.jpg`/`.pdf` imports in About/AboutSection/Navbar/Resume; Vite handles natively. No `.md` imports (v1/v2/v3.md sit unused on disk)
  - [x] `react-scripts` scripts referenced in `package.json` and `npm run deploy` — start/build/test/eject + deploy wraps `npm run build`
- [x] Inventory React 17 → 18 breaking surface
  - [x] `ReactDOM.render` → `createRoot` in `src/index.tsx` — confirmed, single call to convert
  - [x] StrictMode double-invoke implications — effects only in `Sidebar.tsx` + `Navbar.tsx` (scroll/click listeners with cleanup); dev-only double-invoke, low risk
  - [x] Any reliance on automatic batching differences — none found
- [x] Inventory MUI 5 → 7 breaking surface
  - [x] `ButtonTheme.tsx` theme augmentation syntax — module augmentation for Theme/Palette/PaletteColor/ThemeOptions; verify against MUI 7 (primary breakage candidate)
  - [x] Icon imports (`@mui/icons-material`) — plain default imports (Menu, CloseRounded, GitHub, LinkedIn, Email, MenuOpenOutlined); path-stable
  - [x] Any deprecated `sx` / `styled` patterns — none; theme consumed only via `buttonTheme`
- [x] Inventory React Router 6 → 7 breaking surface
  - [x] Confirm all routes in `src/Routes.tsx` use v6 data-router-compatible APIs — uses Routes/Route/Navigate + BrowserRouter; v7-compatible
  - [x] Check `react-router-hash-link` v7 compatibility — **open risk**: peer dep may lag RR7; verify or replace with a small scroll helper
- [x] Confirm TypeScript 4.6 → 5 has no blockers — none; `target: es5` is the only thing worth modernizing (Vite default es2020)

## Phase 2: Ratify decisions

- [x] Confirm React target: **18** ✅ (stable, broad compat; defer 19)
- [x] Confirm MUI target: **7** ✅ (cheap bump; keep icons + button theme)
- [x] Confirm Vite vs alternatives — **Vite** ✅
- [x] Confirm output directory: **keep `build/`** ✅ via Vite `build.outDir: 'build'` — `npm run deploy` stays untouched
- [x] Confirm scope exclusions — no test framework, no MUI removal, no design tokens, no code splitting in this branch ✅
- [x] Confirm React Router: **bump to 7** ✅, verify `react-router-hash-link` under RR7 and replace with a small scroll helper only if broken

## Phase 3: Write the design doc

- [x] Author `docs/plans/stack-upgrade.md` capturing:
  - [x] Decision and rationale per dependency
  - [x] Touchpoint audit results from Phase 1
  - [x] Migration order within the single branch
  - [x] Smoke-test checklist (every route, every interactive element)
  - [x] Rollback story (branch is revertible; deploy is single S3 sync)
- [x] Link the design doc from `docs/architecture.md` "Tech stack" table

## Phase 4: Spawn execution cards

Once the design doc is ratified, create board cards for the actual work and mark this design-doc card done.

- [x] `Migrate CRA → Vite` (M) — ready; owns build-tool swap, `index.html` relocation, `build.outDir`
- [x] `Bump React 17 → 18 + TS 4.6 → 5` (S) — blocked on the Vite branch
- [x] `Bump MUI 5 → 7` (S) — blocked on the Vite branch; theme + button + icon verification
- [x] `Bump React Router 6 → 7` (XS→S) — blocked on the Vite branch; rename + HashLink verification
- [x] ~~Delete~~ → annotated `Update browserslist caniuse-lite data` as SUPERSEDED; delete when CRA→Vite lands (not now — warning still present until then)
- [x] ~~Delete~~ → annotated `Clear Node fs.F_OK deprecation warning during build` as SUPERSEDED; delete when CRA→Vite lands

## Notes

- **No application code changes in this plan.** Anything that edits `src/` belongs to the Phase 4 cards.
- **No CI to satisfy** — verification is manual: `npm start`, `npm run build`, smoke-test every route, `npm run deploy` to S3.
- **Risk concentration**: MUI 7 theme augmentation in `ButtonTheme.tsx` is the single most likely breakage point given the rest of MUI usage is icons.
- **Out of scope** for this plan: adopting a test framework (Vitest), dropping MUI entirely, design-system tokenization, code splitting. Each is a defensible follow-up card.
- **Deploy script change**: `npm run deploy` currently uploads `build/`. Vite outputs to `dist/` by default — either retarget the script or configure Vite's `build.outDir` to `build/` to keep the script untouched. Decide in Phase 2.

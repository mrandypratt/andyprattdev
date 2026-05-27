<!-- Board card format:
### Card title
- **status**: active | pipeline | ready | blocked | backlog
- **size**: S | M | L | XL
- **priority**: 1 (highest) through 5
- **plan**: YYYY-MM-DD-plan-name (optional)
- **blocker**: description (optional, required for blocked status)
- **notes**: context (optional)
-->

### Update resume PDF

- **status**: blocked
- **size**: S
- **priority**: 2
- **blocker**: waiting on updated resume content from user
- **notes**: File swap at `src/assets/AndyPrattResume.pdf`. Content authoring is the user's task; this card unblocks when the new PDF is ready.

### Add /projects/game-set-book page (tennis scheduling app)

- **status**: ready
- **size**: M
- **priority**: 2
- **notes**: Per-project page for Game Set Book. App is no longer live; writeup content TBD. Card already exists on Home in coming-soon state — work is: write content, add `src/views/Projects/GameSetBook.tsx`, add route `/projects/game-set-book`, flip the home card to live by adding `href`.

### Scope work writeups + extensible showcase structure

- **status**: ready
- **size**: M
- **priority**: 2
- **notes**: Design doc in `docs/plans/`. Defines the per-project page template, IP/NDA rules for talking about employer work, and a roadmap of what to write up first. No code. Output feeds future Work and Showcase cards.

### Break up Cards with Friends deep dive

- **status**: ready
- **size**: L
- **priority**: 3
- **notes**: Deep-dive page now lives at `src/views/Projects/CardsWithFriends.tsx` (route `/projects/cards-with-friends`). Split V1/V2/V3 inside it. Render the existing `src/views/Projects/v1.md`, `v2.md`, `v3.md` writeups (currently dead on disk). Elevate YouTube videos to the top of the page. Trim the verbose intro.

### Rewrite /about around engineering identity

- **status**: active
- **size**: M
- **priority**: 2
- **plan**: 2026-05-22-about-page-iteration
- **notes**: Structural rewrite landed (5-chapter layout, photo grid, new home hero with separate mobile photo). Remaining work tracked as checkboxes in the plan: tone iteration per section + photo recrops (Chicago + PNW first).

### Migrate CRA → Vite

- **status**: ready
- **size**: M
- **priority**: 2
- **notes**: Keystone of the stack upgrade. Decisions in `docs/plans/stack-upgrade.md`. Install `vite` + `@vitejs/plugin-react`; add `vite.config.ts` with `build.outDir: 'build'` (keeps `npm run deploy` untouched); move `index.html` to repo root and strip `%PUBLIC_URL%` (3 tags); rewrite start/build/test scripts; remove `react-scripts`. The three bump cards below land on this same branch. Clears the `fs.F_OK` + `caniuse-lite` warnings.

### Bump React 17 → 18 + TS 4.6 → 5

- **status**: blocked
- **size**: S
- **priority**: 2
- **blocker**: lands on the CRA → Vite branch — start after Vite is in
- **notes**: Convert `src/index.tsx` `ReactDOM.render` → `createRoot`. Bump react/react-dom + @types to 18, typescript to 5, tsconfig `target` es5 → es2020. StrictMode double-invoke is dev-only; effects (Sidebar/Navbar scroll listeners) have cleanup. See `docs/plans/stack-upgrade.md`.

### Bump MUI 5 → 7

- **status**: blocked
- **size**: S
- **priority**: 2
- **blocker**: lands on the CRA → Vite branch
- **notes**: Bump @mui/material + @mui/icons-material 5.5 → 7. Highest-risk item: `src/styles/ButtonTheme.tsx` module augmentation (Theme/Palette/PaletteColor/ThemeOptions) — verify it compiles and the button still themes. Six icon imports are path-stable. See `docs/plans/stack-upgrade.md`.

### Bump React Router 6 → 7

- **status**: blocked
- **size**: S
- **priority**: 2
- **blocker**: lands on the CRA → Vite branch
- **notes**: Bump react-router-dom 6 → 7 (mostly a rename; Routes/Route/Navigate are compatible). Open risk: `react-router-hash-link` peer dep may lag RR7 — verify hash nav in Sidebar/Navbar; if broken, replace with a ~15-line `useScrollToHash` helper (decide with evidence). See `docs/plans/stack-upgrade.md`.

### Update browserslist caniuse-lite data

- **status**: ready
- **size**: S
- **priority**: 4
- **notes**: SUPERSEDED by `Migrate CRA → Vite` — auto-resolves when CRA leaves. Delete this card when that migration lands; do not work in isolation. (Original: `npm run build` emits `Browserslist: caniuse-lite is outdated`.)

### Clear Node fs.F_OK deprecation warning during build

- **status**: backlog
- **size**: S
- **priority**: 5
- **notes**: SUPERSEDED by `Migrate CRA → Vite` — `DEP0176: fs.F_OK is deprecated` originates in `react-scripts` and disappears when CRA leaves. Delete this card when that migration lands; don't fix in isolation.


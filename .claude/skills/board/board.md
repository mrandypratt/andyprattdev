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

### Dependency + build-tool upgrade plan

- **status**: ready
- **size**: M
- **priority**: 2
- **notes**: Design doc weighing incremental upgrades (React 17→18, TS 4.6→5, MUI 5.5→latest) vs. Vite migration (CRA is deprecated). Output: choose a path, then card the actual work. Should land before big new UI work on top of the stack.

### Update browserslist caniuse-lite data

- **status**: ready
- **size**: S
- **priority**: 4
- **notes**: Build log emits `Browserslist: caniuse-lite is outdated` on every `npm run build`. Fix: `npx browserslist@latest --update-db`, verify build is clean, commit the updated `package-lock.json`. Cosmetic only — no functional impact, no user-facing change.

### Clear Node fs.F_OK deprecation warning during build

- **status**: backlog
- **size**: S
- **priority**: 5
- **notes**: `npm run build` prints `DEP0176: fs.F_OK is deprecated` from inside `react-scripts`. Originates in CRA, not our code — will resolve naturally as part of the Dependency + build-tool upgrade plan (CRA→Vite or upgrading the toolchain). Tracked here so it doesn't get lost if the upgrade slips. Don't fix in isolation.


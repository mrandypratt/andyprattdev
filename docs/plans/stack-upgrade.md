# Stack Upgrade — Design Doc

Decision record for modernizing the portfolio's frontend toolchain. This doc fixes the *what* and *why*; the actual code changes are tracked as separate board cards (see "Execution cards" below). Companion to `architecture.md`.

**Status:** Decided (2026-05-26). Ready to execute.

## Problem

The stack is a full major version behind across the board, and the build tool is deprecated:

| Area | Current | Issue |
|------|---------|-------|
| Build | `react-scripts` (CRA) 5.0.0 | **Deprecated by the React team.** Emits `fs.F_OK` (DEP0176) and stale `caniuse-lite` warnings on every build. |
| React | 17.0.2 | A major behind 18; ecosystem increasingly assumes 18+. |
| TypeScript | 4.6.2 | Several majors behind 5.x. |
| MUI | 5.5.x | A major+ behind 7. |
| React Router | 6.4.3 | A major behind 7. |

Leaving this in place taxes every future UI change. The goal is to clear it once, on one branch, before new feature work lands on top of the stack.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Build tool | **Vite** + `@vitejs/plugin-react` | CRA is dead; Vite is the de-facto SPA standard, faster dev/build, clean config. |
| React | **18** | Stable, maximum ecosystem compatibility. No 19-only feature is needed today; defer 19 until one is. |
| TypeScript | **5.x** | No blockers found in the audit; code is straightforward. |
| MUI | **7** | Surface is tiny (icons + one theme). Cheap to bump; keeps the existing button theme. |
| React Router | **7** | Mostly a rename from v6. Bump while we're here. |
| Output dir | **Keep `build/`** | Set Vite `build.outDir: 'build'` so `npm run deploy` is untouched. |
| Execution | **One branch, not phased** | App is ~15 components with no tests; phasing React separately from CRA would do the same work twice. |

### Explicitly out of scope (each a defensible follow-up, not this branch)

- Adopting a test framework (Vitest).
- Dropping MUI entirely (inline the 6 icons + CSS button).
- Design-system tokenization / fixing the two competing blues.
- Code splitting / lazy loading.
- React 19.

## Audit results (Phase 1 findings)

Captured from the live codebase on the `stack-upgrade-design` branch. Baseline `npm run build` + `npm start` both verified working before any changes.

### CRA touchpoints
- **`public/index.html`** uses `%PUBLIC_URL%` in 3 tags (favicon, apple-touch-icon, manifest) plus a comment block. Vite uses root-relative paths or `import.meta.env.BASE_URL`; strip these. The `index.html` also moves from `public/` to the project root under Vite.
- **No `process.env.REACT_APP_*` usage** anywhere in `src/`. Nothing to port.
- **Asset imports** — `.jpg` and `.pdf` are imported as modules in `About.tsx`, `AboutSection.tsx`, `Navbar.tsx`, `Resume.tsx`. Vite handles these natively. `global.d.ts` declares `*.pdf` and `*.jpg`; keep it (Vite's `vite/client` types also cover these).
- **No `.md` imports.** `v1.md` / `v2.md` / `v3.md` sit unused on disk — irrelevant to the build.
- **Scripts** — `start` / `build` / `test` / `eject` all call `react-scripts`; `deploy` wraps `npm run build`. The first three get rewritten to Vite; `deploy` is untouched given the `build/` outDir decision.

### React 17 → 18
- **`src/index.tsx`** uses `ReactDOM.render(...)` — single call to convert to `createRoot(...).render(...)`.
- **StrictMode** is on. Effects exist only in `Sidebar.tsx` (scroll listener) and `Navbar.tsx` (scroll/click listeners), all with cleanup. Dev-only double-invoke; low risk.
- No reliance on pre-18 batching behavior.

### MUI 5 → 7
- **`ButtonTheme.tsx`** does module augmentation for `Theme` / `Palette` / `PaletteColor` / `ThemeOptions` and builds `buttonTheme` via `createTheme`. **This is the single highest-risk item** — verify the augmentation shape against MUI 7.
- **Icons** — six plain default imports (`Menu`, `CloseRounded`, `GitHub`, `LinkedIn`, `Email`, `MenuOpenOutlined`). Path-stable across the bump.
- **No `sx` / `styled` usage** to migrate.

### React Router 6 → 7
- **`Routes.tsx`** uses `Routes` / `Route` / `Navigate` with `BrowserRouter` in `index.tsx` — all v7-compatible.
- **`react-router-hash-link`** (used heavily in `Sidebar.tsx`, plus `Navbar.tsx`) is the **open risk**: its peer dependency may not declare RR7. Plan: install RR7 + the lib, smoke-test hash nav; if broken, replace with a ~15-line `useScrollToHash` helper.
- `useRouteError` appears only in the dead `Error.tsx` — irrelevant.

### TypeScript 4.6 → 5
- No blockers. `target: es5` is the only thing worth modernizing (Vite defaults to `es2020`). Existing `strict: true`, `jsx: react-jsx`, `module: esnext` all carry over.

## Migration order (within the single branch)

1. **Add Vite, remove CRA.** Install `vite` + `@vitejs/plugin-react`; add `vite.config.ts` with `build.outDir: 'build'`; move `index.html` to root and strip `%PUBLIC_URL%`; rewrite `start` / `build` / `test` scripts; remove `react-scripts`.
2. **Bump React 17 → 18 + types;** convert `index.tsx` to `createRoot`.
3. **Bump TypeScript 4.6 → 5;** bump `target` to `es2020`; typecheck.
4. **Bump MUI 5 → 7;** verify `ButtonTheme.tsx` augmentation compiles and the button still themes.
5. **Bump React Router 6 → 7;** verify `react-router-hash-link`, replace with helper only if broken.
6. **Verify** (see checklist), then deploy.

## Smoke-test checklist (manual — no CI)

Run `npm start`, then walk every route and interaction:

- [ ] `/` — hero renders; both CTAs (Resume, My story) work; ProjectsSection visible at `#projects`.
- [ ] Navbar — desktop + mobile (toggle below 1000px); PROJECTS HashLink scrolls to `#projects`; Resume PDF opens.
- [ ] `/about` — photo grid loads all images; layout holds at mobile breakpoints.
- [ ] `/projects/cards-with-friends` — page renders; Sidebar HashLinks scroll to each version section with correct offset.
- [ ] `/portfolio` — still redirects to `/projects/cards-with-friends`.
- [ ] Footer — email / GitHub / LinkedIn links resolve.
- [ ] `npm run build` — compiles clean; **`fs.F_OK` and `caniuse-lite` warnings gone**; output lands in `build/`.
- [ ] `serve -s build` (or equivalent) — production bundle loads and routes work.

## Rollback

Low-stakes by construction:
- All work is on the `stack-upgrade-design` branch (or its execution siblings) — revert is a branch discard.
- Deploy is a single `aws s3 sync build/ ... --delete` + CloudFront invalidation. Re-running `npm run deploy` from `main` fully restores the previous site.
- No database, no backend, no stateful migration.

## Execution cards (Phase 4 output)

These are carded separately on the board once this doc is ratified:

- **Migrate CRA → Vite** (M) — build-tool swap, `index.html` relocation, script rewrite, `build.outDir`.
- **Bump React 17 → 18 + TS 4.6 → 5** (S) — folded into the Vite branch or a sibling commit.
- **Bump MUI 5 → 7** (S) — theme + button + icon verification.
- **Bump React Router 6 → 7** (XS) — rename pass + HashLink verification.

Two existing cards — *Update browserslist caniuse-lite data* and *Clear Node fs.F_OK deprecation warning during build* — **auto-resolve** when CRA leaves and should be deleted, not worked.

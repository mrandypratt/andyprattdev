**board**: Add projects section to home; move CWF to deep-dive page

# Add Projects Section to Home; Move CWF to Deep-Dive Page

## Overview

Replace the standalone `/portfolio` page with a Projects section on the home page that previews three projects: Cards with Friends (live), Game Set Book (coming soon), and an AI Assistant (coming soon). The Cards with Friends content moves as-is to a new deep-dive route `/projects/cards-with-friends`. Coming-soon cards display `(Coming soon)` inline beside the title and are not clickable. The old `/portfolio` route redirects to the new deep-dive URL via client-side `<Navigate>`. A dedicated `/projects` index page is deliberately deferred until the portfolio has enough live projects to justify it.

## Phase 1: Routing and content move

- [x] Create `src/views/Projects/CardsWithFriends.tsx` with the current `src/views/Portfolio.tsx` content (content unchanged — relocation only; fix any relative import paths)
- [x] Add route `<Route path="/projects/cards-with-friends" element={<CardsWithFriends/>} />` in `src/Routes.tsx`
- [x] Replace the `/portfolio` route element with `<Navigate to="/projects/cards-with-friends" replace />` to preserve inbound links
- [x] Delete `src/views/Portfolio.tsx` and remove its import from `src/Routes.tsx`
- [x] Update `src/components/Sidebar.tsx` hash links from `/portfolio/#...` to `/projects/cards-with-friends/#...`
- [x] Verify `/projects/cards-with-friends` and `/portfolio` both render the deep-dive

## Phase 2: ProjectCard component (reusable template)

- [x] Create `src/components/ProjectCard.tsx` with props: `title`, `oneLiner`, `summary?`, `techChips?`, `logo?`, `href?` — when `href` is omitted, the card renders in coming-soon state
- [x] Render two visual states:
  - **Live** — clickable card; "Deep dive →" CTA linking to `href`; hover lift
  - **Coming soon** — `(Coming soon)` suffix on title in muted color; no CTA; no hover; `cursor: default`; not wrapped in a link
- [x] Create `src/styles/Projects.css` reusing the existing palette (`#292929` surface, orange/blue accents)
- [x] Layout: full-width single column; cards stack vertically across viewports

## Phase 3: Projects section on home

- [x] Create `src/components/ProjectsSection.tsx` containing:
  - Section heading "Projects"
  - Wrapper `id="projects"` anchor
  - Three `<ProjectCard>` instances in order:
    1. **Cards with Friends** — live; `href="/projects/cards-with-friends"`; `<CWFLogo/>` logo; tech chips `React`, `Node.js`, `Socket.io`, `AWS`
    2. **Game Set Book** — coming soon; one-liner: tennis scheduling app for coordinating group play
    3. **AI Assistant** — coming soon; one-liner exploring AI-enabled workflows and tooling
- [x] Render `<ProjectsSection/>` inside `src/views/Home.tsx`, below the hero/CTA block and above `<Footer/>`
- [x] Update `src/styles/Home.css` grid to add a `projects` row and switch from `height: 100vh` to `min-height: 100vh` so the page scrolls past the hero

## Phase 4: Navigation updates

- [x] In `src/components/Navbar.tsx` (DesktopNavbar):
  - Label: `PORTFOLIO` → `PROJECTS`
  - Link: `to="/portfolio"` → `HashLink to="/#projects"` with smooth scroll
- [x] In `src/components/Navbar.tsx` (MobileNavbar):
  - Label: `PORTFOLIO` → `PROJECTS`
  - Link: `to="/portfolio"` → `HashLink to="/#projects"` with smooth scroll
- [x] **Deviation from original plan:** removed the "Projects" CTA button from the Home hero entirely (the section sits directly below the hero, so scrolling to a visible section was redundant). Home now has two CTAs: `Resume` and `About Me`.
- [x] Verify scroll-to-anchor behaves correctly from `/` and from other routes (`/about` → click PROJECTS → lands on `/` scrolled to section)

## Phase 5: Test and verify locally

- [x] `npm start` and walk through:
  - [x] Home renders hero, CTAs (Resume + About Me), and Projects section below
  - [x] CWF card is clickable → routes to `/projects/cards-with-friends` showing the full deep-dive
  - [x] Game Set Book and AI Assistant cards display `(Coming soon)` and do not respond to clicks (no hover lift, no cursor change to pointer)
  - [x] Navbar `PROJECTS` scrolls to section from `/`
  - [x] Navbar `PROJECTS` from `/about` navigates to `/` and scrolls to section
  - [x] `/portfolio` still resolves (redirects to deep-dive)
  - [x] Mobile viewport: section and cards stack cleanly
- [x] No console errors and no TypeScript warnings
- [x] User reviewed and approved (Projects CTA removal was user-requested)

## Phase 6: Deploy (only when user approves)

- [ ] `aws sts get-caller-identity --query Account --output text` returns `730586623447`
- [ ] `npm run deploy` (build + S3 sync + CloudFront invalidation)
- [ ] Verify on `https://andyprattdev.com`

## Notes

- This plan deliberately defers a dedicated `/projects` index page. Revisit when four or more live projects exist. YAGNI for now.
- `/portfolio` redirect is client-side via `<Navigate replace>`. If SEO continuity matters more, swap for a CloudFront function or S3 redirect rule in a follow-up.
- The coming-soon ProjectCard state is the durable template. When Game Set Book or AI Assistant ships, the home card just gains an `href` and a new `src/views/Projects/<Slug>.tsx` plus a route is added — no card refactor.
- AI Assistant card copy: placeholder text used (`A personal AI assistant exploring AI-enabled workflows and tooling.`). User can swap copy at any time before live launch.

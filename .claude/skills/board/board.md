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

- **status**: ready
- **size**: M
- **priority**: 2
- **notes**: Replace the three-paragraph essay (`src/views/About.tsx`) with north-star-aligned content: how I work, what I'm exploring with AI, values. Restyle layout. Personal/hobbies become a small aside, not a section header.

### New headshot for About + Home

- **status**: blocked
- **size**: S
- **priority**: 3
- **blocker**: waiting on user-sourced headshot photo
- **notes**: Swap is trivial once the file exists. Replaces `src/assets/Profile.jpg`.

### Restyle Home hero + section headers to match Project Card pattern

- **status**: ready
- **size**: M
- **priority**: 1
- **plan**: 2026-05-22-restyle-home-hero-as-about-card
- **notes**: Plan extracts a new `AboutSection.tsx` (parallel to `ProjectsSection.tsx`), reuses `.project-card` / `.project-card-live` / `.project-card-cta` classes directly for the About card (no `<ProjectCard>` change needed), adds a small `.about-card-*` ruleset for hero typography, and deletes the dead hero CSS in `Home.css`. Resume already lives only in `Navbar.tsx` — no nav change. Reference screenshot attached to the originating board request.

### Dependency + build-tool upgrade plan

- **status**: ready
- **size**: M
- **priority**: 2
- **notes**: Design doc weighing incremental upgrades (React 17→18, TS 4.6→5, MUI 5.5→latest) vs. Vite migration (CRA is deprecated). Output: choose a path, then card the actual work. Should land before big new UI work on top of the stack.


**board**: Restyle Home hero + section headers to match Project Card pattern

# Restyle Home Hero as About Card

## Overview

Rework `src/views/Home.tsx` so the Home page reads as two symmetric sections — **About Me** and **Projects** — each with a centered section header in the existing `projects-section-header` style, each containing one or more Project-Card-styled cards with a "Deep dive →" link to the section's detail route.

The current hero (`<h1>Hello! My name is</h1>`, oversized `Andy Pratt.`, two big buttons) is replaced by a single About card that lives inside an "About Me" section, sits above the Projects section, and clicks through to `/about`. The Resume button is removed from the Home body — Resume already exists as a top-nav menu item in both `DesktopNavbar` and `MobileNavbar` and stays there unchanged.

## Inventory of files touched

| File | Change |
|---|---|
| `src/components/AboutSection.tsx` | **Create.** New component, parallel to `ProjectsSection.tsx`. Renders one `<section>` with the "About Me" header and the About card. |
| `src/views/Home.tsx` | **Modify.** Drop the hero block (`<h1>`, `<h2 className="orange-pop">`, `<p className="home-paragraph">`, `<div className="home-button-container">`). Drop the `resume` import. Render `<AboutSection/>` above `<ProjectsSection/>`. |
| `src/styles/Home.css` | **Modify.** Update the grid (`grid-template-areas` / `grid-template-rows`) to drop the dedicated `content` track now that hero is gone, replacing it with an `about` track. Delete dead rules: `.home-content-container`, `.home-greeting`, `.home-paragraph`, `.home-paragraph-container`, `.home-button-container`, `.home-button`, `.orange-pop`, `.blue-pop`, `.blue-split-text`, plus their breakpoint overrides. (Grep confirmed: none of these classes are referenced outside `Home.tsx`.) |
| `src/styles/Projects.css` | **Modify.** Add a small `.about-card-*` ruleset (greeting / name / role / tail / blue-span) so the About card's interior typography matches the screenshot. Reuses `.project-card`, `.project-card-live`, `.project-card-link`, `.project-card-cta` outer classes unchanged. |
| `src/components/Navbar.tsx` | **No change.** Resume already lives only in the navbar (desktop + mobile menu). Verify, do not edit. |

## Component-extraction decision

Three components were candidates for extraction; only one is worth creating:

- **`SectionHeader`** — *Not extracted.* Only two call sites (`AboutSection`, `ProjectsSection`) and a one-line `<h2 className="projects-section-header">`. Extracting would add indirection without saving lines. Both call sites reuse the existing `.projects-section-header` class directly. (If a third section appears, revisit.)
- **`DeepDiveLink`** — *Not extracted.* The CTA is one div: `<div className="project-card-cta">Deep dive →</div>`. The whole card is the link wrapper (`<Link className="project-card-link">`), not the CTA itself. Two inline copies is fine.
- **`AboutSection`** — *Extracted* as a sibling to `ProjectsSection.tsx`. Keeps `Home.tsx` declarative (`<Navbar/><AboutSection/><ProjectsSection/><Footer/>`) and matches the existing pattern.

The About card's interior is rendered **inline inside `AboutSection`**, *not* through `<ProjectCard>`. Reason: the hero copy needs four discrete colored spans (gray greeting / orange name / white-and-teal role line / gray tail). `ProjectCard` accepts plain strings for `title`/`oneLiner`. Forcing it to accept `ReactNode` would generalize a component for a single edge case (YAGNI). Instead the About card reuses the `.project-card` / `.project-card-live` / `.project-card-link` / `.project-card-cta` CSS classes directly so the outer shell, hover, and CTA styling are pixel-identical to a real project card — only the inner text layout differs.

## Target JSX (Home.tsx, AboutSection.tsx)

```tsx
// src/views/Home.tsx
import { AboutSection } from "../components/AboutSection";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { ProjectsSection } from "../components/ProjectsSection";
import "../styles/Home.css";

export const Home = () => (
  <div className="home-container">
    <Navbar />
    <AboutSection />
    <ProjectsSection />
    <Footer />
  </div>
);
```

```tsx
// src/components/AboutSection.tsx
import { Link } from "react-router-dom";

export const AboutSection = () => (
  <section id="about-me" className="projects-section">
    <h2 className="projects-section-header">About Me</h2>

    <div className="projects-section-list">
      <Link to="/about" className="project-card-link">
        <div className="project-card project-card-live about-card">
          <p className="about-card-greeting">Hello, my name is</p>
          <h3 className="about-card-name">Andy Pratt.</h3>
          <p className="about-card-role">
            I'm a <span className="about-card-role-accent">Software Engineer</span>
          </p>
          <p className="about-card-tail">
            who loves building products and solving problems.
          </p>
          <div className="project-card-cta">Deep dive &rarr;</div>
        </div>
      </Link>
    </div>
  </section>
);
```

## Target CSS additions (Projects.css)

```css
/* About card — interior typography for the hero copy */
.about-card-greeting { font-size: 1rem; color: #aaa; margin: 0; }
.about-card-name { font-size: 2.5rem; color: #ffbd59; font-weight: 525; margin: 0; }
.about-card-role { font-size: 1.4rem; color: white; margin: 0; font-weight: 500; }
.about-card-role-accent { color: #5ce1e6; font-weight: 600; }
.about-card-tail { font-size: 1rem; color: #aaa; margin: 0; }

@media (max-width: 600px) {
  .about-card-name { font-size: 2rem; }
  .about-card-role { font-size: 1.2rem; }
}
```

Exact font sizes will be tuned in the browser against the screenshot during Phase 4.

## Phase 1: Inventory + alignment (no code)

- [x] Confirm with user that the JSX/CSS sketches above are the intended structure
- [x] Confirm the About card is the ONLY card in the About Me section (no "more about me" mini-cards underneath)

## Phase 2: Build the About section

- [x] Create `src/components/AboutSection.tsx` per the target JSX above
- [x] Add the `.about-card-*` ruleset to `src/styles/Projects.css`
- [x] Render `<AboutSection/>` in `Home.tsx` between `<Navbar/>` and `<ProjectsSection/>`, leaving the old hero JSX in place for now (side-by-side for visual diff)
- [x] `npm start` and visually compare new About card vs. old hero on desktop and mobile

## Phase 3: Remove the old hero

- [x] Delete the old hero block from `Home.tsx` (`home-content-container` and everything inside it)
- [x] Delete the `import resume from "../assets/AndyPrattResume.pdf"` line from `Home.tsx`
- [x] In `Home.css`, update `grid-template-areas` / `grid-template-rows` to replace the `content` track with an `about` track (resolved: switched the container to a simple flex column — grid was only there to position the now-deleted hero)
- [x] Delete dead Home.css rules: `.home-content-container`, `.home-greeting`, `.home-paragraph`, `.home-paragraph-container`, `.home-button-container`, `.home-button`, `.home-button:hover`, `.orange-pop`, `.blue-pop`, `.blue-split-text`, plus their `@media` overrides
- [x] Verify nothing else in `src/` references the deleted classes (`grep -rE 'home-greeting|home-paragraph|home-button|orange-pop|blue-pop|blue-split-text|home-content-container' src/`)

## Phase 4: Browser verification

- [x] On desktop (>=1100px), confirm: "About Me" header and "Projects" header have identical typography, weight, color, and centering — resolved by removing the "About Me" header entirely (the card alone signals intent)
- [x] On desktop, confirm: vertical spacing between sections matches the gap between Projects-section and the existing Footer
- [x] On desktop, confirm: About card hover state matches Cards-with-Friends hover (teal border, slight upward translate, lighter background)
- [x] On desktop, confirm: "Deep dive →" on the About card matches the CWF "Deep dive →" exactly (color, weight, position)
- [x] On desktop, confirm: clicking anywhere on the About card navigates to `/about`
- [x] On medium screens (502–1100px), confirm: card padding and font scaling look right
- [x] On mobile (<=502px), confirm: About card and Projects cards stack cleanly with consistent gutter
- [x] In the top nav (both desktop and mobile menu), confirm: PROJECTS / RESUME / ABOUT all still work; RESUME still opens the PDF
- [x] Confirm Home content area has NO buttons (no Resume button, no About Me button)
- [x] Confirm colors: greeting + tail are gray (#aaa), "Andy Pratt." is orange (#ffbd59), "Software Engineer" is teal (#5ce1e6)
- [x] Fix: Home page lost the 64px top offset for the fixed navbar — added `padding-top: 64px` + `box-sizing: border-box` on `.home-container` to match About/Portfolio layouts
- [x] Fix: project cards bleeding through the mobile drawer — added `z-index: 1000` on `.navbar` (was relying on tree order and getting beaten by sibling content)

## Phase 5: First commit (About card + initial navbar work)

- [x] Commit: `Restyle Home hero as About card; add Projects dropdown to navbar`
- [x] Push branch `restyle-home-hero-as-about-card` to origin

## Phase 6: Scope additions — Navbar redesign

Discovered during Phase 4 review: the existing PROJECTS link wasn't going to do the new home page justice, and the mobile drawer was visibly broken. These changes weren't in the original mapping but were necessary to ship.

### Desktop navbar
- [x] Add HOME link to the far-left of `.nav-button-container` (logo also links to /, but explicit HOME helps discoverability)
- [x] Replace single PROJECTS HashLink with a click-to-toggle dropdown:
  - PROJECTS becomes a `<button>` trigger with a chevron indicator (▾ closed / ▴ open)
  - Dropdown menu renders Cards with Friends (live link), Game Set Book (disabled), AI Assistant (disabled)
  - Click outside or press Escape to close (useEffect + useRef pattern)
  - ARIA: `aria-expanded`, `aria-haspopup="menu"`, `role="menu"`/`role="menuitem"`, `aria-disabled`
- [x] Widen `.nav-button-container` from 300px → 420px to fit 4 items
- [x] Fix pre-existing invalid CSS: `align-self: "right"` (quoted string, no-op) → `align-items: center`
- [x] Reset `<button>` chrome on `.nav-dropdown-trigger` (background/border/padding) without overriding font — so the button text matches `.desktop-nav-button` styling exactly

### Mobile drawer (Option A — left-aligned wide drawer)
After iterating through teal-bar/arrow ornaments and finding them visually noisy, settled on this principled rewrite:
- [x] Widen drawer: 40vw → 80vw (capped at 400px so it doesn't get huge on tablets)
- [x] Left-align all items (dropped `text-align: center` on `.app-bar-menu`)
- [x] Uniform typography: 1rem uppercase with `letter-spacing: 0.05em` for every item
- [x] Hierarchy via weight + indent — parents (HOME, PROJECTS, RESUME, ABOUT) at `font-weight: 600`, `padding: 14px 28px`; children (CARDS WITH FRIENDS, GAME SET BOOK, AI ASSISTANT) at `font-weight: 400`, `padding-left: 56px`
- [x] Group separation: PROJECTS and RESUME get `margin-top: 20px` to create breathing room
- [x] Disabled state via opacity (0.4) only — no separate "(coming soon)" label, no ornament
- [x] Dropped all decorative classes: `.app-bar-menu-subgroup`, `.app-bar-menu-section-label`, `.app-bar-menu-subitem::before` (arrow), `.app-bar-menu-coming` (label)
- [x] Fix close icon styling: `.close-sidebar-icon` was referenced in JSX but had no CSS — added `position: absolute; top: 12px; right: 16px`. Renamed dead `.close-feedback-icon` rule.
- [x] Removed empty `.app-bar-header` div

## Phase 7: Final commit + deploy

- [x] Single commit covering the navbar redesign + plan/board archival (`a4391f1`)
- [x] Push branch + fast-forward main + push main (`a4391f1` on origin/main)
- [x] Verify AWS account (`aws sts get-caller-identity` returned `730586623447`)
- [x] `npm run deploy` — built, synced to S3, CloudFront invalidation `I7UVFYIWWGW0Y81K9A8SOXCA2G` in progress

## Notes

- **Resume in the navbar is unchanged.** `Navbar.tsx` already renders RESUME in both `DesktopNavbar` and `MobileNavbar` — no edit needed.
- **`/about` route is unchanged.** This plan only changes the entry point on Home, not the destination page.
- **Out of scope:** rewriting `/about` page content (separate board card: "Rewrite /about around engineering identity"). The two cards may want to land in the same release for consistency, but they ship independently.
- **Color tokens are duplicated.** `#ffbd59`, `#5ce1e6`, `#aaa` are hardcoded across multiple CSS files. Not refactoring in this plan — would expand scope. Worth a future card to centralize via CSS custom properties.
- **CWF "Deep dive →" color.** In `Projects.css` `.project-card-cta` is `#ffbd59` (orange); the user's reference screenshot shows it teal-ish. Not changing in this plan — the About card inherits whatever the existing rule says so it stays consistent with the CWF card. If the screenshot's teal CTA is the actual desired state, file a separate card.
- **Follow-up option B left open:** if the mobile drawer's PROJECTS sub-items feel too noisy by default, the next iteration would make PROJECTS collapsible with a right-aligned chevron and children hidden until tap.

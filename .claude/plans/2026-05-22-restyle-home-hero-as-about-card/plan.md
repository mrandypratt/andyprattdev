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

- [ ] On desktop (>=1100px), confirm: "About Me" header and "Projects" header have identical typography, weight, color, and centering
- [ ] On desktop, confirm: vertical spacing between sections matches the gap between Projects-section and the existing Footer
- [ ] On desktop, confirm: About card hover state matches Cards-with-Friends hover (teal border, slight upward translate, lighter background)
- [ ] On desktop, confirm: "Deep dive →" on the About card matches the CWF "Deep dive →" exactly (color, weight, position)
- [ ] On desktop, confirm: clicking anywhere on the About card navigates to `/about`
- [ ] On medium screens (502–1100px), confirm: card padding and font scaling look right
- [ ] On mobile (<=502px), confirm: About card and Projects cards stack cleanly with consistent gutter
- [ ] In the top nav (both desktop and mobile menu), confirm: PROJECTS / RESUME / ABOUT all still work; RESUME still opens the PDF
- [ ] Confirm Home content area has NO buttons (no Resume button, no About Me button)
- [ ] Confirm colors: greeting + tail are gray (#aaa), "Andy Pratt." is orange (#ffbd59), "Software Engineer" is teal (#5ce1e6)

## Phase 5: Commit

- [ ] Single commit: `feat(home): restyle hero as About card under "About Me" section header`
- [ ] Push and `npm run deploy` (separate decision — confirm with user before deploying)

## Notes

- **Resume in the navbar is unchanged.** `Navbar.tsx` already renders RESUME in both `DesktopNavbar` and `MobileNavbar` — no edit needed.
- **`/about` route is unchanged.** This plan only changes the entry point on Home, not the destination page.
- **Out of scope:** rewriting `/about` page content (separate board card: "Rewrite /about around engineering identity"). The two cards may want to land in the same release for consistency, but they ship independently.
- **Color tokens are duplicated.** `#ffbd59`, `#5ce1e6`, `#aaa` are hardcoded across multiple CSS files. Not refactoring in this plan — would expand scope. Worth a future card to centralize via CSS custom properties.
- **CWF "Deep dive →" color.** In `Projects.css` `.project-card-cta` is `#ffbd59` (orange); the user's reference screenshot shows it teal-ish. Not changing in this plan — the About card inherits whatever the existing rule says so it stays consistent with the CWF card. If the screenshot's teal CTA is the actual desired state, file a separate card.

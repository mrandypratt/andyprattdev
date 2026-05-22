**board**: Rewrite /about around engineering identity

# About page — tone + photo iteration

## Overview

The structural rewrite of `/about` is in place (intro → "How I got here" → "What pulls me toward software" → "Outside of work" photo grid → "A few other things"). The current prose is boilerplate I drafted from Andy's notes; the next pass is to rewrite each section in Andy's own voice and tighten the photo grid.

This plan exists to **work the page section-by-section** rather than rewriting everything at once. Each checkbox is a small, focused iteration we can pick up independently.

## Files in play

| File | Notes |
|---|---|
| `src/views/About.tsx` | Section copy + photo grid captions live here. |
| `src/styles/About.css` | Layout/colors. Likely untouched by tone work, but available if a section needs structural tweaks. |
| `src/assets/about/*.jpg` | Photo files. Recrops happen here. |

## Section-by-section tone iteration

For each section below: read the current prose in `About.tsx`, rewrite in Andy's voice, replace. Keep section structure (heading + body) consistent unless we decide otherwise.

- [x] **Intro / hero lede** — replaced with: *"I make my living at the keyboard, but I don't do all my living there."*
- [ ] **"How I got here"** — current copy covers the accounting / steakhouse / spreadsheet → Python → editor-in-August-2020 arc. Make sure the chronology, framing, and specifics (job titles, restaurants, what kind of accounting work) sound right. Decide whether to name specific employers or keep it generic.
- [ ] **"What pulls me toward software"** — three-thing draft (feedback loop / leverage / curve-never-flattens) + AI note. Confirm those are the *real* three things; rewrite if not. Decide whether the AI sentence stays or gets pulled into its own section / a dedicated "what I'm exploring" beat.
- [x] **"Outside of work" intro line** — replaced with: *"Tennis, travel, and a fiancée who always expands my horizons."*
- [x] **Photo grid captions** — six captions rewritten in Andy's voice. Grid also reflowed from 3×2 to 2×3 on desktop (pairs: tennis/PNW, Chicago/Denver, Switzerland/Northeast).
- [ ] **"A few other things" list + outro** — current list: tennis/fitness/hiking, podcasts (Lex/Tim/Huberman), board+video games, live music + stand-up. Outro currently points back at `/projects`. Confirm the list is current and the outro lands.

## Photo grid — visual cleanup

- [x] **Recrop `chicago.jpg`** — replaced by user.
- [x] **Recrop `pacific-northwest.jpg`** — replaced by user.
- [x] **Audit the other four** (`tennis-florida`, `denver`, `switzerland`, `northeast`) — confirmed crops look right alongside the new 2×3 grid layout.
- [ ] **Decide on `acadia-hike.jpg`** — extra file uploaded that isn't wired. Options: pair it with `northeast.jpg` (split into Boston + Acadia), drop a 7th slot in, or leave on disk.

## Out of scope for this plan

- Engineering-identity content for other pages (Projects, Home hero copy). This plan is scoped to `/about` only.
- Headshot replacement for the homepage hero (`src/assets/Profile.jpg`) — that's a separate blocked board card waiting on a new photo.
- Photo grid layout / aspect ratio changes — the grid layout is working as-is; only crops need touching.

## How to use this plan

Pick a single checkbox, do the rewrite or the recrop, commit, move to the next one. No need to do them in order — each one is independent. When all boxes are checked, this plan archives.

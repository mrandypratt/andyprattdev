# Board Archive

<!-- Completed and archived cards, newest first. Full card blocks preserved from board.md with completed/archived date added. -->

### Restyle Home hero + section headers to match Project Card pattern

- **status**: done
- **completed**: 2026-05-22
- **size**: M
- **priority**: 1
- **plan**: archive/2026-05-22-restyle-home-hero-as-about-card
- **notes**: Shipped 2026-05-22. Home hero replaced with a `<AboutSection/>` rendering a Project-Card-styled About card that links to `/about` (Deep dive →). Scope grew during execution to include a desktop navbar redesign (added HOME link, replaced single PROJECTS HashLink with click-to-toggle dropdown listing Cards with Friends + disabled Game Set Book/AI Assistant items, Escape/click-outside to close) and a full mobile drawer rewrite (Option A: 80vw wide, left-aligned, hierarchy via weight+indent rather than ornaments, disabled state via 0.4 opacity, dropped the teal vertical bar and arrow prefixes). Two follow-up fixes: `padding-top: 64px` on `.home-container` to restore navbar offset, `z-index: 1000` on `.navbar` so its stacking context elevates above page content. Deleted dead Home.css rules (hero/button styles, orange-pop, blue-pop, blue-split-text).

### Add projects section to home; move CWF to deep-dive page

- **status**: done
- **completed**: 2026-05-22
- **size**: L
- **priority**: 1
- **plan**: archive/2026-05-21-home-projects-section
- **notes**: Shipped 2026-05-22. CWF deep-dive moved to `/projects/cards-with-friends`; `/portfolio` redirects via `<Navigate>`. Home now renders a `<ProjectsSection/>` below the hero with three cards (CWF live; Game Set Book + AI Assistant as `(Coming soon)` non-clickable). Navbar `PORTFOLIO` → `PROJECTS` smooth-scrolls to `#projects`. Deviation from plan: removed the hero "Projects" CTA entirely (section is visible just below). Dedicated `/projects` index deferred until 4+ live projects (YAGNI). Deploy: CloudFront invalidation `ICI5DQ96UAH7Y4EEL5AEAA6IL0`. Unblocked: Game Set Book page, CWF deep-dive restructure.

### Clean up vestigial elasticbeanstalk S3 bucket

- **status**: done
- **completed**: 2026-05-21
- **size**: S
- **priority**: 4
- **notes**: Deleted bucket `s3://elasticbeanstalk-us-east-2-730586623447` (empty; had EB-installed Deny-DeleteBucket policy that had to be removed first). Also deleted the two leftover EB applications surfaced during inspection: `CardsWithFriends` (us-east-2, 2022) and `game-set-book` (us-east-1, 2024). No environments, app versions, or other resources were attached. Verified post-cleanup: bucket 404, both regions return empty application list.

### Fix apex DNS for andyprattdev.com (via CDK adoption)

- **status**: done
- **completed**: 2026-05-21
- **size**: L
- **priority**: 1
- **plan**: 2026-05-21-apex-dns-cdk-migration
- **notes**: Apex broken — GoDaddy HTTPS Domain Forwarding returns 405/empty. Plan now also folds in CDK adoption (TypeScript, single stack, `/infra` in repo, local-only deploys). End state: private S3 bucket `andyprattdev.com` (us-east-1) behind CloudFront OAC, new CloudFront distribution authored in CDK (old one decommissioned), Route 53 hosted zone with A/AAAA ALIAS + ACM validation CNAMEs, CloudFront Function 301s www→apex. Requires user nameserver swap at GoDaddy. Supersedes the "Scope CDK migration" card. Brief downtime on www accepted during alias cutover.

### Scope CDK migration

- **status**: done
- **completed**: 2026-05-21
- **size**: M
- **priority**: 3
- **notes**: Superseded by "Fix apex DNS for andyprattdev.com (via CDK adoption)". CDK is now adopted: single TypeScript stack at `/infra/lib/site-stack.ts` owns S3, CloudFront, OAC, Route 53. Deploys remain local (`cd infra && npx cdk deploy`); no CI/CD wired up.

### Extend npm run deploy to invalidate CloudFront after sync

- **status**: done
- **completed**: 2026-05-21
- **size**: S
- **priority**: 3
- **notes**: Folded into the apex DNS / CDK migration card. `npm run deploy` already invalidated; updated bucket + distribution ID to the CDK-managed pair (`s3://andyprattdev.com`, `E3OIYWCNDQ275Q`).

### Remove "looking for SWE opportunities" footer line

- **status**: done
- **completed**: 2026-05-21
- **size**: S
- **priority**: 2
- **notes**: One-line removal in `src/components/Footer.tsx:29`. Off-tone for the north-star "calm, technically mature" positioning.

### Kill "Play my Card Game!" CTA + dead Cards with Friends links

- **status**: done
- **completed**: 2026-05-21
- **size**: S
- **priority**: 1
- **notes**: Cards with Friends is offline. Remove the Home button at `src/views/Home.tsx:42-46` and unwrap the dead anchors in `src/views/Portfolio.tsx:21,29` that link to cardswithfriendsgame.com.

<!-- Board card format:
### Card title
- **status**: active | pipeline | ready | blocked | backlog
- **size**: S | M | L | XL
- **priority**: 1 (highest) through 5
- **plan**: YYYY-MM-DD-plan-name (optional)
- **blocker**: description (optional, required for blocked status)
- **notes**: context (optional)
-->

### Fix apex DNS for andyprattdev.com

- **status**: ready
- **size**: M
- **priority**: 1
- **notes**: Root domain currently doesn't resolve; only `www` works. Inspect GoDaddy records, route apex to the CloudFront distribution or 301 to `www`. May require adding apex to the ACM cert's SANs. Capture findings in `docs/infrastructure.md` open-questions list.

### Update resume PDF

- **status**: blocked
- **size**: S
- **priority**: 2
- **blocker**: waiting on updated resume content from user
- **notes**: File swap at `src/assets/AndyPrattResume.pdf`. Content authoring is the user's task; this card unblocks when the new PDF is ready.

### Stand up /projects index; move Cards with Friends to deep-dive page

- **status**: ready
- **size**: L
- **priority**: 1
- **notes**: New `/projects` index + `/projects/cards-with-friends` deep-dive page. Move current Portfolio content as-is into the deep-dive page (restructure is a separate card). Update Home button from "Portfolio" to "Projects". Decide whether `/portfolio` 301s to `/projects` or stays as alias. Unblocks cards: Game Set Book page, CWF deep-dive restructure.

### Add /projects/game-set-book page (tennis scheduling app)

- **status**: blocked
- **size**: M
- **priority**: 2
- **blocker**: /projects index + page template (card: "Stand up /projects index")
- **notes**: New per-project page for Game Set Book. App is no longer live; writeup content TBD. Use the page template established when /projects is stood up.

### Scope work writeups + extensible showcase structure

- **status**: ready
- **size**: M
- **priority**: 2
- **notes**: Design doc in `docs/plans/`. Defines the per-project page template, IP/NDA rules for talking about employer work, and a roadmap of what to write up first. No code. Output feeds future Work and Showcase cards.

### Break up Cards with Friends deep dive

- **status**: blocked
- **size**: L
- **priority**: 3
- **blocker**: /projects index + CWF deep-dive page (card: "Stand up /projects index")
- **notes**: Split V1/V2/V3 inside the CWF deep-dive page. Render the existing `src/views/Projects/v1.md` and `v2.md` writeups (currently dead on disk). Elevate YouTube videos to the top of the page. Trim the verbose intro.

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

### Scope CDK migration

- **status**: ready
- **size**: M
- **priority**: 3
- **notes**: Design doc in `docs/plans/`. Should S3 + CloudFront + ACM move into CDK? How to bootstrap? Wire to GitHub Actions on push vs. keep manual deploys? Cost considerations (user is cost-conscious about CI). Decision-only card; no infra changes.

### Dependency + build-tool upgrade plan

- **status**: ready
- **size**: M
- **priority**: 2
- **notes**: Design doc weighing incremental upgrades (React 17→18, TS 4.6→5, MUI 5.5→latest) vs. Vite migration (CRA is deprecated). Output: choose a path, then card the actual work. Should land before big new UI work on top of the stack.

### Extend npm run deploy to invalidate CloudFront after sync

- **status**: ready
- **size**: S
- **priority**: 3
- **notes**: Small improvement noted in `docs/infrastructure.md`. May be folded into the CDK migration card depending on its outcome.

### Clean up vestigial elasticbeanstalk S3 bucket

- **status**: ready
- **size**: S
- **priority**: 4
- **notes**: `s3://elasticbeanstalk-us-east-2-730586623447` (us-east-2, created 2022-04-28) is unrelated to this site — auto-created by an old Elastic Beanstalk session, possibly from the Cards with Friends backend era. Inspect contents, confirm no live EB environments still reference it (check `aws elasticbeanstalk describe-environments`), then delete the bucket. Pure account hygiene; no user-visible effect.


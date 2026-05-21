# andyprattdev — Agent Orientation

Personal portfolio for Andy Pratt. Single-page React/TypeScript app, statically hosted on AWS (S3 + CloudFront) at `andyprattdev.com`. Domain registered at GoDaddy.

## Read these first

The substance lives in `docs/`. Read in this order before doing work:

1. **`docs/north-star.md`** — Purpose, positioning, and decision filter for the site. The "why" before the "what." Position is: AI-first Software Engineer, systems thinker, evidence over claims.
2. **`docs/architecture.md`** — Code-level inventory: tech stack, directory map, components, design system, known issues.
3. **`docs/infrastructure.md`** — Hosting topology (Route 53 → CloudFront → private S3 via OAC, all CDK-managed in `/infra`), deploy flow, AWS access.
4. **`docs/development.md`** — Local setup, common commands, git workflow, identity setup.

## Quick facts

- React 17 + TypeScript 4.6 + CRA 5 — all behind current major versions (flagged in `architecture.md`).
- No backend code in this repo. The Cards with Friends backend lives in a separate repo.
- No tests. Default CRA ESLint. No CI/CD — both content (`npm run deploy`) and infra (`cd infra && npx cdk deploy`) ship from local.
- AWS access via SSO (already configured on this machine).

## Commands

| Command | What it does |
|---------|--------------|
| `npm install` | Install dependencies |
| `npm start` | CRA dev server at http://localhost:3000 |
| `npm run build` | Production build → `./build` |
| `npm run deploy` | Runs `npm run build`, then `aws s3 sync build/ s3://andyprattdev.com --delete`, then CloudFront invalidation on distribution `E3OIYWCNDQ275Q` (requires `aws sso login`) |
| `cd infra && npx cdk diff` / `npx cdk deploy` | Diff or apply the CDK stack (`AndyPrattDevSite`) that owns S3, CloudFront, Route 53, etc. CDK ships infra; `npm run deploy` ships content. |

## AWS account verification

Any command that touches AWS resources MUST run against the correct account. This applies to `aws *`, `cdk *`, `npx cdk *`, and `npm run deploy` (which wraps AWS calls).

| Field | Value |
|---|---|
| Account ID | `730586623447` |
| Friendly name | `andyprattdev` |
| Region | `us-east-1` |
| SSO profile | `mrandypratt` |
| Permission set | `AdministratorAccess` |

**Before running any AWS-affecting command**, verify the identity:

```
aws sts get-caller-identity --query Account --output text   # must print 730586623447
```

If it prints something else (or errors), re-authenticate:

```
aws sso login --profile mrandypratt
```

A `PreToolUse` hook (`.claude/hooks/aws-account-guard.sh`, wired in `.claude/settings.json`) enforces this automatically and will block the tool call with a `BLOCKED:` message if the account doesn't match.

## Working notes for agents

- The user prefers "discuss → commit" over "draft and edit." Confirm structural decisions in chat before generating files.
- Cards with Friends writeups (`src/views/Projects/v1.md`, `v2.md`) are high-value content currently unrendered in the UI. Preserve them.
- If you discover infrastructure or stack facts not yet captured in `docs/`, update the relevant doc rather than creating a new one. Keep `CLAUDE.md` slim.

# Infrastructure

Production hosting for andyprattdev.com.

## Topology

```
              andyprattdev.com  (apex — behavior to verify)
              www.andyprattdev.com
                       │
                       ▼
              ┌──────────────────┐
              │   GoDaddy DNS    │   ← registrar + DNS
              └────────┬─────────┘
                       │  CNAME / ALIAS
                       ▼
              ┌──────────────────┐
              │   CloudFront     │   ← CDN + TLS termination
              │   distribution   │
              └────────┬─────────┘
                       │  origin
                       ▼
              ┌──────────────────┐
              │ S3 bucket        │   ← static site contents
              │ s3://andyprattdev│
              └──────────────────┘
```

## Components

### Domain

- **Registrar:** GoDaddy
- **Domain:** `andyprattdev.com`
- Production traffic resolves to `www.andyprattdev.com`. Apex (`andyprattdev.com`) behavior is not yet documented — see open questions.

### DNS

- DNS is hosted at GoDaddy (not delegated to Route 53).
- `www` → CloudFront distribution domain (CNAME).
- Record types and exact target — to verify.

### CDN

- **CloudFront** distribution fronts `www.andyprattdev.com`.
- TLS — presumed ACM certificate in `us-east-1` attached to the distribution (CloudFront requires `us-east-1` for ACM).
- Distribution ID — to capture in this doc once verified.
- Default behavior, error/404 handling, cache policies — to capture.

### Origin

- **S3 bucket:** `s3://andyprattdev`
- Region — to verify.
- Access pattern (public website hosting vs private bucket fronted by OAI/OAC) — to verify.

## Deploy flow

```
npm run build                  # CRA produces ./build
npm run deploy                 # aws s3 sync build/ s3://andyprattdev
```

The deploy script does **not** invalidate CloudFront. Edge caches may serve stale assets until natural TTL expiry. To force-refresh:

```
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

A small future improvement: extend `npm run deploy` to invalidate after the sync.

## AWS access

CLI access is via **AWS SSO** (already configured on the user's machine).

Typical flow:
```
aws sso login --profile <profile>
npm run deploy
```

SSO profile name, AWS account ID, and IAM permissions scope — to capture.

## No CI/CD

Deploys today are manual from a developer machine. Future improvement: a GitHub Actions workflow on push-to-`main` that builds and deploys, using OIDC against an AWS role so no long-lived secrets are stored in GitHub.

## Open questions / to verify

These are the gaps that future sessions should fill in (most can be answered with a few `aws` CLI calls after `aws sso login`):

- [ ] CloudFront distribution ID
- [ ] AWS account ID and SSO profile name
- [ ] S3 bucket region
- [ ] Apex domain behavior (does `andyprattdev.com` 301 → `www`? Or is there a second distribution?)
- [ ] DNS record types at GoDaddy for `@` and `www`
- [ ] ACM certificate ARN and SANs
- [ ] Whether the bucket is public website hosting or private behind OAI/OAC
- [ ] Whether the deploy script should be extended to invalidate CloudFront
- [ ] Whether to migrate DNS from GoDaddy to Route 53 (would enable ALIAS records for the apex and tighten the AWS-side surface)

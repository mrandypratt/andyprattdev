# Infrastructure

Production hosting for andyprattdev.com.

## Topology

```
   andyprattdev.com  (apex — DNS broken at GoDaddy)
   www.andyprattdev.com
            │
            ▼
   ┌──────────────────┐
   │   GoDaddy DNS    │   ← registrar + DNS
   └────────┬─────────┘
            │  CNAME (www only today)
            ▼
   ┌──────────────────────────┐
   │   CloudFront E2NOY0IXIWZPZD │   ← CDN + TLS termination
   │   aliases: apex + www       │   ← apex alias configured but no DNS
   └────────┬────────────────────┘
            │  origin
            ▼
   ┌────────────────────────────────────────┐
   │ S3 bucket: www.andyprattdev.com        │   ← static site (us-east-2)
   │ S3 website hosting, public, index.html │
   └────────────────────────────────────────┘

Vestigial (not in serving path today):
   s3://andyprattdev.com (us-east-1) — RedirectAllRequestsTo www bucket's
   S3-website endpoint. Predates the CloudFront apex alias. Safe to leave
   alone; revisit when fixing apex DNS.
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
- **Distribution ID:** `E2NOY0IXIWZPZD`
- TLS — presumed ACM certificate in `us-east-1` attached to the distribution (CloudFront requires `us-east-1` for ACM).
- Default behavior, error/404 handling, cache policies — to capture.

### Origin

- **S3 bucket:** `s3://www.andyprattdev.com`
- **Region:** `us-east-2` (Ohio)
- **Access pattern:** S3 static website hosting (public), `index.html` for both index and error documents. Not fronted by OAI/OAC.
- An additional bucket `s3://andyprattdev.com` (us-east-1) exists with `RedirectAllRequestsTo` pointing at the www bucket's website endpoint. It is not currently in the serving path (CloudFront has the apex alias directly) and can be left alone until apex DNS is sorted.
- **Unrelated bucket:** `elasticbeanstalk-us-east-2-730586623447` exists in the account from an April 2022 Elastic Beanstalk session. Not related to this site; safe to leave or clean up separately.

## Deploy flow

```
npm run deploy   # build + s3 sync + CloudFront invalidation
```

`npm run deploy` runs:

```
npm run build \
  && aws s3 sync build/ s3://www.andyprattdev.com --delete \
  && aws cloudfront create-invalidation --distribution-id E2NOY0IXIWZPZD --paths '/*'
```

The build step is folded in so a single command goes from source → live site. To build without deploying (e.g., to inspect `./build`), `npm run build` still works on its own.

- `--delete` removes objects from the bucket that no longer exist in `build/`. CRA emits hash-suffixed asset filenames, so without `--delete` every prior version of every JS/CSS chunk would accumulate forever.
- The invalidation forces edge caches to re-fetch on the next request, so changes are visible immediately rather than waiting for natural TTL expiry.

**Historical note:** Before May 2026 the script targeted `s3://andyprattdev` (a bucket that does not exist), so every invocation failed with `NoSuchBucket` and the live site sat at the December 2022 upload. Once the next deploy runs, the site will refresh.

## AWS access

CLI access is via **AWS SSO** (already configured on the user's machine).

| Field | Value |
|---|---|
| Account ID | `730586623447` |
| Friendly name | `andyprattdev` |
| Region | `us-east-1` |
| SSO profile | `mrandypratt` |
| Permission set | `AdministratorAccess` |

Typical flow:
```
aws sso login --profile mrandypratt
npm run deploy
```

A pre-tool-use hook (`.claude/hooks/aws-account-guard.sh`) verifies that any agent-issued `aws`, `cdk`, `npx cdk`, or `npm run deploy` command runs against account `730586623447` and blocks otherwise. See "AWS account verification" in `CLAUDE.md`.

## No CI/CD

Deploys today are manual from a developer machine. Future improvement: a GitHub Actions workflow on push-to-`main` that builds and deploys, using OIDC against an AWS role so no long-lived secrets are stored in GitHub.

## Open questions / to verify

These are the gaps that future sessions should fill in (most can be answered with a few `aws` CLI calls after `aws sso login`):

- [x] CloudFront distribution ID — `E2NOY0IXIWZPZD`
- [x] AWS account ID and SSO profile name — `730586623447` / `mrandypratt`
- [x] Whether the deploy script should be extended to invalidate CloudFront — done; `npm run deploy` now syncs and invalidates
- [x] S3 bucket region — `us-east-2` for the www bucket, `us-east-1` for the vestigial apex-redirect bucket
- [x] Apex domain behavior — CloudFront has apex as an alias on the same distribution as www; the gap is purely DNS-side at GoDaddy
- [x] Whether the bucket is public website hosting or private behind OAI/OAC — public S3 website hosting, not OAC
- [ ] DNS record types at GoDaddy for `@` and `www`
- [ ] ACM certificate ARN and SANs
- [ ] Whether to migrate DNS from GoDaddy to Route 53 (would enable ALIAS records for the apex and tighten the AWS-side surface)

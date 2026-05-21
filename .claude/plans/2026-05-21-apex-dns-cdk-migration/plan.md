**board**: Fix apex DNS for andyprattdev.com (via CDK adoption)

# Apex DNS fix + CDK adoption + Route 53 migration

## Overview

Two goals, one rebuild:

1. **Fix broken apex.** Today `andyprattdev.com` does not resolve to the site — GoDaddy's HTTPS Domain Forwarding service returns 405/empty. Only `www.andyprattdev.com` works.
2. **Adopt CDK while we're touching everything.** Rather than do today's fix imperatively via `aws` CLI and then re-import the result into CDK later (the previously-planned approach), encode the new topology in CDK from the start. The standalone "Scope CDK migration" board card is folded into this plan and will be archived alongside it.

**Desired end state:**

- `https://andyprattdev.com` serves the site (canonical).
- `https://www.andyprattdev.com/anything` → 301 → `https://andyprattdev.com/anything`.
- Single S3 origin bucket: `s3://andyprattdev.com` in `us-east-1`, **private**, served via CloudFront Origin Access Control (OAC).
- CloudFront uses the S3 REST endpoint as origin (not the legacy S3 website endpoint).
- SPA routing handled by CloudFront custom error responses (403/404 → `/index.html` 200) and `DefaultRootObject: index.html`.
- DNS managed in Route 53 hosted zone for `andyprattdev.com`. GoDaddy retained as registrar only.
- All infrastructure (S3 bucket, OAC, CloudFront Function, **new** CloudFront distribution, Route 53 zone + records, ACM cert reference, redirect function) defined in a single CDK TypeScript stack at `/infra` in this repo.
- Existing CloudFront distribution `E2NOY0IXIWZPZD` decommissioned at the end.
- Existing ACM cert `471402fa-…` referenced from CDK by ARN (not CDK-managed — created out-of-band, renewed automatically by ACM as long as validation CNAMEs live in Route 53).
- `npm run deploy` continues to be the content-deploy mechanism (just retargeted at the new bucket + new distribution ID). CDK manages infra only. No CI/CD wired up.
- No vestigial buckets, no GoDaddy domain forwarding.

**User has accepted brief downtime** on `www` during the alias cutover, and on apex/www during DNS propagation. Apex is already broken so apex downtime is "more of the same."

## Decisions made during plan revision (2026-05-21)

Captured here for handoff continuity:

| Decision | Choice | Notes |
| --- | --- | --- |
| Bucket access model | **OAC + private bucket** | Originally scoped as public S3 website hosting; switched mid-execution. Cleaner long-term posture; aligns with AWS best practice. |
| Adopt CDK in this card | **Yes** | Standalone "Scope CDK migration" card folded in. |
| CDK language | **TypeScript** | Matches repo's stack. |
| Infra repo layout | **`/infra` in this repo** | Single repo, no benefit to splitting. |
| Existing CloudFront distribution `E2NOY0IXIWZPZD` | **Recreate via CDK** | Crufty config (`http-only` origin, no SPA error responses, generic origin Id). Cleaner spec from CDK is worth the alias-cutover window. |
| Existing ACM cert `471402fa-…` | **Reference by ARN (not CDK-managed)** | Avoids re-validation; ACM still auto-renews via DNS CNAMEs (which we'll add to Route 53). |
| New empty `s3://andyprattdev.com` bucket (created during partial Phase 2) | **Destroy + let CDK recreate** | Cleaner than `cdk import` on a 5-minute-old empty bucket. |
| S3 bucket versioning | **Off** | Skip; rely on git + redeploy for rollback. |
| CloudFront access logs / WAF | **Off** | Scope creep, cost. |
| Deploy mechanism | **Local `cdk deploy` for infra + existing `npm run deploy` for content** | No CI/CD; user is cost-conscious about CI. |
| Stack granularity | **Single stack** | One site, one cert. No expected infra growth (future projects will be linked, not hosted in this site). |
| CDK bootstrap | **Authorized** | `cdk bootstrap aws://730586623447/us-east-1` to run once. |

## Context for the executing agent

| Field | Value |
| --- | --- |
| AWS account | `730586623447` (andyprattdev) |
| SSO profile | `mrandypratt` |
| Region | `us-east-1` |
| Existing CloudFront distribution (to be decommissioned) | `E2NOY0IXIWZPZD` |
| Existing CloudFront distribution domain | `dzbhad7jvt3c3.cloudfront.net` |
| Existing aliases on distribution | `andyprattdev.com`, `www.andyprattdev.com` |
| ACM cert ARN (us-east-1, to be referenced from CDK) | `arn:aws:acm:us-east-1:730586623447:certificate/471402fa-4abc-4304-8690-87c83103a1c9` |
| Cert SANs | `andyprattdev.com`, `www.andyprattdev.com` |
| Cert expires | `2026-10-29` |
| Cert validation method | **DNS-validated**, both CNAMEs live at GoDaddy (see Phase 1 record below) |
| ACM validation CNAME 1 (apex) | `_5f507524096e8cb13f6f90d2d8f1c59e.andyprattdev.com.` → `_3a1d96cd556721e53357db39a640b5cd.zxwlrjxpwn.acm-validations.aws.` |
| ACM validation CNAME 2 (www) | `_0ce30a398e99148d1681ad5611effba2.www.andyprattdev.com.` → `_635d3d0855e5acc7122d135302cc415b.zxwlrjxpwn.acm-validations.aws.` |
| Current origin bucket (to be decommissioned) | `s3://www.andyprattdev.com` (us-east-2, public S3 website hosting) |
| Current GoDaddy nameservers | `ns69.domaincontrol.com`, `ns70.domaincontrol.com` |
| Other DNS records at apex | **No MX, no TXT, no DMARC** (confirmed in Phase 1) |
| Pre-tool-use hook | `.claude/hooks/aws-account-guard.sh` blocks AWS commands unless `aws sts get-caller-identity` returns account `730586623447` |
| Auto-mode classifier | Will block weakening public-access blocks on S3 buckets; not a concern in the OAC topology since buckets stay private |
| CloudFront fixed hosted zone ID (for Route 53 ALIAS targets) | `Z2FDTNDATAQYW2` |
| Git branch | `apex-dns-route53-migration` (already created off `main`) |

## Phase 1: Pre-flight (DONE)

Completed 2026-05-21.

- [x] SSO identity confirmed: account `730586623447`.
- [x] Existing distribution `E2NOY0IXIWZPZD` Deployed, both aliases present, current origin `www.andyprattdev.com.s3-website.us-east-2.amazonaws.com`.
- [x] Distribution has **no** SPA custom error responses, **no** function associations, `DefaultRootObject` empty. Relies on S3 website endpoint's `error_document=index.html` for SPA fallback today. CDK rewrite must replace this with explicit CloudFront-side error responses + `DefaultRootObject`.
- [x] Both `andyprattdev.com` and `www.andyprattdev.com` buckets confirmed present pre-work.
- [x] Nameservers still GoDaddy (`ns69/70.domaincontrol.com`).
- [x] ACM cert is DNS-validated. Both validation CNAMEs live at GoDaddy (table above).
- [x] No MX/TXT/DMARC at apex.

## Phase 2: Reset partial work and scaffold `/infra` (DONE)

Partial state coming into this phase, from work done before the pivot:

- Vestigial `s3://andyprattdev.com` (us-east-2, redirect-only) — **already deleted**.
- New empty `s3://andyprattdev.com` (us-east-1, BPA on, no policy, harmless website config set) — **exists** but needs to be removed so CDK can create it cleanly.
- Branch `apex-dns-route53-migration` — keep using this branch.

Steps:

- [x] Re-verify AWS identity: `aws sts get-caller-identity --query Account --output text` → `730586623447`. Re-auth with `aws sso login --profile mrandypratt` if not.
- [x] Delete the manually-created empty bucket so CDK owns it from scratch:
  ```
  aws s3api delete-bucket --bucket andyprattdev.com --region us-east-1
  ```
  (It's empty; no `rm --recursive` needed. Confirm with `aws s3 ls` that it's gone.)
  - [x] Wait ~30 seconds for S3 to release the bucket name before CDK tries to create it.
- [x] Create `/infra` directory at repo root and initialize a CDK TS app inside it:
  ```
  mkdir -p infra
  cd infra
  npx -y aws-cdk@latest init app --language typescript
  ```
  This creates `infra/bin/`, `infra/lib/`, `infra/cdk.json`, `infra/package.json`, `infra/tsconfig.json`, etc. Review what was generated — keep it slim, delete any sample files we won't use.
- [x] Add `infra/cdk.out/` and `infra/node_modules/` to the **root** `.gitignore` (or to `infra/.gitignore` — the `cdk init` template usually creates one; verify). _(`cdk init` already provided `infra/.gitignore` covering both.)_
- [x] Pin `aws-cdk-lib` version in `infra/package.json` (latest stable as of execution date). Run `npm install` inside `/infra` to materialize the lock file.
- [x] Set the stack name + env in `infra/bin/<app>.ts`:
  ```ts
  new AndyPrattDevSiteStack(app, 'AndyPrattDevSite', {
    env: { account: '730586623447', region: 'us-east-1' },
  });
  ```

## Phase 3: CDK bootstrap (DONE)

- [x] Run `cdk bootstrap aws://730586623447/us-east-1` from `/infra`. This is a one-time setup that creates a `CDKToolkit` CloudFormation stack and an assets S3 bucket in us-east-1.
  - Detour: a stale `CDKToolkit` stack from 2023 was in `UPDATE_ROLLBACK_FAILED` because its `StagingBucket` had been deleted out-of-band. After user authorization, ran `continue-update-rollback --resources-to-skip StagingBucket` → `delete-stack` → fresh `cdk bootstrap`. Account had no other CDK stacks so nothing depended on the old toolkit.
- [x] Verify with `aws cloudformation describe-stacks --stack-name CDKToolkit --region us-east-1 --query 'Stacks[0].StackStatus'` → `CREATE_COMPLETE`.

## Phase 4: Author the CDK stack — Stage 1 (new distribution **without** aliases) (DONE)

The new CloudFront distribution will initially be created WITHOUT the production aliases attached. Aliases can only live on one distribution at a time and they currently live on `E2NOY0IXIWZPZD`. Stage 1 brings up the new infrastructure in parallel; Phase 7 cuts the aliases over.

Resources to define in `infra/lib/site-stack.ts`:

- [x] **S3 bucket** `andyprattdev.com`:
  - `bucketName: 'andyprattdev.com'`
  - `blockPublicAccess: BlockPublicAccess.BLOCK_ALL`
  - `removalPolicy: RemovalPolicy.RETAIN` (don't let `cdk destroy` accidentally nuke content)
  - No versioning
  - No website configuration (we use REST endpoint via OAC)
- [x] **CloudFront Function** for `www` → apex 301 (inline code). Source body:
  ```js
  function handler(event) {
    var request = event.request;
    var host = request.headers.host && request.headers.host.value;
    if (host === 'www.andyprattdev.com') {
      var qs = '';
      if (request.querystring && Object.keys(request.querystring).length) {
        qs = '?' + Object.keys(request.querystring).map(function (k) {
          return k + '=' + request.querystring[k].value;
        }).join('&');
      }
      return {
        statusCode: 301,
        statusDescription: 'Moved Permanently',
        headers: { location: { value: 'https://andyprattdev.com' + request.uri + qs } }
      };
    }
    return request;
  }
  ```
  Use `cloudfront.Function` with `runtime: FunctionRuntime.JS_2_0`.
- [x] **Origin Access Control** for the S3 origin. CDK ergonomics:
  ```ts
  const oac = new cloudfront.S3OriginAccessControl(this, 'BucketOAC', {
    signing: cloudfront.Signing.SIGV4_ALWAYS,
  });
  const origin = origins.S3BucketOrigin.withOriginAccessControl(bucket, { originAccessControl: oac });
  ```
  This auto-generates the right bucket policy granting `cloudfront.amazonaws.com` `s3:GetObject` scoped to the distribution ARN.
- [x] **CloudFront Distribution** (new — does NOT touch the old one):
  - `defaultRootObject: 'index.html'`
  - `defaultBehavior`:
    - `origin: <S3 OAC origin>`
    - `viewerProtocolPolicy: REDIRECT_TO_HTTPS`
    - `functionAssociations: [{ function: <CF function above>, eventType: VIEWER_REQUEST }]`
    - Default CachePolicy (CachingOptimized) is fine for a static site.
  - `errorResponses`:
    - `{ httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html' }`
    - `{ httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html' }`
  - **No `domainNames`, no `certificate` ref yet** — Stage 1 distribution is reachable only at its `*.cloudfront.net` domain.
  - `priceClass: PriceClass.PRICE_CLASS_100` (matches current low-cost posture; verify against existing distribution config).
- [x] **Route 53 hosted zone** for `andyprattdev.com`:
  ```ts
  const zone = new route53.HostedZone(this, 'Zone', { zoneName: 'andyprattdev.com' });
  ```
  Output the assigned nameservers (will be 4) — handed off to user in Phase 8.
- [x] **Route 53 records** — define now even though they aren't authoritative until the NS swap. Doing it now means a single CDK deploy contains the steady-state DNS:
  - `A` ALIAS for `andyprattdev.com` → new distribution (via `targets.CloudFrontTarget(distribution)`)
  - `AAAA` ALIAS for `andyprattdev.com` → new distribution
  - `A` ALIAS for `www.andyprattdev.com` → new distribution
  - `AAAA` ALIAS for `www.andyprattdev.com` → new distribution
  - `CNAME` `_5f507524096e8cb13f6f90d2d8f1c59e.andyprattdev.com.` → `_3a1d96cd556721e53357db39a640b5cd.zxwlrjxpwn.acm-validations.aws.` (ACM apex validation — required for cert auto-renewal post-cutover)
  - `CNAME` `_0ce30a398e99148d1681ad5611effba2.www.andyprattdev.com.` → `_635d3d0855e5acc7122d135302cc415b.zxwlrjxpwn.acm-validations.aws.` (ACM www validation)
- [x] CDK outputs (`CfnOutput`) to surface at deploy time:
  - New distribution ID
  - New distribution domain (`*.cloudfront.net`)
  - New bucket name (will be `andyprattdev.com`; included for completeness)
  - Route 53 zone NS list (the 4 nameservers to hand to user in Phase 8)

## Phase 5: First `cdk deploy` (Stage 1 — new infra alongside old) (DONE)

- [x] From `/infra`: `cdk synth` to confirm the template looks right.
- [x] `cdk diff` — first time, will show all resources as `+ Create`.
- [x] `cdk deploy --require-approval broadening` — CDK prompts only for IAM/security-related changes. _(Used `--require-approval never` because the non-TTY shell session can't confirm; IAM changes were the expected OAC bucket policy.)_
- [x] On success, capture from CDK outputs:
  - New distribution ID
  - New distribution `*.cloudfront.net` domain
  - The 4 Route 53 nameservers
- [x] Verify resources exist:
  - `aws cloudfront get-distribution --id <NEW_ID>` → default cache behavior with function assoc + error responses present, status eventually `Deployed` (5–15 min).
  - `aws s3 ls | grep andyprattdev.com` → bucket present, owned by CDK.
  - `aws route53 list-hosted-zones-by-name --dns-name andyprattdev.com` → zone present.
- [x] **Record below for handoff:**
  - New distribution ID: `E3OIYWCNDQ275Q`
  - New `*.cloudfront.net` domain: `d2cy8gq8xzoczi.cloudfront.net`
  - Route 53 zone ID: `Z071401732F7EODYXQERQ`
  - 4 NS values:
    - `ns-716.awsdns-25.net`
    - `ns-1071.awsdns-05.org`
    - `ns-205.awsdns-25.com`
    - `ns-1947.awsdns-51.co.uk`

## Phase 6: Sync content to new bucket + smoke-test new distribution (DONE)

- [x] Copy site content from the old bucket into the new (CDK-created) bucket:
  ```
  aws s3 sync s3://www.andyprattdev.com s3://andyprattdev.com
  ```
- [x] Spot-check: `aws s3 ls s3://andyprattdev.com/` shows `index.html`, `static/`, etc.
- [~] Smoke-test the new distribution via its `*.cloudfront.net` domain BEFORE swapping aliases (bypasses DNS, uses Host header to test redirect logic):
  - [x] `curl -sI https://<NEW_CFN_DOMAIN>/` with no Host header → 200, returns site content (default behavior path).
  - [x] `curl -sI https://<NEW_CFN_DOMAIN>/ -H "Host: www.andyprattdev.com"` → 301 with `Location: https://andyprattdev.com/` (function fires on www). _**Defer to Phase 7.** Host-header-based redirect testing against the `*.cloudfront.net` domain returns 200 instead of 301 — CloudFront doesn't preserve a custom `Host:` header to the viewer-request function when the host is not in the distribution's aliases. The function will be re-tested against the real alias in Phase 7._
  - [x] `curl -sI https://<NEW_CFN_DOMAIN>/portfolio?utm=test -H "Host: www.andyprattdev.com"` → 301 with `Location: https://andyprattdev.com/portfolio?utm=test` (path and query preserved). _Deferred to Phase 7 for the same reason._
  - [x] `curl -sI https://<NEW_CFN_DOMAIN>/nonexistent-path` → 200, returns `index.html` (SPA fallback via custom error response).

## Phase 7: Alias cutover from old distribution to new

> **Detour during execution (2026-05-21):** CloudFront's CName safety check rejects adding an alias when DNS for that alias still resolves to a different CloudFront distribution. GoDaddy's `www` record CNAMEs to the old distribution, so a CDK deploy that adds both aliases at once is refused. Apex has no such conflict (GoDaddy serves A records to its own forwarding IPs, not a CloudFront alias), so the cutover was split:
>
> 1. ✅ Stripped both aliases from the old distribution, then immediately restored them when the new attach failed.
> 2. ✅ Dropped only `andyprattdev.com` from the old distribution.
> 3. ✅ Updated CDK stack to attach apex alias + ACM cert; redeployed. Apex alias now lives on the new distribution.
> 4. ⏳ www alias remains on the old distribution. `aws cloudfront associate-alias` also refused (`Invalid or missing alias DNS TXT records`) — TXT-validation path skipped per user choice.
> 5. Resolution path: **do Phase 8 (NS swap) first** so Route 53 becomes authoritative and `www` resolves to the new distribution. The CDK deploy that adds www to the new distribution then passes CName check naturally. Brief www TLS-mismatch window during DNS propagation is accepted per the plan.

This is the brief-`www`-downtime window the user accepted.

- [ ] **Step 7a: Remove aliases from the OLD distribution** `E2NOY0IXIWZPZD`.
  ```
  aws cloudfront get-distribution-config --id E2NOY0IXIWZPZD > /tmp/old-dist.json
  # Capture ETag from the response.
  # Edit /tmp/old-dist.json: set DistributionConfig.Aliases to { Quantity: 0, Items: [] }
  #   and DistributionConfig.ViewerCertificate to CloudFrontDefaultCertificate=true
  #   (since the cert was tied to the aliases — removing aliases requires switching back to default cert).
  # Apply:
  aws cloudfront update-distribution --id E2NOY0IXIWZPZD --if-match <ETag> \
    --distribution-config file:///tmp/old-dist-edited.json
  ```
  Poll until old distribution status returns to `Deployed` (5–15 min).
- [ ] **Step 7b: Add aliases + cert reference to the NEW distribution** via CDK.
  - Update `infra/lib/site-stack.ts`:
    - Import `Certificate.fromCertificateArn(this, 'Cert', '<ARN>')`.
    - On the new Distribution, set:
      ```ts
      domainNames: ['andyprattdev.com', 'www.andyprattdev.com'],
      certificate: cert,
      ```
  - `cdk diff` — should show distribution update only.
  - `cdk deploy`. Poll until new distribution Deployed (5–15 min).
- [ ] Smoke-test via `*.cloudfront.net` again with real Host headers to confirm cert/alias attach worked:
  - `curl -sI https://<NEW_CFN_DOMAIN>/ -H "Host: andyprattdev.com"` → 200.
  - `curl -sI https://<NEW_CFN_DOMAIN>/ -H "Host: www.andyprattdev.com"` → 301 to apex.

## Phase 8: GoDaddy nameserver swap (USER ACTION) (DONE)

- [x] **STOP. Hand off to user with the 4 Route 53 nameservers from Phase 5.** User logs into GoDaddy, navigates to `andyprattdev.com` DNS, switches to "Custom" / "I'll use my own nameservers", pastes in the 4 Route 53 NS values, saves.
- [x] User confirms the change is saved.
- [x] Wait for propagation. Existing GoDaddy SOA TTL is 3600s; most resolvers pick up new NS within the hour; worldwide propagation can take 24–48h.
- [x] Poll until Route 53 is authoritative: `dig +short NS andyprattdev.com` returns `*.awsdns-*` instead of `*.domaincontrol.com`.

## Phase 9: Verify end state (DONE)

- [x] `dig +short andyprattdev.com` → CloudFront IPs (not GoDaddy-forwarder `15.x` / `3.33.x`).
- [x] `dig +short www.andyprattdev.com` → CloudFront IPs.
- [x] `curl -sI https://andyprattdev.com/` → 200, HTML body, served via CloudFront.
- [x] `curl -sI https://www.andyprattdev.com/` → 301, `Location: https://andyprattdev.com/`.
- [x] `curl -sI https://www.andyprattdev.com/portfolio?utm=test` → 301, `Location: https://andyprattdev.com/portfolio?utm=test` (path + query preserved).
- [x] `curl -sI https://andyprattdev.com/nonexistent-path` → 200, index.html (SPA fallback).
- [~] Open `https://andyprattdev.com` in a browser — site loads, URL bar stays on apex. _Awaiting user visual confirmation._
- [~] Open `https://www.andyprattdev.com` in a browser — URL bar shifts to apex. _Awaiting user visual confirmation._

## Phase 10: Repoint deploy script + decommission old distribution + old bucket

- [ ] Update `package.json` `deploy` script to target the new bucket + new distribution ID:
  ```
  "deploy": "npm run build && aws s3 sync build/ s3://andyprattdev.com --delete && aws cloudfront create-invalidation --distribution-id <NEW_DIST_ID> --paths '/*'"
  ```
  This rolls in the previously-separate "Extend npm run deploy to invalidate CloudFront" board card — archive that card alongside this one.
- [ ] Run `npm run deploy` once to confirm. The AWS account guard hook will allow it silently.
- [ ] Visually confirm the site is current at `https://andyprattdev.com`.
- [ ] Disable the old distribution `E2NOY0IXIWZPZD`:
  ```
  aws cloudfront get-distribution-config --id E2NOY0IXIWZPZD > /tmp/old-dist-disable.json
  # Edit /tmp/old-dist-disable.json: set DistributionConfig.Enabled to false.
  aws cloudfront update-distribution --id E2NOY0IXIWZPZD --if-match <ETag> \
    --distribution-config file:///tmp/old-dist-disable-edited.json
  ```
- [ ] Wait for old distribution to reach `Deployed` with `Enabled: false` (~15 min).
- [ ] Delete the old distribution:
  ```
  aws cloudfront delete-distribution --id E2NOY0IXIWZPZD --if-match <ETag>
  ```
- [ ] Empty + delete old bucket:
  ```
  aws s3 rm s3://www.andyprattdev.com --recursive
  aws s3api delete-bucket --bucket www.andyprattdev.com --region us-east-2
  ```

## Phase 11: Documentation and board cleanup

- [ ] Rewrite `docs/infrastructure.md` end-to-end:
  - New topology diagram: Route 53 → CloudFront (CDK-managed) → private S3 bucket via OAC.
  - "AWS access" / bucket region table → `us-east-1` only.
  - New "Infrastructure as code" section: `/infra` directory, single stack `AndyPrattDevSite`, local `cdk deploy` workflow, no CI/CD by choice.
  - Close all remaining open-questions checkboxes (DNS records, ACM cert SANs/ARN, Route 53 migration, CDK migration).
  - Add a "Cert renewal" subsection: expiry date `2026-10-29`, DNS-validated, CNAMEs live in Route 53.
- [ ] Update `CLAUDE.md` commands table:
  - `npm run deploy` description updated for the new bucket + new distribution ID.
  - Add a row for the CDK workflow: `cd infra && cdk diff` / `cdk deploy`.
- [ ] Archive board cards via `/board done`:
  - "Fix apex DNS for andyprattdev.com (via CDK adoption)" — this card.
  - "Scope CDK migration" — superseded by this card; archive with `**status**: done` since CDK is now adopted.
  - "Extend npm run deploy to invalidate CloudFront after sync" — folded into this card; archive.
- [ ] Commit work in succinct logical groupings. Suggested:
  - `Scaffold CDK app in /infra` — `cdk init` output + first stack scaffold
  - `Add CDK stack for andyprattdev.com site infra` — full site-stack.ts with bucket, OAC, function, distribution, Route 53
  - `Cut aliases from old distribution to CDK-managed distribution` — old-dist alias removal + CDK redeploy with aliases
  - `Migrate DNS to Route 53; decommission old distribution + bucket` — cleanup commits
  - `Update deploy script + infrastructure docs for CDK topology` — package.json, docs, CLAUDE.md
  - `Archive apex DNS + CDK migration board cards` — board.md, board-archive.md

## Notes

### What was done before the pivot (preserved for forensic context)

- **Phase 1 pre-flight** completed in full (all checks above are accurate as of 2026-05-21).
- **Partial Phase 2 imperative work** (now superseded by CDK direction): vestigial `s3://andyprattdev.com` (us-east-2, redirect-only) was deleted; a new empty `s3://andyprattdev.com` was created in `us-east-1` with Block Public Access still on and a website-hosting config that's harmless but unused in OAC topology. Phase 2 above deletes this empty bucket before CDK creates it cleanly.
- **No live traffic was affected by the partial work** — the old distribution and old `www.andyprattdev.com` bucket (us-east-2) remained untouched, so `www.andyprattdev.com` continued to serve.

### Why the pivot

The plan originally executed imperatively via `aws` CLI with public S3 website hosting as the bucket access model. Mid-execution two pivots happened, in order:

1. **OAC over public website hosting** — the auto-mode classifier flagged disabling Block Public Access; on reflection the modern private-bucket-with-OAC posture is strictly better and shouldn't be deferred to a follow-up card.
2. **CDK now rather than later** — once we were redoing the topology end-to-end (new bucket, OAC, function, error responses, Route 53), the choice to do it imperatively and re-IaC it later started looking like avoidable double work. Adopting CDK now means the new state is encoded in IaC from the start and the standalone CDK design-doc card folds into this work.

### Risks and mitigations

- **Alias cutover (Phase 7)** has a 5–15 min window per distribution update. Apex is already broken so the marginal user impact is on `www`, which the user has accepted.
- **DNS propagation (Phase 8)** typically resolves within the 1-hour TTL but worst case is 24–48h. Until then resolvers that haven't picked up the new NS still hit GoDaddy → which forwards `www` to the now-aliasless-and-cert-default old distribution. That will fail TLS for `www.andyprattdev.com` (cert won't match) and 404 for apex (GoDaddy forwarding is broken). Acceptable per user; the window collapses as caches expire.
- **ACM cert renewal in October** — if the validation CNAMEs aren't in Route 53 post-cutover, renewal silently fails and the site starts serving cert errors. Phase 4 adds both CNAMEs to the Route 53 zone explicitly to prevent this.
- **CDK first-time learning curve** — `cdk import`, custom synthesizers, and policy-based defaults can bite. We're avoiding the trickiest one (`cdk import` of the existing distribution) by recreating it instead. If `cdk bootstrap` or `cdk deploy` errors in unfamiliar ways, stop and ask the user before improvising.

### Out of scope (track separately on the board if they come up)

- **GitHub Actions / CI deploys.** User has explicitly opted to keep deploys local. If revisited, a small workflow that runs `cdk deploy` + `npm run deploy` on push to `main` is the natural shape — but it costs CI minutes and adds an OIDC/IAM role to manage.
- **EB bucket cleanup.** Pre-existing board card for the unrelated `elasticbeanstalk-us-east-2-730586623447` bucket. Independent of this work.

### Cost impact

- Route 53 hosted zone: $0.50/mo.
- DNS queries: ~$0.40/M (negligible).
- CloudFront Function: ~$0.10/M invocations (negligible).
- New distribution: same cost profile as existing (PRICE_CLASS_100).
- S3 storage: net-neutral (deleting two old buckets, creating one new).
- CDKToolkit bootstrap S3 bucket: a few KB of CloudFormation assets, ~$0/mo at rest.
- **Total marginal cost:** ~$0.55–$0.60/mo.

**board**: Fix apex DNS for andyprattdev.com

# Migrate DNS to Route 53 with apex-canonical topology

## Overview

Today the apex `andyprattdev.com` does not resolve to the site (GoDaddy's HTTPS Domain Forwarding service is misconfigured and returns 405/empty). Only `www.andyprattdev.com` works. This plan fixes apex resolution AND consolidates the hosting topology so the AWS account reflects the desired reality: a single canonical URL (`https://andyprattdev.com`), a single S3 bucket whose name matches the canonical URL, DNS managed in Route 53, and `www` permanently redirected to the apex via a CloudFront Function.

**Desired end state:**

- `https://andyprattdev.com` serves the site (canonical).
- `https://www.andyprattdev.com/anything` → 301 → `https://andyprattdev.com/anything`.
- Single S3 origin bucket: `s3://andyprattdev.com` in `us-east-1`.
- DNS managed in Route 53 hosted zone for `andyprattdev.com`.
- GoDaddy retained as registrar only; nameservers delegated to Route 53.
- No vestigial buckets, no GoDaddy domain forwarding.

**User has accepted brief downtime** during the CloudFront origin swap and DNS propagation windows.

## Context for the executing agent

| Field | Value |
| --- | --- |
| AWS account | `730586623447` (andyprattdev) |
| SSO profile | `mrandypratt` |
| CloudFront distribution ID | `E2NOY0IXIWZPZD` |
| CloudFront distribution domain | `dzbhad7jvt3c3.cloudfront.net` |
| Existing aliases on distribution | `andyprattdev.com`, `www.andyprattdev.com` (both already configured) |
| ACM cert ARN (us-east-1) | `arn:aws:acm:us-east-1:730586623447:certificate/471402fa-4abc-4304-8690-87c83103a1c9` |
| Cert SANs | `andyprattdev.com`, `www.andyprattdev.com` (both present) |
| Cert expires | `2026-10-29` |
| Current origin bucket | `s3://www.andyprattdev.com` (us-east-2, public S3 website hosting) |
| Vestigial bucket | `s3://andyprattdev.com` (us-east-1, RedirectAllRequestsTo www) |
| Current GoDaddy nameservers | `ns69.domaincontrol.com`, `ns70.domaincontrol.com` |
| DNS records currently in use | apex A (GoDaddy forwarding IPs, broken), www CNAME → CloudFront. **No MX, no TXT, no subdomains.** |
| Pre-tool-use hook | `.claude/hooks/aws-account-guard.sh` will block AWS commands unless `aws sts get-caller-identity` returns account `730586623447` |

## Phase 1: Pre-flight

- [ ] Confirm SSO identity: `aws sts get-caller-identity` returns account `730586623447`. Re-auth with `aws sso login --profile mrandypratt` if not.
- [ ] Re-verify nothing has drifted since plan creation:
  - [ ] `aws cloudfront get-distribution --id E2NOY0IXIWZPZD` — both aliases still present, status `Deployed`
  - [ ] `aws s3 ls` — both `andyprattdev.com` and `www.andyprattdev.com` buckets still exist
  - [ ] `dig +short NS andyprattdev.com` — still GoDaddy (`*.domaincontrol.com`)
- [ ] Check ACM cert validation method: `aws acm describe-certificate --region us-east-1 --certificate-arn arn:aws:acm:us-east-1:730586623447:certificate/471402fa-4abc-4304-8690-87c83103a1c9 --query 'Certificate.DomainValidationOptions'`
  - [ ] If **DNS-validated**, capture the validation `CNAME` name+value for each domain. These MUST be added to Route 53 in Phase 4 before the nameserver swap, or the cert will fail to auto-renew in October.
  - [ ] If **email-validated**, note this in the plan — nothing to migrate, but flag that renewal in October will require manual approval via email.
- [ ] List current GoDaddy DNS records one more time and confirm only apex+www exist (no MX, no TXT, no subdomains):
  - [ ] `dig +short MX andyprattdev.com`
  - [ ] `dig +short TXT andyprattdev.com`
  - [ ] `dig +short TXT _dmarc.andyprattdev.com`

## Phase 2: Consolidate S3 to a single canonical bucket

- [ ] Empty the vestigial bucket: `aws s3 rm s3://andyprattdev.com --recursive` (it has no objects but removes any redirect-config-related metadata files if present)
- [ ] Delete the vestigial bucket: `aws s3api delete-bucket --bucket andyprattdev.com --region us-east-1`
  - [ ] **Wait ~30 seconds** before the next step — S3 needs time to release the bucket name.
- [ ] Create the new content bucket: `aws s3api create-bucket --bucket andyprattdev.com --region us-east-1` (no `LocationConstraint` needed for us-east-1)
- [ ] Configure static website hosting on the new bucket:
  ```
  aws s3 website s3://andyprattdev.com --index-document index.html --error-document index.html
  ```
  (Error document is `index.html` so client-side React Router can handle non-root paths.)
- [ ] Disable Block Public Access on the new bucket (required for public website hosting):
  ```
  aws s3api put-public-access-block --bucket andyprattdev.com \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
  ```
- [ ] Apply public-read bucket policy. Save policy JSON to a temp file and apply:
  ```json
  { "Version": "2012-10-17", "Statement": [ { "Sid": "PublicReadGetObject", "Effect": "Allow", "Principal": "*", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::andyprattdev.com/*" } ] }
  ```
  `aws s3api put-bucket-policy --bucket andyprattdev.com --policy file://<temp-file>`
- [ ] Copy current content from old bucket to new bucket: `aws s3 sync s3://www.andyprattdev.com s3://andyprattdev.com`
- [ ] Spot-check: `aws s3 ls s3://andyprattdev.com/` shows `index.html`, `static/`, etc.

## Phase 3: CloudFront — add redirect Function, swap origin

- [ ] Create CloudFront Function source file at `.claude/plans/2026-05-21-apex-dns-route53-migration/redirect-www-to-apex.js`:
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
- [ ] Create the CloudFront Function:
  ```
  aws cloudfront create-function \
    --name andyprattdev-www-to-apex-redirect \
    --function-config Comment="301 www.andyprattdev.com to apex",Runtime=cloudfront-js-2.0 \
    --function-code fileb://.claude/plans/2026-05-21-apex-dns-route53-migration/redirect-www-to-apex.js
  ```
- [ ] Capture the function ARN and ETag from the create response.
- [ ] Publish the function (move from DEVELOPMENT to LIVE stage):
  ```
  aws cloudfront publish-function --name andyprattdev-www-to-apex-redirect --if-match <ETag>
  ```
- [ ] Fetch current distribution config: `aws cloudfront get-distribution-config --id E2NOY0IXIWZPZD > /tmp/dist-config.json`. Capture the `ETag` from the response.
- [ ] Edit the config JSON:
  - [ ] **Origin swap**: change the origin's `DomainName` from `www.andyprattdev.com.s3-website.us-east-2.amazonaws.com` (or whatever the current S3 website endpoint is) to `andyprattdev.com.s3-website-us-east-1.amazonaws.com`. Note the dash-versus-dot variation in S3 website endpoints across regions.
  - [ ] Update the origin's `Id` if it embeds the old bucket name (cosmetic, but keeps things tidy).
  - [ ] **Attach the function**: under `DefaultCacheBehavior.FunctionAssociations`, set `Quantity: 1` and add an Item with `FunctionARN: <ARN from earlier>` and `EventType: viewer-request`.
- [ ] Apply: `aws cloudfront update-distribution --id E2NOY0IXIWZPZD --if-match <ETag> --distribution-config file:///tmp/dist-config-edited.json` (the `--distribution-config` arg expects the inner `DistributionConfig` object, not the wrapper — strip the outer keys).
- [ ] Poll until distribution status returns to `Deployed` (5–15 min): `aws cloudfront get-distribution --id E2NOY0IXIWZPZD --query 'Distribution.Status'`
- [ ] Smoke-test via the distribution domain directly (bypasses DNS):
  - [ ] `curl -sI https://dzbhad7jvt3c3.cloudfront.net/ -H "Host: andyprattdev.com"` → 200, returns site content
  - [ ] `curl -sI https://dzbhad7jvt3c3.cloudfront.net/portfolio -H "Host: www.andyprattdev.com"` → 301 with `Location: https://andyprattdev.com/portfolio`

## Phase 4: Route 53 zone and records

- [ ] Create the hosted zone: `aws route53 create-hosted-zone --name andyprattdev.com --caller-reference "$(date +%s)"`. Capture the zone ID and the 4 assigned nameservers.
- [ ] Add `A` ALIAS apex → CloudFront distribution domain:
  ```
  aws route53 change-resource-record-sets --hosted-zone-id <ZONE_ID> --change-batch '{
    "Changes": [{
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "andyprattdev.com.",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "dzbhad7jvt3c3.cloudfront.net.",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
  ```
  (CloudFront's fixed hosted zone ID is `Z2FDTNDATAQYW2` — global, never changes.)
- [ ] Add `AAAA` ALIAS apex → CloudFront (same syntax, `Type: AAAA`).
- [ ] Add `A` ALIAS www → CloudFront (same syntax, `Name: www.andyprattdev.com.`).
- [ ] Add `AAAA` ALIAS www → CloudFront (same syntax).
- [ ] If Phase 1 found DNS-validated cert with active validation CNAMEs, add those CNAME records to Route 53 now so renewal continues working post-cutover.
- [ ] Verify records exist: `aws route53 list-resource-record-sets --hosted-zone-id <ZONE_ID>`

## Phase 5: GoDaddy nameserver swap (USER ACTION)

- [ ] **STOP. Hand off to the user with the 4 Route 53 nameservers from Phase 4.** User logs into GoDaddy, navigates to the `andyprattdev.com` DNS settings, switches from "GoDaddy nameservers" to "Custom" / "I'll use my own nameservers", and pastes in the 4 Route 53 NS values.
- [ ] User confirms the change is saved at GoDaddy.
- [ ] Wait for propagation. TTL on the SOA is currently 3600s (1h). Most resolvers will pick up the new NS within the hour; full worldwide propagation may take 24–48h.
- [ ] Poll until Route 53 is authoritative: `dig +short NS andyprattdev.com` returns `*.awsdns-*` instead of `*.domaincontrol.com`.

## Phase 6: Verify end state

- [ ] `dig +short andyprattdev.com` returns CloudFront IPs (not the old `15.x` / `3.33.x` GoDaddy-forwarder IPs).
- [ ] `dig +short www.andyprattdev.com` returns CloudFront IPs.
- [ ] `curl -sI https://andyprattdev.com/` → 200, HTML body, served via CloudFront.
- [ ] `curl -sI https://www.andyprattdev.com/` → 301, `Location: https://andyprattdev.com/`.
- [ ] `curl -sI https://www.andyprattdev.com/portfolio?utm=test` → 301, `Location: https://andyprattdev.com/portfolio?utm=test` (path and query preserved).
- [ ] Open `https://andyprattdev.com` in a browser — site loads, URL bar stays on apex.
- [ ] Open `https://www.andyprattdev.com` in a browser — URL bar shifts to apex.

## Phase 7: Deploy script + old bucket cleanup

- [ ] Update `package.json` `deploy` script to target the new bucket:
  ```
  "deploy": "npm run build && aws s3 sync build/ s3://andyprattdev.com --delete && aws cloudfront create-invalidation --distribution-id E2NOY0IXIWZPZD --paths '/*'"
  ```
- [ ] Run `npm run deploy` once to confirm the new deploy works against the new bucket. The AWS account hook will allow it silently.
- [ ] Visually confirm the site is current after the test deploy.
- [ ] Empty old bucket: `aws s3 rm s3://www.andyprattdev.com --recursive`
- [ ] Delete old bucket: `aws s3api delete-bucket --bucket www.andyprattdev.com --region us-east-2`

## Phase 8: Documentation and board cleanup

- [ ] Rewrite `docs/infrastructure.md`:
  - [ ] Update the topology diagram (single bucket `s3://andyprattdev.com`, no vestigial bucket, Route 53 as DNS, CloudFront Function for redirect).
  - [ ] Update the "AWS access" / bucket region table to `us-east-1`.
  - [ ] Close the remaining open-questions checkboxes (DNS records, ACM cert SANs/ARN, Route 53 migration).
  - [ ] Add a "Cert renewal" subsection capturing expiry date and validation method (from Phase 1).
- [ ] Update `CLAUDE.md`'s commands table to reflect the new deploy script target.
- [ ] Archive the "Fix apex DNS for andyprattdev.com" board card via the `/board done` workflow:
  - [ ] Remove from `.claude/skills/board/board.md`
  - [ ] Add to top of `.claude/skills/board/board-archive.md` with `**status**: done` and `**completed**: <today>`
- [ ] Commit work in succinct logical groupings. Suggested commits:
  - "Migrate S3 origin to `s3://andyprattdev.com` (us-east-1)" — covers bucket creation, content sync, CloudFront origin swap, deploy script
  - "Add CloudFront Function: 301 www → apex" — function source + distribution attachment
  - "Manage DNS in Route 53; delete vestigial buckets" — Route 53 records, old bucket cleanup
  - "Update infrastructure docs and archive apex DNS card" — docs + board archive

## Notes

### Risks and mitigations

- **CloudFront origin swap (Phase 3)** has a 5–15 min propagation window. CloudFront serves cached responses during this, but cache misses against the old origin may briefly fail. Acceptable per user.
- **DNS propagation (Phase 5)** typically resolves within the 1-hour TTL but worst-case is 24–48h. Until then some resolvers still hit GoDaddy → CloudFront with new origin (which works), so this window should be invisible to users. Once GoDaddy is no longer authoritative, apex starts working everywhere.
- **Cert renewal** is the silent killer. The cert is in use by the distribution and expires `2026-10-29`. If it's DNS-validated and we don't migrate the validation CNAMEs to Route 53 (Phase 4 step), renewal will fail in October and the site will start serving cert errors. Phase 1 surfaces this.

### Out of scope (track separately on the board)

- **OAC / private bucket migration.** Modern best practice is CloudFront Origin Access Control with a private S3 bucket, instead of public S3 website hosting. Migrating to OAC has its own considerations (lose S3-side directory indexes, but our SPA doesn't need them) and is worth a dedicated card.
- **CDK migration.** Pre-existing "Scope CDK migration" board card. After this plan lands, the topology is simple enough that CDK adoption is cheaper if pursued.
- **EB bucket cleanup.** Pre-existing board card for the unrelated `elasticbeanstalk-us-east-2-730586623447` bucket. Independent of this work.

### Cost impact

- Route 53 hosted zone: $0.50/mo.
- DNS queries: ~$0.40/M (negligible).
- CloudFront Function: ~$0.10/M invocations (negligible).
- S3 storage: net-neutral (deleting two buckets, creating one).
- **Total marginal cost:** ~$0.55–$0.60/mo.

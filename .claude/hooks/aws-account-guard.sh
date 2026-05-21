#!/usr/bin/env bash
# Pre-tool-use guard: block AWS-mutating commands unless the current AWS
# identity resolves to the expected account. The hook reads the agent's
# Bash command from stdin (JSON), greps for AWS-affecting shapes, then
# verifies `aws sts get-caller-identity` returns the expected Account.
#
# Expected: account 730586623447 (andyprattdev), SSO profile 'mrandypratt'.
# To re-auth: aws sso login --profile mrandypratt

set -eu

EXPECTED_ACCOUNT="730586623447"
ACCOUNT_NAME="andyprattdev"
SSO_PROFILE="mrandypratt"

cmd=$(jq -r '.tool_input.command // ""')

# Guard any command that touches AWS: direct CLI, CDK (raw or via npx),
# and the npm wrapper script that shells to `aws s3 sync` + invalidation.
echo "$cmd" | grep -qE '(^|[^A-Za-z0-9_])(aws|cdk|npx +cdk|npm +run +deploy)([^A-Za-z0-9_]|$)' || exit 0

actual=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")
[ "$actual" = "$EXPECTED_ACCOUNT" ] && exit 0

echo "BLOCKED: AWS account is '${actual:-not logged in}', expected $EXPECTED_ACCOUNT ($ACCOUNT_NAME). Run: aws sso login --profile $SSO_PROFILE" >&2
exit 2

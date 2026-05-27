# Development

Local setup and day-to-day workflow.

## Prerequisites

- **Node.js** — any active LTS or current release. Verified on Node 24.x.
- **npm** — bundled with Node.
- **AWS CLI v2** — only needed for deploys. Login is via SSO.
- **git** — see "Git identity" below for personal-vs-work-account setup.

## First-time setup

```
git clone https://github.com/mrandypratt/andyprattdev.git
cd andyprattdev
npm install
```

Then configure your git identity for this repo — see "Git identity" below — before making any commits.

## Day-to-day commands

| Command | Purpose |
|---------|---------|
| `npm start` | CRA dev server at http://localhost:3000. Hot reload; type errors print in the terminal and overlay in the browser. |
| `npm run build` | Production build into `./build`. |
| `npm test` | Jest test runner. No tests currently exist. |
| `npm run deploy` | `aws s3 sync build/ s3://andyprattdev`. Requires `aws sso login` first. See `infrastructure.md`. |

## Type checking

There is no standalone `tsc` script — type checking runs as part of `npm start` and `npm run build`. If you want a one-shot check without starting the dev server: `npx tsc --noEmit`.

## Linting

Default CRA ESLint config only. No custom rules. No separate `lint` script.

## Deploy workflow

1. `aws sso login --profile <profile>`
2. `npm run build`
3. `npm run deploy`
4. (Optional, until automated) Invalidate CloudFront — see `infrastructure.md`.

## Git workflow

Solo single-`main` setup. `main` has **no protected-branch rules and no required PR review** — commit and push directly to `main`. There's no CI gate; `npm run deploy` ships content from local (see "Deploy workflow" above).

Branches and PRs are optional, not required — use one only when you want to stage risky work in isolation. Earlier history used feature branches merged via GitHub PR (e.g. PR #12, `single-page-portfolio`), but that ceremony is not expected for routine solo work.

> Note for agents: some Claude Code skills (`/plan-worker`, `/board`) default to auto-creating feature branches and refuse to commit to `main`. That default does not apply here — see the git-workflow note in `CLAUDE.md`.

## Git identity

This repo lives on a **personal** GitHub account (`mrandypratt`), separate from work accounts on this machine. The global git identity on this machine is the work identity (`apratt@ensomata.com`); this repo overrides it locally.

### How the isolation works

Two pieces, both repo-local — global config is untouched:

1. **Per-host SSH alias** (`~/.ssh/config`) makes the personal account use a dedicated key. The repo's remote uses the alias hostname (`github-personal`), so git can only authenticate as `mrandypratt` from this repo. The alias is defined as:

   ```
   Host github-personal
       HostName github.com
       User git
       IdentityFile ~/.ssh/id_ed25519_mrandypratt
       IdentitiesOnly yes
   ```

   The matching public key is registered as an **account-level** SSH key on the mrandypratt account (`github.com/settings/keys`), so it works for all of that account's repos.

2. **Repo-local `user.name` / `user.email`** attribute commits to the personal account using a GitHub no-reply alias, keeping the real email out of git history.

### Current configuration (already applied)

```
# remote
remote.origin.url = git@github-personal:mrandypratt/andyprattdev.git

# repo-local identity (.git/config, not ~/.gitconfig)
user.name  = Andrew Pratt
user.email = 69016402+mrandypratt@users.noreply.github.com
```

### Verifying it still works

```
ssh -T git@github-personal           # should print "Hi mrandypratt!"
git config user.email                # should print the no-reply alias
git remote -v                        # should show the github-personal: URL
```

### Cloning another personal repo on this machine

When cloning any other repo owned by `mrandypratt`, use the alias hostname so the same isolation applies:

```
git clone git@github-personal:mrandypratt/<repo>.git
cd <repo>
git config --local user.email "69016402+mrandypratt@users.noreply.github.com"
git config --local user.name  "Andrew Pratt"
```

(The `user.name` value above matches global; change if you want a different attribution on the personal account.)

### Adding a passphrase to the SSH key later

The key was generated without a passphrase for convenience. To add one:

```
ssh-keygen -p -f ~/.ssh/id_ed25519_mrandypratt
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_mrandypratt    # store in Keychain so you only type it once
```

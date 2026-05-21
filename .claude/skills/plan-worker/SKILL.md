---
name: plan-worker
description: Execute steps from an existing plan file, updating checkboxes as work completes. Use when the user wants to work through a saved plan, continue working on a plan, or check off completed steps. Triggers on "work on the plan", "execute the plan", "continue the plan", "next step", or "mark step as done".
---

# Plan Worker

Execute steps from a plan in `.claude/plans/{YYYY-MM-DD}-{plan-name}/plan.md`, updating checkboxes as work completes.

## Related Skills

- `/plan-creator` — creates plans with phases and steps

## Workflow

1. **Locate the plan** - Find the plan file (ask user if multiple plans exist)
2. **Ensure feature branch** - See [Feature Branch Setup](#feature-branch-setup) below
3. **Read current state** - Identify pending `[ ]` and completed `[x]` steps
4. **Execute steps** - Work through pending steps in phase order
5. **Update checkboxes** - Mark `[x]` as each step completes
6. **Report progress** - Summarize completed work and remaining steps
7. **Archive if complete** - When all steps are `[x]`, archive the plan and the board card (see [Completion](#completion) below)

## Feature Branch Setup

Before executing any steps, ensure work lands on a feature branch — never commit directly to `main`.

1. **Check current branch** with `git branch --show-current`:
   - If on a non-`main` branch — assume it's an existing feature branch and proceed without creating a new branch
   - If on `main` — create a new feature branch (continue below)
2. **Construct the branch name** from the plan directory name (`{YYYY-MM-DD}-{plan-slug}`), dropping the date prefix:
   - e.g., plan `2026-03-05-add-dark-mode` → branch `add-dark-mode`
3. **Create and switch** with `git checkout -b {branch-name}`

## Step Execution Rules

- Work through phases sequentially (Phase 1 before Phase 2)
- Complete parent steps before substeps when dependencies exist
- After completing each step, update the plan file immediately
- If a step is blocked or unclear, ask the user before proceeding

## Checkbox Updates

When marking a step complete, edit the plan file:

```diff
- - [ ] Add ThemeContext provider
+ - [x] Add ThemeContext provider
```

## Plan Format Reference

See [plan-format.md](../plan-creator/plan-format.md) for structure and formatting rules.

## Completion

After updating checkboxes, check if all steps in the plan are `[x]`. If so:

1. **Archive the board card** linked by the plan's `**board**:` metadata field:
   - Move the matching card from `.claude/skills/board/board.md` to the top of `.claude/skills/board/board-archive.md`
   - Set `**status**: done` and `**completed**: {today's date}`
   - Preserve all other fields
   - Fallback: if `**board**:` is absent (legacy plans), search `board.md` for cards with `**plan**: {plan-dir-name}`
2. **Move the plan folder** to `.claude/plans/archive/`:
   ```bash
   mv .claude/plans/{YYYY-MM-DD}-{plan-name} .claude/plans/archive/{YYYY-MM-DD}-{plan-name}
   ```
3. **Confirm** to the user that the plan and board card are complete and archived

## Progress Summary

After each work session, report:

- Steps completed this session
- Current phase progress (e.g., "Phase 2: 3/5 steps complete")
- Next pending step or blockers

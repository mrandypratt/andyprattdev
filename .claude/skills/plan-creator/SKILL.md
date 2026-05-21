---
name: plan-creator
description: Save and format implementation plans as structured markdown files. Use when the user wants to save, name, or persist a plan that was created during the conversation. Triggers on requests like "save this plan", "name this plan", "create a plan file", or after completing plan mode when the user wants to preserve the plan.
---

# Plan Creator

Save the current plan to `.claude/plans/{YYYY-MM-DD}-{plan-name}/plan.md`.

## Workflow

1. **Identify the plan** - Review the conversation for the plan to save
2. **Generate a name** - Create a kebab-case name reflecting the plan's **specific changes**, prepended with today's date in `YYYY-MM-DD` format (e.g., `2026-03-05-add-dark-mode`). Name based on _what_ the plan does, never the skill or process that produced it. Bad: `session-review-improvements`, `plan-mode-changes`. Good: `add-dark-mode`, `claude-allow-grep`, `update-projects-section`.
3. **Determine the board card title** - Use the plan title as the board card title (adjust for readability if needed, e.g., "Add Dark Mode" -> "Add dark mode")
4. **Format the plan** - Structure per [plan-format.md](plan-format.md), with `**board**: {card title}` as the first line of the file (before the `#` heading)
5. **Save the file** - Write to `.claude/plans/{YYYY-MM-DD}-{plan-name}/plan.md`
6. **Add or update board card** - First check `.claude/skills/board/board.md` for an existing card that matches the plan (fuzzy title match).
   - **If a matching card exists**: update the existing card in place — add the `**plan**:` field pointing to the new plan directory, and refresh `**notes**` if the plan adds useful context. Preserve all other fields (status, size, priority). Do NOT create a duplicate.
   - **If no matching card exists**: append a new card with:
     - **title**: same as the `**board**:` value in the plan
     - **status**: `ready` (default) — use `active` if the user is clearly about to start working on it
     - **size/priority**: infer from the plan's scope. Only ask the user if genuinely ambiguous
     - **plan**: the plan directory name (e.g., `2026-03-05-add-dark-mode`)
     - **notes**: brief context from the plan overview

## After Saving

Confirm the save location and the board card that was created. Remind the user:

- Use `/plan-worker` to execute steps from the plan
- Step checkboxes will be updated as work progresses
- When all steps are complete, the plan will be moved to `.claude/plans/archive/`

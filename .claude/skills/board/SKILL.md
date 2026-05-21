---
name: board
description: Personal work board for tracking cards (tasks/to-dos), priorities, and blockers. Use when asking "what's next?", "show my cards", "what should I work on?", or managing work items. Also triggers on "tasks", "to-dos", "what card should I pick up?". Invoke as `/board` with optional arguments.
---

# Board

Personal work management system centered on `board.md` (active cards) and `board-archive.md` (completed cards). Ties together plans in `.claude/plans/` (execution tracking) and individual cards (prioritization and lifecycle).

**All files live in this directory:** `.claude/skills/board/`

## Commands

Parse the user's `/board` invocation and execute the matching command below.

**Ambiguous input:** If the user provides a bare card title without a verb (e.g., "Personal work board skill" instead of "/board show Personal work board skill"), default to **showing** the card — never edit or update without an explicit action verb.

---

### `/board show <title>` — Show Card Detail

1. Find the card by fuzzy title match (case-insensitive substring)
2. Display the full card block from `board.md`
3. If the card has a `**plan**:` field, read the linked plan file and show:
   - Step progress (count of `[x]` vs total `[ ]` + `[x]`)
   - Next pending step (first `[ ]` line)
4. If no match, list all cards and ask

---

### `/board` (no arguments) — Show Summary

Read `board.md` from this skill's directory and display it to the user. Light formatting only — group cards by status in order: **active**, **blocked**, **pipeline**, **ready**, **backlog**. Show each card as one line: title, size, and blocker if present. For cards with a `**plan**:` field, include the clickable file path (e.g., `.claude/plans/2026-04-14-feature-name/plan.md`). Do NOT read plan files or do any extra work.

---

### `/board add` — Add Card

1. Infer as many fields as possible from conversation context or plan context
2. Only prompt the user for fields that are genuinely ambiguous — do NOT ask for every field
3. Required fields: **title**, **status**, **size**, **priority**
4. Optional fields: **plan**, **blocker**, **notes**
5. Append the new card block to `board.md`
6. Confirm what was added

**Default inference rules:**

- If a plan was just created, link it
- New cards default to **ready** unless context suggests otherwise
- If size/priority can't be inferred, ask

---

### `/board update <title>` — Update Card

1. Find the card by fuzzy title match (case-insensitive substring)
2. If multiple matches, show them and ask user to clarify
3. If no match, list all cards and ask
4. Update only the fields the user specifies — preserve all other fields
5. Show the before/after diff

---

### `/board pick` — Recommend Next Card

1. Filter to cards with status **ready**
2. Sort by: priority ascending (1 first), then size ascending (S < M < L < XL)
3. Recommend the top card with reasoning
4. If no ready cards, check for blocked cards that might be unblocked, or suggest pulling from backlog

---

### `/board done <title>` — Complete Card

1. Find the card by fuzzy title match
2. Remove the full card block from `board.md`
3. Add to the **top** of `board-archive.md` with:
   - **status** set to `done`
   - **completed** date set to today
   - All original fields preserved
4. If the card has a `**plan**:` field, run **Plan Archival** (see below)
5. Confirm what was completed (and whether the plan was archived)

---

### `/board archive <title>` — Archive Without Completing

1. Find the card by fuzzy title match
2. Remove from `board.md`
3. Add to top of `board-archive.md` with:
   - **status** unchanged (not set to done)
   - **archived** date set to today
   - **reason** field added (ask user for reason: cancelled, deprioritized, superseded, etc.)
   - All original fields preserved
4. If the card has a `**plan**:` field, run **Plan Archival** (see below)
5. Confirm what was archived (and whether the plan was archived)

---

## Plan Archival

Triggered by `/board done` and `/board archive` when the card being archived has a `**plan**:` field.

1. Read the card's `**plan**:` value (e.g., `2026-04-24-feature-name`). Skip if it already starts with `archive/`.
2. Check `board.md` for any **other** card whose `**plan**:` field references the same plan name.
3. If another active card still references the plan, leave it in place — note this in the confirmation message.
4. If this was the last active card referencing the plan:
   - Move the directory: `mv .claude/plans/<plan-name> .claude/plans/archive/<plan-name>`
   - Rewrite the just-added archive entry's `**plan**:` value to `archive/<plan-name>` so the path stays correct.
   - If the source directory does not exist (already archived or never existed), skip the move and just rewrite the field to `archive/<plan-name>` if the archive copy exists; otherwise warn the user.

---

## Status Lifecycle

| Status       | Meaning                                                 |
| ------------ | ------------------------------------------------------- |
| **active**   | Currently coding / focused on this                      |
| **pipeline** | PR open, waiting to merge / deploy                      |
| **ready**    | Unblocked, can be picked up next                        |
| **blocked**  | Waiting on a dependency, predecessor, or external input |
| **backlog**  | Known work, not yet prioritized or ready                |
| **done**     | Complete — only appears in board-archive.md             |

## Validation Rules

- **blocked** cards MUST have a **blocker** field — prompt if missing
- **active** cards should be limited to 1-3 — warn if adding a 4th
- **priority** is relative (1 = highest) — duplicates are fine
- **size** values: S, M, L, XL

## Card Format Reference

```markdown
### Card title

- **status**: active | pipeline | ready | blocked | backlog
- **size**: S | M | L | XL
- **priority**: 1
- **plan**: 2026-04-10-feature-name
- **blocker**: waiting on PR #123 to merge
- **notes**: any context
```

# Plan Format Specification

Plans are stored in `.claude/plans/{YYYY-MM-DD}-{plan-name}/plan.md`. The date prefix uses today's date in `YYYY-MM-DD` format for chronological sorting.

## Metadata Fields

Plan files may contain metadata fields at the very top of the file, **before** the first `#` heading. These fields link plans to the board.

```markdown
**board**: Card title

# {Plan Title}

...
```

### `**board**:` — Board card link

Links the plan to a card in `board.md`. Written by `/plan-creator` at creation time.

```markdown
**board**: Add dark mode
```

- The value must exactly match the `### Card title` heading in `board.md`
- If this field is absent (legacy plans), resolve the link by searching `board.md` for `**plan**: {plan-dir-name}`

## Structure

```markdown
# {Plan Title}

## Overview

Brief description of what this plan accomplishes.

## Phase 1: {Phase Name}

- [ ] Step description
- [ ] Another step
  - [ ] Substep if needed

## Phase 2: {Phase Name}

- [ ] Step description
- [x] Completed step (if already done)

## Notes

Any additional context, dependencies, or considerations.
```

## Formatting Rules

| Element         | Rule                                                                         |
| --------------- | ---------------------------------------------------------------------------- |
| **Plan name**   | Date-prefixed kebab-case, 2-5 words (e.g., `2026-03-05-add-dark-mode`)       |
| **Phases**      | Logical groupings: setup, implementation, testing, cleanup                   |
| **Steps**       | Imperative form ("Add middleware" not "Adding middleware")                   |
| **Checkboxes**  | `[ ]` pending, `[x]` completed                                               |
| **Substeps**    | Indent with 2 spaces                                                         |
| **Specificity** | Actionable and unambiguous                                                   |

## Example

**File**: `.claude/plans/2026-03-05-add-dark-mode/plan.md`

```markdown
**board**: Add dark mode

# Add Dark Mode

## Overview

Add a dark mode toggle to the portfolio site with persistence via `localStorage`.

## Phase 1: Setup

- [ ] Define dark-mode CSS variables in `index.css`
- [ ] Add a `ThemeContext` provider at the app root

## Phase 2: Implementation

- [ ] Build a toggle component in the nav
- [ ] Read/write the user's preference to `localStorage`
- [ ] Default to system preference via `prefers-color-scheme`

## Phase 3: Polish

- [ ] Verify contrast on all views
- [ ] Update screenshots in project case studies

## Notes

- No backend changes needed.
- Default to light mode if `localStorage` is unavailable.
```

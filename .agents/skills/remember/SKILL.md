---
name: remember
description: "Updates persistent project memory, summarises completed work, records decisions, and prepares state for the next session"
---

# /remember — Memory & Continuity Skill

## Purpose
Use this skill after completing significant work to persist the project state. This ensures that the next session (or a new agent) can pick up exactly where work left off without losing context.

## When to Activate
- After completing a phase
- After completing a significant feature within a phase
- Before ending a work session
- After making important decisions
- After resolving a significant bug
- At natural breakpoints in development

## Execution Steps

### 1. Summarise What Was Done
Create a concise summary of the work completed:
- Features implemented
- Files created or modified
- Components added
- Services created
- Database changes
- Tests added

### 2. Update Progress Tracker
Edit `context/progress-tracker.md`:

```markdown
### Session N — YYYY-MM-DD
**Objective:** [What was the goal]

**Completed:**
- [List of concrete deliverables]

**In Progress:**
- [Anything partially done]

**Decisions Made:**
- [Key decisions with rationale]

**Unresolved:**
- [Open issues, blockers, questions]

**Next Steps:**
1. [Specific next actions in priority order]
```

### 3. Update Build Plan
Edit `context/build-plan.md`:
- Mark completed items as `[x]`
- Mark in-progress items as `[/]`
- Add any new tasks discovered during implementation
- Update "Definition of Done" if scope changed

### 4. Update Architecture (If Changed)
If any architectural changes were made:
- Update `context/architecture.md`
- Create new ADR in `docs/decisions/`
- Update `context/library-docs.md` if new patterns were discovered

### 5. Update UI Registry (If Components Changed)
If UI components were added or modified:
- Update `context/ui-registry.md`
- Mark implemented components as `[x]`
- Add any new components discovered during implementation

### 6. Record Environment State
Note any environment changes:
- New dependencies added
- New environment variables needed
- New Supabase tables or migrations
- Configuration changes

### 7. Prepare Handoff
Write a clear "next steps" section that answers:
- What phase are we in?
- What is the next task?
- Are there any blockers?
- What files should be looked at first?
- Are there any known issues?

### 8. Git Commit
```bash
git add .
git commit -m "chore: update project context and progress tracker"
```

## Context File Checklist
After running `/remember`, verify these files are current:

| File | Last Updated | Status |
|---|---|---|
| `context/project-overview.md` | | Should rarely change |
| `context/architecture.md` | | Update if architecture changed |
| `context/build-plan.md` | | Update task status |
| `context/code-standards.md` | | Update if new patterns |
| `context/library-docs.md` | | Update if new libraries/patterns |
| `context/ui-tokens.md` | | Update if design system changed |
| `context/ui-rules.md` | | Update if UI rules added |
| `context/ui-registry.md` | | Update component status |
| `context/progress-tracker.md` | | ALWAYS update |

## Session Recovery Test
A new session should be able to:
1. Read `context/progress-tracker.md`
2. Understand current phase and state
3. Know exactly what to do next
4. Not duplicate completed work
5. Not miss unresolved issues

If any of these would fail, the `/remember` execution is incomplete.

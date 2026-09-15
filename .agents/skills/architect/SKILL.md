---
name: architect
description: "Architecture, planning, system design, and technical decision-making skill for ApplyWise AI"
---

# /architect — Architecture & Planning Skill

## Purpose
Use this skill when making architectural decisions, planning new features, evaluating technology choices, or designing system components.

## When to Activate
- Before starting any new phase or feature
- When a technical decision has multiple valid approaches
- When adding a new dependency or service
- When modifying the database schema
- When designing a new API route or service
- When planning a LangGraph agent workflow

## Execution Steps

### 1. Context Loading
Read the following context files before making any decision:
- `context/project-overview.md` — Product identity and tech stack
- `context/architecture.md` — System architecture and invariants
- `context/build-plan.md` — Current phase and dependencies
- `context/code-standards.md` — Engineering conventions

### 2. Analysis
For any architectural decision:
1. **State the problem** — What capability is needed?
2. **Identify constraints** — Free tier limits, existing patterns, dependencies
3. **Evaluate options** — At least 2 approaches with trade-offs
4. **Select approach** — Choose based on: simplicity, consistency, maintainability, showcase value
5. **Check invariants** — Does the decision violate any architectural invariants from `architecture.md`?

### 3. Documentation
- Create or update the relevant ADR in `docs/decisions/`
- Update `context/architecture.md` if the system architecture changes
- Update `context/build-plan.md` if the phase plan changes

### 4. ADR Format
```markdown
# ADR-NNN: [Title]

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue motivating this decision?

## Decision
What is the change being proposed?

## Consequences
What becomes easier or harder because of this change?

## Alternatives Considered
What other options were evaluated and why were they rejected?
```

### 5. Output
After completing the architectural analysis:
- Document the decision
- Update relevant context files
- Confirm the plan before proceeding to implementation

## Anti-Patterns to Avoid
- ❌ Making architectural changes during implementation without documenting them
- ❌ Adding dependencies without evaluating free-tier compatibility
- ❌ Designing components that violate the trust boundary model
- ❌ Hard-coding provider-specific logic outside the adapter layer
- ❌ Creating database tables without RLS policies

---
name: imprint
description: "Preserves and enforces project conventions, coding patterns, and architectural decisions for ApplyWise AI"
---

# /imprint — Convention Enforcement Skill

## Purpose
Use this skill to solidify new patterns, conventions, or architectural decisions into the project's persistent context, ensuring future sessions follow the same rules.

## When to Activate
- When a new coding pattern is established (e.g., first Server Action, first LangGraph agent)
- When a design decision is made that should be consistent across the project
- When a library usage pattern is discovered and should be standardised
- After resolving a bug caused by inconsistent patterns
- When adding a new component to the design system

## Execution Steps

### 1. Identify the Pattern
Clearly describe:
- **What** is the pattern? (code structure, naming, data flow)
- **Where** does it apply? (components, services, agents, tests)
- **Why** is it important? (consistency, security, performance, maintainability)
- **Example** — show a concrete code example

### 2. Record the Pattern
Update the appropriate context file:

| Pattern Type | Update File |
|---|---|
| Code structure/naming | `context/code-standards.md` |
| Architecture/data flow | `context/architecture.md` |
| UI component pattern | `context/ui-registry.md` |
| UI behaviour rule | `context/ui-rules.md` |
| Design tokens | `context/ui-tokens.md` |
| Library usage | `context/library-docs.md` |
| Significant decision | `docs/decisions/ADR-NNN.md` |

### 3. Verify Consistency
After recording a new pattern:
1. Search the codebase for existing instances that don't follow the pattern
2. List any files that need to be updated
3. Update them to match (or flag for future cleanup)

### 4. Anti-Pattern Documentation
If the pattern was established to prevent a specific problem, also document the anti-pattern:

```markdown
## ❌ Anti-Pattern: [Name]
**Problem:** [What goes wrong]
**Example:** [Bad code]

## ✅ Correct Pattern: [Name]
**Solution:** [What to do instead]
**Example:** [Good code]
```

## Key Conventions Already Established

### Server Action Pattern
All mutations use Server Actions with Zod validation and typed error returns.

### AI Gateway Pattern
All AI calls go through `src/lib/ai/gateway.ts` — never call providers directly.

### Trust Boundary Pattern
External data is always sandwiched between XML-like delimiters in prompts and never placed in system instructions.

### Component Pattern
Server Components by default. `'use client'` only for interactivity. Props typed with `{Name}Props` interface.

### Database Access Pattern
Supabase server client for reads in Server Components. Server Actions for writes. Never expose Supabase client to browser without RLS.

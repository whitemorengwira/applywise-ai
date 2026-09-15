# ApplyWise AI — Agent Configuration

## Before Starting Any Work

1. Read `context/progress-tracker.md` to understand current state
2. Read `context/build-plan.md` to understand current phase
3. Read `context/architecture.md` to understand system design
4. Read `context/code-standards.md` to understand conventions

## Engineering Workflow

Follow this cycle for every meaningful unit of work:

```
PLAN → CONTEXT → ARCHITECT → IMPLEMENT → TEST → REVIEW → REMEMBER → COMMIT
```

## Available Skills

| Skill | Purpose | When |
|---|---|---|
| `/architect` | Architecture, planning, design | Before new features, decisions |
| `/review` | Quality control, security | After features, before commits |
| `/imprint` | Record conventions, patterns | When patterns are established |
| `/recover` | Debug, fix, restore | When things break |
| `/remember` | Update project memory | After milestones, end of sessions |

## Critical Rules

1. **Never modify architecture without documenting** — use `/architect` + ADR
2. **Never commit without review** — use `/review`
3. **Never end a session without saving state** — use `/remember`
4. **Never randomly change files when debugging** — use `/recover`
5. **Never add technology without justification** — every dependency has a reason
6. **Never present AI output as verified fact** — label generated content
7. **Never put untrusted content in system prompts** — use trust boundaries
8. **Never skip tests** — `lint`, `type-check`, and `build` must pass before commit

---
name: review
description: "Code review, security review, architecture review, and quality control skill for ApplyWise AI"
---

# /review — Review & Quality Control Skill

## Purpose
Use this skill after completing a feature, phase, or significant code change to ensure quality, security, and architectural consistency.

## When to Activate
- After completing any phase
- After implementing a major feature
- Before merging or committing significant changes
- When security-sensitive code is modified (auth, AI, external data)
- Before deployment

## Execution Steps

### 1. Context Loading
Read:
- `context/architecture.md` — Verify architectural compliance
- `context/code-standards.md` — Verify coding conventions
- `context/ui-rules.md` — Verify UI compliance (for frontend changes)
- `context/build-plan.md` — Verify scope alignment

### 2. Code Review Checklist
For each changed file, verify:

**General:**
- [ ] TypeScript strict mode — no `any`, proper types
- [ ] No console.log left in production code (use structured logging)
- [ ] Error handling — try/catch with typed error returns
- [ ] No hardcoded secrets or API keys
- [ ] Import order follows code standards
- [ ] JSDoc on exported functions

**Components (Frontend):**
- [ ] Server Component by default, `'use client'` only when needed
- [ ] Proper loading/error/empty states
- [ ] Responsive design verified
- [ ] Accessibility: keyboard nav, ARIA labels, focus indicators
- [ ] Uses `cn()` for conditional classes
- [ ] Props interface defined and typed

**Data Access:**
- [ ] All queries go through Supabase clients (never raw SQL from frontend)
- [ ] RLS policies exist for accessed tables
- [ ] Input validated with Zod before database operations
- [ ] Server Actions handle mutations (not client-side fetches)

**AI Code:**
- [ ] AI calls go through AI Gateway — not direct to OpenRouter
- [ ] Structured outputs validated with Zod
- [ ] Audit record created for AI operations
- [ ] External data sandboxed in prompts (not in system instructions)
- [ ] AI output labelled as generated (not presented as fact)

### 3. Security Review Checklist
- [ ] No secrets in code or git history
- [ ] RLS policies on new/modified tables
- [ ] Input validation on all user inputs
- [ ] External content (job descriptions, URLs) treated as untrusted
- [ ] No prompt injection vectors (external text in system prompts)
- [ ] CSRF protection on mutations
- [ ] Rate limiting consideration for AI endpoints

### 4. Test Verification
- [ ] Relevant unit tests exist and pass
- [ ] Integration tests for new service methods
- [ ] E2E tests for new user journeys
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] `npm run build` passes

### 5. Output
Document findings:
- **Pass** — Code meets quality standards, proceed
- **Issues Found** — List issues with severity (Critical/Major/Minor) and fix before proceeding
- **Architectural Concern** — Escalate to `/architect` for decision

## Severity Definitions
| Severity | Definition | Action |
|---|---|---|
| Critical | Security vulnerability, data leak, broken auth | Must fix before commit |
| Major | Architecture violation, missing validation, broken feature | Must fix before phase completion |
| Minor | Style issue, missing test, documentation gap | Fix when convenient |

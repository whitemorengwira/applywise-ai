---
name: recover
description: "Recovering from broken states, diagnosing failures, and restoring project consistency for ApplyWise AI"
---

# /recover — Recovery & Debugging Skill

## Purpose
Use this skill when the project is in a broken state — failed build, test failures, runtime errors, or corrupted configuration. This skill enforces a disciplined recovery process instead of random file changes.

## When to Activate
- Build fails (`npm run build` exits non-zero)
- Tests fail unexpectedly
- Runtime errors in development
- Deployment failure
- Database migration failure
- AI service errors
- Git conflicts or corrupted state

## Execution Steps — MUST FOLLOW IN ORDER

### 1. STOP — Do Not Change Random Files
Before touching any code:
- Read the error message completely
- Identify the specific file(s) and line(s) mentioned
- Do NOT start modifying unrelated files

### 2. Identify the Failure
```
What broke? → [Build | Test | Runtime | Deploy | Database | AI | Git]
Error message: → [exact message]
Error location: → [file:line]
When did it last work? → [last known good state]
What changed since then? → [list of changes]
```

### 3. Reproduce
- Run the failing command again to confirm the error is consistent
- Check if the error is deterministic or intermittent
- If intermittent → likely external dependency issue (API rate limit, model availability)

### 4. Diagnose
For each failure type:

**Build Failure:**
1. Read the full error output
2. Check `tsconfig.json` for type errors
3. Check for missing imports or dependencies
4. Check for circular dependencies
5. Run `npm run type-check` to isolate type errors from build errors

**Test Failure:**
1. Run the specific failing test in isolation
2. Check if the test depends on external services
3. Check if test data is stale
4. Check if a code change broke an assumption

**Runtime Error:**
1. Check browser console and server logs
2. Identify the component/service that threw
3. Check for null/undefined access
4. Check environment variables

**Deployment Failure:**
1. Check Vercel build logs
2. Check environment variables are set in Vercel
3. Check for differences between dev and prod configs
4. Check function size limits

**Database Error:**
1. Check migration order
2. Check for missing RLS policies
3. Check for type mismatches
4. Verify Supabase project is not paused

**AI Service Error:**
1. Check OpenRouter status
2. Check rate limits (429 response)
3. Check model availability (model may have been removed from free tier)
4. Check for malformed prompts
5. Test with `openrouter/free` auto-router as fallback

### 5. Fix — Smallest Safe Change
- Make the **minimum change** that fixes the error
- Do NOT refactor during recovery
- Do NOT add features during recovery
- If the fix requires an architectural change → use `/architect` first

### 6. Verify
- Run the originally failing command
- Run `npm run lint`
- Run `npm run type-check`
- Run `npm run build`
- Run `npm run test`

### 7. Document
Update `context/progress-tracker.md`:
- What broke
- Root cause
- What was fixed
- Any preventive measures added

### 8. Commit Recovery
```bash
git add .
git commit -m "fix: [description of what was fixed]"
```

## Emergency Recovery Procedures

### Git Reset (Nuclear Option)
If the codebase is severely corrupted:
```bash
# Check what changed
git status
git diff

# If changes are salvageable, stash them
git stash

# Reset to last known good commit
git log --oneline -10
git reset --hard <commit-hash>

# Re-apply salvageable changes
git stash pop
```

### Supabase Project Paused
1. Go to Supabase dashboard
2. Navigate to the project
3. Click "Restore project"
4. Wait for it to come back online
5. Verify database connectivity

### OpenRouter Rate Limited
1. Wait for rate limit window to reset (typically 1 minute for RPM, midnight UTC for RPD)
2. Implement request queuing if not already present
3. Check if daily limit reached → consider purchasing $10 credits for 1000 RPD

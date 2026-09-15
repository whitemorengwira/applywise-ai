# ApplyWise AI — Code Standards

## Language & Runtime
- **TypeScript** — strict mode enabled, no `any` unless explicitly justified
- **Node.js 24.x** — target runtime
- **ES Modules** — use `import`/`export`, never `require()`

## File Naming
- Components: `PascalCase.tsx` (e.g., `JobCard.tsx`)
- Utilities/services: `kebab-case.ts` (e.g., `model-router.ts`)
- Types: `kebab-case.ts` in `/types` directory
- Tests: `*.test.ts` or `*.test.tsx` co-located or in `/tests`
- Constants: `SCREAMING_SNAKE_CASE` within files

## Component Patterns
- Use **React Server Components** by default
- Add `'use client'` only when interactivity is required
- Props interfaces named `{ComponentName}Props`
- Destructure props in function signature
- Use `cn()` utility from `@/lib/utils` for conditional classnames
- No inline styles — use Tailwind classes or CSS modules

```tsx
// ✅ Good
interface JobCardProps {
  job: Job;
  onSelect?: (id: string) => void;
}

export function JobCard({ job, onSelect }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      {/* content */}
    </Card>
  );
}
```

## Import Order
1. React/Next.js imports
2. Third-party packages
3. Internal `@/lib` imports
4. Internal `@/components` imports
5. Internal `@/types` imports
6. Relative imports
7. Styles

## Data Access Patterns
- **Reads:** Use Supabase server client in Server Components or Server Actions
- **Writes:** Use Server Actions with Zod validation
- **AI operations:** Use API routes for streaming; Server Actions for non-streaming
- **Never** access Supabase directly from client components — always go through Server Actions or API routes

## Error Handling
- Use `try/catch` in all Server Actions and API routes
- Return typed error objects, never throw raw errors to clients
- Log errors with structured metadata
- Display user-friendly error messages via toast or inline

```tsx
// ✅ Server Action pattern
export async function updateProfile(data: ProfileFormData) {
  const validated = profileSchema.safeParse(data);
  if (!validated.success) {
    return { error: 'Invalid input', details: validated.error.flatten() };
  }
  try {
    // ... database operation
    revalidatePath('/dashboard/profile');
    return { success: true };
  } catch (error) {
    console.error('[updateProfile]', error);
    return { error: 'Failed to update profile' };
  }
}
```

## AI Code Standards
- All AI calls go through `src/lib/ai/gateway.ts`
- Never hardcode model IDs — use the Model Router
- Always validate structured AI outputs with Zod
- Always create audit records for AI operations
- Separate system instructions from external data in prompts
- Never include raw untrusted content in system messages

## Validation
- Use **Zod** for all input validation
- Define schemas in `/lib/validators/`
- Validate on both client (forms) and server (actions)

## Testing
- Unit tests: Vitest — test pure functions, scoring, validation, routing
- Integration tests: Vitest — test services with real Supabase (test project)
- E2E tests: Playwright — test critical user journeys
- AI evaluation: Custom evaluation scripts in `/tests/evaluation/`

## Git Conventions
- Branch naming: `feat/phase-{N}-{description}` or `fix/{description}`
- Commit messages: conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`)
- One logical change per commit
- No commits with failing lint or type checks

## Comments & Documentation
- Document **why**, not **what** — code should be self-documenting
- JSDoc on all exported functions
- Inline comments only for non-obvious logic
- Keep existing comments unless they describe removed functionality

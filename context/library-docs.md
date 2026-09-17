# ApplyWise AI — Library Documentation

## Core Libraries

### Next.js 15 (App Router)
- **Version:** 15.x (latest stable)
- **Router:** App Router (`src/app/`)
- **Rendering:** Server Components by default, `'use client'` for interactive
- **Data fetching:** Server Components fetch directly; no `getServerSideProps`
- **Mutations:** Server Actions (`'use server'`)
- **Streaming:** `loading.tsx` for Suspense boundaries
- **Middleware:** `middleware.ts` at project root for auth checks
- **API Routes:** `app/api/*/route.ts` for streaming AI and webhooks

### TypeScript
- **Strict mode** enabled in `tsconfig.json`
- Path aliases: `@/*` → `src/*`

### Tailwind CSS
- **Version:** v4 (latest)
- Custom theme configured in `tailwind.config.ts`
- Use `cn()` utility from `@/lib/utils` for class merging (clsx + tailwind-merge)

### shadcn/ui
- **Installation:** `npx shadcn@latest add <component>`
- Components copied to `src/components/ui/`
- Fully customisable — they are our code once added
- Built on Radix UI primitives (accessible by default)

### Supabase
- **`@supabase/supabase-js`** — Database client
- **`@supabase/ssr`** — Server-side rendering helpers for Next.js
- Three client types:
  1. **Browser client** (`createBrowserClient`) — client components
  2. **Server client** (`createServerClient`) — server components, server actions
  3. **Admin client** (`createClient` with service role) — migrations, admin ops
- Auth uses **PKCE flow** for secure server-side auth
- RLS is enforced on all queries through the standard clients

### LangChain.js
- **`langchain`** — Core framework
- **`@langchain/core`** — Base classes, prompts, output parsers
- **`@langchain/openai`** — OpenAI-compatible chat models (works with OpenCode Zen / Cloudflare AI Gateway)
- **`@langchain/community`** — Community integrations

Key usage patterns:
```typescript
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';

// OpenCode Zen via Cloudflare AI Gateway
const model = new ChatOpenAI({
  modelName: 'opencode/nemotron-3-ultra:free',
  configuration: {
    baseURL: process.env.CLOUDFLARE_AI_GATEWAY_URL || 'https://api.opencodezen.com/v1',
    defaultHeaders: { 'HTTP-Referer': 'https://applywise-ai-app.vercel.app' },
  },
  openAIApiKey: process.env.OPENCODE_ZEN_API_KEY,
});
```

### LangGraph.js
- **`@langchain/langgraph`** — Stateful agent orchestration
- **`@langchain/langgraph-checkpoint-postgres`** — Supabase-compatible checkpointing

Key usage patterns:
```typescript
import { Annotation, StateGraph } from '@langchain/langgraph';

const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({ reducer: messagesStateReducer }),
  jobDescription: Annotation<string>(),
  matchScore: Annotation<number | null>(),
});

const graph = new StateGraph(AgentState)
  .addNode('parse', parseNode)
  .addNode('retrieve', retrieveNode)
  .addNode('analyze', analyzeNode)
  .addEdge('__start__', 'parse')
  .addEdge('parse', 'retrieve')
  .addConditionalEdges('retrieve', shouldContinue)
  .addEdge('analyze', '__end__')
  .compile();
```

### Zod
- **Version:** 3.x
- Used for all input validation (forms, API inputs, AI outputs)
- Schemas defined in `src/lib/validators/`

### Vitest
- **Version:** Latest
- Config: `vitest.config.ts`
- Test files: `*.test.ts` / `*.test.tsx`
- Run: `npm run test`

### Playwright
- **Version:** Latest
- Config: `playwright.config.ts`
- Test files: `tests/e2e/*.spec.ts`
- Run: `npm run test:e2e`

## External APIs

### OpenCode Zen & Cloudflare AI Gateway
- **Base URL:** `https://api.opencodezen.com/v1` or `https://gateway.ai.cloudflare.com/v1/nwhite-systems/applywise-ai`
- **Auth:** Bearer token via `OPENCODE_ZEN_API_KEY`
- **Compatible with:** OpenAI SDK / LangChain `ChatOpenAI`
- **Free models:** `opencode/nemotron-3-ultra:free`, `opencode/nemotron-3.5-lightning:free`, `opencode/ling-3.0-flash-fin:free`, `opencode/mimo-v2.5:free`, `opencode/muse-spark-1.3:free`
- **Governance:** Hard-locked `FREE_ONLY_MODE=true` (zero silent paid fallbacks)

### Adzuna
- **Base URL:** `https://api.adzuna.com/v1/api/jobs`
- **Auth:** `app_id` + `app_key` query parameters
- **Free tier:** 1,000 calls/month
- **Coverage:** UK, US, EU, and more

### Arbeitnow
- **Base URL:** `https://www.arbeitnow.com/api/job-board-api`
- **Auth:** None required for basic access
- **Focus:** Tech/remote roles, Europe

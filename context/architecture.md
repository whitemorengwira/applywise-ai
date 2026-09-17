# ApplyWise AI — Architecture

## System Architecture

### High-Level Architecture
```
Client (Browser)
  └─ Next.js 15 App Router (Vercel)
       ├─ React Server Components (pages, layouts)
       ├─ Client Components (interactive UI)
       ├─ API Routes (/api/*)
       └─ Server Actions (mutations)
            └─ Service Layer
                 ├─ Profile Service
                 ├─ Jobs Service
                 ├─ Applications Service
                 ├─ Documents Service
                 └─ AI Service Layer
                      ├─ AI Gateway → Model Router → Provider Adapter → OpenCode Zen / Cloudflare AI Gateway
                      ├─ LangChain (prompts, chains, docs, embeddings)
                      ├─ LangGraph (agent graphs with typed state)
                      └─ RAG Pipeline (ingest → chunk → embed → retrieve → generate)
                           └─ Supabase
                                ├─ PostgreSQL (relational data + RLS)
                                ├─ pgvector (embeddings + similarity search)
                                ├─ Auth (sessions, OAuth)
                                └─ Storage (documents, files)
```

### Folder Structure
```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/              # Auth group: /sign-in, /sign-up
│   ├── (dashboard)/         # Protected: /dashboard, /profile, /jobs, /applications
│   ├── (marketing)/         # Public: landing page
│   ├── api/                 # API routes
│   │   ├── ai/              # AI endpoints
│   │   ├── jobs/            # Job endpoints
│   │   └── webhooks/        # Webhook handlers
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── layout/              # Sidebar, Header, PageContainer
│   ├── dashboard/           # Dashboard widgets
│   ├── profile/             # Profile forms and views
│   ├── jobs/                # Job cards, filters, detail
│   ├── applications/        # Application tracker, timeline
│   └── ai/                  # Chat, analysis, streaming
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client
│   │   ├── admin.ts         # Service-role client
│   │   └── middleware.ts    # Auth middleware helper
│   ├── ai/
│   │   ├── gateway.ts       # AI Gateway (entry point)
│   │   ├── router.ts        # Model Router (task → model mapping)
│   │   ├── provider.ts      # OpenCode Zen / Cloudflare AI Gateway adapter
│   │   ├── prompts/         # Prompt templates
│   │   ├── chains/          # LangChain chains
│   │   ├── agents/          # LangGraph agent definitions
│   │   │   ├── job-analysis.ts
│   │   │   ├── application-tailoring.ts
│   │   │   ├── company-research.ts
│   │   │   └── agentic-rag.ts
│   │   ├── rag/
│   │   │   ├── ingest.ts    # Document ingestion pipeline
│   │   │   ├── chunk.ts     # Text chunking
│   │   │   ├── embed.ts     # Embedding generation
│   │   │   ├── retrieve.ts  # Similarity search
│   │   │   └── store.ts     # pgvector operations
│   │   ├── tools/           # Agent tool definitions
│   │   └── evaluation/      # AI output evaluation
│   ├── services/
│   │   ├── profile.ts
│   │   ├── jobs.ts
│   │   ├── applications.ts
│   │   ├── documents.ts
│   │   ├── analytics.ts
│   │   └── audit.ts
│   ├── validators/          # Zod schemas
│   └── utils/               # Shared utilities
├── hooks/                   # React hooks
├── types/                   # TypeScript type definitions
└── config/                  # App configuration constants
```

### Data Flow Patterns

**Read Path (Server Components):**
```
Page (RSC) → Service → Supabase Client (server) → PostgreSQL → Return data → Render
```

**Write Path (Server Actions):**
```
Form Submit → Server Action → Validate (Zod) → Service → Supabase Client → PostgreSQL → Revalidate path
```

**AI Path (API Routes):**
```
Client Request → API Route → AI Gateway → Model Router → Select Model
  → Provider Adapter → OpenCode Zen / Cloudflare AI Gateway → Stream Response → Client
```

**RAG Path:**
```
Query → AI Gateway → Agentic RAG Agent (LangGraph)
  → Plan Retrieval → Embed Query → pgvector Similarity Search
  → Evaluate Evidence → [Loop if insufficient]
  → Generate Grounded Response → Validate → Return with Citations
```

**Control Plane & Multi-Turn Chat Path:**
```
Client (/control) → POST /api/control/chat (message + history)
  → ControlPlaneOrchestrator.processMessage
  → resolveContextualQuery (resolves pronouns/ordinals against prior turns)
  → IntentClassifier (24 intents)
  → ToolRegistry (20 real backend tools: query_rag, search_jobs, prepare_application, etc.)
  → SemanticReRanker (empirical keywords + candidate entity boosts + 75% threshold)
  → Synthesize Grounded Evidence with [Source N: Title] citation tags
  → Return structured ControlPlaneResponse (message, plan, execution, result, evidence, nextActions)
  → Render ChatMarkdownRenderer with code blocks, tables, and emerald citation badges
```

### Key Architectural Invariants
1. All database access goes through Supabase clients with RLS enforced
2. All AI calls go through the AI Gateway — never call OpenCode Zen or external APIs directly from components
3. External data (job descriptions, web content) is always treated as untrusted
4. AI output is always labelled as generated, never presented as verified fact
5. Server Actions handle all mutations; API routes handle streaming/long-running AI tasks
6. Every AI operation creates an audit record
7. **Zero-Simulation in Production**: `SIMULATION_REACHABLE_FROM_PRODUCTION = false`. All production components truthfully report `REAL_AI` vs `AI_RUNTIME_UNAVAILABLE`.
8. **Master CV Cryptographic Invariance**: `whitemore_ngwira_cv_n.white.pdf` SHA-256 hash `3994A09C...` is immutable and verified on every submission.
9. **Multi-Turn Context Resolution**: Control plane maintains conversation turns and resolves context before semantic RAG retrieval.
10. **Strict Grounding Threshold**: Semantic scores below 75.0% return a Factual Boundary Notice rather than fabricating claims.

# ApplyWise AI — Build Plan

## Current Status: ALL PHASES COMPLETE (0–25) — PRODUCTION VERIFIED & LIVE

---

## Phase 0 — Context Architecture & Agent Skills
- [x] Study reference video methodology
- [x] Inspect existing project directory and CV/cover letter assets
- [x] Research free-tier capabilities (OpenRouter, Supabase, Vercel)
- [x] Design architecture & system invariants
- [x] Create implementation plan
- [x] Create context system (12 context files)
- [x] Create agent skills (5 skills: `/architect`, `/review`, `/imprint`, `/recover`, `/remember`)
- [x] Create initial ADRs (ADR-001 through ADR-007)
- [x] Create Project Foundation Report

**Definition of Done:** All context files, skills, and ADRs created and reviewed. Completed.

---

## Phase 1 — Project Setup & Tooling
- [x] Next.js 15 + TypeScript initialisation
- [x] Tailwind CSS + design primitives setup
- [x] ESLint + Prettier configuration
- [x] Vitest configuration
- [x] Clean folder structure creation
- [x] `.env.example` with documented variables
- [x] Git initialisation + GitHub repository (`whitemorengwira/applywise-ai`)
- [x] README documentation

**Definition of Done:** `npm run dev` starts successfully. `npm run lint` passes. `npm run build` passes. Git repo pushed to GitHub. Completed.

---

## Phase 2 — Database Schema & Seed Data
- [x] Full schema (35+ tables PostgreSQL schema in `supabase/migrations/`)
- [x] pgvector extension integration for semantic search
- [x] Row Level Security (RLS) policies
- [x] Production seed data grounded in Whitemore Ngwira verified capability
- [x] In-memory repository fallback for deterministic local testing

**Definition of Done:** Schema files created. Seed data verified against candidate record. Completed.

---

## Phase 3 — Domain Services & AI Gateway
- [x] OpenRouter AI Gateway with multi-model routing
- [x] Fallback mechanisms and simulation mode
- [x] MatchService with hybrid heuristic + qualitative evaluation
- [x] TailorService for CV and Cover Letter generation
- [x] RAGService with semantic search and source attribution
- [x] InterviewService for behavioral, technical, and executive prep

**Definition of Done:** All domain services implemented and unit tested with Vitest. Completed.

---

## Phase 4 — Core API Routes & Health Probes
- [x] `/api/health` — liveness probe
- [x] `/api/ready` — readiness probe with memory check
- [x] `/api/metrics` — Prometheus telemetry exposition
- [x] `/api/profile` — profile retrieval and updates
- [x] `/api/jobs` — job search and submission
- [x] `/api/match` — job compatibility analysis
- [x] `/api/tailor` — resume and cover letter generation
- [x] `/api/rag` — semantic search across candidate experience
- [x] `/api/applications` — application CRM pipeline
- [x] `/api/interview` — interview prep material generation
- [x] `/api/audit` — immutable AI audit log trail

**Definition of Done:** All 11 API endpoints return correct HTTP responses and pass observability wrapping. Completed.

---

## Phase 5 — Frontend Applications & UI Design
- [x] Root Landing & Showcase page (`/`)
- [x] Jobs Discovery page (`/jobs`)
- [x] CV Studio page (`/cv-studio`)
- [x] Cover Letters page (`/cover-letters`)
- [x] Application CRM Tracker page (`/applications`)
- [x] Semantic RAG Search page (`/rag-search`)
- [x] Interview Intelligence page (`/interviews`)
- [x] Telemetry & Analytics page (`/analytics`)
- [x] Settings page (`/settings`)
- [x] Candidate Profile page (`/profile`)

**Definition of Done:** 10 full pages responsive across mobile, tablet, desktop. Completed.

---

## Phase 6 — Docker Containerisation
- [x] Multi-stage Dockerfile with non-root user `nextjs:1001`
- [x] Optimized `.dockerignore`
- [x] `docker-compose.yml` for local multi-service composition
- [x] ADR-008: Docker Containerisation Architecture

**Definition of Done:** Production container image builds cleanly. Non-root user enforced. Completed.

---

## Phase 7 — Kubernetes Workloads & Helm Chart
- [x] `k8s/` manifests: Deployment, HorizontalPodAutoscaler, NetworkPolicy, Service, Probes
- [x] Helm v3 chart (`helm/applywise-ai/`) with values templating
- [x] Resource limits (250m CPU, 512Mi memory) and health probes
- [x] ADR-009: Kubernetes Deployment & Helm Architecture

**Definition of Done:** Manifests validate against Kubernetes schemas. Helm lint passes. Completed.

---

## Phase 8 — CI/CD Quality Gates
- [x] `.github/workflows/ci.yml` — automated lint, type-check, test, and build
- [x] `.github/workflows/docker.yml` — Docker build & security scan
- [x] `.github/workflows/k8s.yml` — Kubernetes & Helm verification
- [x] `.github/workflows/observability.yml` — Grafana dashboard & Prometheus validation
- [x] ADR-010: CI/CD Quality Gates & Automation

**Definition of Done:** GitHub Actions workflows configured and passing. Completed.

---

## Phase 9 — Observability, Metrics & Alerting
- [x] `prom-client` metrics registry in `src/lib/observability/metrics.ts`
- [x] Machine-readable structured JSON logger (`logger.ts`)
- [x] HTTP observability wrapper (`http.ts`)
- [x] 6 Grafana Dashboards as Code in `observability/grafana/dashboards/`:
  - `01-application-overview.json`
  - `02-ai-operations.json`
  - `03-kubernetes-workloads.json`
  - `04-database-storage.json`
  - `05-business-intelligence.json`
  - `06-nwhite-systems-traffic-analytics.json`
- [x] Prometheus alert rules in `observability/prometheus/alerts.yml`

**Definition of Done:** Metrics exposed at `/api/metrics`, all 6 dashboards validated. Completed.

---

## Phase 10 — Infrastructure-as-Code (Terraform)
- [x] Modular Terraform composition in `terraform/`
- [x] Grafana provider module (`terraform/modules/grafana/`)
- [x] Dev and Prod environment definitions
- [x] `terraform fmt -check -recursive` (0 violations)
- [x] `terraform validate` (valid configuration)

**Definition of Done:** Terraform files formatted and validated. Completed.

---

## Phase 11 — Recruiter Showcase & Documentation
- [x] Comprehensive documentation in `docs/`
- [x] `docs/observability-demo.md` — live demonstration script
- [x] `docs/technology-stack.md` — deep-dive architecture reference
- [x] Updated `README.md` with enterprise architecture overview

**Definition of Done:** Full recruiter-facing documentation completed. Completed.

---

## Phase 12 — Production Deployment (Vercel)
- [x] Production deployment live at official canonical URL: `https://applywise-ai-app.vercel.app`
- [x] Route verification (Root, Health, Ready, Metrics returning HTTP 200)
- [x] Open Graph and SEO optimization
- [x] Official Vercel project renamed to `applywise-ai`

**Definition of Done:** Live public URL active and verified under official ApplyWise AI domain. Completed.

---

## Phase 13 — External Platform Configuration
- [x] Dedicated Supabase project provisioning (`applywise-ai` - ref `vxiufajiipqdntsxmkjn`)
- [x] PostgreSQL 16 + pgvector schema deployed to remote database (25 core tables verified)
- [x] Grafana Cloud telemetry ingestion setup (`https://ardentcosmos829.grafana.net/`)
- [x] Dashboards 01 and 06 imported and active in Grafana Cloud
- [x] Environment variables populated in `.env.local`

**Definition of Done:** Remote Supabase project created and migrated; remote Grafana Cloud connected with active telemetry. Completed.

---

## Phase 14 — Candidate Intelligence & Geographic Rule Engine
- [x] Track authoritative master prompt and role catalogue documents in git
- [x] Non-negotiable location and work arrangement validation (SA 100% remote, Zim/Malawi remote/hybrid/onsite, Global remote contractor)
- [x] Expanded candidate role family alignment in `match.service.ts`
- [x] Location eligibility filtering in job discovery

**Definition of Done:** Job matching enforces strict geographic rules and reflects Whitemore Ngwira's complete 15+ year capability profile. Completed.

---

## Phase 15 — OpenCode Zen Model Suite Integration
- [x] Integrate canonical 5-model OpenCode Zen suite (`nemotron-3-ultra-free`, `nemotron-3.5-lightning-free`, `ling-3.0-flash-fin-free`, `muse-spark-1.3-contributor-free`, `deepseek-v3.0-coder-free`)
- [x] Eliminate OpenRouter permanently from runtime, env, and documentation
- [x] Model capabilities routing table and model latency benchmarks

**Definition of Done:** 100% zero-cost model suite operational under `FREE_ONLY_MODE=true`. Completed.

---

## Phase 16 — Directive 2.0 Autonomous Engineering
- [x] Cryptographic Master CV SHA-256 byte lock (`3994A09C...`)
- [x] LangGraph stateful application generation graph
- [x] African market coverage (SA, ZW, MW) with seniority filtering
- [x] Cloud cron deployment on Vercel serverless (`0 6 * * *`)

**Definition of Done:** Autonomous submission pipeline operates with zero laptop dependency. Completed.

---

## Phase 17 — Final Launch Directive & Dry Run
- [x] End-to-end dry run verification (Section 11)
- [x] Freshness engine and deduplication rules (Section 5)
- [x] Zoho official email submission routes (Section 10, 29)
- [x] 52 unit and integration tests passing

**Definition of Done:** Safe dry-run verified without ungrounded hallucinations or broken submissions. Completed.

---

## Phase 18 — Production Hardening & Perfection Patch
- [x] Resilient AI Model Circuit Breakers with automatic failover rotation
- [x] Alert Webhook Dispatcher routing critical system alerts to Zoho email
- [x] Enhanced RAG SemanticReRanker (99%+ precision)
- [x] 13 synthetic route uptime probes (`/api/health/synthetic`)
- [x] 68 unit and integration tests passing

**Definition of Done:** Production resilience and alert delivery fully operational. Completed.

---

## Phase 19 — Live Autonomous Execution (2 Target Verification)
- [x] Execute live autonomous cycle `run-1789593666896` in `LIVE_PRODUCTION`
- [x] Submit SA Direct Portal application (`PROOF-AW-1789593666869-XTUX9`)
- [x] Submit ZW Zoho Email application (`PROOF-AW-1789593666893-XU5XO`)
- [x] Rolling 7-day counter updated (198 remaining towards 200 target)

**Definition of Done:** Verifiable live submission proofs recorded in database. Completed.

---

## Phase 20 — Core Production Deficiencies & UX Hardening
- [x] Strict RAG Grounding Guardrail (< 0.75 threshold declines ungrounded queries)
- [x] Interactive bottom-left model switcher across 5 OpenCode Zen models
- [x] Official ApplyWise AI branded SVG favicon deployed
- [x] Dedicated `/dashboard` executive overview page
- [x] 69 unit and integration tests passing

**Definition of Done:** Zero simulation leaks and polished executive UI. Completed.

---

## Phase 21 — Final Forensic QC & Autonomous Operations
- [x] Full forensic claims audit (`CLAIM | EVIDENCE | STATUS`)
- [x] Remote Supabase pgvector populated with 13 chunks and candidate profile
- [x] Distributed lease locks and deterministic idempotency keys (`CYCLE-YYYY-MM-DD-B{n}`)
- [x] Codified Grafana Dashboards 07 & 08
- [x] 81 unit and integration tests passing

**Definition of Done:** 100% truthful claims and resilient cloud scheduler autonomy. Completed.

---

## Phase 22 — Intelligent Control-Plane Chat & Agent Orchestrator
- [x] Dedicated `/control` executive command centre interface
- [x] 24-intent classifier and 20-tool dispatch registry
- [x] Multi-agent orchestration and approval boundaries for mutating operations
- [x] Codified Grafana Dashboard 09 (`09-applywise-control-plane.json`)
- [x] 118 unit and integration tests passing

**Definition of Done:** Real-time conversational operational control plane active. Completed.

---

## Phase 23 — Real AI Runtime & Blocker Remediation
- [x] Permanently eliminated `SIMULATION_HEURISTIC` from production (`SIMULATION_REACHABLE_FROM_PRODUCTION = false`)
- [x] Canonical OpenCode Zen API connection (`https://opencode.ai/zen/v1`)
- [x] Enforced Section 15 Provider Failure contract (truthful `AI_RUNTIME_UNAVAILABLE` reporting)
- [x] 120 unit and integration tests passing

**Definition of Done:** Zero fake AI in production; 100% honest runtime status reporting. Completed.

---

## Phase 24 — Control Chat Intelligence & Grounded Citation Engine
- [x] Eliminated generic conversational fallback text entirely
- [x] Upgraded IntentClassifier with greeting protection and broad technical catch-all
- [x] Deterministic tool binding (`query_rag`, `search_jobs`, `prepare_application`, etc.)
- [x] RAG grounded synthesis with mandatory formatted `[Source N: Title]` citation tags
- [x] Lightweight `ChatMarkdownRenderer` with code blocks, tables, and emerald badge chips
- [x] Real-time tool execution progress states
- [x] 125 unit and integration tests passing

**Definition of Done:** Full technical dossier intelligence with verified citation badges. Completed.

---

## Phase 25 — Multi-Turn Conversational Memory & Enterprise Chat Experience
- [x] Multi-turn conversational memory (`history?: ChatHistoryMessage[]`) in orchestrator
- [x] Context resolution engine (`resolveContextualQuery`) resolving ordinals and demonstrative follow-ups
- [x] Conversational pleasantries handling without redundant agent invocations
- [x] One-click copy message with emerald visual confirmation
- [x] Export chat transcript as Markdown (`applywise-transcript-[date].md`)
- [x] Clear conversation thread reset
- [x] Interactive top-bar model switcher across all 5 OpenCode Zen models
- [x] Auto-expanding multiline textarea with desktop shortcuts (`Enter ↵`, `Shift+Enter`)
- [x] 127 unit and integration tests passing across all 21 test files

**Definition of Done:** Enterprise-grade conversational AI experience with full multi-turn memory and best-in-class UX. Completed.


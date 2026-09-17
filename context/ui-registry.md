# ApplyWise AI — UI Registry

## Component Registry

This document tracks all reusable UI components and their implementation status in accordance with the design system and ADR-002.

### Base Components (`src/components/ui/`)

| Component | Status | Path | Notes |
|---|---|---|---|
| Button | [x] | `src/components/ui/button.tsx` | Primary, secondary, ghost, outline, destructive variants |
| Input | [x] | `src/components/ui/input.tsx` | Accessible text input with state styling |
| Card | [x] | `src/components/ui/card.tsx` | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| Badge | [x] | `src/components/ui/badge.tsx` | Status badges, category labels, skill tags |
| ChatMarkdownRenderer | [x] | `src/components/control/chat-markdown.tsx` | Zero-dependency markdown parser for tables, code blocks, emerald citation chips |

### Layout Components (`src/components/layout/`)

| Component | Status | Path | Notes |
|---|---|---|---|
| AppShell | [x] | `src/components/layout/app-shell.tsx` | Top-level provider and page container shell |
| Navbar | [x] | `src/components/layout/navbar.tsx` | Responsive header with recruiter badge & navigation |
| Sidebar | [x] | `src/components/layout/sidebar.tsx` | Full enterprise navigation with status indicators |

### Feature & Page Components (`src/app/`)

| Page / Feature | Status | Path | Purpose |
|---|---|---|---|
| Root Landing & Showcase | [x] | `src/app/page.tsx` | Flagship landing, hero metrics, system health |
| Dashboard Overview | [x] | `src/app/dashboard/page.tsx` | Executive summary, active targets, quick actions |
| Control Centre (Chat) | [x] | `src/app/control/page.tsx` | Multi-turn conversational orchestrator, command centre |
| Jobs Discovery | [x] | `src/app/jobs/page.tsx` | Job board, search filters, match score preview |
| CV Studio | [x] | `src/app/cv-studio/page.tsx` | CV viewer, tailor generator, diff view |
| Cover Letters | [x] | `src/app/cover-letters/page.tsx` | Tailored cover letter generator with citations |
| Application CRM Tracker | [x] | `src/app/applications/page.tsx` | Pipeline stages, status changes, timeline |
| Semantic RAG Search | [x] | `src/app/rag-search/page.tsx` | Vector-grounded semantic candidate search |
| Interview Intelligence | [x] | `src/app/interviews/page.tsx` | Behavioral, technical, and executive prep |
| Telemetry & Analytics | [x] | `src/app/analytics/page.tsx` | Golden signals, AI metrics, audit trails |
| Settings | [x] | `src/app/settings/page.tsx` | Platform configurations, API keys, preferences |
| Profile | [x] | `src/app/profile/page.tsx` | Candidate credentials, experience, skills |

### Observability & Dashboards (`observability/grafana/dashboards/`)

| Dashboard | Status | Path | Panels |
|---|---|---|---|
| Application Overview | [x] | `01-application-overview.json` | Four Golden Signals, Traffic by route, Latency quantiles |
| AI Operations | [x] | `02-ai-operations.json` | Invocations, p95 inference latency, circuit breakers, token usage |
| Kubernetes Workloads | [x] | `03-kubernetes-workloads.json` | Heap memory, CPU rate, event loop lag, GC duration |
| Database & Storage | [x] | `04-database-storage.json` | Query throughput, p95 latency, pgvector search stats |
| Business Intelligence | [x] | `05-business-intelligence.json` | Jobs analyzed, CRM pipeline, CV generation velocity |
| N.White Systems Traffic | [x] | `06-nwhite-systems-traffic-analytics.json` | Unified cloud & traffic analytics, geo distribution |
| Idempotency & Leases | [x] | `07-idempotency-and-leases.json` | Distributed lease locks, cycle idempotency keys |
| Claims Verification | [x] | `08-claims-verification.json` | Truthful claims verification table, zero-simulation audit |
| Control Plane Telemetry | [x] | `09-applywise-control-plane.json` | 24-intent classification, tool latency, approvals |

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

## Available Skills (22 Persistent JSM Skills)

| Skill | Purpose | When |
|---|---|---|
| `/architect` | Architecture, planning, design, and ADR creation | Before new features, architectural decisions |
| `/review` | Quality control, security, and integrity verification | After features, before commits |
| `/imprint` | Record conventions, patterns, and architectural rules | When patterns are established |
| `/recover` | Debug, fix, restore, and diagnose failure states | When things break or tests fail |
| `/remember` | Update project memory, progress tracker, and build plan | After milestones, end of sessions |
| `/control-plane` | Control centre orchestrator, multi-turn chat, and tool dispatching | Inquiries into `/control` and operations |
| `/candidate-evidence`| Multi-source intelligence graph (CV, N.White Systems, case studies) | Profile queries, matching, evidence grounding |
| `/cv-integrity` | Cryptographic SHA-256 immutability lock (`3994A09C...`) | Pre-submission verification, CV updates |
| `/free-tier-governance`| Zero-cost budget locks, fallbacks, and zero-simulation governance | Model selection, service additions |
| `/model-routing` | OpenCode Zen 5-model suite, circuit breakers, and Cloudflare AI Gateway | AI task routing, model failover |
| `/rag` | Multi-source pgvector RAG (13 chunks), SemanticReRanker, 75% threshold | Career Q&A, evidence retrieval |
| `/cover-letter` | Adaptive executive cover letters in British English, zero hallucination | Application preparation |
| `/job-discovery` | African and global vacancy discovery, freshness, deduplication | Job searching, feed polling |
| `/job-eligibility`| Authoritative geographic rules (SA/ZW/MW Remote/Hybrid/On-site) | Fit evaluation, vacancy triage |
| `/job-matching` | Three-way candidate matching across CV, portfolio, and JD | Match scoring, alignment analysis |
| `/langgraph-orchestration`| Stateful multi-agent application workflow, proof capture | Application preparation and submission |
| `/application` | Submission routing, proof capture, 200 apps/week target | Application pipeline management |
| `/observability` | 9 Grafana Cloud dashboards, Prometheus telemetry, synthetic probes | Monitoring, metrics inspection |
| `/company-research`| Tech stack detection, business model analysis, company intelligence | Pre-application company evaluation |
| `/zoho-email` | Official business email application routing and audit trail | Email submissions, alert dispatch |
| `/github-showcase`| Recruiter showcase repo maintenance and code demonstrations | Portfolio reviews, public showcase |
| `/marketing` | Growth intelligence promoting Whitemore Ngwira and N.White Systems | Portfolio dissemination, outreach |

## Critical Rules

1. **Never modify architecture without documenting** — use `/architect` + ADR
2. **Never commit without review** — use `/review`
3. **Never end a session without saving state** — use `/remember`
4. **Never randomly change files when debugging** — use `/recover`
5. **Never add technology without justification** — every dependency has a reason
6. **Never present AI output as verified fact** — label generated content
7. **Never put untrusted content in system prompts** — use trust boundaries
8. **Never skip tests** — `lint`, `type-check`, and `build` must pass before commit

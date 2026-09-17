---
name: model-routing
description: "Operational model routing skill for OpenCode Zen 100% Free-Tier Suite and Cloudflare AI Gateway"
---

# /model-routing — OpenCode Zen Model Routing & Cloudflare AI Gateway Skill

## Purpose
Manages dynamic model routing by task capability under strict `FREE_ONLY_MODE=true`.

## Architecture Invariants
- **NO OpenRouter**: OpenRouter is completely purged from runtime, env, and docs.
- **Canonical OpenCode Zen Free Models (5)**:
  - `nemotron-3-ultra-free` (`opencode/nemotron-3-ultra:free`) — Default reasoning, LangGraph workflows, RAG synthesis, match evaluation.
  - `nemotron-3.5-lightning-free` (`opencode/nemotron-3.5-lightning:free`) — Fast extraction, keyword parsing, schema normalization.
  - `ling-3.0-flash-fin-free` (`opencode/ling-3.0-flash-fin:free`) — Company research, compensation benchmarks, financial health.
  - `muse-spark-1.3-contributor-free` (`opencode/muse-spark-1.3:free`) — Adaptive cover letter creative drafting.
  - `deepseek-v3.0-coder-free` (`opencode/deepseek-v3.0-coder:free`) — Code analysis, infrastructure scripts, and systems engineering queries.
- **Cloudflare AI Gateway**: Edge caching, rate limiting, and zero-cost observability across 300+ edge locations.
- **Free-Tier Enforcement**: If a free model is unavailable, rotate through circuit breakers or fail safely with logged telemetry. Never trigger silent paid inference.
- **Zero Simulation Governance**: `SIMULATION_REACHABLE_FROM_PRODUCTION = false`. Never emit mock or simulation labels in production.
- **Section 15 Provider Failure Contract**: When upstream inference is unavailable, truthfully report `AI_RUNTIME_UNAVAILABLE` rather than generating mock AI output.
- **Interactive Multi-Model Switcher**: Accessible live from `/settings` and `/control` header bar with `localStorage` persistence and event broadcasting.

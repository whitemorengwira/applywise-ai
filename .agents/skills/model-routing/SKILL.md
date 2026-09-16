---
name: model-routing
description: "Operational model routing skill for OpenCode Zen 100% Free-Tier Suite and Cloudflare AI Gateway"
---

# /model-routing — OpenCode Zen Model Routing & Cloudflare AI Gateway Skill

## Purpose
Manages dynamic model routing by task capability under strict `FREE_ONLY_MODE=true`.

## Architecture Invariants
- **NO OpenRouter**: OpenRouter is completely purged from runtime, env, and docs.
- **OpenCode Zen Free Models**:
  - `opencode/nemotron-3-ultra:free` — Complex reasoning, LangGraph workflows, RAG synthesis, match evaluation.
  - `opencode/nemotron-3.5-lightning:free` — Fast extraction, keyword parsing, schema normalization.
  - `opencode/ling-3.0-flash-fin:free` — Company research, compensation benchmarks, financial health.
  - `opencode/mimo-v2.5:free` — Multimodal layout analysis and structured document parsing.
  - `opencode/muse-spark-1.3:free` — Adaptive cover letter creative drafting.
- **Cloudflare AI Gateway**: Edge caching, rate limiting, and zero-cost observability across 300+ edge locations.
- **Free-Tier Enforcement**: If a free model is unavailable, queue or fail safely with logged telemetry. Never trigger silent paid inference.

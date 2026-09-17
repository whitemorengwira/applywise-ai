---
name: free-tier-governance
description: "Zero-cost free tier governance rules, budget locks, and fallback handling for ApplyWise AI"
---

# /free-tier-governance — Free-Tier Governance & Zero-Cost Policy Skill

## Purpose
Enforces the mandatory rule: **100% Free-Tier Architecture**.
ApplyWise AI must operate permanently under `FREE_ONLY_MODE=true` without requiring credit card spend or paid inference.

## Free-Tier Matrix
| Service | Free Allowance | Usage Guardrail | Fallback Action |
|---|---|---|---|
| **OpenCode Zen Models** | 100% Free Inference Models | 5 Free model IDs (`:free`) | Rotate through free model rotation chain |
| **Cloudflare AI Gateway** | 100,000 requests/month free | Edge caching enabled | Direct free API endpoint |
| **Supabase PostgreSQL + pgvector** | 500 MB database, 2 projects free | Connection pooling & 13 chunks | Dedicated eu-west-1 project `vxiufajiipqdntsxmkjn` |
| **Grafana Cloud** | 10k metric series, 50GB logs free | Low-cardinality metric labels | Drop high-cardinality labels |
| **Vercel Hosting & Crons** | 1 cron/project, serverless free | Schedule `0 6 * * *` (daily cycle) | Serverless execution with idempotency locks |
| **Adzuna API** | 250 calls/day free | Cache results in Supabase | Seed opportunities feed |

## Rules
1. **Never Silently Upgrade**: If a model rate-limits, back off or fail safely. Never substitute a paid API.
2. **Paid Model Blocking**: `AIGateway` validates model against `OPENCODE_ZEN_MODELS` with `tier === "Free"`. Non-free requests throw `FREE_TIER_VIOLATION`.
3. **Zero Simulation in Production**: `SIMULATION_REACHABLE_FROM_PRODUCTION = false`. All production components report honest runtime status (`REAL_AI` vs `AI_RUNTIME_UNAVAILABLE`). Mock or simulation labels are forbidden in production.
4. **Section 15 Provider Failure Contract**: Truthfully report provider unavailability when keys or upstream services are down, without fabricated output.

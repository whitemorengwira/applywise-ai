---
name: rag
description: "pgvector vector store, multi-source chunking, semantic retrieval, and grounding validation skill"
---

# /rag — Multi-Source pgvector RAG & Career Memory Skill

## Purpose
Governs the durable retrieval-augmented generation pipeline over Whitemore Ngwira's Master CV, N.White Systems website, and verified platform evidence.

## Pipeline Architecture
`Source Documents (Master CV, N.White Systems, Client Case Studies)`
→ `Ingestion & Sanitization`
→ `13 Semantic Knowledge Chunks`
→ `Embeddings (pgvector in eu-west-1 Supabase)`
→ `HNSW Cosine Index (1536-dim normalized)`
→ `SemanticReRanker (N-gram affinity + token coverage + tech affinity + category + empirical density + entity boost)`
→ `Grounding Guardrail (Strict >= 75.0% threshold)`
→ `Deterministic Evidence Citation: [Source N: Title]`
→ `Grounded Synthesis (Live inference or 100% verified fallback)`

## 13 Indexed Core Knowledge Chunks
1. `chunk-professional-background` — Master CV Principal Technology Architect (14+ years)
2. `chunk-nwhite-systems-overview` — N.White Systems philosophy: "The model is only one part of the system"
3. `chunk-earcodex-insurtech` — EarCodeX AWS cloud-native claims administration & document intelligence
4. `chunk-supabets-high-traffic` — Supabets regulated gaming payment architecture (12,000 req/sec, sub-second latency)
5. `chunk-nico-life-platform` — NICO Life mobile performance & regulatory compliance
6. `chunk-socinga-mining-platform` — Socinga smart mining shaft-to-mill industrial IoT telemetry
7. `chunk-samf-archival-platform` — SAMF cryptographic SHA-256 archival across 21 major broadcast productions
8. `chunk-terraform-cloud-blueprints` — 37 modular AWS Terraform blueprints, KMS envelope encryption, Tailscale zero-trust
9. `chunk-ai-gateway-routing` — Enterprise AI Gateways (LiteLLM, Cloudflare AI Gateway across 300+ cities)
10. `chunk-geographic-eligibility-rules` — Authoritative Africa & global remote contractor rules
11. `chunk-cover-letter-philosophy` — British English, adaptive executive tailoring, zero hallucination
12. `chunk-master-cv-cryptographic-lock` — SHA-256 byte invariant (`3994A09C...`)
13. `chunk-cloud-scheduler-telemetry` — Vercel serverless autonomous cron (`0 6 * * *`)

## Invariant Grounding Principles
- **Strict Grounding Guardrail**: If query relevance score is below 75%, query is declined with an authoritative **Factual Boundary Notice** rather than fabricating ungrounded claims.
- **Mandatory Formatted Badges**: Every response must cite sources using `[Source N: Title]` format, rendered as emerald badges in the UI.
- **Multi-Turn Context Awareness**: Resolves follow-up queries (*"tell me more about that"*, *"what AWS services did it use?"*) against prior conversational turns.

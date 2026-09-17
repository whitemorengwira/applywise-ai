---
name: observability
description: "Grafana Cloud, Prometheus metrics, and structured telemetry command centre operations"
---

# /observability — Grafana Command Centre & Prometheus Observability Skill

## Purpose
Governs real-time observability across AI model inference, RAG retrieval latency, job discovery, application submissions, and cloud infrastructure.

## Core Telemetry Endpoints
- `/api/health`: Health & readiness check returning service and model statuses.
- `/api/ready`: Readiness probe for Kubernetes and Docker orchestrators.
- `/api/metrics`: Prometheus exposition endpoint with low-cardinality metric labels.
- `/api/alerts/webhook`: Alertmanager & operational webhook receiver dispatching critical alerts to Zoho Mail.
- `/api/health/synthetic`: 13 synthetic route probes with zero external network dependency.

## Grafana Command Centre Dashboards (9 Codified Dashboards)
- **01 — Executive Overview & Job Acquisition Pipeline**: Active vacancies, eligible roles, submission velocity, rolling 7-day target (towards 200 applications/week).
- **02 — AI Model Routing & Token Economics**: OpenCode Zen free models, request latency, token consumption, circuit breaker state, zero-dollar cost tracking.
- **03 — Agentic RAG & Candidate Memory Bank**: Vector chunk retrieval latency, similarity scores, citation frequency, 13 pgvector chunks.
- **04 — Autonomous Cloud Operations**: Cron execution history, success rate, error recovery, run leases.
- **05 — Cloud & Network Infrastructure**: Vercel serverless latency, edge cache hit rates, HTTP status distribution.
- **06 — N.White Systems Unified Cloud & Traffic Analytics**: Consolidated platform traffic across portfolio assets.
- **07 — Idempotency & Lease Lock Operations**: Distributed lease locks, cycle idempotency keys (`CYCLE-YYYY-MM-DD-B{n}`), lock contention.
- **08 — Forensics & Claims Auditing**: Truthful claims verification table, zero-simulation audit, evidence provenance tracking.
- **09 — ApplyWise Control Plane & Intent Telemetry**: 24-intent classification breakdown, tool latency, approval workflows, conversational turns.

## Control Chat & Agent Telemetry
- `control_chat_requests_total{intent, runtime_status}`: Total control plane requests handled.
- `control_chat_duration_seconds{intent}`: Latency histogram for intent classification and tool dispatch.
- `control_chat_intent_total{intent}`: Intent distribution counter.
- `control_chat_approvals_total{action_type, status}`: Approval decisions counter (approved vs rejected).

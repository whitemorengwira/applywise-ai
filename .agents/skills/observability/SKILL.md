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

## Grafana Command Centre Dashboards
- **01 — Executive Overview & Job Acquisition Pipeline**: Active vacancies, eligible roles, submission velocity, rolling 7-day target (towards 200 applications/week).
- **02 — AI Model Routing & Token Economics**: OpenCode Zen free models, request latency, token consumption, simulated vs live inference, zero-dollar cost tracking.
- **03 — Agentic RAG & Candidate Memory Bank**: Vector chunk retrieval latency, similarity scores, citation frequency.
- **04 — Autonomous Cloud Operations**: Cron execution history, success rate, error recovery, run leases.
- **05 — Cloud & Network Infrastructure**: Vercel serverless latency, edge cache hit rates, HTTP status distribution.
- **06 — N.White Systems Unified Cloud & Traffic Analytics**: Consolidated platform traffic across portfolio assets.

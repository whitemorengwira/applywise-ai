# Prometheus Metrics Specification & Catalog — ApplyWise AI

## Overview

ApplyWise AI exports standard Prometheus-compatible telemetry at the `/api/metrics` endpoint using `prom-client`. The metrics catalogue is specifically engineered for **zero-cost observability**, adhering to strict low-cardinality constraints so that telemetry remains well below the Grafana Cloud Free tier limit of 10,000 active series.

---

## 1. High-Cardinality Protection Rules

| Category | Strict Rule |
|---|---|
| **User Identifiers** | NEVER use `user_id`, `email`, or `username` as labels. |
| **Document Content** | NEVER use CV text, cover letter body, job description, or raw query strings as labels. |
| **Database Keys** | NEVER use `application_id`, `job_id`, or UUID primary keys as labels. |
| **URL Paths** | Must always be normalized to static route patterns (e.g. `/api/jobs`), never raw query strings. |
| **AI Models** | Must be mapped to bounded aliases (`gemini-flash`, `qwen-72b`, `llama-70b`, `deepseek-r1`). |

---

## 2. Metrics Catalogue

### 2.1 HTTP & Edge Service Metrics

| Metric Name | Type | Purpose | Labels | Cardinality | Source | Dashboard | Alert Usage |
|---|---|---|---|---|---|---|---|
| `applywise_http_requests_total` | Counter | Total HTTP requests handled | `method`, `route`, `status` | ~60 | `withObservability` wrapper | Application Overview | High Traffic Spike |
| `applywise_http_request_duration_seconds` | Histogram | Request latency distribution | `method`, `route`, `status` | ~480 | `withObservability` wrapper | Application Overview | High p99 Latency (>2s) |
| `applywise_http_errors_total` | Counter | HTTP 4xx and 5xx errors | `route`, `error_type` | ~30 | `withObservability` wrapper | Application Overview | Elevated 5xx Error Rate |

### 2.2 Business & Domain Pipeline Metrics

| Metric Name | Type | Purpose | Labels | Cardinality | Source | Dashboard | Alert Usage |
|---|---|---|---|---|---|---|---|
| `applywise_active_users` | Gauge | Currently active sessions | None | 1 | App state | Executive Overview | Zero Activity Warning |
| `applywise_jobs_analyzed_total` | Counter | Total job specifications analyzed | `source` (`manual`, `adzuna`, `seed`) | 3 | `MatchService` | Business Intelligence | — |
| `applywise_applications_created_total` | Counter | Applications in CRM | `stage` (`draft`, `applied`, `interviewing`, `offer`) | 4 | `ApplicationsRoute` | Business Intelligence | — |
| `applywise_cv_tailor_generations_total` | Counter | Grounded CV tailoring runs | `status` (`success`, `fallback`) | 2 | `TailorService` | Business Intelligence | Tailoring Failure Rate |
| `applywise_cover_letter_generations_total` | Counter | Evidence cover letters generated | `status` (`success`, `fallback`) | 2 | `TailorService` | Business Intelligence | Cover Letter Errors |
| `applywise_interview_sessions_total` | Counter | STAR interview prep sessions | `status` (`success`, `fallback`) | 2 | `InterviewService` | Business Intelligence | — |

### 2.3 AI Gateway & Multi-Model Router Metrics

| Metric Name | Type | Purpose | Labels | Cardinality | Source | Dashboard | Alert Usage |
|---|---|---|---|---|---|---|---|
| `applywise_ai_requests_total` | Counter | AI gateway requests | `model_id`, `task_type`, `status` | ~36 | `AIGateway` | AI Operations | Excessive AI Invocations |
| `applywise_ai_latency_seconds` | Histogram | Inference latency | `model_id`, `task_type` | ~216 | `AIGateway` | AI Operations | AI Model Latency (>15s) |
| `applywise_ai_fallbacks_total` | Counter | Degradation fallback events | `primary_model`, `fallback_model`, `reason` | ~12 | `AIGateway` | AI Operations | Model Fallback Spike (>20%) |
| `applywise_ai_token_usage_total` | Counter | Token consumption | `model_id`, `token_type` | ~12 | `AIGateway` | AI Operations | Budget Warning |
| `applywise_ai_errors_total` | Counter | Failed AI model calls | `model_id`, `error_code` | ~18 | `AIGateway` | AI Operations | Sustained AI Failures |

### 2.4 Vector Search & RAG Copilot Metrics

| Metric Name | Type | Purpose | Labels | Cardinality | Source | Dashboard | Alert Usage |
|---|---|---|---|---|---|---|---|
| `applywise_rag_queries_total` | Counter | Career copilot semantic queries | `status` (`success`, `empty_retrieval`, `failed`) | 3 | `RAGService` | AI Operations | High Empty Retrieval (>10%) |
| `applywise_rag_retrieval_duration_seconds` | Histogram | Vector similarity search latency | None | 7 | `RAGService` | AI Operations | Slow Vector Search (>1s) |
| `applywise_rag_chunks_retrieved` | Histogram | Grounded chunks per query | None | 7 | `RAGService` | AI Operations | Low Retrieval Yield |

### 2.5 LangGraph Agent Workflows

| Metric Name | Type | Purpose | Labels | Cardinality | Source | Dashboard | Alert Usage |
|---|---|---|---|---|---|---|---|
| `applywise_agent_runs_total` | Counter | LangGraph agent loop runs | `agent_name`, `status` | ~8 | Domain services | AI Operations | Agent Failures |
| `applywise_agent_duration_seconds` | Histogram | Agent end-to-end duration | `agent_name` | ~32 | Domain services | AI Operations | Agent Loop Timeout (>45s) |

### 2.6 Database & System Runtime Metrics

| Metric Name | Type | Purpose | Labels | Cardinality | Source | Dashboard | Alert Usage |
|---|---|---|---|---|---|---|---|
| `applywise_db_queries_total` | Counter | DB queries executed | `table_name`, `operation`, `status` | ~40 | Repository | Database & Storage | Elevated DB Errors |
| `applywise_db_latency_seconds` | Histogram | Query execution latency | `operation` | ~24 | Repository | Database & Storage | High DB Latency (>500ms) |
| `applywise_node_*` | Gauges/Counters | Process memory, CPU, GC | Standard | ~40 | Default prom-client | Kubernetes / App Overview | Memory Leak (>450MB) |

---

## 3. Total Metric Series Footprint

- **Estimated Total Series**: ~950 active series.
- **Grafana Cloud Free Allowance**: 10,000 active series.
- **Safety Margin**: Utilizes **<10%** of free-tier allocation, ensuring permanent free-tier stability.

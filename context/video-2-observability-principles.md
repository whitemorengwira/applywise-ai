# Production Observability & DevOps Architecture Principles
## Derived from Video Study & SRE Industry Practice

**Source Reference**: [DevOps, Observability & Cloud-Native Production Operations](https://youtu.be/vf5MJLoXUG0?list=PLUPGUUotMT_s)  
**System**: ApplyWise AI — Flagship Full-Stack Agentic Job Applications SaaS  
**Architect**: Whitemore Ngwira (N. White)  
**Date**: 2026-09-15  

---

## 1. Executive Summary & Philosophy

Building high-scale, modern software requires shifting from merely writing application code to **operating software reliably in production**. For an AI-native SaaS combining Next.js, pgvector, LangChain/LangGraph agent loops, and multi-model routing, observability is not a passive logging exercise—it is a critical control loop for performance, cost, security, and user experience.

This document extracts the core engineering principles from the reference study, identifies what is directly applicable to ApplyWise AI, and establishes the strict architectural standards adopted across our observability and Terraform infrastructure.

---

## 2. Core Observability Principles Extracted

### 2.1 The Four Golden Signals (Google SRE)
1. **Latency**: The time it takes to service a request. Differentiated between successful requests and failed requests (since failures can be artificially fast or slow due to timeouts).
2. **Traffic**: A measure of demand on the system (e.g., HTTP requests per minute, AI model invocations, RAG vector searches).
3. **Errors**: The rate of requests that fail, either explicitly (500s, model API timeouts) or implicitly (empty RAG retrievals, hallucination guards tripped).
4. **Saturation**: How "full" the service is (CPU/memory utilization, Kubernetes pod replica capacity, free-tier API rate limits).

### 2.2 The RED Method (for Request-Driven Services)
- **Rate**: Number of requests per second.
- **Errors**: Number of failing requests per second.
- **Duration**: Distribution of latency across requests (p50, p90, p99).

### 2.3 The USE Method (for Infrastructure & Resources)
- **Utilization**: Time or capacity percentage busy.
- **Saturation**: Degree of extra work queued.
- **Errors**: Count of error events.

---

## 3. High-Cardinality Protection (Metric Store Preservation)

One of the most dangerous anti-patterns in production monitoring is **uncontrolled metric cardinality**. In Prometheus and Grafana Cloud, every unique combination of key-value label pairs creates a new time series stored in memory.

### Strict Label Cardinality Rules for ApplyWise AI:
* **FORBIDDEN Labels**:
  - `user_id` / `email` (Infinite cardinality, PII leakage)
  - `job_id` / `application_id` (Unbounded database primary keys)
  - `prompt_text` / `cv_text` (Arbitrary string inputs)
  - Raw query parameters or unparameterized URLs (e.g. `/api/jobs?search=react` must be normalized to route `/api/jobs`)
* **ALLOWED Labels (Bounded Sets)**:
  - `method`: `GET`, `POST`, `PUT`, `DELETE` (Cardinality: 4)
  - `route`: Predefined API endpoints, e.g. `/api/health`, `/api/jobs`, `/api/tailor` (Cardinality: ~15)
  - `status`: Bounded HTTP status codes: `200`, `400`, `404`, `500`, `503` (Cardinality: ~10)
  - `model_id`: Bounded AI model aliases: `gemini-2.0-flash-thinking`, `qwen-2.5-72b`, `llama-3.3-70b`, `deepseek-r1-distill` (Cardinality: ~6)
  - `agent_type`: `job_analysis`, `tailor_cv`, `agentic_rag`, `interview_prep` (Cardinality: 4)
  - `cache_status`: `hit`, `miss` (Cardinality: 2)

---

## 4. Structured Logging & Distributed Correlation

Plain unstructured text logs (`console.log("error happened")`) cannot be parsed at scale.
* **Adopted Standard**:
  - All application and container logs must be emitted as single-line JSON to `stdout`/`stderr`.
  - Every log entry includes:
    - `timestamp`: ISO 8601 UTC
    - `level`: `DEBUG`, `INFO`, `WARN`, `ERROR`
    - `service`: `applywise-ai`
    - `correlation_id`: Unique trace ID propagated across HTTP request, AI gateway invocation, and database operation.
    - `event`: Standardized semantic event name (e.g., `ai_gateway_call`, `rag_retrieval_complete`)
    - `duration_ms`: Execution time in milliseconds where applicable.
  - PII Sanitization: Strictly redact passwords, auth tokens, candidate addresses, and raw resume contents.

---

## 5. Grafana Cloud Free-Tier Telemetry Budgeting

To ensure the system remains **100% free forever without surprise billing**:
1. **Metrics Budget**: Grafana Cloud Free offers 10,000 active series. ApplyWise AI is designed for <300 active series.
2. **Logs Budget**: 50GB log ingestion per month. Rate-limited and capped via Docker logging drivers (`max-size: 10m`, `max-file: 3`) and log level controls.
3. **Scrape Interval**: Set to 30 seconds for non-critical workloads, preserving network egress and ingest buffers.

---

## 6. Actionable Alerting Principles

Alert fatigue causes real outages to be ignored. We adopt the following alert severity taxonomy:
- **CRITICAL** (Requires immediate action):
  - Application completely unavailable (`/api/health` failing > 1 min).
  - Pod crashlooping in Kubernetes (`CrashLoopBackOff`).
  - Sustained 5xx error rate > 5% over 5 minutes.
- **WARNING** (Action needed within working hours):
  - Elevated p99 latency (> 3000ms for web, > 15000ms for AI reasoning).
  - High AI model fallback frequency (> 20% of requests).
  - Free-tier rate limit approaching 80%.
- **INFO** (Observational):
  - Deployment rolling update completed.
  - Cache purge event.

---

## 7. Infrastructure as Code (Terraform) Philosophy

1. **Declarative State**: All Grafana folders, dashboards, alert rules, and cloud infrastructure are codified in Terraform.
2. **Separation of Concerns**:
   - **Terraform**: Manages cloud platforms (Vercel project settings, Supabase references, Grafana Cloud alert rules & dashboards).
   - **Helm**: Manages Kubernetes application workloads.
   - **Kubectl**: Inspection and ad-hoc diagnostics.
3. **State Protection**: Never commit `.tfstate` files; all secrets passed via environment variables or uncommitted `terraform.tfvars`.

---

## 8. Summary of Adopted vs Excluded Practices

| Practice | Status | Rationale |
|---|---|---|
| Bounded Prometheus Metrics | **Adopted** | Core to performance and staying within free-tier limits |
| Dashboards-as-Code (JSON) | **Adopted** | Reproducible, version-controlled observability |
| Three-tier Probes (Startup/Liveness/Readiness) | **Adopted** | Essential for zero-downtime Kubernetes deployments |
| Structured JSON Logs with Correlation IDs | **Adopted** | Enables precise debugging across AI agent workflows |
| Heavy APM Agents (Datadog/NewRelic) | **Excluded** | Violates 100% free-tier constraint; high memory footprint |
| High-Frequency 1s Metrics Scraping | **Excluded** | Unnecessary cardinality and quota consumption for personal showcase |
| Raw Prompt/CV Payload Ingestion | **Excluded** | PII and security hazard; high bandwidth waste |

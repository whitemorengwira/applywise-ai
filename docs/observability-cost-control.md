# Observability Cost Control & Telemetry Budget Guide

## 1. Executive Summary & Free-Tier Guarantee

ApplyWise AI enforces a strict **100% Free-Tier Architecture**. Telemetry must never incur accidental costs or exceed cloud vendor thresholds. This guide defines the telemetry budget, quotas, cardinality rules, and retention parameters engineered to keep ApplyWise AI comfortably within the **Grafana Cloud Free** tier.

---

## 2. Grafana Cloud Free-Tier Allowances vs ApplyWise AI Allocation

| Telemetry Type | Grafana Cloud Free Quota | ApplyWise AI Peak Consumption | Safety Utilization % |
|---|---|---|---|
| **Prometheus Metrics** | 10,000 active series | ~950 active series | **9.5%** |
| **Loki Logs** | 50 GB / month | ~1.5 GB / month | **3.0%** |
| **Tempo Traces** | 50 GB / month | ~0.5 GB / month | **1.0%** |
| **Alert Rules** | Bounded free rules | 7 critical/warning rules | **Nominal** |
| **Data Retention** | 14 days (default) | 14 days | **100% compliant** |

---

## 3. High-Cardinality Protection Mechanism

In Prometheus and Grafana Cloud Mimir, every distinct combination of metric name and key-value label pairs constitutes an independent time series. Unbounded labels create explosive series counts that instantly exhaust free-tier limits.

### Enforced Protections:
1. **Forbidden High-Cardinality Labels**:
   - `user_id`, `email`, `candidate_id`
   - Raw prompt texts, CV strings, cover letter bodies
   - Database primary keys (`job_id`, `application_id`)
   - Unparameterized query URLs (e.g. `/api/jobs?q=react` normalized to route `/api/jobs`)
2. **Strict Bounded Enumerations**:
   - HTTP Methods: `GET`, `POST`, `PUT`, `DELETE`
   - Route Names: ~15 fixed string constants
   - Status Codes: `200`, `201`, `400`, `404`, `500`, `503`
   - AI Models: `gemini-flash`, `qwen-72b`, `llama-70b`, `deepseek-r1`
   - Agent Workflows: `job_analysis`, `tailoring`, `agentic_rag`, `interview`

---

## 4. Logging Volume Control & Rotation

Container and application logs are managed via three defensive mechanisms:
1. **Log Level Filtering**: Default production level is `INFO`. `DEBUG` level is restricted to local development environments.
2. **Docker Log Driver Limits**:
   ```yaml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```
   Ensures local container host logs never exceed 30MB total.
3. **Payload Truncation**: Strings exceeding 500 characters (such as raw LLM completions) are truncated in structured logs with `... [TRUNCATED]` markers.

---

## 5. Trace Sampling & Frequency

- **Scrape Interval**: Set to **15 seconds** (or 30s in development), avoiding aggressive 1-second scraping loops that burn network bandwidth and ingestion quotas.
- **Trace Sampling Rate**: 100% of errors (5xx, AI gateway failures) and 10% of successful background health requests.

---

## 6. Zero-Cost Verification Checklist

- [x] No credit card or paid add-on required.
- [x] Dashboards use standard open-source PromQL queries.
- [x] Remote write endpoints authenticated via environment variables only.
- [x] Log rotation active on Docker and Kubernetes configurations.
- [x] All metric series bounded by design.

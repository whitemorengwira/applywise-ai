---
name: job-discovery
description: "Job discovery, normalization, freshness verification, and canonical deduplication skill"
---

# /job-discovery — Autonomous Job Discovery Skill

## Purpose
Discovers, ingests, normalizes, and deduplicates opportunities derived directly from verified candidate competencies and target role hierarchies.

## Discovery Engine Rules
1. **Search Priority**: AI & Agentic Systems (Priority 1) -> AI+Cloud -> Cloud Architecture -> Platform/SRE -> DevOps/DevSecOps -> Systems Engineering -> Automation.
2. **Geographic Scopes**: South Africa (Tier 1: Remote, Hybrid, On-site) -> Zimbabwe & Malawi (Tier 2/3: Remote, Hybrid, On-site) -> Wider Africa (Tier 4) -> Global Verified Cross-Border (Tier 5).
3. **Canonical Deduplication**: Normalize title, company domain, and apply URL to prevent applying repeatedly to the same vacancy.
4. **Staleness Filter**: Vacancies older than 30 days are automatically archived.

# ADR-003: Job Discovery API — Adzuna + Arbeitnow

## Status
Accepted

## Context
The application needs to discover real job listings. The reference project uses Browserbase (paid browser automation). We need a free alternative. The architecture should support adding more sources later via a provider abstraction.

## Decision
Use a dual-provider strategy:
1. **Adzuna** (primary) — 1,000 free API calls/month, broad coverage (UK, US, EU)
2. **Arbeitnow** (secondary/fallback) — No API key required, tech/remote focus

Wrapped behind a `JobProvider` abstraction interface so additional sources can be added.

## Consequences
- Positive: Two independent sources for resilience
- Positive: Provider abstraction enables future expansion (Indeed, LinkedIn, etc.)
- Positive: No credit card required for either service
- Negative: Adzuna's 1,000 calls/month limits real-time search volume
- Negative: Arbeitnow has limited coverage (mostly European tech)
- Mitigation: Cache job results in Supabase, implement smart refresh intervals

## Alternatives Considered
- **JSearch (RapidAPI)**: Requires credit card for API key
- **LinkedIn API**: Requires partnership agreement, not available for personal projects
- **Web scraping**: Violates most job sites' ToS, fragile, legal risk
- **USAJOBS**: Free but US federal jobs only — too narrow

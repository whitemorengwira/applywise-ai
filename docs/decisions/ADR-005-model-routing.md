# ADR-005: Model Routing Strategy

## Status
Accepted

## Context
Different AI tasks have different requirements (speed, reasoning quality, context window, tool calling). Rather than using one model for everything, the application should route tasks to the most appropriate free model.

## Decision
Implement a **task-based model routing layer** with four role categories:

| Role | Optimises For | Use Cases |
|---|---|---|
| FAST | Speed, low latency | Classification, simple extraction, UI assistance |
| STRONG | Reasoning quality | Job analysis, CV tailoring, complex generation |
| LONG_CONTEXT | Large input handling | Full CV/job document analysis |
| AGENT | Tool calling support | LangGraph agent workflows |

Each role has a primary model and fallback model. Model identifiers are configured via environment variables, not hard-coded.

The routing layer provides:
- Task → Role mapping
- Primary + fallback model selection
- Retry with fallback on failure
- Rate limit awareness
- Context window validation

## Consequences
- Positive: Optimal model usage — fast tasks don't waste strong model capacity
- Positive: Resilient — fallback chain handles model unavailability
- Positive: Swappable — models can be changed via env vars without code changes
- Positive: Showcases model orchestration architecture
- Negative: More complex than single-model approach
- Negative: Free model availability may change, requiring env var updates

## Alternatives Considered
- **Single model for everything**: Simpler but less efficient, no showcase value
- **OpenRouter auto-router only**: Less control over model selection for specific tasks
- **Multiple provider adapters**: Overengineered for a free-tier project

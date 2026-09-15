# ADR-002: AI Provider — OpenRouter Free Tier

## Status
Accepted

## Context
The application requires an AI model provider for LLM inference (chat completion, structured output, tool calling) and embeddings. The entire stack must be free-tier. Options considered: OpenAI (paid), Anthropic (paid), Google AI Studio (free tier exists), Groq (free tier exists), OpenRouter (free tier with multiple models).

## Decision
Use **OpenRouter** as the primary AI provider because:
1. OpenAI-compatible API — works with LangChain's `ChatOpenAI` class
2. Multiple free models available via `:free` suffix
3. Auto-routing via `openrouter/free` selects the best available free model
4. Single API key provides access to models from multiple providers (Google, NVIDIA, Meta, etc.)
5. If a model is removed from free tier, others remain available

## Consequences
- Positive: Multi-model routing is built-in, no provider lock-in
- Positive: LangChain integration is straightforward (OpenAI-compatible)
- Negative: Free tier has rate limits (20 RPM, 50-1000 RPD)
- Negative: Model availability can change without notice
- Mitigation: Implement caching, request queuing, and graceful fallback chains

## Alternatives Considered
- **OpenAI**: Superior quality but entirely paid, no free tier for production use
- **Google AI Studio**: Free tier exists but more limited model selection
- **Groq**: Fast inference, free tier, but limited model variety and context windows
- **Self-hosted**: Not viable for free-tier Vercel deployment

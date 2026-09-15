# ADR-006: Vector Storage — pgvector via Supabase

## Status
Accepted

## Context
The RAG system requires vector storage for document embeddings (CV, job descriptions, company research). Options: Pinecone (paid), Weaviate (paid/self-hosted), Qdrant (paid/self-hosted), ChromaDB (self-hosted), pgvector (Supabase built-in).

## Decision
Use **pgvector** extension within the existing Supabase PostgreSQL database.

## Consequences
- Positive: No additional service — uses existing Supabase free tier
- Positive: SQL-based queries — can combine vector search with relational filters
- Positive: LangChain has `SupabaseVectorStore` integration
- Positive: Simpler infrastructure — one database for everything
- Positive: RLS applies to vector data too
- Negative: Limited to Supabase free tier storage (500 MB total including vectors)
- Negative: Less performant than dedicated vector databases at scale
- Mitigation: Use 768-dimension embeddings (not 1536) to reduce storage. Limit total embedded documents. This is a portfolio project, not a billion-document search engine.

## Alternatives Considered
- **Pinecone**: Industry standard but requires paid plan for production
- **Weaviate Cloud**: Free tier exists but adds infrastructure complexity
- **ChromaDB**: Would need self-hosting, not viable on Vercel
- **Qdrant Cloud**: Free tier exists but limited, adds another service to manage

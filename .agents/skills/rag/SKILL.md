---
name: rag
description: "pgvector vector store, multi-source chunking, semantic retrieval, and grounding validation skill"
---

# /rag — Multi-Source pgvector RAG & Career Memory Skill

## Purpose
Governs the durable retrieval-augmented generation pipeline over Whitemore Ngwira's Master CV, N.White Systems website, and verified platform evidence.

## Pipeline Architecture
`Source Documents`
→ `Ingestion & Cleaning`
→ `Semantic Chunking`
→ `Embeddings (pgvector)`
→ `HNSW Cosine Index`
→ `Hybrid Retrieval (Keyword + Vector)`
→ `Evidence Citation`
→ `Grounded Generation`

## Invariant Grounding Principle
- All factual technical claims generated in cover letters or copilot Q&A must cite indexed knowledge chunks.
- Zero ungrounded hallucinations permitted.

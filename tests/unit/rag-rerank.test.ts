import { describe, it, expect } from "vitest";
import { RAGService, SemanticReRanker, KNOWLEDGE_CHUNKS } from "@/lib/services/rag.service";

describe("Enhanced RAG Semantic Re-ranking Layer", () => {
  it("re-ranks candidate chunks prioritizing high-affinity exact phrases and empirical evidence", () => {
    const query = "Cloudflare AI Gateway LiteLLM edge caching token cost tracking";
    const reRanked = SemanticReRanker.reRank(query, KNOWLEDGE_CHUNKS);

    expect(reRanked.length).toBe(KNOWLEDGE_CHUNKS.length);
    // The top ranked chunk must be the AI Gateway chunk
    expect(reRanked[0].chunk.id).toBe("chunk-ai-gateway");
    expect(reRanked[0].breakdown.ngramAffinity).toBeGreaterThan(0.5);
    expect(reRanked[0].breakdown.categoryRelevance).toBe(1.0);
    expect(reRanked[0].breakdown.empiricalDensity).toBeGreaterThan(0.5);
    // Grounding confidence must reach 99%+
    expect(reRanked[0].groundingConfidence).toBeGreaterThanOrEqual(99.0);
  });

  it("accurately re-ranks InsurTech and claims platform queries to EarCodeX architecture chunk", () => {
    const query = "AWS cloud-native InsurTech platform claims administration automated document intelligence";
    const reRanked = SemanticReRanker.reRank(query, KNOWLEDGE_CHUNKS);

    expect(reRanked[0].chunk.id).toBe("chunk-earcodex");
    expect(reRanked[0].chunk.category).toBe("Architecture");
    expect(reRanked[0].groundingConfidence).toBeGreaterThanOrEqual(99.0);
  });

  it("retrieves grounded chunks for executive cover letter with >= 99% grounding precision", () => {
    const jobTitle = "Principal AI Systems Architect";
    const jobDescription =
      "Seeking a Principal AI Architect to build governed AI gateways with LiteLLM, Cloudflare, and LangGraph with sub-second latency and zero-cost edge caching.";

    const result = RAGService.retrieveGroundedChunksForCoverLetter(jobTitle, jobDescription, 3);

    expect(result.chunks.length).toBe(3);
    expect(result.reRanked.length).toBe(3);
    expect(result.averageGroundingConfidence).toBeGreaterThanOrEqual(99.0);
    expect(result.overallPrecision).toBeGreaterThan(0.85);

    // Verify top chunk matches AI Gateways
    expect(result.chunks[0].id).toBe("chunk-ai-gateway");
    expect(result.reRanked[0].chunk.title).toContain("AI Gateways");
  });

  it("filters and orders knowledge chunks via RAGService.retrieveRelevantChunks using semantic re-ranking", () => {
    const results = RAGService.retrieveRelevantChunks("Terraform AWS modular blueprints Transit Gateway", 2);

    expect(results.length).toBe(2);
    expect(results[0].id).toBe("chunk-terraform-cloud");
    expect(results[0].title).toContain("Infrastructure as Code");
  });

  it("re-ranks professional systems architecture background with high precision and formats citation badges", async () => {
    const query = "What do you know about my professional systems architecture background?";
    const allChunks = RAGService.getAllKnowledgeChunks();
    const reRanked = SemanticReRanker.reRank(query, allChunks);

    expect(reRanked[0].precisionScore).toBeGreaterThanOrEqual(0.75);
    expect(reRanked[0].groundingConfidence).toBeGreaterThanOrEqual(99.0);

    const copilotResult = await RAGService.queryCopilot(query);
    expect(copilotResult.answer).toContain("[Source 1: Master CV]");
    expect(copilotResult.answer).toContain("[Source 2: N.White Systems]");
    expect(copilotResult.answer).toContain("EarCodeX");
    expect(copilotResult.answer).toContain("Supabets");
    expect(copilotResult.citedChunks.length).toBeGreaterThanOrEqual(3);
  });
});

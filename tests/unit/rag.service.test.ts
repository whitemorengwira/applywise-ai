import { describe, it, expect } from "vitest";
import { RAGService } from "@/lib/services/rag.service";

describe("RAGService", () => {
  it("retrieves relevant knowledge chunks based on query tokens", () => {
    const chunks = RAGService.retrieveRelevantChunks("EarCodeX claims intelligence", 2);

    expect(chunks).toBeDefined();
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].title).toContain("EarCodeX");
  });

  it("retrieves AI gateway knowledge for model routing queries", () => {
    const chunks = RAGService.retrieveRelevantChunks("LiteLLM model routing and failover", 1);

    expect(chunks.length).toBe(1);
    expect(chunks[0].title).toContain("AI Gateways");
  });

  it("executes grounded career copilot queries with citations", async () => {
    const result = await RAGService.queryCopilot("How was EarCodeX delivered on AWS?");

    expect(result).toBeDefined();
    expect(result.answer).toBeTruthy();
    expect(result.citedChunks.length).toBeGreaterThan(0);
    expect(result.modelUsed).toBeTruthy();
  });

  it("strictly declines to hallucinate on out-of-domain or ungrounded queries (< 0.75 score)", async () => {
    const result = await RAGService.queryCopilot("Can you give me a recipe for baking sourdough bread and grilling salmon?");

    expect(result).toBeDefined();
    expect(result.answer).toContain("I do not have verified candidate records");
    expect(result.answer).toContain("strict grounding threshold");
    expect(result.citedChunks.length).toBe(0);
    expect(result.modelUsed).toContain("Grounding Guard");
  });
});

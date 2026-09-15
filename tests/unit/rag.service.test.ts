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
});

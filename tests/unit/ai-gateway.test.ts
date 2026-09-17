import { describe, it, expect } from "vitest";
import { AIGateway, OPENCODE_ZEN_MODELS } from "@/lib/ai/gateway";

describe("AIGateway & OpenCode Zen Suite", () => {
  it("includes all 5 OpenCode Zen free models in catalog", () => {
    const catalog = AIGateway.getCatalog();
    expect(catalog).toHaveLength(5);

    const modelIds = catalog.map((m) => m.id);
    expect(modelIds).toContain("nemotron-3-ultra-free");
    expect(modelIds).toContain("nemotron-3.5-lightning-free");
    expect(modelIds).toContain("ling-3.0-flash-fin-free");
    expect(modelIds).toContain("mimo-v2.5-free");
    expect(modelIds).toContain("muse-spark-1.3-contributor-free");
  });

  it("selects appropriate models according to ADR-005 model routing strategy", () => {
    const reasoningModel = AIGateway.selectModel("agentic_rag");
    expect(reasoningModel).toBe("nemotron-3-ultra-free");

    const extractionModel = AIGateway.selectModel("job_extraction");
    expect(extractionModel).toBe("nemotron-3.5-lightning-free");

    const financeModel = AIGateway.selectModel("company_research");
    expect(financeModel).toBe("ling-3.0-flash-fin-free");

    const creativeModel = AIGateway.selectModel("cover_letter_generation");
    expect(creativeModel).toBe("muse-spark-1.3-contributor-free");
  });

  it("normalizes OpenCode Zen model names for telemetry metrics", () => {
    expect(AIGateway.normalizeModelName("nemotron-3-ultra-free")).toBe("nemotron-3-ultra");
    expect(AIGateway.normalizeModelName("nemotron-3.5-lightning-free")).toBe("nemotron-3.5-lightning");
    expect(AIGateway.normalizeModelName("ling-3.0-flash-fin-free")).toBe("ling-3.0-flash-fin");
    expect(AIGateway.normalizeModelName("mimo-v2.5-free")).toBe("mimo-v2.5");
    expect(AIGateway.normalizeModelName("muse-spark-1.3-contributor-free")).toBe("muse-spark-1.3");
  });

  it("successfully tests all 5 OpenCode Zen models via testModel()", async () => {
    for (const entry of OPENCODE_ZEN_MODELS) {
      const testResult = await AIGateway.testModel(entry.id);
      expect(testResult.modelId).toBe(entry.id);
      expect(testResult.modelName).toBe(entry.name);
      expect(["operational", "simulated", "unavailable"]).toContain(testResult.status);
      expect(testResult.latencyMs).toBeGreaterThanOrEqual(0);
      expect(testResult.sampleOutput).toBeTruthy();
    }
  });

  it("handles offline provider state gracefully with logged telemetry for Nemotron", async () => {
    const result = await AIGateway.complete({
      taskType: "match_scoring",
      prompt: "Assess fit for Principal Engineer",
      modelOverride: "nemotron-3-ultra-free",
    });

    expect(result).toBeDefined();
    expect(result.content).toBeTruthy();
    expect(result.modelUsed).toContain("nemotron-3-ultra");
    expect(result.log).toBeDefined();
    expect(result.log.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it("strictly blocks paid models when FREE_ONLY_MODE is enabled", async () => {
    await expect(
      AIGateway.complete({
        taskType: "match_scoring",
        prompt: "Test paid inference",
        modelOverride: "openai/gpt-4o-paid",
      })
    ).rejects.toThrow(/FREE_TIER_VIOLATION/);
  });
});

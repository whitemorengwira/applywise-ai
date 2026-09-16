import { describe, it, expect } from "vitest";
import { AIGateway } from "@/lib/ai/gateway";

describe("AIGateway", () => {
  it("selects appropriate models according to ADR-005 model routing strategy", () => {
    const reasoningModel = AIGateway.selectModel("agentic_rag");
    expect(reasoningModel).toContain("nemotron-3-ultra");

    const extractionModel = AIGateway.selectModel("job_extraction");
    expect(extractionModel).toContain("nemotron-3.5-lightning");
  });

  it("normalizes OpenCode Zen model names for telemetry metrics", () => {
    expect(AIGateway.normalizeModelName("opencode/nemotron-3-ultra:free")).toBe("nemotron-3-ultra");
    expect(AIGateway.normalizeModelName("opencode/nemotron-3.5-lightning:free")).toBe("nemotron-3.5-lightning");
    expect(AIGateway.normalizeModelName("opencode/ling-3.0-flash-fin:free")).toBe("ling-3.0-flash-fin");
    expect(AIGateway.normalizeModelName("opencode/mimo-v2.5:free")).toBe("mimo-v2.5");
    expect(AIGateway.normalizeModelName("opencode/muse-spark-1.3:free")).toBe("muse-spark-1.3");
  });

  it("handles offline simulation mode gracefully with logged telemetry for Nemotron", async () => {
    const result = await AIGateway.complete({
      taskType: "match_scoring",
      prompt: "Assess fit for Principal Engineer",
      modelOverride: "opencode/nemotron-3-ultra:free",
    });

    expect(result).toBeDefined();
    expect(result.content).toBeTruthy();
    expect(result.modelUsed).toContain("nemotron-3-ultra");
    expect(result.log).toBeDefined();
    expect(result.log.success).toBe(true);
    expect(result.log.latencyMs).toBeGreaterThanOrEqual(0);
  });
});

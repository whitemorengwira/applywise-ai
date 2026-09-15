import { describe, it, expect } from "vitest";
import { AIGateway } from "@/lib/ai/gateway";

describe("AIGateway", () => {
  it("selects appropriate models according to ADR-005 model routing strategy", () => {
    const reasoningModel = AIGateway.selectModel("agentic_rag");
    expect(reasoningModel).toContain("gemini-2.0-flash-thinking");

    const extractionModel = AIGateway.selectModel("job_extraction");
    expect(extractionModel).toContain("flash-exp");
  });

  it("handles offline simulation mode gracefully with logged telemetry", async () => {
    const result = await AIGateway.complete({
      taskType: "match_scoring",
      prompt: "Assess fit for Principal Engineer",
    });

    expect(result).toBeDefined();
    expect(result.content).toBeTruthy();
    expect(result.log).toBeDefined();
    expect(result.log.success).toBe(true);
    expect(result.log.latencyMs).toBeGreaterThanOrEqual(0);
  });
});

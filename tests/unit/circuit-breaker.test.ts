import { describe, it, expect, beforeEach } from "vitest";
import {
  AIGateway,
  ModelCircuitBreaker,
  OPENCODE_ZEN_MODELS,
  MODEL_ROTATION_FALLBACKS,
} from "@/lib/ai/gateway";

describe("ModelCircuitBreaker & AI Model Rotation", () => {
  beforeEach(() => {
    AIGateway.resetCircuitBreakers();
  });

  it("initializes models in CLOSED state with 0 failures", () => {
    const statuses = AIGateway.getCircuitBreakerStatuses();
    expect(statuses.length).toBe(OPENCODE_ZEN_MODELS.length);
    for (const status of statuses) {
      expect(status.state).toBe("CLOSED");
      expect(status.failures).toBe(0);
      expect(status.lastFailureTime).toBeNull();
    }
  });

  it("trips to OPEN state after consecutive failures meet threshold", () => {
    const modelId = "opencode/nemotron-3-ultra:free";

    // 1st failure
    expect(ModelCircuitBreaker.recordFailure(modelId, "Timeout")).toBe("CLOSED");
    expect(ModelCircuitBreaker.isAvailable(modelId)).toBe(true);

    // 2nd failure
    expect(ModelCircuitBreaker.recordFailure(modelId, "429 Rate Limited")).toBe("CLOSED");
    expect(ModelCircuitBreaker.isAvailable(modelId)).toBe(true);

    // 3rd failure (trips breaker)
    expect(ModelCircuitBreaker.recordFailure(modelId, "503 Downtime")).toBe("OPEN");
    expect(ModelCircuitBreaker.isAvailable(modelId)).toBe(false);
    expect(ModelCircuitBreaker.getState(modelId)).toBe("OPEN");
  });

  it("resets to CLOSED state when success is recorded", () => {
    const modelId = "opencode/nemotron-3-ultra:free";
    AIGateway.tripCircuitBreaker(modelId);
    expect(ModelCircuitBreaker.isAvailable(modelId)).toBe(false);

    ModelCircuitBreaker.recordSuccess(modelId);
    expect(ModelCircuitBreaker.getState(modelId)).toBe("CLOSED");
    expect(ModelCircuitBreaker.isAvailable(modelId)).toBe(true);
  });

  it("transitions to HALF_OPEN after cooldown window passes", () => {
    const modelId = "opencode/nemotron-3.5-lightning:free";
    AIGateway.tripCircuitBreaker(modelId);
    expect(ModelCircuitBreaker.getState(modelId)).toBe("OPEN");

    // Temporarily reduce COOLDOWN_MS to verify HALF_OPEN transition
    const originalCooldown = ModelCircuitBreaker.COOLDOWN_MS;
    ModelCircuitBreaker.COOLDOWN_MS = -1; // Force immediate expiry
    try {
      expect(ModelCircuitBreaker.getState(modelId)).toBe("HALF_OPEN");
      expect(ModelCircuitBreaker.isAvailable(modelId)).toBe(true);
    } finally {
      ModelCircuitBreaker.COOLDOWN_MS = originalCooldown;
    }
  });

  it("provides valid rotation candidates strictly within OpenCode Zen 100% Free models", () => {
    const taskTypes = Object.keys(MODEL_ROTATION_FALLBACKS) as (keyof typeof MODEL_ROTATION_FALLBACKS)[];

    for (const taskType of taskTypes) {
      const candidates = AIGateway.getRotationCandidates(taskType);
      expect(candidates.length).toBeGreaterThanOrEqual(2);

      // Verify every rotation candidate is a verified free tier model
      for (const candidate of candidates) {
        const found = OPENCODE_ZEN_MODELS.find((m) => m.id === candidate);
        expect(found).toBeDefined();
        expect(found?.tier).toBe("Free");
        expect(candidate.endsWith(":free")).toBe(true);
      }
    }
  });

  it("seamlessly rotates to backup free model when primary is tripped in simulation", async () => {
    const primary = "opencode/nemotron-3-ultra:free";
    // Trip the primary reasoning model
    AIGateway.tripCircuitBreaker(primary);

    // Perform match_scoring (which normally routes to nemotron-3-ultra:free)
    const result = await AIGateway.complete({
      taskType: "match_scoring",
      prompt: "Evaluate candidate match",
    });

    expect(result.content).toBeDefined();
    // Verify it rotated to backup free model (nemotron-3.5-lightning:free)
    expect(result.modelUsed).toContain("Rotated Fallback");
    expect(result.modelUsed).toContain("nemotron-3.5-lightning:free");
    expect(result.log.success).toBe(true);
  });
});

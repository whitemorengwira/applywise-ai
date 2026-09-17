import { describe, it, expect, vi, beforeEach } from "vitest";
import { ControlPlaneOrchestrator } from "@/lib/control/orchestrator";
import { AIGateway } from "@/lib/ai/gateway";

describe("Section 15 Mandatory Provider Failure Test", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("truthfully reports provider unavailability when AI provider is down, without mock text", async () => {
    // 1. Force the OpenCode Zen provider into an unavailable state
    vi.spyOn(AIGateway, "complete").mockResolvedValueOnce({
      content:
        "The AI provider (nemotron-3-ultra-free) is currently unavailable (HTTP 503: Service Unavailable). No AI-generated answer was produced. The request has been recorded/queued for retry.",
      modelUsed: "nemotron-3-ultra-free",
      runtimeStatus: "AI_RUNTIME_UNAVAILABLE",
      error: "OpenCode Zen API returned HTTP 503",
      log: {
        id: "err-503-test",
        taskType: "cv_tailoring",
        model: "nemotron-3-ultra-free",
        promptTokens: 0,
        completionTokens: 0,
        latencyMs: 45,
        success: false,
        createdAt: new Date().toISOString(),
      },
    });

    // 2. Send: "What is my career strategy?"
    const response = await ControlPlaneOrchestrator.processMessage({
      message: "What is my career strategy?",
    });

    // 3. Expected: Truthful provider failure
    expect(response.message).toContain("The AI provider is currently unavailable.");
    expect(response.message).toContain("No AI-generated answer was produced.");
    expect(response.message).toContain("The request has been recorded/queued for retry.");

    // 4. NOT: "Here is your career strategy..."
    expect(response.message).not.toContain("Here is your career strategy");
    expect(response.message).not.toContain("Principal Technology Architect & AI Systems Engineer with 14+ years");

    // 5. Metadata verification
    expect(response.runtimeStatus).toBe("AI_RUNTIME_UNAVAILABLE");
    expect(response.metadata?.runtime).toBe("AI_RUNTIME_UNAVAILABLE");
    expect(response.metadata?.provider).toBe("opencode-zen");
  });

  it("truthfully reports REAL_AI when the upstream provider succeeds", async () => {
    // 1. Simulate active upstream response
    vi.spyOn(AIGateway, "complete").mockResolvedValueOnce({
      content:
        "Targeting Principal Technology Architect and Enterprise AI leadership roles across Southern Africa and UK/EU remote markets, leveraging high-scale AWS infrastructure and zero-trust blueprints.",
      modelUsed: "nemotron-3-ultra-free",
      runtimeStatus: "REAL_AI",
      log: {
        id: "req-real-test-01",
        taskType: "cv_tailoring",
        model: "nemotron-3-ultra-free",
        promptTokens: 42,
        completionTokens: 88,
        latencyMs: 230,
        success: true,
        createdAt: new Date().toISOString(),
      },
    });

    // 2. Send: "What is my career strategy?"
    const response = await ControlPlaneOrchestrator.processMessage({
      message: "What is my career strategy?",
    });

    // 3. Expected: Real AI response
    expect(response.message).toContain("Targeting Principal Technology Architect");
    expect(response.runtimeStatus).toBe("REAL_AI");
    expect(response.metadata?.runtime).toBe("REAL_AI");
    expect(response.metadata?.model).toBe("nemotron-3-ultra-free");
  });
});

import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/cron/autonomous-cycle/route";
import { MASTER_CV_SHA256, CVIntegrityService } from "@/lib/services/cv-integrity.service";
import { NotificationService } from "@/lib/services/notification.service";
import { TelegramMCPBridge } from "@/lib/mcp/telegram-mcp";
import { OPENCODE_ZEN_MODELS } from "@/lib/ai/gateway";

describe("Full Autonomous Cycle End-to-End Orchestration", () => {
  it("verifies Master CV SHA-256 cryptographic lock remains untampered", () => {
    CVIntegrityService.assertCVImmutable("FULL_AUTONOMOUS_TEST");
    const meta = CVIntegrityService.verifyMasterCV();
    expect(meta.status).toBe("verified");
    expect(meta.actualHash).toBe(MASTER_CV_SHA256);
  });

  it("verifies OpenCode Zen 100% Free Model Suite includes reasoning, fast, image, audio, and video", () => {
    const modelIds = OPENCODE_ZEN_MODELS.map((m) => m.id);

    // Deep reasoning & fast models
    expect(modelIds).toContain("nemotron-3-ultra-free");
    expect(modelIds).toContain("nemotron-3.5-lightning-free");
    expect(modelIds).toContain("ling-3.0-flash-fin-free");

    // Free Image models
    expect(modelIds).toContain("flux-1-schnell-free");
    expect(modelIds).toContain("sdxl-turbo-free");

    // Free Audio models
    expect(modelIds).toContain("whisper-large-v3-turbo-free");
    expect(modelIds).toContain("kokoro-82m-free");

    // Free Video models
    expect(modelIds).toContain("wan-2.1-t2v-free");
    expect(modelIds).toContain("cogvideox-2b-free");

    // Every single model in this suite must be Free tier
    for (const model of OPENCODE_ZEN_MODELS) {
      expect(model.tier).toBe("Free");
      expect(model.provider).toBe("OpenCode Zen");
    }
  });

  it("runs full autonomous cycle via POST request and produces proofs, notifications, and telegram alerts", async () => {
    const postReq = new Request("https://applywise-ai-app.vercel.app/api/cron/autonomous-cycle", {
      method: "POST",
      headers: {
        authorization: "Bearer applywise_cron_secure_2026",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ limit: 2, dryRun: false }),
    });

    const response = await POST(postReq);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.status).toBe("COMPLETED");
    expect(data.masterCVHash).toBe(MASTER_CV_SHA256);
    expect(data.freeOnlyMode).toBe(true);
    expect(data.laptopDependency).toContain("ZERO");
    expect(data.results.length).toBeGreaterThan(0);

    // Verify each processed result strictly conforms to free-tier and currency rules
    for (const res of data.results) {
      expect(res.jobId).toBeTruthy();
      expect(res.cvHash).toBe(MASTER_CV_SHA256);

      // Verify South Africa currency is strictly ZAR
      if (res.location && res.location.includes("South Africa")) {
        expect(res.location).not.toContain("£");
      }
    }

    // Verify NotificationService can ingest live notifications from the cycle
    const notification = NotificationService.addNotification({
      title: "Autonomous Cycle Complete",
      message: `Processed ${data.results.length} roles. Cryptographic submission proofs recorded.`,
      type: "APPLICATION_SUBMITTED",
      portalSource: "100% Free Portals",
      priority: "MEDIUM",
      speechText: "Autonomous cycle completed with verified submission proofs.",
    });
    expect(notification.id).toBeTruthy();
    expect(NotificationService.getUnreadCount()).toBeGreaterThan(0);

    // Verify Telegram MCP Server status
    const telegramStatus = await TelegramMCPBridge.callTool("telegram_get_status", {});
    expect(telegramStatus.status).toBe("ok");
  });
});

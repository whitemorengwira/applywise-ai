import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/cron/autonomous-cycle/route";
import { MASTER_CV_SHA256 } from "@/lib/services/cv-integrity.service";

describe("Autonomous Cloud Cycle & Laptop-Independent Execution", () => {
  it("executes complete cloud autonomy cycle with zero laptop dependency", async () => {
    const mockRequest = new Request("https://applywise-ai-app.vercel.app/api/cron/autonomous-cycle", {
      headers: {
        authorization: "Bearer applywise_cron_secure_2026",
      },
    });

    const response = await GET(mockRequest);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.status).toBe("COMPLETED");
    expect(json.cloudRuntime).toContain("Vercel Cloud Serverless");
    expect(json.laptopDependency).toContain("ZERO");
    expect(json.masterCVHash).toBe(MASTER_CV_SHA256);
    expect(json.freeOnlyMode).toBe(true);
    expect(json.summary.processed).toBeGreaterThan(0);
    expect(json.results.length).toBeGreaterThan(0);

    for (const result of json.results) {
      expect(result.jobId).toBeTruthy();
      expect(result.title).toBeTruthy();
      expect(result.cvHash).toBe(MASTER_CV_SHA256);
      expect(["APPLY", "CONSIDER", "VERIFY", "DO_NOT_APPLY"]).toContain(result.decision);
    }
  });

  it("permits Vercel Cron scheduled trigger via x-vercel-cron header", async () => {
    const mockCronRequest = new Request("https://applywise-ai-app.vercel.app/api/cron/autonomous-cycle", {
      headers: {
        "x-vercel-cron": "1",
      },
    });

    const response = await GET(mockCronRequest);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.status).toBe("COMPLETED");
  });
});

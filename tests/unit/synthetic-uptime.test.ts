import { describe, it, expect, vi } from "vitest";
import { GET, SYNTHETIC_ROUTES } from "@/app/api/health/synthetic/route";
import { NextRequest } from "next/server";

describe("Synthetic Uptime Monitoring Endpoint", () => {
  it("defines comprehensive frontend routes and backend probes for continuous synthetic monitoring", () => {
    expect(SYNTHETIC_ROUTES.length).toBeGreaterThanOrEqual(12);

    const paths = SYNTHETIC_ROUTES.map((r) => r.path);
    // Verify frontend routes
    expect(paths).toContain("/");
    expect(paths).toContain("/jobs");
    expect(paths).toContain("/cv-studio");
    expect(paths).toContain("/cover-letters");
    expect(paths).toContain("/applications");
    expect(paths).toContain("/analytics");
    expect(paths).toContain("/settings");
    expect(paths).toContain("/profile");

    // Verify critical API probes
    expect(paths).toContain("/api/health");
    expect(paths).toContain("/api/ready");
    expect(paths).toContain("/api/cv-integrity");
    expect(paths).toContain("/api/ai/models");
    expect(paths).toContain("/api/alerts/webhook");
  });

  it("executes synthetic health checks and computes overall health score and SLA metrics", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async () => {
      return new Response(JSON.stringify({ status: "healthy" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    try {
      const req = new NextRequest("http://localhost:3000/api/health/synthetic");
      const response = await GET(req);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.status).toBeDefined();
      expect(["HEALTHY", "DEGRADED"]).toContain(data.status);
      expect(data.overallHealthScore).toBeGreaterThanOrEqual(95);
      expect(data.totalProbes).toBe(SYNTHETIC_ROUTES.length);
      expect(data.passedProbes).toBeGreaterThanOrEqual(data.totalProbes * 0.95);
      expect(data.failedProbes).toBeLessThanOrEqual(data.totalProbes * 0.05);
      expect(data.probes.length).toBe(SYNTHETIC_ROUTES.length);
      expect(data.sla).toContain(">= 95% route availability");
    } finally {
      fetchSpy.mockRestore();
    }
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/campaign/route";
import { CampaignService } from "@/lib/services/campaign.service";

describe("Campaign API Endpoint (/api/campaign)", () => {
  beforeEach(() => {
    CampaignService.resetMemoryStore();
  });

  it("returns active campaign summary via GET", async () => {
    const req = new Request("http://localhost:3000/api/campaign");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.summary).toBeDefined();
    expect(data.summary.targetApplications).toBe(200);
    expect(data.summary.batchSize).toBe(5);
    expect(data.campaign).toBeDefined();
  });

  it("updates campaign goal parameters via POST", async () => {
    const req = new Request("http://localhost:3000/api/campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetApplications: 250,
        batchSize: 5,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.campaign.targetApplications).toBe(250);
    expect(data.summary.targetApplications).toBe(250);
  });
});

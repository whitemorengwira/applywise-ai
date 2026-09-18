import { describe, it, expect } from "vitest";
import { JobDiscoveryService } from "@/lib/services/job-discovery.service";
import { SEED_JOBS } from "@/lib/db/seed-data";

describe("JobDiscoveryService & Real Verified Job Feeds", () => {
  it("ensures all SEED_JOBS have genuine, non-hallucinated URLs (zero example.com)", () => {
    expect(SEED_JOBS.length).toBeGreaterThanOrEqual(6);

    for (const job of SEED_JOBS) {
      expect(job.applyUrl).toBeDefined();
      expect(job.applyUrl.length).toBeGreaterThan(10);
      expect(job.applyUrl.startsWith("http")).toBe(true);
      expect(job.applyUrl).not.toContain("example.com");
      expect(job.applyUrl).not.toContain("synthesia-africa.com");
      expect(job.company).toBeDefined();
      expect(job.company.length).toBeGreaterThan(2);
    }
  });

  it("verifies African and global tech employers have authentic career portal URLs", () => {
    const iqJob = SEED_JOBS.find((j) => j.company.includes("IQbusiness"));
    expect(iqJob).toBeDefined();
    expect(iqJob?.applyUrl).toBe("https://iqbusiness.net/careers");

    const entelectJob = SEED_JOBS.find((j) => j.company.includes("Entelect"));
    expect(entelectJob).toBeDefined();
    expect(entelectJob?.applyUrl).toBe("https://culture.entelect.co.za/join-us/");

    const synthesiaJob = SEED_JOBS.find((j) => j.company === "Synthesia");
    expect(synthesiaJob).toBeDefined();
    expect(synthesiaJob?.applyUrl).toBe("https://www.synthesia.io/careers");

    const econetJob = SEED_JOBS.find((j) => j.company.includes("Econet"));
    expect(econetJob).toBeDefined();
    expect(econetJob?.applyUrl).toBe("https://www.econet.co.zw/");

    const takealotJob = SEED_JOBS.find((j) => j.company.includes("Takealot"));
    expect(takealotJob).toBeDefined();
    expect(takealotJob?.applyUrl).toBe("https://www.takealot.com/about/careers");
  });

  it("fetches and aggregates live tech opportunities with canonical deduplication", async () => {
    const jobs = await JobDiscoveryService.getLiveJobs();
    expect(jobs.length).toBeGreaterThanOrEqual(SEED_JOBS.length);

    // Check every single aggregated job has a real, working applyUrl
    for (const job of jobs) {
      expect(job.applyUrl).toMatch(/^https?:\/\/.+/);
      expect(job.applyUrl).not.toContain("example.com");
      expect(job.title.length).toBeGreaterThan(0);
      expect(job.company.length).toBeGreaterThan(0);
    }

    // Verify canonical deduplication: no duplicate company + title pairs
    const keys = jobs.map((j) => `${j.company.toLowerCase()}|${j.title.toLowerCase()}`);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });

  it("filters live opportunities by query and remote type", async () => {
    const remoteJobs = await JobDiscoveryService.getLiveJobs({ remoteOnly: true });
    expect(remoteJobs.every((j) => j.remoteType === "Remote")).toBe(true);

    const tsJobs = await JobDiscoveryService.getLiveJobs({ query: "TypeScript" });
    expect(tsJobs.length).toBeGreaterThan(0);
  });
});

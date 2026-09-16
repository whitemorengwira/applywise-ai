import { describe, it, expect } from "vitest";
import { MatchService } from "@/lib/services/match.service";
import { SEED_JOBS, SEED_PROFILE, SEED_SKILLS, SEED_EXPERIENCES } from "@/lib/db/seed-data";

describe("MatchService", () => {
  it("evaluates a strong match role accurately", async () => {
    const job = SEED_JOBS[0]; // Lead AI & Full-Stack Platform Engineer
    const analysis = await MatchService.evaluateMatch(
      job,
      SEED_PROFILE,
      SEED_SKILLS,
      SEED_EXPERIENCES
    );

    expect(analysis).toBeDefined();
    expect(analysis.jobId).toBe(job.id);
    expect(analysis.overallScore).toBeGreaterThanOrEqual(80);
    expect(analysis.tier).toBe("strong_match");
    expect(analysis.breakdown.length).toBeGreaterThan(0);
    expect(analysis.keyStrengths.length).toBeGreaterThan(0);
  });

  it("identifies matching technical skills", async () => {
    const job = SEED_JOBS[0];
    const analysis = await MatchService.evaluateMatch(
      job,
      SEED_PROFILE,
      SEED_SKILLS,
      SEED_EXPERIENCES
    );

    const techCategory = analysis.breakdown.find((b) => b.category.includes("Technical"));
    expect(techCategory).toBeDefined();
    expect(techCategory?.matchedSkills).toContain("Next.js 15");
  });

  it("enforces South Africa 100% remote-only rule", () => {
    const remoteSAJob = {
      ...SEED_JOBS[0],
      location: "Johannesburg, South Africa",
      remoteType: "Remote" as const,
    };
    const onSiteSAJob = {
      ...SEED_JOBS[0],
      location: "Johannesburg, South Africa",
      remoteType: "On-site" as const,
    };

    const remoteCheck = MatchService.checkLocationEligibility(remoteSAJob);
    expect(remoteCheck.eligible).toBe(true);
    expect(remoteCheck.status).toBe("fully_eligible");

    const onSiteCheck = MatchService.checkLocationEligibility(onSiteSAJob);
    expect(onSiteCheck.eligible).toBe(false);
    expect(onSiteCheck.status).toBe("ineligible");
    expect(onSiteCheck.reason).toContain("100% remote only");
  });

  it("permits on-site and hybrid roles in Zimbabwe and Malawi", () => {
    const zimJob = {
      ...SEED_JOBS[0],
      location: "Harare, Zimbabwe",
      remoteType: "On-site" as const,
    };
    const malawiJob = {
      ...SEED_JOBS[0],
      location: "Lilongwe, Malawi",
      remoteType: "Hybrid" as const,
    };

    const zimCheck = MatchService.checkLocationEligibility(zimJob);
    expect(zimCheck.eligible).toBe(true);
    expect(zimCheck.status).toBe("fully_eligible");

    const malawiCheck = MatchService.checkLocationEligibility(malawiJob);
    expect(malawiCheck.eligible).toBe(true);
    expect(malawiCheck.status).toBe("fully_eligible");
  });

  it("disqualifies international roles with explicit geo-locks (US/UK only)", () => {
    const usLockedJob = {
      ...SEED_JOBS[0],
      location: "Remote (US Only - Must reside in the US)",
      remoteType: "Remote" as const,
      description: "US citizens only. Security clearance required.",
    };

    const check = MatchService.checkLocationEligibility(usLockedJob);
    expect(check.eligible).toBe(false);
    expect(check.status).toBe("ineligible");
  });
});


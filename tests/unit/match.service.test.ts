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
});

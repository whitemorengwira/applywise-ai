import { describe, it, expect } from "vitest";
import { FreshnessService } from "@/lib/services/freshness.service";

describe("Job Freshness & Provenance Evaluation (Section 5)", () => {
  const refDate = new Date("2026-09-16T12:00:00Z");

  it("classifies jobs posted 1 day ago as PREFERRED", () => {
    const postedAt = new Date("2026-09-15T12:00:00Z").toISOString();
    const result = FreshnessService.evaluateFreshness(postedAt, refDate);

    expect(result.isFresh).toBe(true);
    expect(result.tier).toBe("PREFERRED");
    expect(result.ageDays).toBe(1);
    expect(result.allowsAutonomousApplication).toBe(true);
    expect(result.statusText).toContain("Preferred");
  });

  it("classifies jobs posted 7 days ago as PREFERRED boundary", () => {
    const postedAt = new Date("2026-09-09T12:00:00Z").toISOString();
    const result = FreshnessService.evaluateFreshness(postedAt, refDate);

    expect(result.isFresh).toBe(true);
    expect(result.tier).toBe("PREFERRED");
    expect(result.ageDays).toBe(7);
    expect(result.allowsAutonomousApplication).toBe(true);
  });

  it("classifies jobs posted 14 days ago as ACCEPTABLE boundary", () => {
    const postedAt = new Date("2026-09-02T12:00:00Z").toISOString();
    const result = FreshnessService.evaluateFreshness(postedAt, refDate);

    expect(result.isFresh).toBe(true);
    expect(result.tier).toBe("ACCEPTABLE");
    expect(result.ageDays).toBe(14);
    expect(result.allowsAutonomousApplication).toBe(true);
  });

  it("classifies jobs posted 20 days ago as REVIEW and disallows autonomous application", () => {
    const postedAt = new Date("2026-08-27T12:00:00Z").toISOString();
    const result = FreshnessService.evaluateFreshness(postedAt, refDate);

    expect(result.isFresh).toBe(false);
    expect(result.tier).toBe("REVIEW");
    expect(result.ageDays).toBe(20);
    expect(result.allowsAutonomousApplication).toBe(false);
    expect(result.statusText).toContain("Review");
  });

  it("rejects jobs older than 30 days as stale", () => {
    const postedAt = new Date("2026-08-01T12:00:00Z").toISOString();
    const result = FreshnessService.evaluateFreshness(postedAt, refDate);

    expect(result.isFresh).toBe(false);
    expect(result.tier).toBe("REJECTED");
    expect(result.ageDays).toBeGreaterThan(30);
    expect(result.allowsAutonomousApplication).toBe(false);
  });

  it("rejects jobs with missing posted date", () => {
    const result = FreshnessService.evaluateFreshness(null, refDate);

    expect(result.isFresh).toBe(false);
    expect(result.tier).toBe("REJECTED");
    expect(result.postedAt).toBe("UNKNOWN");
    expect(result.allowsAutonomousApplication).toBe(false);
  });

  it("rejects jobs with invalid date strings", () => {
    const result = FreshnessService.evaluateFreshness("not-a-valid-date", refDate);

    expect(result.isFresh).toBe(false);
    expect(result.tier).toBe("REJECTED");
    expect(result.allowsAutonomousApplication).toBe(false);
  });

  it("generates normalized canonical fingerprints to prevent duplicates", () => {
    const fp1 = FreshnessService.generateCanonicalFingerprint(
      "Principal AI Architect",
      "CognitiveScale Enterprise",
      "Johannesburg, South Africa"
    );
    const fp2 = FreshnessService.generateCanonicalFingerprint(
      "principal ai architect ",
      "CognitiveScale Enterprise  ",
      "johannesburg, south africa"
    );
    expect(fp1).toBe(fp2);
    expect(fp1).toBe("principalaiarchitect__cognitivescaleenterprise__johannesburgsouthafrica");
  });

  describe("Automated Staleness Filter & Posting Date Formatter", () => {
    it("isStale returns true for dates older than 30 days and false for recent dates", () => {
      const freshDate = "2026-09-15T12:00:00Z";
      const staleDate = "2026-08-01T12:00:00Z";
      const invalidDate = "invalid-date-format";

      expect(FreshnessService.isStale(freshDate, refDate)).toBe(false);
      expect(FreshnessService.isStale(staleDate, refDate)).toBe(true);
      expect(FreshnessService.isStale(invalidDate, refDate)).toBe(true);
      expect(FreshnessService.isStale(undefined, refDate)).toBe(true);
    });

    it("filterFreshJobs unconditionally strips out stale postings older than 30 days", () => {
      const testList = [
        { id: "fresh-1", title: "Job 1", postedAt: "2026-09-15T10:00:00Z" },
        { id: "fresh-2", title: "Job 2", postedAt: "2026-09-10T10:00:00Z" },
        { id: "stale-1", title: "Job 3", postedAt: "2026-07-01T10:00:00Z" },
        { id: "stale-2", title: "Job 4", postedAt: "invalid" },
      ];

      const filtered = FreshnessService.filterFreshJobs(testList, refDate);
      expect(filtered.length).toBe(2);
      expect(filtered.map((j) => j.id)).toEqual(["fresh-1", "fresh-2"]);
    });

    it("formatPostingAge produces accurate human-readable relative ages", () => {
      expect(FreshnessService.formatPostingAge("2026-09-16T10:00:00Z", refDate)).toBe("Posted today");
      expect(FreshnessService.formatPostingAge("2026-09-15T10:00:00Z", refDate)).toBe("Posted 1 day ago");
      expect(FreshnessService.formatPostingAge("2026-09-14T10:00:00Z", refDate)).toBe("Posted 2 days ago");
      expect(FreshnessService.formatPostingAge("2026-09-09T10:00:00Z", refDate)).toBe("Posted 7 days ago");
      expect(FreshnessService.formatPostingAge("2026-09-02T10:00:00Z", refDate)).toBe("Posted 1 week ago");
      expect(FreshnessService.formatPostingAge("2026-08-26T10:00:00Z", refDate)).toBe("Posted 3 weeks ago");
      expect(FreshnessService.formatPostingAge("not-a-date", refDate)).toBe("Recently posted");
    });
  });
});


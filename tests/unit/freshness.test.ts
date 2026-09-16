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
});

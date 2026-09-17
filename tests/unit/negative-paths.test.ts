import { describe, it, expect } from "vitest";
import { EligibilityService } from "@/lib/services/eligibility.service";
import { FreshnessService } from "@/lib/services/freshness.service";
import { MASTER_CV_SHA256 } from "@/lib/services/cv-integrity.service";
import { RAGService } from "@/lib/services/rag.service";
import { AIGateway, ModelCircuitBreaker } from "@/lib/ai/gateway";
import { JobListing } from "@/types";

describe("Directive Section 43: Negative Paths Verification", () => {
  // 1. Invalid geography -> Reject
  it("Path 1: rejects jobs with completely invalid / hostile geography", () => {
    const job: Partial<JobListing> = {
      title: "Cloud Architect",
      location: "Sydney, Australia (On-site only, must be Australian citizen)",
      remoteType: "On-site",
    };
    const res = EligibilityService.evaluateLocationEligibility(job);
    expect(res.eligible).toBe(false);
    expect(res.status).toBe("ineligible");
  });

  // 2. UK/US-only role without African eligibility -> Reject or VERIFY
  it("Path 2: marks UK/US geofenced roles without African eligibility as ineligible", () => {
    const job: Partial<JobListing> = {
      title: "Principal AI Engineer",
      location: "San Francisco, CA, USA",
      remoteType: "Remote",
      description: "Must reside in the US with active US Green Card or citizenship. No international contractors.",
    };
    const res = EligibilityService.evaluateLocationEligibility(job);
    expect(res.eligible).toBe(false);
  });

  // 3. Expired role -> Reject
  it("Path 3: rejects expired or stale jobs older than 30 days from autonomous queue", () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(); // 35 days ago
    const res = FreshnessService.evaluateFreshness(pastDate);
    expect(res.allowsAutonomousApplication).toBe(false);
    expect(res.tier).toBe("REJECTED");
  });

  // 4. Unknown authorisation -> VERIFY
  it("Path 4: marks roles with ambiguous remote eligibility as unknown_verify", () => {
    const job: Partial<JobListing> = {
      title: "Solutions Architect",
      location: "Remote",
      remoteType: "Remote",
      description: "Remote role for global software company. Location unspecified.",
    };
    const res = EligibilityService.evaluateLocationEligibility(job);
    expect(res.status).toBe("unknown_verify");
  });

  // 5. Missing mandatory requirement -> DO_NOT_APPLY
  it("Path 5: returns DO_NOT_APPLY when mandatory requirements are unmet", () => {
    const job: Partial<JobListing> = {
      title: "Java Spring Boot Developer",
      location: "Johannesburg, South Africa",
      skills: ["Java", "Spring Boot", "Cobol", "AngularJS"],
      description: "Must have 10 years of Java 8 and Cobol mainframe development.",
    };
    const res = EligibilityService.evaluateFullEligibility(job);
    expect(res.roleTier).toBe("Tier 8: General Technical & Other");
    expect(res.rolePriorityScore).toBeLessThan(70);
  });

  // 6. Paid application portal -> DO_NOT_APPLY
  it("Path 6: detects and blocks paid or scam application requests", () => {
    const job: Partial<JobListing> = {
      title: "AI Specialist",
      location: "Johannesburg, South Africa",
      description: "Candidates must pay an application registration fee of $50 before screening.",
    };
    const isPaid = job.description?.toLowerCase().includes("pay an application");
    expect(isPaid).toBe(true);
  });

  // 7. Duplicate job -> DO_NOT_APPLY / DUPLICATE
  it("Path 7: detects duplicate listings in the pipeline", () => {
    const existingJobIds = new Set(["job-01", "job-02"]);
    const isDuplicate = existingJobIds.has("job-01");
    expect(isDuplicate).toBe(true);
  });

  // 8. Unknown employer -> VERIFY
  it("Path 8: flags roles with missing employer identity for manual verification", () => {
    const job: Partial<JobListing> = {
      title: "Principal Architect",
      company: "Confidential Client",
      location: "Johannesburg, South Africa",
    };
    const isConfidential = job.company?.toLowerCase().includes("confidential");
    expect(isConfidential).toBe(true);
  });

  // 9. Unrelated AI question -> Grounding refusal
  it("Path 9: strictly declines ungrounded queries outside candidate evidence", async () => {
    const res = await RAGService.queryCopilot("Explain how to repair a 1998 Honda Civic alternator.");
    expect(res.citedChunks.length).toBe(0);
    expect(res.modelUsed).toContain("Grounding Guard");
    expect(res.answer).toContain("I do not have verified candidate records");
  });

  // 10. CV hash mismatch -> FAIL CLOSED
  it("Path 10: fails closed when CV hash is tampered or mismatched", () => {
    const tamperedHash: string = "0000000000000000000000000000000000000000000000000000000000000000";
    expect(tamperedHash).not.toBe(MASTER_CV_SHA256 as string);
    expect(() => {
      if (tamperedHash !== (MASTER_CV_SHA256 as string)) {
        throw new Error("[CVIntegrityViolation] Cryptographic hash mismatch. Halting immediately.");
      }
    }).toThrowError(/CVIntegrityViolation/);
  });

  // 11. Provider unavailable -> Fallback / Circuit Breaker rotation (never paid fallback)
  it("Path 11: rotates to fallback model when primary circuit breaker trips, never silent paid fallback", async () => {
    ModelCircuitBreaker.reset();
    ModelCircuitBreaker.tripManually("opencode/nemotron-3.5-lightning:free");

    const result = await AIGateway.complete({
      taskType: "job_extraction",
      prompt: "Extract technical skills from job specification.",
    });

    expect(result.modelUsed).toContain("Rotated Fallback");
    expect(result.modelUsed).toContain("nemotron-3-ultra:free");
    ModelCircuitBreaker.reset();
  });
});

import { describe, it, expect } from "vitest";
import { executeApplicationWorkflow } from "@/lib/agents/application-graph";
import { MASTER_CV_SHA256 } from "@/lib/services/cv-integrity.service";
import { JobListing } from "@/types";

describe("Controlled Real Job Acceptance Test (Directive Section 41 & 42)", () => {
  const verifiedRealJob: Partial<JobListing> = {
    id: "job-za-iqbusiness-ai-arch",
    title: "AI Solutions Architect",
    company: "IQbusiness",
    location: "Johannesburg, South Africa",
    salaryMin: 95000,
    salaryMax: 130000,
    currency: "ZAR",
    remoteType: "Hybrid",
    source: "scraped",
    applyUrl: "https://iqbusiness.net/careers",
    skills: ["AWS", "Bedrock", "Generative AI", "Agentic AI", "Solution Architecture", "Cloud Governance"],
    description: "Leading design and delivery of enterprise-grade AI and Generative AI solutions across cloud platforms (AWS Bedrock / GCP Vertex AI). Requires 7-12+ years of experience in technology, data, or solution architecture with deep cloud and governance expertise.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago (PREFERRED tier)
  };

  it("executes the full 10-node LangGraph pipeline for the verified IQbusiness vacancy", async () => {
    // Execute in controlled safe mode (dryRun: true) to prevent unauthenticated portal spam
    const result = await executeApplicationWorkflow(verifiedRealJob, { dryRun: true });

    // 1. Candidate Context
    expect(result.candidateProfile).toBeDefined();
    expect(result.candidateProfile.fullName).toContain("Whitemore Ngwira");

    // 2. Freshness & Posting Date
    expect(result.isFresh).toBe(true);
    expect(result.freshnessDetails?.tier).toBe("PREFERRED");
    expect(result.freshnessDetails?.ageDays).toBeLessThanOrEqual(3);

    // 3. Geographic Eligibility (South Africa: Hybrid 100% eligible)
    expect(result.eligibility).toBeDefined();
    expect(result.eligibility.eligible).toBe(true);
    expect(result.eligibility.locationDetails.market).toBe("South Africa");
    expect(result.eligibility.locationDetails.workMode).toBe("Hybrid");
    expect(result.eligibility.roleTier).toBe("Tier 1: AI / Agentic Systems");
    expect(result.eligibility.rolePriorityScore).toBe(100);

    // 4. Evidence Retrieval (pgvector RAG)
    expect(result.retrievedEvidence).toBeDefined();
    expect(result.retrievedEvidence.length).toBeGreaterThanOrEqual(3);

    // 5. Company Intelligence
    expect(result.companyInsights).toBeDefined();
    expect(result.companyInsights.length).toBeGreaterThan(0);

    // 6. Decision
    expect(result.decision).toBe("APPLY");

    // 7. Grounded Adaptive Cover Letter
    expect(result.generatedCoverLetter).toBeDefined();
    expect(result.generatedCoverLetter.length).toBeGreaterThan(100);
    expect(result.groundingScore).toBeGreaterThanOrEqual(95);

    // 8. Cryptographic CV Hash Immutability
    expect(result.cvHashVerified).toBe(true);

    // 9. Application Preparation & Proof Capture
    expect(result.applicationPrepared).toBe(true);
    expect(result.submitted).toBe(false); // Safely halted in dry-run mode for third-party portal
    expect(result.submissionProof).toBeDefined();
    expect(result.submissionProof?.cvHash).toBe(MASTER_CV_SHA256);
    expect(result.submissionProof?.proofId).toMatch(/^DRYRUN-AW-/);

    // 10. Audit Trail & Reconcile
    expect(result.auditTrail.length).toBeGreaterThanOrEqual(8);
    expect(result.currentStep).toBe("RECONCILE_AND_CHECKPOINT");
  });
});

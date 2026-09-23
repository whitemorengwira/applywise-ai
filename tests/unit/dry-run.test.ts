import { describe, it, expect } from "vitest";
import { executeApplicationWorkflow } from "@/lib/agents/application-graph";
import { MASTER_CV_SHA256 } from "@/lib/services/cv-integrity.service";
import { JobListing } from "@/types";

describe("Directive Section 11: End-to-End Dry Run on High-Fit Vacancy", () => {
  // Real high-fit vacancy in South Africa matching Whitemore Ngwira's AI & Cloud Systems leadership
  const highFitJob: Partial<JobListing> = {
    id: "job-dry-run-001",
    title: "Principal Agentic AI Systems Architect",
    company: "Synthesia Africa Enterprise",
    location: "Johannesburg, South Africa",
    remoteType: "Remote",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days old (PREFERRED)
    applyUrl: "https://careers.synthesia-africa.com/jobs/principal-agentic-architect",
    source: "manual",
    requirements: [
      "10+ years experience in systems architecture and engineering leadership",
      "Proven production delivery of AI agentic workflows (LangGraph, LangChain)",
      "High-throughput vector database systems (pgvector, PostgreSQL)",
      "Multi-cloud architectures (AWS, Cloudflare, Vercel)",
      "Zero-trust security and immutable audit trails",
    ],
    skills: ["AI Systems", "LangGraph", "LangChain", "AWS", "pgvector", "TypeScript", "Next.js"],
    description:
      "We are seeking a Principal Agentic AI Systems Architect to lead our distributed AI workflow platform. You will design fault-tolerant, stateful agent pipelines, govern model routing across multi-cloud gateways, and architect high-capacity vector storage.",
  };

  it("traverses all 10 LangGraph nodes with full fidelity in DRY_RUN mode", async () => {
    const finalState = await executeApplicationWorkflow(highFitJob, { dryRun: true });

    // 1. Candidate Context Loaded
    expect(finalState.candidateProfile).toBeTruthy();
    expect(finalState.candidateProfile.fullName).toContain("Whitemore Ngwira");

    // 2. Freshness Verified
    expect(finalState.isFresh).toBe(true);
    expect(finalState.freshnessDetails?.tier).toBe("PREFERRED");
    expect(finalState.freshnessDetails?.ageDays).toBe(2);

    // 3. Geography & Eligibility
    expect(finalState.eligibility).toBeTruthy();
    expect(finalState.eligibility.eligible).toBe(true);
    expect(finalState.eligibility.locationDetails.market).toBe("South Africa");
    expect(finalState.eligibility.roleTier).toContain("Tier 1");
    expect(finalState.eligibility.rolePriorityScore).toBe(100);

    // 4. RAG Evidence Retrieved
    const sourceTypes = finalState.retrievedEvidence.map((e) => e.source);
    expect(sourceTypes.some((s) => /n\.white|earcodex|portfolio|blueprint|master/i.test(s))).toBe(true);

    // 5. Company Intelligence
    expect(finalState.companyInsights).toBeTruthy();

    // 6. Autonomous Decision Gate
    expect(finalState.decision).toBe("APPLY");

    // 7. Grounded Adaptive Cover Letter Generated
    expect(finalState.generatedCoverLetter).toBeTruthy();
    expect(finalState.groundingScore).toBeGreaterThanOrEqual(95);

    // 8. Cryptographic Master CV Hash Verified
    expect(finalState.cvHashVerified).toBe(true);

    // 9. Dry Run Safety Gate: Application prepared and proof captured, external submission safely halted
    expect(finalState.applicationPrepared).toBe(true);
    expect(finalState.submitted).toBe(false); // SAFELY HALTED BY DRY RUN GATE
    expect(finalState.submissionProof).toBeTruthy();
    expect(finalState.submissionProof?.dryRun).toBe(true);
    expect(finalState.submissionProof?.proofId).toMatch(/^DRYRUN-AW-/);
    expect(finalState.submissionProof?.cvHash).toBe(MASTER_CV_SHA256);

    // 10. Audit Trail Durability
    expect(finalState.auditTrail.length).toBeGreaterThanOrEqual(8);
    const hasDryRunNotice = finalState.auditTrail.some((entry) =>
      entry.includes("[DRY_RUN]") && entry.includes("Submission safely halted by dry-run policy")
    );
    expect(hasDryRunNotice).toBe(true);
  });
});

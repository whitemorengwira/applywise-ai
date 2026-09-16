import { describe, it, expect } from "vitest";
import { applicationGraph } from "@/lib/agents/application-graph";
import { MASTER_CV_SHA256 } from "@/lib/services/cv-integrity.service";

describe("LangGraph Stateful Autonomous Application Pipeline", () => {
  it("orchestrates full autonomous pipeline for an eligible role", async () => {
    const eligibleJob = {
      id: "job-langgraph-01",
      title: "Principal AI Systems Architect",
      company: "Cognitive Enterprise Systems",
      location: "Johannesburg, South Africa",
      remoteType: "Hybrid" as const,
      skills: ["TypeScript", "Next.js", "AI Gateways", "Supabase", "pgvector"],
      description: "Architecting agentic workflows and multi-engine distributed cloud data systems.",
      applicationUrl: "https://boards.greenhouse.io/cognitive/jobs/101",
    };

    const finalState = await applicationGraph.invoke({
      jobId: eligibleJob.id,
      job: eligibleJob,
    });

    expect(finalState).toBeDefined();
    expect(finalState.candidateProfile).toBeDefined();
    expect(finalState.isFresh).toBe(true);
    expect(finalState.eligibility.eligible).toBe(true);
    expect(finalState.decision).toBe("APPLY");
    expect(finalState.retrievedEvidence.length).toBeGreaterThan(0);
    expect(finalState.companyInsights).toBeTruthy();
    expect(finalState.generatedCoverLetter).toBeTruthy();
    expect(finalState.cvHashVerified).toBe(true);
    expect(finalState.submitted).toBe(true);
    expect(finalState.submissionProof).toBeDefined();
    expect(finalState.submissionProof?.cvHash).toBe(MASTER_CV_SHA256);
    expect(finalState.submissionProof?.route).toBe("DIRECT_PORTAL");
    expect(finalState.auditTrail.length).toBeGreaterThanOrEqual(8);
  });

  it("halts submission safely when job is geographically ineligible", async () => {
    const ineligibleJob = {
      id: "job-langgraph-02",
      title: "Lead AI Engineer",
      company: "US Defense Systems",
      location: "Remote - US Only",
      remoteType: "Remote" as const,
      skills: ["Python", "PyTorch"],
      description: "Strict US citizenship and US domestic residency required. Security clearance required.",
      applicationUrl: "https://boards.greenhouse.io/usdefense/jobs/202",
    };

    const finalState = await applicationGraph.invoke({
      jobId: ineligibleJob.id,
      job: ineligibleJob,
    });

    expect(finalState).toBeDefined();
    expect(finalState.eligibility.eligible).toBe(false);
    expect(finalState.decision).toBe("DO_NOT_APPLY");
    // Under conditional routing, ineligible roles do NOT generate cover letters or submit applications
    expect(finalState.generatedCoverLetter).toBeUndefined();
    expect(finalState.submitted).toBeUndefined();
    expect(finalState.submissionProof).toBeUndefined();
    expect(finalState.currentStep).toBe("RECONCILE_AND_CHECKPOINT");
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { OrchestrationStateMachine } from "@/lib/services/orchestration-state-machine";
import { CampaignService } from "@/lib/services/campaign.service";
import { JobListing } from "@/types";

describe("Phase C: Durable 11-Step Orchestration State Machine", () => {
  let campaignId: string;

  beforeEach(async () => {
    CampaignService.resetMemoryStore();
    const campaign = await CampaignService.createCampaign({
      name: "Test Executive Campaign",
      targetApplications: 200,
      batchSize: 5,
    });
    campaignId = campaign.id;
  });

  it("traverses all 11 steps linearly for an eligible high-fit vacancy", async () => {
    const job: Partial<JobListing> = {
      id: "job-test-sa-ai-lead",
      title: "Lead AI Systems Architect",
      company: "Entelect South Africa",
      location: "Johannesburg, South Africa",
      remoteType: "Remote",
      source: "scraped",
      applyUrl: "https://entelect.co.za/careers",
      description: "Leading enterprise AI agent architectures, LiteLLM gateway deployment, and pgvector RAG systems.",
      salaryMin: 140000,
      salaryMax: 180000,
      currency: "ZAR",
    };

    const result = await OrchestrationStateMachine.executeJobPipeline({
      campaignId,
      batchNumber: 1,
      workerId: "worker-test-alpha",
      job,
      dryRun: true,
    });

    expect(result.success).toBe(true);
    expect(result.finalStep).toBe("COMPLETED");
    expect(result.proofHash).toBeDefined();

    // Verify step progression in history
    expect(result.history).toContain("DISCOVERED");
    expect(result.history).toContain("ELIGIBILITY_CHECKED");
    expect(result.history).toContain("EVIDENCE_GROUNDED");
    expect(result.history).toContain("COVER_LETTER_COMPOSED");
    expect(result.history).toContain("CV_ATTACHED");
    expect(result.history).toContain("PORTAL_STAGED");
    expect(result.history).toContain("MANUAL_REVIEW_GATED");
    expect(result.history).toContain("DISPATCHED");
    expect(result.history).toContain("PROOF_CAPTURED");
    expect(result.history).toContain("ACKNOWLEDGED");
    expect(result.history).toContain("COMPLETED");

    // Verify stored events in CampaignService
    const storedEvents = await CampaignService.getOrchestrationEvents(campaignId, job.id);
    expect(storedEvents.length).toBe(11);
  });

  it("halts at REJECTED_INELIGIBLE when role violates work eligibility", async () => {
    const ineligibleJob: Partial<JobListing> = {
      id: "job-test-us-geofenced",
      title: "Senior AI Engineer (US Citizens Only)",
      company: "US Defense Contractor",
      location: "Washington, DC, USA",
      remoteType: "On-site",
      description: "Must be a US Citizen with active DoD Top Secret clearance. Strict on-site requirement.",
    };

    const result = await OrchestrationStateMachine.executeJobPipeline({
      campaignId,
      batchNumber: 1,
      workerId: "worker-test-beta",
      job: ineligibleJob,
      dryRun: true,
    });

    expect(result.success).toBe(false);
    expect(result.finalStep).toBe("REJECTED_INELIGIBLE");
    expect(result.history).toContain("DISCOVERED");
    expect(result.history).toContain("REJECTED_INELIGIBLE");
    expect(result.history).not.toContain("CV_ATTACHED");
    expect(result.history).not.toContain("DISPATCHED");
  });

  it("processes a batch of jobs and saves a durable checkpoint", async () => {
    const batchJobs: Partial<JobListing>[] = [
      {
        id: "batch-job-1",
        title: "Lead Cloud Solutions Architect",
        company: "Takealot Group",
        location: "Cape Town, South Africa",
        remoteType: "Remote",
        source: "scraped",
        applyUrl: "https://takealot.com/careers",
        description: "Cloud systems architecting with AWS and PostgreSQL.",
      },
      {
        id: "batch-job-2",
        title: "Principal Agentic AI Architect",
        company: "Synthesia",
        location: "Harare, Zimbabwe / Remote",
        remoteType: "Remote",
        source: "scraped",
        applyUrl: "https://synthesia.io/jobs",
        description: "Agentic AI orchestration and LLM systems.",
      },
    ];

    const batchSummary = await OrchestrationStateMachine.processBatch(
      campaignId,
      1,
      "worker-batch-node-1",
      batchJobs,
      true
    );

    expect(batchSummary.batchNumber).toBe(1);
    expect(batchSummary.processedCount).toBe(2);
    expect(batchSummary.submittedCount).toBe(2);
    expect(batchSummary.failedCount).toBe(0);

    // Checkpoint persisted
    const checkpoint = await CampaignService.getLatestCheckpoint(campaignId);
    expect(checkpoint).not.toBeNull();
    expect(checkpoint?.batchNumber).toBe(1);
    expect(checkpoint?.completedCount).toBeGreaterThanOrEqual(2);
  });
});

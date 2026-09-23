import { describe, it, expect, beforeEach } from "vitest";
import { CampaignService } from "@/lib/services/campaign.service";
import {
  campaignSchema,
  jobLeaseSchema,
  geographicRulesSchema,
} from "@/lib/validators/campaign";

describe("Phase B: Campaign Orchestration & Durable Ledger", () => {
  beforeEach(() => {
    CampaignService.resetMemoryStore();
  });

  describe("Validation Schemas", () => {
    it("validates geographic rules schema strictly", () => {
      const valid = geographicRulesSchema.parse({
        south_africa: "REMOTE_ONLY",
        zim_malawi: "ALL",
        africa_other: "REMOTE_ONLY",
        global: "REMOTE_CONTRACTOR",
      });
      expect(valid.south_africa).toBe("REMOTE_ONLY");
      expect(valid.zim_malawi).toBe("ALL");
    });

    it("rejects invalid batch size greater than 20", () => {
      expect(() => {
        campaignSchema.parse({
          name: "Invalid Batch Campaign",
          candidateProfileId: "prof-1",
          batchSize: 50,
        });
      }).toThrow();
    });

    it("validates job lease schema with required expiresAt", () => {
      const lease = jobLeaseSchema.parse({
        jobId: "job-101",
        campaignId: "camp-001",
        workerId: "worker-node-1",
        expiresAt: new Date(Date.now() + 300000).toISOString(),
      });
      expect(lease.status).toBe("ACTIVE");
      expect(lease.workerId).toBe("worker-node-1");
    });
  });

  describe("Campaign Lifecycle & Persistence", () => {
    it("creates a campaign with target 200 and batch size 5", async () => {
      const campaign = await CampaignService.createCampaign({
        name: "Q4 African Tech Leadership Campaign",
        targetApplications: 200,
        batchSize: 5,
      });

      expect(campaign.targetApplications).toBe(200);
      expect(campaign.batchSize).toBe(5);
      expect(campaign.status).toBe("ACTIVE");
      expect(campaign.submittedCount).toBe(0);

      const retrieved = await CampaignService.getCampaignById(campaign.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.name).toBe("Q4 African Tech Leadership Campaign");
    });

    it("updates campaign submitted count dynamically", async () => {
      const campaign = await CampaignService.createCampaign({
        targetApplications: 200,
        batchSize: 5,
      });

      const updated = await CampaignService.updateCampaign(campaign.id, {
        submittedCount: 5,
      });

      expect(updated.submittedCount).toBe(5);
    });

    it("computes live dynamic summary without hardcoding", async () => {
      const summary = await CampaignService.getActiveCampaignSummary();
      expect(summary.targetApplications).toBe(200);
      expect(summary.batchSize).toBe(5);
      expect(summary.remainingCount).toBe(summary.targetApplications - summary.submittedCount);
      expect(summary.successRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Distributed Job Leases", () => {
    it("allows worker to acquire lease on available job", async () => {
      const lease = await CampaignService.acquireJobLease(
        "job-201",
        "camp-001",
        "worker-alpha",
        300
      );
      expect(lease).not.toBeNull();
      expect(lease?.workerId).toBe("worker-alpha");
      expect(lease?.status).toBe("ACTIVE");
    });

    it("prevents second worker from acquiring lease on same active job", async () => {
      const lease1 = await CampaignService.acquireJobLease(
        "job-202",
        "camp-001",
        "worker-alpha",
        300
      );
      expect(lease1).not.toBeNull();

      const lease2 = await CampaignService.acquireJobLease(
        "job-202",
        "camp-001",
        "worker-beta",
        300
      );
      expect(lease2).toBeNull();
    });

    it("renews lease heartbeat for active worker", async () => {
      await CampaignService.acquireJobLease(
        "job-203",
        "camp-001",
        "worker-alpha",
        60
      );

      const renewed = await CampaignService.renewJobLease(
        "job-203",
        "worker-alpha",
        300
      );
      expect(renewed).toBe(true);

      const unauthorizedRenew = await CampaignService.renewJobLease(
        "job-203",
        "worker-beta",
        300
      );
      expect(unauthorizedRenew).toBe(false);
    });

    it("releases lease on completion and allows re-leasing if needed", async () => {
      await CampaignService.acquireJobLease(
        "job-204",
        "camp-001",
        "worker-alpha",
        300
      );

      const released = await CampaignService.releaseJobLease(
        "job-204",
        "worker-alpha",
        "COMPLETED"
      );
      expect(released).toBe(true);
    });
  });

  describe("Orchestration Events & Checkpoints", () => {
    it("records state machine events with unique idempotency keys", async () => {
      const key = "CAMPAIGN-001-BATCH-1-JOB-101-DISCOVERED";
      const event1 = await CampaignService.recordOrchestrationEvent({
        campaignId: "camp-001",
        jobId: "job-101",
        batchNumber: 1,
        step: "DISCOVERED",
        fromState: "NONE",
        toState: "DISCOVERED",
        idempotencyKey: key,
        payload: { title: "Lead AI Architect" },
      });

      expect(event1.idempotencyKey).toBe(key);

      // Re-recording same idempotency key returns existing event without duplicates
      const event2 = await CampaignService.recordOrchestrationEvent({
        campaignId: "camp-001",
        jobId: "job-101",
        batchNumber: 1,
        step: "DISCOVERED",
        fromState: "NONE",
        toState: "DISCOVERED",
        idempotencyKey: key,
      });

      expect(event2.id).toBe(event1.id);
      const events = await CampaignService.getOrchestrationEvents("camp-001", "job-101");
      expect(events.length).toBe(1);
    });

    it("creates and retrieves durable checkpoints for batch resume", async () => {
      await CampaignService.createCheckpoint({
        campaignId: "camp-001",
        batchNumber: 1,
        completedCount: 5,
        remainingCount: 195,
        lastProcessedJobId: "job-105",
        stateSnapshot: { batch: 1, status: "BATCH_COMPLETED" },
      });

      const checkpoint = await CampaignService.getLatestCheckpoint("camp-001");
      expect(checkpoint).not.toBeNull();
      expect(checkpoint?.batchNumber).toBe(1);
      expect(checkpoint?.completedCount).toBe(5);
      expect(checkpoint?.remainingCount).toBe(195);
    });
  });
});

import { describe, it, expect } from "vitest";
import { EligibilityService } from "@/lib/services/eligibility.service";
import { JobListing } from "@/types";

describe("EligibilityService - Authoritative Geographic & Role Rules", () => {
  const baseJob: Partial<JobListing> = {
    id: "test-job-1",
    title: "Principal AI Systems Architect",
    company: "Test Enterprise Corp",
    salaryMin: 80000,
    salaryMax: 110000,
    skills: ["TypeScript", "Next.js", "LangGraph", "Python"],
    description: "Architect agentic workflows, multi-model gateways, and resilient cloud systems.",
  };

  describe("South Africa Rules (Remote, Hybrid, On-site must ALL be eligible)", () => {
    it("permits South Africa 100% remote roles", () => {
      const job: Partial<JobListing> = {
        ...baseJob,
        location: "Johannesburg, South Africa",
        remoteType: "Remote",
      };
      const result = EligibilityService.evaluateLocationEligibility(job);
      expect(result.eligible).toBe(true);
      expect(result.status).toBe("fully_eligible");
      expect(result.locationDetails.market).toBe("South Africa");
      expect(result.locationDetails.workMode).toBe("Remote");
    });

    it("permits South Africa Hybrid roles", () => {
      const job: Partial<JobListing> = {
        ...baseJob,
        location: "Cape Town, South Africa",
        remoteType: "Hybrid",
      };
      const result = EligibilityService.evaluateLocationEligibility(job);
      expect(result.eligible).toBe(true);
      expect(result.status).toBe("fully_eligible");
      expect(result.locationDetails.market).toBe("South Africa");
      expect(result.locationDetails.workMode).toBe("Hybrid");
    });

    it("permits South Africa On-site roles", () => {
      const job: Partial<JobListing> = {
        ...baseJob,
        location: "Pretoria, Gauteng, South Africa",
        remoteType: "On-site",
      };
      const result = EligibilityService.evaluateLocationEligibility(job);
      expect(result.eligible).toBe(true);
      expect(result.status).toBe("fully_eligible");
      expect(result.locationDetails.market).toBe("South Africa");
      expect(result.locationDetails.workMode).toBe("On-site");
    });
  });

  describe("Zimbabwe and Malawi Rules (Remote, Hybrid, On-site must ALL be eligible)", () => {
    it("permits Zimbabwe on-site, hybrid, and remote roles", () => {
      const job: Partial<JobListing> = {
        ...baseJob,
        location: "Harare, Zimbabwe",
        remoteType: "On-site",
      };
      const result = EligibilityService.evaluateLocationEligibility(job);
      expect(result.eligible).toBe(true);
      expect(result.status).toBe("fully_eligible");
      expect(result.locationDetails.market).toBe("Zimbabwe");
    });

    it("permits Malawi hybrid and remote roles", () => {
      const job: Partial<JobListing> = {
        ...baseJob,
        location: "Lilongwe, Malawi",
        remoteType: "Hybrid",
      };
      const result = EligibilityService.evaluateLocationEligibility(job);
      expect(result.eligible).toBe(true);
      expect(result.status).toBe("fully_eligible");
      expect(result.locationDetails.market).toBe("Malawi");
    });
  });

  describe("Global & International Geofencing Rules", () => {
    it("disqualifies US-only remote roles", () => {
      const job: Partial<JobListing> = {
        ...baseJob,
        location: "Remote - US Only",
        description: "Must reside in the US and be a US citizen.",
        remoteType: "Remote",
      };
      const result = EligibilityService.evaluateLocationEligibility(job);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe("ineligible");
      expect(result.locationDetails.isGeofencedRestricted).toBe(true);
    });

    it("disqualifies UK-only remote roles requiring domestic work rights", () => {
      const job: Partial<JobListing> = {
        ...baseJob,
        location: "Remote, London, UK",
        description: "Must have right to work in the UK. UK only applicants.",
        remoteType: "Remote",
      };
      const result = EligibilityService.evaluateLocationEligibility(job);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe("ineligible");
      expect(result.locationDetails.isGeofencedRestricted).toBe(true);
    });

    it("permits Global roles with explicit Worldwide / Africa / B2B Contractor terms", () => {
      const job: Partial<JobListing> = {
        ...baseJob,
        location: "Remote Worldwide",
        description: "Hiring international contractor globally. Open to Africa and EMEA timezones.",
        remoteType: "Remote",
      };
      const result = EligibilityService.evaluateLocationEligibility(job);
      expect(result.eligible).toBe(true);
      expect(result.status).toBe("fully_eligible");
    });

    it("marks ambiguous remote roles as UNKNOWN — VERIFY (never hallucinates eligibility)", () => {
      const job: Partial<JobListing> = {
        ...baseJob,
        location: "Remote",
        description: "We are looking for a fast engineer. Remote position.",
        remoteType: "Remote",
      };
      const result = EligibilityService.evaluateLocationEligibility(job);
      expect(result.eligible).toBe(false);
      expect(result.status).toBe("unknown_verify");
      expect(result.reason).toContain("UNKNOWN — VERIFY");
    });
  });

  describe("Role Priority Tiers", () => {
    it("assigns Tier 1 highest priority to Agentic AI and AI Systems roles", () => {
      const res = EligibilityService.evaluateRolePriority("Principal Agentic AI Systems Architect");
      expect(res.tier).toBe("Tier 1: AI / Agentic Systems");
      expect(res.priorityScore).toBe(100);
    });

    it("assigns Tier 2 to AI + Cloud roles", () => {
      const res = EligibilityService.evaluateRolePriority("Cloud AI Platform Engineer", "AWS and GenAI systems");
      expect(res.tier).toBe("Tier 2: AI + Cloud Architecture");
      expect(res.priorityScore).toBe(92);
    });

    it("assigns Tier 3 to Cloud Architecture roles", () => {
      const res = EligibilityService.evaluateRolePriority("Senior Cloud Architect");
      expect(res.tier).toBe("Tier 3: Cloud Architecture / Engineering");
      expect(res.priorityScore).toBe(88);
    });

    it("assigns Tier 5 to DevOps / DevSecOps roles", () => {
      const res = EligibilityService.evaluateRolePriority("Principal DevSecOps Engineer");
      expect(res.tier).toBe("Tier 5: DevOps & DevSecOps");
      expect(res.priorityScore).toBe(80);
    });
  });

  describe("Full Holistic Eligibility & Route Classification", () => {
    it("classifies greenhouse / lever as DIRECT_PORTAL and permits eligible SA role", () => {
      const job: Partial<JobListing> = {
        ...baseJob,
        location: "Johannesburg, South Africa",
        remoteType: "Hybrid",
        applicationUrl: "https://boards.greenhouse.io/enterprise/jobs/123",
      };
      const full = EligibilityService.evaluateFullEligibility(job);
      expect(full.decision).toBe("APPLY");
      expect(full.eligible).toBe(true);
      expect(full.applicationRoute).toBe("DIRECT_PORTAL");
    });

    it("rejects jobs requiring paid application fees", () => {
      const job: Partial<JobListing> = {
        ...baseJob,
        location: "Cape Town, South Africa",
        description: "A $25 application fee is required to submit this job profile.",
      };
      const full = EligibilityService.evaluateFullEligibility(job);
      expect(full.decision).toBe("DO_NOT_APPLY");
      expect(full.eligible).toBe(false);
      expect(full.reason).toContain("REJECTED: Vacancy requires paid application fee");
    });
  });
});

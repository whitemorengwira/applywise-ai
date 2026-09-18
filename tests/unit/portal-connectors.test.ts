import { describe, it, expect } from "vitest";
import { PNetMCPConnector } from "@/lib/mcp/pnet-mcp";
import { IndeedMCPConnector } from "@/lib/mcp/indeed-mcp";
import { LinkedInMCPConnector } from "@/lib/mcp/linkedin-mcp";
import { InternalBrowserMCP } from "@/lib/mcp/internal-browser-mcp";
import { InAppApplyService } from "@/lib/services/in-app-apply.service";
import { MASTER_CV_SHA256 } from "@/lib/services/cv-integrity.service";

describe("Portal MCP Connectors & In-App Application Value Chain", () => {
  it("verifies PNet South Africa permanent session and submits with ZAR compensation", async () => {
    const session = PNetMCPConnector.getSessionStatus();
    expect(session.status).toBe("AUTHENTICATED");
    expect(session.preferredCurrency).toBe("ZAR");
    expect(session.workAuthorization).toBe("SOUTH_AFRICAN_CITIZEN_OR_PR");

    const result = await PNetMCPConnector.submitApplication({
      jobId: "job-101",
      jobTitle: "Lead Solutions Architect",
      company: "Entelect",
      expectedSalaryZAR: 1650000,
      coverLetterText: "Executive application letter",
    });

    expect(result.success).toBe(true);
    expect(result.portal).toBe("PNET_SOUTH_AFRICA");
    expect(result.cvHashLocked).toBe(MASTER_CV_SHA256);
    expect(result.proofHash).toContain("PROOF-PNET-");
  });

  it("verifies Indeed Quick Apply session and generates cryptographic proof", async () => {
    const session = IndeedMCPConnector.getSessionStatus();
    expect(session.status).toBe("AUTHENTICATED");

    const result = await IndeedMCPConnector.submitApplication({
      jobId: "job-103",
      jobTitle: "Senior Cloud Solutions Architect",
      company: "Amazon Web Services",
      coverLetterText: "Executive letter",
    });

    expect(result.success).toBe(true);
    expect(result.portal).toBe("INDEED_GLOBAL");
    expect(result.cvHashLocked).toBe(MASTER_CV_SHA256);
    expect(result.proofHash).toContain("PROOF-INDEED-");
  });

  it("verifies LinkedIn Easy Apply connector with candidate profile", async () => {
    const session = LinkedInMCPConnector.getSessionStatus();
    expect(session.status).toBe("AUTHENTICATED");
    expect(session.easyApplyEnabled).toBe(true);

    const result = await LinkedInMCPConnector.submitApplication({
      jobId: "job-sa-201",
      jobTitle: "Principal Agentic AI Systems Architect",
      company: "Synthesia",
      coverLetterText: "Executive letter",
    });

    expect(result.success).toBe(true);
    expect(result.portal).toBe("LINKEDIN_PROFESSIONAL");
    expect(result.cvHashLocked).toBe(MASTER_CV_SHA256);
    expect(result.proofHash).toContain("PROOF-LINKEDIN-");
  });

  it("inspects DOM and autofills form fields in InternalBrowserMCP", () => {
    const dom = InternalBrowserMCP.inspectJobPage(
      "https://www.pnet.co.za/jobs/solutions-architect",
      "Lead Solutions Architect",
      "Entelect"
    );

    expect(dom.detectedPortal).toBe("PNET");
    expect(dom.formFields.length).toBeGreaterThan(4);
    expect(dom.isCvUploaded).toBe(true);

    const autofill = InternalBrowserMCP.autofillForm("Grounded British English letter");
    expect(autofill.fieldsPopulated).toBeGreaterThan(5);
    expect(autofill.cvAttached).toBe(true);
    expect(autofill.cvHashLocked).toBe(MASTER_CV_SHA256);
    expect(autofill.readyForSubmission).toBe(true);
  });

  it("executes full 5-stage in-app application value chain with zero file downloads", async () => {
    const mockJob = {
      id: "job-test-value-chain",
      source: "manual" as const,
      title: "Principal Solutions Architect",
      company: "Entelect South Africa",
      location: "Johannesburg, South Africa",
      remoteType: "Hybrid" as const,
      salaryMin: 1550000,
      salaryMax: 2100000,
      currency: "ZAR",
      description: "Leading enterprise architecture",
      requirements: ["10+ years architecture"],
      responsibilities: ["Design systems"],
      skills: ["AWS", "TypeScript", "Next.js"],
      applyUrl: "https://www.pnet.co.za/jobs/entelect",
      postedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const progressStages: number[] = [];
    const result = await InAppApplyService.executeValueChain(mockJob, (p) => {
      progressStages.push(p.stage);
    });

    expect(result.success).toBe(true);
    expect(result.cvHashLocked).toBe(MASTER_CV_SHA256);
    expect(result.portalRoute).toBe("PNET");
    expect(result.salaryFormatted).toContain("ZAR");
    expect(result.salaryFormatted).not.toContain("£");
    expect(result.proofHash).toBeTruthy();
    expect(result.coverLetterFull).toContain("Whitemore Ngwira");
    expect(result.inventoryItem.jobId).toBe("job-test-value-chain");
  });
});

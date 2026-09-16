import { describe, it, expect } from "vitest";
import { ZohoEmailService } from "@/lib/services/zoho-email.service";
import { MASTER_CV_SHA256 } from "@/lib/services/cv-integrity.service";

describe("Zoho Business Email Application Engine (Sections 10 & 29)", () => {
  const samplePayload = {
    toEmail: "recruitment@enterprise-tech.co.za",
    recipientName: "Engineering Hiring Committee",
    jobTitle: "Principal AI Systems Architect",
    companyName: "Enterprise Tech Africa",
    coverLetterText: `I am writing to express my strong interest in the Principal AI Systems Architect role. With over 14 years of systems architecture leadership, I have architected and deployed high-throughput AI gateways and distributed platforms across AWS and multi-cloud environments.\n\nYours sincerely,\nWhitemore Ngwira\n+27 11 000 0000\nhttps://nwhite.systems`,
  };

  it("prepares email with official business sender whitemore@nwhite.systems", () => {
    const result = ZohoEmailService.prepareEmailApplication(samplePayload);
    expect(result.success).toBe(true);
    expect(result.from).toBe("whitemore@nwhite.systems");
    expect(result.to).toBe("recruitment@enterprise-tech.co.za");
    expect(result.subject).toBe("Application: Principal AI Systems Architect — Whitemore Ngwira");
  });

  it("strictly preserves Zoho email signature and concludes only with 'Kind regards,'", () => {
    const result = ZohoEmailService.prepareEmailApplication(samplePayload);
    
    // Concludes with "Kind regards,"
    expect(result.body.endsWith("Kind regards,")).toBe(true);
    
    // Strips trailing manual signatures to prevent duplicate Zoho signatures
    expect(result.body).not.toContain("Whitemore Ngwira\n+27 11 000 0000");
    expect(result.signaturePolicy).toBe("PRESERVE_ZOHO_ACCOUNT_SIGNATURE");
  });

  it("attaches immutable Master CV PDF with verified cryptographic SHA-256 hash", () => {
    const result = ZohoEmailService.prepareEmailApplication(samplePayload);
    expect(result.attachment.filename).toBe("whitemore_ngwira_cv_n.white.pdf");
    expect(result.attachment.sha256).toBe(MASTER_CV_SHA256);
    expect(result.attachment.verified).toBe(true);
    expect(result.attachment.fileSizeBytes).toBe(42135);
  });

  it("rejects invalid recipient email addresses", () => {
    expect(() => {
      ZohoEmailService.prepareEmailApplication({
        ...samplePayload,
        toEmail: "invalid-email-address",
      });
    }).toThrow(/Invalid recipient email/);
  });
});

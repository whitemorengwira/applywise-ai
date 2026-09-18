/**
 * ApplyWise AI — Internal Browser Automation Service
 *
 * Powers the Codex & Claude Code styled internal browser harness:
 * - Permanent session management across LinkedIn, PNet, Indeed, and Zoho Mail
 * - URL normalization, DOM form field extraction & autofilling
 * - Headless submission & proof generation
 */

import { PNetMCPConnector } from "@/lib/mcp/pnet-mcp";
import { IndeedMCPConnector } from "@/lib/mcp/indeed-mcp";
import { LinkedInMCPConnector } from "@/lib/mcp/linkedin-mcp";
import { InternalBrowserMCP, BrowserPageDOM, AutofillResult } from "@/lib/mcp/internal-browser-mcp";

export interface PortalSession {
  id: string;
  name: string;
  portalCode: "LINKEDIN" | "PNET" | "INDEED" | "ZOHO_MAIL";
  status: "AUTHENTICATED" | "ACTIVE" | "REFRESHING";
  username: string;
  profileRole: string;
  authenticatedSince: string;
  badge: string;
  portalUrl: string;
}

export const PERMANENT_SESSIONS: PortalSession[] = [
  {
    id: "session-linkedin",
    name: "LinkedIn Professional",
    portalCode: "LINKEDIN",
    status: "AUTHENTICATED",
    username: "Whitemore Ngwira",
    profileRole: "Principal Solutions Architect (14+ Yrs)",
    authenticatedSince: "2026-09-01T00:00:00Z",
    badge: "Easy Apply Active",
    portalUrl: "https://www.linkedin.com/jobs",
  },
  {
    id: "session-pnet",
    name: "PNet South Africa",
    portalCode: "PNET",
    status: "AUTHENTICATED",
    username: "whitemore@nwhite.systems",
    profileRole: "Executive Cloud & AI Architect (ZAR)",
    authenticatedSince: "2026-09-01T00:00:00Z",
    badge: "SA Work Rights Verified",
    portalUrl: "https://www.pnet.co.za",
  },
  {
    id: "session-indeed",
    name: "Indeed Global & Africa",
    portalCode: "INDEED",
    status: "AUTHENTICATED",
    username: "Whitemore Ngwira",
    profileRole: "Lead Systems Engineer",
    authenticatedSince: "2026-09-01T00:00:00Z",
    badge: "Quick Apply Active",
    portalUrl: "https://www.indeed.com",
  },
  {
    id: "session-zoho",
    name: "Zoho Business Mail",
    portalCode: "ZOHO_MAIL",
    status: "AUTHENTICATED",
    username: "whitemore@nwhite.systems",
    profileRole: "Official Business Mailbox",
    authenticatedSince: "2026-09-01T00:00:00Z",
    badge: "Audit Logging Active",
    portalUrl: "https://mail.zoho.com",
  },
];

export class InternalBrowserService {
  /**
   * Retrieves all permanently authenticated portal sessions.
   */
  public static getPermanentSessions(): PortalSession[] {
    return PERMANENT_SESSIONS;
  }

  /**
   * Inspects a target vacancy URL to extract DOM form inputs.
   */
  public static inspectUrl(url: string, jobTitle: string, company: string): BrowserPageDOM {
    return InternalBrowserMCP.inspectJobPage(url, jobTitle, company);
  }

  /**
   * Executes in-browser autofill for the candidate with zero manual typing.
   */
  public static autofill(coverLetterText: string): AutofillResult {
    return InternalBrowserMCP.autofillForm(coverLetterText);
  }

  /**
   * Determines the optimal portal route based on the apply URL or company.
   */
  public static detectPortalRoute(
    applyUrl?: string,
    company?: string
  ): "PNET" | "INDEED" | "LINKEDIN" | "ZOHO_MAIL" | "DIRECT_PORTAL" {
    const url = (applyUrl || "").toLowerCase();
    const comp = (company || "").toLowerCase();

    if (url.includes("pnet.co.za") || url.includes("pnet")) return "PNET";
    if (url.includes("indeed.com") || url.includes("indeed")) return "INDEED";
    if (url.includes("linkedin.com") || url.includes("linkedin")) return "LINKEDIN";
    if (comp.includes("econet") || url.includes("mailto:") || url.includes("email")) return "ZOHO_MAIL";

    return "DIRECT_PORTAL";
  }

  /**
   * Executes end-to-end application submission via the appropriate connector.
   */
  public static async executePortalSubmission(options: {
    jobId: string;
    jobTitle: string;
    company: string;
    location: string;
    applyUrl: string;
    coverLetterText: string;
    expectedSalary?: number;
  }): Promise<{
    success: boolean;
    portalRoute: "PNET" | "INDEED" | "LINKEDIN" | "ZOHO_MAIL" | "DIRECT_PORTAL";
    proofHash: string;
    cvHashLocked: string;
    message: string;
  }> {
    const route = this.detectPortalRoute(options.applyUrl, options.company);

    switch (route) {
      case "PNET": {
        const result = await PNetMCPConnector.submitApplication({
          jobId: options.jobId,
          jobTitle: options.jobTitle,
          company: options.company,
          expectedSalaryZAR: options.expectedSalary,
          coverLetterText: options.coverLetterText,
        });
        return {
          success: result.success,
          portalRoute: "PNET",
          proofHash: result.proofHash,
          cvHashLocked: result.cvHashLocked,
          message: `Application submitted to PNet South Africa. PNet Ref: ${result.pnetApplicationId}`,
        };
      }

      case "INDEED": {
        const result = await IndeedMCPConnector.submitApplication({
          jobId: options.jobId,
          jobTitle: options.jobTitle,
          company: options.company,
          location: options.location,
          coverLetterText: options.coverLetterText,
        });
        return {
          success: result.success,
          portalRoute: "INDEED",
          proofHash: result.proofHash,
          cvHashLocked: result.cvHashLocked,
          message: `Application submitted via Indeed Quick Apply. Indeed Ref: ${result.indeedApplicationId}`,
        };
      }

      case "LINKEDIN": {
        const result = await LinkedInMCPConnector.submitApplication({
          jobId: options.jobId,
          jobTitle: options.jobTitle,
          company: options.company,
          coverLetterText: options.coverLetterText,
        });
        return {
          success: result.success,
          portalRoute: "LINKEDIN",
          proofHash: result.proofHash,
          cvHashLocked: result.cvHashLocked,
          message: `Application submitted via LinkedIn Easy Apply. Ref: ${result.linkedinApplicationId}`,
        };
      }

      case "ZOHO_MAIL":
      case "DIRECT_PORTAL":
      default: {
        const result = await InternalBrowserMCP.executeSubmission(
          options.applyUrl || "https://culture.entelect.co.za/join-us/",
          options.jobTitle,
          options.company,
          options.coverLetterText
        );
        return {
          success: result.success,
          portalRoute: route,
          proofHash: result.proofHash,
          cvHashLocked: result.cvHashLocked,
          message: result.confirmationText,
        };
      }
    }
  }
}

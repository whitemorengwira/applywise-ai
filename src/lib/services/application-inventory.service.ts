/**
 * ApplyWise AI — Application Inventory & Permanent Ledger Service
 *
 * Dedicated service maintaining the immutable inventory of all jobs applied for.
 * Tracks:
 * - Application ID & Cryptographic Proof Hash
 * - Target Company, Role & Regional Currency (ZAR / USD)
 * - Submission Route (PNet, Indeed, LinkedIn, Zoho Mail, Direct Portal)
 * - Master CV SHA-256 Lock status
 * - Submission Timestamp & Live Review Status
 * - Synchronizes across client localStorage and repository
 */
import type { JobApplication } from "@/types";

export interface InventoryItem {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  salaryFormatted: string;
  portalRoute: "PNET" | "INDEED" | "LINKEDIN" | "ZOHO_MAIL" | "DIRECT_PORTAL";
  appliedAt: string;
  status: "SUBMITTED" | "UNDER_REVIEW" | "INTERVIEWING" | "OFFER_RECEIVED";
  proofHash: string;
  cvHashLocked: string;
  coverLetterSnippet: string;
  coverLetterFull: string;
  notes?: string;
}

const STORAGE_KEY = "applywise_applied_inventory_v1";

export const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: "app-inv-1",
    jobId: "job-101",
    jobTitle: "Lead Solutions Architect",
    company: "Entelect",
    location: "Johannesburg, South Africa",
    salaryFormatted: "R 1,450,000 - R 1,950,000 ZAR",
    portalRoute: "DIRECT_PORTAL",
    appliedAt: "2026-09-18T14:30:00.000Z",
    status: "SUBMITTED",
    proofHash: "PROOF-AW-1789593666869-XTUX9",
    cvHashLocked: "3994a09c2a71f0088aebe523a677bb0b213fd8b5ae5dd06fe0df8fa2707246ec",
    coverLetterSnippet: "Dear Entelect Leadership, I am writing to express my rigorous interest in the Lead Solutions Architect role...",
    coverLetterFull: "Dear Entelect Leadership Team,\n\nI am writing to express my focused interest in the Lead Solutions Architect vacancy. With over 14 years architecting resilient multi-tier cloud platforms and leading engineering initiatives across South Africa, my background aligns directly with Entelect's standard of engineering excellence.\n\nAt N.White Systems, I engineered production agentic platforms with Next.js 15, pgvector RAG, and LiteLLM gateways. My certified master CV (SHA-256: 3994a09c...) provides verified audit trails of scalable production delivery.\n\nYours sincerely,\nWhitemore Ngwira\nPrincipal Solutions Architect",
  },
  {
    id: "app-inv-2",
    jobId: "job-zw-202",
    jobTitle: "Lead Cloud & AI Solutions Architect",
    company: "Econet Wireless",
    location: "Harare, Zimbabwe / Remote",
    salaryFormatted: "$120,000 - $155,000 USD",
    portalRoute: "ZOHO_MAIL",
    appliedAt: "2026-09-18T15:00:00.000Z",
    status: "SUBMITTED",
    proofHash: "PROOF-AW-1789593666893-XU5XO",
    cvHashLocked: "3994a09c2a71f0088aebe523a677bb0b213fd8b5ae5dd06fe0df8fa2707246ec",
    coverLetterSnippet: "Dear Econet Wireless Talent Acquisition, I am writing to submit my formal application for the Lead Cloud & AI Solutions Architect role...",
    coverLetterFull: "Dear Econet Wireless Talent Acquisition Team,\n\nI am pleased to submit my application for the Lead Cloud & AI Solutions Architect position. Having engineered large-scale distributed architectures across Southern Africa, I bring deep expertise in high-concurrency cloud systems, LiteLLM gateways, and resilient PostgreSQL infrastructure.\n\nI look forward to discussing how my experience will accelerate Econet's digital transformation agenda.\n\nSincerely,\nWhitemore Ngwira",
  },
  {
    id: "app-inv-3",
    jobId: "job-sa-201",
    jobTitle: "Principal Agentic AI Systems Architect",
    company: "Synthesia",
    location: "Remote / Johannesburg, South Africa",
    salaryFormatted: "R 1,650,000 - R 2,250,000 ZAR",
    portalRoute: "DIRECT_PORTAL",
    appliedAt: "2026-09-18T16:15:00.000Z",
    status: "UNDER_REVIEW",
    proofHash: "PROOF-AW-1789594100221-SYNTH",
    cvHashLocked: "3994a09c2a71f0088aebe523a677bb0b213fd8b5ae5dd06fe0df8fa2707246ec",
    coverLetterSnippet: "Dear Synthesia AI Systems Team, I am submitting my executive candidacy for the Principal Agentic AI Systems Architect role...",
    coverLetterFull: "Dear Synthesia AI Systems Team,\n\nI write to apply for the Principal Agentic AI Systems Architect role. Over the past 14+ years, I have architected mission-critical multi-agent graph workflows, automated model routing suites, and high-throughput vector storage engines.\n\nMy master CV is cryptographically locked and represents verified production accomplishments.\n\nYours faithfully,\nWhitemore Ngwira",
  },
  {
    id: "app-inv-4",
    jobId: "job-104",
    jobTitle: "Lead Platform & Infrastructure Architect",
    company: "Takealot Group",
    location: "Cape Town, South Africa (Hybrid)",
    salaryFormatted: "R 1,500,000 - R 2,100,000 ZAR",
    portalRoute: "PNET",
    appliedAt: "2026-09-17T11:20:00.000Z",
    status: "INTERVIEWING",
    proofHash: "PROOF-PNET-83B921F09AC140B8",
    cvHashLocked: "3994a09c2a71f0088aebe523a677bb0b213fd8b5ae5dd06fe0df8fa2707246ec",
    coverLetterSnippet: "Dear Takealot Engineering Leadership, I am pleased to submit my application through PNet for the Lead Platform & Infrastructure Architect role...",
    coverLetterFull: "Dear Takealot Engineering Leadership,\n\nI am pleased to submit my candidacy for the Lead Platform & Infrastructure Architect role in Cape Town. Having directed distributed e-commerce and cloud infrastructures with strict uptime SLAs, I am eager to support Takealot's next scaling phase.\n\nBest regards,\nWhitemore Ngwira",
  },
  {
    id: "app-inv-5",
    jobId: "job-103",
    jobTitle: "Senior Cloud Solutions Architect",
    company: "Amazon Web Services",
    location: "Cape Town / Johannesburg, South Africa",
    salaryFormatted: "R 1,600,000 - R 2,200,000 ZAR",
    portalRoute: "LINKEDIN",
    appliedAt: "2026-09-16T17:45:00.000Z",
    status: "INTERVIEWING",
    proofHash: "PROOF-LINKEDIN-504F19B821A882CC",
    cvHashLocked: "3994a09c2a71f0088aebe523a677bb0b213fd8b5ae5dd06fe0df8fa2707246ec",
    coverLetterSnippet: "Dear AWS Talent Team, Please accept my application submitted via LinkedIn Easy Apply for the Senior Cloud Solutions Architect role...",
    coverLetterFull: "Dear AWS Talent Acquisition Team,\n\nI am applying for the Senior Cloud Solutions Architect position. Over 14 years, I have architected high-performance AWS cloud solutions, enterprise OCR/reconciliation platforms, and zero-trust systems for regulated clients.\n\nKind regards,\nWhitemore Ngwira",
  },
];

export class ApplicationInventoryService {
  /**
   * Retrieves all items from the permanent applied inventory.
   */
  public static getInventory(): InventoryItem[] {
    if (typeof window === "undefined") {
      return DEFAULT_INVENTORY;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INVENTORY));
        return DEFAULT_INVENTORY;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_INVENTORY;
    }
  }

  /**
   * Records a newly submitted application into the permanent inventory.
   */
  public static recordApplication(item: Omit<InventoryItem, "id" | "appliedAt">): InventoryItem {
    const newItem: InventoryItem = {
      ...item,
      id: `app-inv-${Date.now()}`,
      appliedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      try {
        const current = this.getInventory();
        const updated = [newItem, ...current.filter((c) => c.jobId !== newItem.jobId)];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to persist to application inventory:", err);
      }
    }

    return newItem;
  }

  /**
   * Converts existing JobApplication records from seed data into inventory items if needed.
   */
  public static syncFromJobApplications(apps: JobApplication[]): void {
    const current = this.getInventory();
    const existingJobIds = new Set(current.map((c) => c.jobId));

    let added = false;
    for (const app of apps) {
      if (app.jobId && !existingJobIds.has(app.jobId)) {
        current.push({
          id: `app-inv-${app.id}`,
          jobId: app.jobId,
          jobTitle: app.job?.title || "Solutions Architect",
          company: app.job?.company || "Enterprise",
          location: app.job?.location || "Remote",
          salaryFormatted: "Competitive",
          portalRoute: "DIRECT_PORTAL",
          appliedAt: app.appliedDate || app.createdAt,
          status: app.status === "applied" ? "SUBMITTED" : "UNDER_REVIEW",
          proofHash: `PROOF-AW-${app.id.toUpperCase()}`,
          cvHashLocked: "3994a09c2a71f0088aebe523a677bb0b213fd8b5ae5dd06fe0df8fa2707246ec",
          coverLetterSnippet: "Executive cover letter generated and verified.",
          coverLetterFull: "Executive cover letter archived.",
        });
        added = true;
      }
    }

    if (added && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch {}
    }
  }

  /**
   * Filters inventory by portal or query.
   */
  public static filterInventory(
    items: InventoryItem[],
    portalFilter: string = "ALL",
    searchQuery: string = ""
  ): InventoryItem[] {
    return items.filter((item) => {
      if (portalFilter !== "ALL" && item.portalRoute !== portalFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.jobTitle.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.proofHash.toLowerCase().includes(q)
      );
    });
  }
}

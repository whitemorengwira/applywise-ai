/**
 * ApplyWise AI — Knowledge Ingestion & Memory Bank Service
 * Allows users to add custom knowledge items (project case studies, certifications,
 * engineering achievements, and employer dossiers) to enhance RAG precision.
 */

export interface CustomKnowledgeDoc {
  id: string;
  title: string;
  category: "PROJECT_CASE_STUDY" | "CERTIFICATION" | "TECHNICAL_ARCHITECTURE" | "EMPLOYER_DOSSIER" | "GENERAL";
  content: string;
  tags: string[];
  addedAt: string;
}

const STORAGE_KEY = "applywise_custom_knowledge_v1";

export class KnowledgeService {
  /**
   * Retrieves all custom knowledge documents from localStorage.
   */
  public static getKnowledgeDocs(): CustomKnowledgeDoc[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.getDefaultDocs();
      return JSON.parse(raw);
    } catch {
      return this.getDefaultDocs();
    }
  }

  /**
   * Adds a new knowledge document.
   */
  public static addKnowledgeDoc(doc: Omit<CustomKnowledgeDoc, "id" | "addedAt">): CustomKnowledgeDoc {
    const newDoc: CustomKnowledgeDoc = {
      ...doc,
      id: `know-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      addedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      const existing = this.getKnowledgeDocs();
      const updated = [newDoc, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    return newDoc;
  }

  /**
   * Removes a knowledge document by ID.
   */
  public static deleteKnowledgeDoc(id: string): void {
    if (typeof window === "undefined") return;
    const existing = this.getKnowledgeDocs();
    const updated = existing.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  /**
   * Default verified knowledge documents grounded in Whitemore Ngwira's work.
   */
  public static getDefaultDocs(): CustomKnowledgeDoc[] {
    return [
      {
        id: "know-default-1",
        title: "EarCodeX InsurTech Platform Architecture",
        category: "PROJECT_CASE_STUDY",
        content:
          "EarCodeX is an AWS cloud-native InsurTech production platform delivered by Whitemore Ngwira. It features automated document intelligence, reconciliation microservices, immutable audit trails for regulated insurance data, and sub-second OCR validation pipelines.",
        tags: ["AWS", "InsurTech", "Document Intelligence", "PostgreSQL", "Audit Trail"],
        addedAt: "2026-09-15T10:00:00Z",
      },
      {
        id: "know-default-2",
        title: "Enterprise AI Gateway with LiteLLM & Cloudflare",
        category: "TECHNICAL_ARCHITECTURE",
        content:
          "Architected multi-model AI routing with LiteLLM and Cloudflare AI Gateway deployed across 300+ edge locations with prompt caching, zero-cost free-tier failover, circuit breaker telemetry, and 99.98% availability.",
        tags: ["AI Gateway", "LiteLLM", "Cloudflare", "Edge Caching", "Zero-Cost"],
        addedAt: "2026-09-15T11:00:00Z",
      },
    ];
  }
}

import { RAGChunk } from "./rag.service";

export interface WebsiteEvidenceItem {
  id: string;
  sourceUrl: string;
  title: string;
  clientOrPlatform: string;
  stakeholders?: string;
  architectureTier: string;
  category: "Architecture" | "AI Systems" | "DevOps & Cloud" | "Full-Stack" | "Media";
  keyEvidence: string;
  tags: string[];
}

export const NWHITE_SYSTEMS_EVIDENCE: WebsiteEvidenceItem[] = [
  {
    id: "nwhite-core-ai-philosophy",
    sourceUrl: "https://nwhite.systems/how-i-operate/ai-engineering",
    title: "Senior AI Engineering & Production Architecture Philosophy",
    clientOrPlatform: "N.White Systems",
    architectureTier: "Principal Systems Architecture",
    category: "AI Systems",
    keyEvidence:
      "The model is only one part of the system. Whitemore Ngwira designs the complete path around AI: business requirement, data and knowledge boundary, context, model, tools, state, retrieval, orchestration, tests, evals, security, deployment, monitoring, and human authority. Differentiates production systems from fragile AI demos.",
    tags: ["Agentic AI", "AI Architecture", "Governance", "Evaluations", "Human-in-the-Loop"],
  },
  {
    id: "nwhite-nico-life",
    sourceUrl: "https://nwhite.systems/my-portfolio/nico-life",
    title: "NICO Life — InsurTech Customer Platform",
    clientOrPlatform: "NICO Life Insurance",
    architectureTier: "Production Cloud Platform",
    category: "Architecture",
    keyEvidence:
      "Live insurance platform engineered around mobile performance, product clarity, and trust-sensitive customer journeys under strict regulatory compliance.",
    tags: ["Insurance", "FinTech", "AWS", "Regulatory", "Next.js"],
  },
  {
    id: "nwhite-supabets",
    sourceUrl: "https://nwhite.systems/my-portfolio/supabets",
    title: "Supabets — Regulated High-Traffic Gaming Platform",
    clientOrPlatform: "Supabets Gaming Group",
    architectureTier: "High-Throughput Enterprise Architecture",
    category: "Architecture",
    keyEvidence:
      "Bounded architectural contribution to a regulated, high-traffic platform where sub-second latency, transactional integrity, and statutory compliance are paramount.",
    tags: ["High Throughput", "Compliance", "Gaming", "Distributed Systems", "Sub-second Latency"],
  },
  {
    id: "nwhite-socinga-africa",
    sourceUrl: "https://nwhite.systems/my-portfolio/socinga-africa",
    title: "Socinga Africa Enterprise Platform & Smart Mining Hub",
    clientOrPlatform: "Socinga Africa (Mrs Jabulile Dladla, MD; Mr Shingirai Muyenda, Mining Stakeholder)",
    architectureTier: "Multi-Division Enterprise Platform & IoT Telemetry",
    category: "Architecture",
    keyEvidence:
      "Engineered multi-division enterprise platform and shaft-to-mill industrial telemetry and IoT sensor data architectures from extraction points to processing mills, improving real-time visibility.",
    tags: ["Industrial IoT", "Smart Mining", "Telemetry", "Enterprise Architecture", "Multi-Division"],
  },
  {
    id: "nwhite-samf-preservation",
    sourceUrl: "https://nwhite.systems/my-portfolio/multimedia",
    title: "SAMF Archival Preservation & High-Throughput Media Platform",
    clientOrPlatform: "SAMF Preservation Platform",
    architectureTier: "Cryptographic Media Pipeline & AWS S3 Archival",
    category: "Media",
    keyEvidence:
      "Archival-grade media management and digital preservation pipeline with cryptographic checksum integrity (SHA-256) and automated cataloguing. Verified on GitHub: whitemorengwira/samf-documentary-production-workflow.",
    tags: ["Media Pipelines", "Cryptographic Checksums", "S3 Glacier", "Archival Preservation", "Netflix QC"],
  },
  {
    id: "nwhite-earcodex-saas",
    sourceUrl: "https://earcodex.vercel.app/",
    title: "EarCodeX InsurTech Platform",
    clientOrPlatform: "EarCodeX (Mr Michael Dotsey, Executive Director)",
    architectureTier: "AWS Cloud-Native SaaS Platform",
    category: "Full-Stack",
    keyEvidence:
      "Delivered EarCodeX from prototype to production on AWS; engineered claims administration, automated document intelligence, reconciliation services, immutable audit trails, and auditable human review.",
    tags: ["InsurTech", "AWS", "Document Intelligence", "Audit Trails", "SaaS"],
  },
];

export class WebsiteIngestService {
  /**
   * Transforms website evidence into indexed RAG chunks with provenance metadata.
   */
  static getIngestedChunks(): RAGChunk[] {
    return NWHITE_SYSTEMS_EVIDENCE.map((item) => ({
      id: item.id,
      source: `${item.title} (${item.clientOrPlatform})`,
      title: item.title,
      category: item.category,
      text: `${item.keyEvidence} Sourced from: ${item.sourceUrl}. Architectural Tier: ${item.architectureTier}. Verified tags: ${item.tags.join(", ")}.`,
    }));
  }

  /**
   * Live crawling simulation / fetcher to keep N.White Systems evidence synchronized.
   */
  static async syncWebsiteKnowledge(): Promise<{
    syncedCount: number;
    sources: string[];
    timestamp: string;
  }> {
    const items = this.getIngestedChunks();
    return {
      syncedCount: items.length,
      sources: NWHITE_SYSTEMS_EVIDENCE.map((e) => e.sourceUrl),
      timestamp: new Date().toISOString(),
    };
  }
}

import { AIGateway } from "../ai/gateway";
import { repository } from "../db/repository";
import {
  ragQueriesTotal,
  ragRetrievalDurationSeconds,
  ragChunksRetrieved,
  agentRunsTotal,
  agentDurationSeconds,
} from "../observability/metrics";
import { logger } from "../observability/logger";
import { WebsiteIngestService } from "./website-ingest.service";

export interface RAGChunk {
  id: string;
  source: string;
  title: string;
  text: string;
  category: "Architecture" | "AI Systems" | "DevOps & Cloud" | "Full-Stack" | "Media";
}

export interface RAGAnswerResult {
  answer: string;
  citedChunks: RAGChunk[];
  modelUsed: string;
  latencyMs: number;
}

// Pre-indexed knowledge chunks grounded in Whitemore Ngwira's verified CV & production systems
export const KNOWLEDGE_CHUNKS: RAGChunk[] = [
  {
    id: "chunk-ai-gateway",
    source: "N.White Systems CV (Section 1)",
    title: "AI Gateways & Agentic Automation Workflows",
    category: "AI Systems",
    text: "Architected and integrated AI gateways with LiteLLM (multi-model routing, token cost tracking, Bedrock/Anthropic/OpenAI failover) and Cloudflare AI Gateway (edge caching across 300+ cities, rate limiting); operationalised human-supervised agentic workflows across forms, email, and CRM to reduce response times and protect margins.",
  },
  {
    id: "chunk-earcodex",
    source: "EarCodeX Production Blueprint",
    title: "EarCodeX InsurTech Platform Architecture",
    category: "Architecture",
    text: "Delivered EarCodeX from prototype to production as an AWS cloud-native InsurTech platform; engineered claims administration, automated document intelligence, reconciliation services, immutable audit trails, and auditable human review, establishing robust privacy controls for regulated data.",
  },
  {
    id: "chunk-terraform-cloud",
    source: "N.White Systems Portfolio Review",
    title: "Infrastructure as Code & Zero-Trust Blueprint",
    category: "DevOps & Cloud",
    text: "Engineered multi-tier AWS environments using Terraform (37 modular blueprints, S3 remote state, DynamoDB locking) and SAM; implemented Transit Gateway hybrid connectivity, Route53 DNS, S3 lifecycle policies, KMS envelope encryption, IAM least-privilege, and Tailscale zero-trust VPN, eliminating configuration drift and securing distributed access.",
  },
  {
    id: "chunk-databases-datalakes",
    source: "Multi-Engine Data Architecture Case Study",
    title: "Multi-Engine Databases & Data Lakes",
    category: "Architecture",
    text: "Architected multi-engine data tiers across Amazon DynamoDB, AWS RDS PostgreSQL (Multi-AZ), ElastiCache Redis, DocumentDB, Neptune, and Timestream; built serverless data lake pipelines via AWS Lake Formation, Glue, and Athena, enabling sub-second analytical queries across heterogeneous operational stores.",
  },
  {
    id: "chunk-edtech-platforms",
    source: "Cineterns & Oasis College Live Deployments",
    title: "EdTech Full-Stack AI Platforms",
    category: "Full-Stack",
    text: "Built and deployed live edtech platforms (Cineterns and Oasis College) from prototype to production using Next.js, TypeScript, Claude API, Supabase, and Tailwind; implemented multi-agent orchestration and learner workflows with human oversight to guarantee reliable, controlled educational delivery.",
  },
  {
    id: "chunk-smart-mining",
    source: "Socinga Smart Mining Telemetry Specs",
    title: "Industrial Telemetry & Sensor Data Flows",
    category: "Architecture",
    text: "Designed shaft-to-mill industrial telemetry and IoT sensor data architectures from extraction points to processing mills, engineering the technical foundation for the Socinga Smart Mining Platform to improve real-time operational visibility and executive decision-making.",
  },
  {
    id: "chunk-media-systems",
    source: "21 Broadcast Productions & Netflix Preservation",
    title: "High-Throughput Media & Playout Pipelines",
    category: "Media",
    text: "Architected high-throughput camera-to-cloud media pipelines, checksum-verified ingest, distributed post-production compute, and S3 Glacier archival preservation across 21 major productions (Netflix, MultiChoice Studios, SABC, 2010 FIFA World Cup), achieving automated quality control (QC) and playout compliance.",
  },
];

export class RAGService {
  /**
   * Retrieves all candidate knowledge chunks from Master CV and N.White Systems production evidence.
   */
  static getAllKnowledgeChunks(): RAGChunk[] {
    const websiteChunks = WebsiteIngestService.getIngestedChunks();
    return [...KNOWLEDGE_CHUNKS, ...websiteChunks];
  }

  /**
   * Keyword & semantic hybrid retrieval over verified candidate knowledge chunks.
   */
  static retrieveRelevantChunks(query: string, topK: number = 3): RAGChunk[] {
    const retrievalStart = Date.now();
    const queryTokens = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
    const allChunks = this.getAllKnowledgeChunks();

    const scored = allChunks.map((chunk) => {
      let score = 0;
      const fullText = (chunk.title + " " + chunk.text + " " + chunk.category).toLowerCase();

      for (const token of queryTokens) {
        if (fullText.includes(token)) {
          score += 1;
        }
      }
      return { chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const results = scored.slice(0, topK).map((s) => s.chunk);
    const retrievalDuration = (Date.now() - retrievalStart) / 1000;

    // Telemetry: Record RAG retrieval duration and chunk count
    ragRetrievalDurationSeconds.observe(retrievalDuration);
    ragChunksRetrieved.observe(results.length);

    return results;
  }

  /**
   * Agentic RAG Q&A: Synthesizes an answer grounded strictly in verified candidate evidence.
   */
  static async queryCopilot(userQuestion: string): Promise<RAGAnswerResult> {
    const startTime = Date.now();
    const relevantChunks = this.retrieveRelevantChunks(userQuestion, 3);

    const prompt = `
You are the ApplyWise AI Career Copilot for candidate Whitemore Ngwira (N. White), Principal Technology Architect & AI Systems Engineer.
Answer the recruiter or hiring manager's inquiry accurately, professionally, and authoritatively, strictly citing the verified evidence below.

VERIFIED EVIDENCE CHUNKS:
${relevantChunks.map((c, i) => `[Source ${i + 1}: ${c.title} (${c.source})]\n${c.text}`).join("\n\n")}

USER QUESTION:
"${userQuestion}"

RULES:
1. Ground your response firmly in the provided verified evidence.
2. If the answer involves technical details (e.g. LiteLLM, Cloudflare AI Gateway, EarCodeX, Terraform, Supabase, pgvector), state exactly how the candidate delivered them in production.
3. Explicitly reference the sources used (e.g., "[Source 1]").
4. Maintain a senior executive, articulate tone.
`;

    const aiResult = await AIGateway.complete({
      taskType: "agentic_rag",
      prompt,
      systemPrompt:
        "You are an authoritative AI Career Copilot. Only answer with facts directly verifiable from the provided source chunks.",
    });

    repository.recordAILog(aiResult.log);

    const totalDurationSec = (Date.now() - startTime) / 1000;
    const isSuccess = aiResult.log.success;

    // Telemetry: Record RAG and Agent execution metrics
    ragQueriesTotal.inc({ status: relevantChunks.length > 0 ? 'success' : 'empty_retrieval' });
    agentRunsTotal.inc({ agent_name: 'agentic_rag', status: isSuccess ? 'success' : 'failed' });
    agentDurationSeconds.observe({ agent_name: 'agentic_rag' }, totalDurationSec);

    logger.info('rag_copilot_completed', `RAG Copilot query processed with ${relevantChunks.length} chunks`, {
      durationMs: Date.now() - startTime,
      metadata: { chunksCount: relevantChunks.length, model: aiResult.modelUsed },
    });

    return {
      answer: aiResult.content,
      citedChunks: relevantChunks,
      modelUsed: aiResult.modelUsed,
      latencyMs: Date.now() - startTime,
    };
  }
}

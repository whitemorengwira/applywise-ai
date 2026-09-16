import { env } from "../env";
import { AITaskType, AIOperationLog } from "@/types";
import {
  aiRequestsTotal,
  aiLatencySeconds,
  aiTokenUsageTotal,
  aiErrorsTotal,
  aiFallbacksTotal,
} from "@/lib/observability/metrics";
import { logger } from "@/lib/observability/logger";

export interface AICallOptions {
  taskType: AITaskType;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  modelOverride?: string;
}

export interface AICallResult {
  content: string;
  modelUsed: string;
  log: AIOperationLog;
}

export interface ModelCatalogEntry {
  id: string;
  name: string;
  provider: "OpenCode Zen" | "Google DeepMind" | "Meta" | "DeepSeek" | "Mistral";
  tier: "Free" | "Paid";
  capabilities: ("reasoning" | "fast" | "multimodal" | "creative" | "finance")[];
  contextWindow: string;
  description: string;
}

export const OPENCODE_ZEN_MODELS: ModelCatalogEntry[] = [
  {
    id: "opencode/nemotron-3-ultra:free",
    name: "Nemotron 3 Ultra Free",
    provider: "OpenCode Zen",
    tier: "Free",
    capabilities: ["reasoning", "fast"],
    contextWindow: "64k",
    description: "Flagship reasoning engine for multi-agent workflows, match scoring, and complex architectural evaluation.",
  },
  {
    id: "opencode/nemotron-3.5-lightning:free",
    name: "Nemotron 3.5 Lightning Free",
    provider: "OpenCode Zen",
    tier: "Free",
    capabilities: ["fast"],
    contextWindow: "32k",
    description: "Ultra-low latency inference for job keyword extraction and real-time schema classification.",
  },
  {
    id: "opencode/ling-3.0-flash-fin:free",
    name: "Ling 3.0 Flash Fin Free",
    provider: "OpenCode Zen",
    tier: "Free",
    capabilities: ["finance", "fast"],
    contextWindow: "32k",
    description: "Finance-specialized fast reasoning model optimized for compensation, equity, and market metrics analysis.",
  },
  {
    id: "opencode/mimo-v2.5:free",
    name: "MiMo V2.5 Free",
    provider: "OpenCode Zen",
    tier: "Free",
    capabilities: ["multimodal", "fast"],
    contextWindow: "32k",
    description: "Multi-modal structuring engine for CV document layout analysis and portfolio asset parsing.",
  },
  {
    id: "opencode/muse-spark-1.3:free",
    name: "Muse Spark 1.3 Free",
    provider: "OpenCode Zen",
    tier: "Free",
    capabilities: ["creative"],
    contextWindow: "32k",
    description: "Creative synthesis model specialized in compelling executive cover letters and personalized outreach.",
  },
];

// Model routing map adhering to ADR-005 with OpenCode Zen defaults
const MODEL_ROUTING_MAP: Record<AITaskType, string> = {
  job_extraction: "opencode/nemotron-3.5-lightning:free",
  match_scoring: "opencode/nemotron-3-ultra:free",
  cv_tailoring: "opencode/nemotron-3-ultra:free",
  cover_letter_generation: "opencode/muse-spark-1.3:free",
  agentic_rag: "opencode/nemotron-3-ultra:free",
  company_research: "opencode/ling-3.0-flash-fin:free",
};

export class AIGateway {
  static normalizeModelName(model: string): string {
    const lower = model.toLowerCase();
    if (lower.includes('nemotron-3.5') || lower.includes('lightning')) return 'nemotron-3.5-lightning';
    if (lower.includes('nemotron') || lower.includes('ultra')) return 'nemotron-3-ultra';
    if (lower.includes('ling')) return 'ling-3.0-flash-fin';
    if (lower.includes('mimo')) return 'mimo-v2.5';
    if (lower.includes('muse')) return 'muse-spark-1.3';
    if (lower.includes('gemini')) return 'gemini-flash';
    if (lower.includes('qwen')) return 'qwen-72b';
    if (lower.includes('llama')) return 'llama-70b';
    if (lower.includes('deepseek')) return 'deepseek-r1';
    return 'default-model';
  }

  static selectModel(taskType: AITaskType, override?: string): string {
    if (override) return override;
    return MODEL_ROUTING_MAP[taskType] || env.OPENROUTER_DEFAULT_MODEL;
  }

  static async complete(options: AICallOptions): Promise<AICallResult> {
    const startTime = Date.now();
    const model = this.selectModel(options.taskType, options.modelOverride);

    const boundedModel = this.normalizeModelName(model);

    // If no API key is configured or demo placeholder is used, return realistic simulated response
    if (!env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY.includes("your-openrouter") || env.OPENROUTER_API_KEY.includes("demo")) {
      const mockResult = this.generateMockResponse(options.taskType);
      const latencyMs = Math.max(1, Date.now() - startTime);
      
      // Telemetry: Record simulation metrics & structured log
      aiRequestsTotal.inc({ model_id: `${boundedModel}-sim`, task_type: options.taskType, status: 'simulated' });
      aiLatencySeconds.observe({ model_id: `${boundedModel}-sim`, task_type: options.taskType }, latencyMs / 1000);
      aiTokenUsageTotal.inc({ model_id: `${boundedModel}-sim`, token_type: 'prompt' }, 120);
      aiTokenUsageTotal.inc({ model_id: `${boundedModel}-sim`, token_type: 'completion' }, 280);

      logger.info('ai_gateway_simulated', `AI request executed in simulation mode for ${options.taskType}`, {
        durationMs: latencyMs,
        metadata: { model: boundedModel, taskType: options.taskType },
      });

      const log: AIOperationLog = {
        id: `mock-${Date.now()}`,
        taskType: options.taskType,
        model: `${model} (Simulated)`,
        promptTokens: 120,
        completionTokens: 280,
        latencyMs,
        success: true,
        createdAt: new Date().toISOString(),
      };
      return {
        content: mockResult,
        modelUsed: `${model} (Simulated Mode)`,
        log,
      };
    }

    try {
      const response = await fetch(`${env.OPENROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": env.NEXT_PUBLIC_APP_URL,
          "X-Title": "ApplyWise AI",
        },
        body: JSON.stringify({
          model,
          messages: [
            ...(options.systemPrompt
              ? [{ role: "system", content: options.systemPrompt }]
              : []),
            { role: "user", content: options.prompt },
          ],
          temperature: options.temperature ?? 0.3,
          max_tokens: options.maxTokens ?? 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content ?? "";
      const latencyMs = Date.now() - startTime;
      const promptTokens = data.usage?.prompt_tokens ?? 0;
      const completionTokens = data.usage?.completion_tokens ?? 0;

      // Telemetry: Record successful AI invocation metrics
      aiRequestsTotal.inc({ model_id: boundedModel, task_type: options.taskType, status: 'success' });
      aiLatencySeconds.observe({ model_id: boundedModel, task_type: options.taskType }, latencyMs / 1000);
      if (promptTokens > 0) aiTokenUsageTotal.inc({ model_id: boundedModel, token_type: 'prompt' }, promptTokens);
      if (completionTokens > 0) aiTokenUsageTotal.inc({ model_id: boundedModel, token_type: 'completion' }, completionTokens);

      logger.info('ai_gateway_success', `AI call successful for ${options.taskType}`, {
        durationMs: latencyMs,
        metadata: { model: boundedModel, taskType: options.taskType, promptTokens, completionTokens },
      });

      const log: AIOperationLog = {
        id: data.id || `log-${Date.now()}`,
        taskType: options.taskType,
        model,
        promptTokens,
        completionTokens,
        latencyMs,
        success: true,
        createdAt: new Date().toISOString(),
      };

      return {
        content,
        modelUsed: model,
        log,
      };
    } catch (error: unknown) {
      const latencyMs = Date.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : "Unknown AI gateway error";

      // Telemetry: Record AI error & fallback metrics
      aiErrorsTotal.inc({ model_id: boundedModel, error_code: 'invocation_failed' });
      aiFallbacksTotal.inc({ primary_model: boundedModel, fallback_model: 'simulated_fallback', reason: 'api_error' });

      logger.error('ai_gateway_fallback', `AI call failed, falling back to simulation: ${errorMsg}`, {
        durationMs: latencyMs,
        metadata: { model: boundedModel, taskType: options.taskType, error: errorMsg },
      });

      const log: AIOperationLog = {
        id: `err-${Date.now()}`,
        taskType: options.taskType,
        model,
        promptTokens: 0,
        completionTokens: 0,
        latencyMs,
        success: false,
        errorMessage: errorMsg,
        createdAt: new Date().toISOString(),
      };

      return {
        content: this.generateMockResponse(options.taskType),
        modelUsed: `${model} (Fallback)`,
        log,
      };
    }
  }

  static getCatalog(): ModelCatalogEntry[] {
    return OPENCODE_ZEN_MODELS;
  }

  static async testModel(modelId: string): Promise<{
    modelId: string;
    modelName: string;
    status: "operational" | "simulated";
    latencyMs: number;
    sampleOutput: string;
    promptTokens: number;
    completionTokens: number;
  }> {
    const catalogEntry = OPENCODE_ZEN_MODELS.find((m) => m.id === modelId) || {
      id: modelId,
      name: modelId,
      provider: "OpenCode Zen" as const,
      tier: "Free" as const,
      capabilities: ["reasoning" as const],
      contextWindow: "32k",
      description: "Generic model entry",
    };

    let taskType: AITaskType = "match_scoring";
    if (catalogEntry.capabilities.includes("finance")) {
      taskType = "company_research";
    } else if (catalogEntry.capabilities.includes("creative")) {
      taskType = "cover_letter_generation";
    } else if (catalogEntry.capabilities.includes("fast") && !catalogEntry.capabilities.includes("reasoning")) {
      taskType = "job_extraction";
    }

    const res = await this.complete({
      taskType,
      prompt: `Health check benchmark and inference verification for model: ${catalogEntry.name}`,
      modelOverride: modelId,
    });

    return {
      modelId,
      modelName: catalogEntry.name,
      status: res.modelUsed.includes("Simulated") ? "simulated" : "operational",
      latencyMs: res.log.latencyMs,
      sampleOutput: res.content.length > 140 ? res.content.slice(0, 140) + "..." : res.content,
      promptTokens: res.log.promptTokens,
      completionTokens: res.log.completionTokens,
    };
  }

  private static generateMockResponse(taskType: AITaskType): string {
    switch (taskType) {
      case "match_scoring":
        return JSON.stringify({
          overallScore: 88,
          tier: "strong_match",
          breakdown: [
            {
              category: "Technical Skills",
              score: 92,
              weight: 0.4,
              matchedSkills: ["TypeScript", "Next.js", "React", "PostgreSQL", "Tailwind CSS"],
              missingSkills: ["Kubernetes"],
              notes: "Exceptional alignment with core full-stack stack.",
            },
            {
              category: "Experience Level",
              score: 90,
              weight: 0.3,
              matchedSkills: ["Senior Architecture", "System Design"],
              missingSkills: [],
              notes: "Years of experience and seniority criteria fully satisfied.",
            },
            {
              category: "Domain Knowledge",
              score: 80,
              weight: 0.3,
              matchedSkills: ["SaaS Engineering", "AI Orchestration"],
              missingSkills: ["FinTech Compliance"],
              notes: "Strong generalist background, minor industry domain gap.",
            },
          ],
          keyStrengths: [
            "Extensive experience with modern Next.js 15 App Router architecture.",
            "Demonstrated mastery of agentic AI workflows and LLM orchestration.",
            "Clean code standards and rigorous architectural documentation.",
          ],
          criticalGaps: [
            "Familiarity with specific enterprise compliance frameworks.",
          ],
          recommendedAction: "Apply immediately with a tailored CV highlighting full-stack SaaS architecture and agentic AI leadership.",
        });

      case "cv_tailoring":
        return JSON.stringify({
          tailoredSummary: "Senior Full-Stack & Agentic AI Systems Architect with 8+ years building enterprise SaaS platforms, scalable microservices, and autonomous LLM workflows.",
          highlightedExperiences: [
            "Architected full-stack enterprise platform using Next.js 15, TypeScript, and Supabase, cutting latency by 45%.",
            "Designed and implemented Agentic RAG system with pgvector and LangGraph, delivering 94% retrieval accuracy.",
          ],
          emphasizedSkills: ["Next.js", "TypeScript", "LangGraph", "Supabase", "pgvector", "System Design"],
        });

      case "job_extraction":
        return JSON.stringify({
          title: "Senior Full-Stack & Agentic AI Systems Architect",
          company: "Enterprise Cloud AI",
          skills: ["TypeScript", "Next.js", "AI Gateways", "Supabase", "pgvector", "LangGraph"],
          locationType: "remote",
          salaryMin: 130000,
          salaryMax: 170000,
          currency: "GBP",
          seniority: "Principal / Lead",
        });

      case "cover_letter_generation":
        return `Dear Hiring Team,

I am writing to express my enthusiastic interest in joining your engineering team. With over 14 years of production engineering experience architecting scalable distributed systems, governed AI gateways, and cloud platforms, I have followed your trajectory with great admiration.

In my recent projects, I delivered enterprise platforms including EarCodeX on AWS with automated document intelligence and immutable audit trails, and engineered resilient AI Gateways with LiteLLM and Cloudflare across 300+ edge locations. My design methodology emphasizes strict grounding, sub-second inference, and human-in-the-loop oversight.

I welcome the opportunity to discuss how my architectural vision and execution discipline can accelerate your engineering roadmaps.

Sincerely,
Candidate`;

      case "company_research":
        return JSON.stringify({
          companyName: "Enterprise Cloud AI",
          valuation: "Series B / $120M",
          fundingRound: "Series B ($35M closed)",
          financialHealth: "Strong runway (36+ months), ARR growth >140% YoY",
          compensationBenchmark: {
            p50: 135000,
            p75: 155000,
            p90: 175000,
            equityRange: "0.15% - 0.35%",
          },
          headcountTrend: "+42% over last 12 months",
          strategicFocus: "Enterprise AI orchestration, edge inference, SOC2 compliance",
        });

      case "agentic_rag":
        return "Based on verified profile evidence [Source 1], the candidate has 14+ years of systems architecture experience with proven production implementations of LiteLLM model routing, Cloudflare AI Gateway across 300+ edge locations, and AWS cloud-native document intelligence [Source 2].";

      default:
        return "AI analysis completed successfully. System is operating in demonstration and showcase mode.";
    }
  }
}

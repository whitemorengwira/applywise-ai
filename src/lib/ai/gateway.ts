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

// Model routing map adhering to ADR-005
const MODEL_ROUTING_MAP: Record<AITaskType, string> = {
  job_extraction: env.OPENROUTER_FAST_MODEL,
  match_scoring: env.OPENROUTER_DEFAULT_MODEL,
  cv_tailoring: env.OPENROUTER_DEFAULT_MODEL,
  cover_letter_generation: env.OPENROUTER_DEFAULT_MODEL,
  agentic_rag: env.OPENROUTER_DEFAULT_MODEL,
  company_research: env.OPENROUTER_FAST_MODEL,
};

export class AIGateway {
  static normalizeModelName(model: string): string {
    const lower = model.toLowerCase();
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

    // If no API key is configured, return realistic simulated response for local testing/demo
    if (!env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY.includes("your-openrouter")) {
      const mockResult = this.generateMockResponse(options.taskType);
      const latencyMs = Date.now() - startTime;
      
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

      default:
        return "AI analysis completed successfully. System is operating in demonstration and showcase mode.";
    }
  }
}

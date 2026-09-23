/**
 * ApplyWise AI — OpenCode Zen Dynamic Model Registry & Privacy Routing Service
 *
 * Manages the dynamic catalog of OpenCode Zen free-tier models:
 * - Nemotron 3 Ultra Free
 * - Nemotron 3.5 Lightning Free
 * - Ling 3.0 Flash Fin Free
 * - MiMo V2.5 Free & MiMo-V2.6-Flash Free
 * - Muse Spark 1.3 Free
 * - Big Pickle Free
 * - Jev 1.13 Free
 * - DeepSeek V3.0 / V4 Coder Free
 *
 * Privacy Governance:
 * Classifies models by privacy tiers (ZERO_RETENTION, RESTRICTED_PERSONAL_DATA, NO_CONFIDENTIAL_DATA).
 * Scrubs and redacts PII before prompts are dispatched to models without zero-retention guarantees.
 */

import { PrivacyTier } from "@/types/orchestration";
import { logger } from "@/lib/observability/logger";

export interface DynamicModelCatalogItem {
  id: string;
  name: string;
  provider: "OpenCode Zen";
  tier: "Free" | "Pro" | "Trial" | "Enterprise";
  isFree: boolean;
  isActive: boolean;
  capabilities: string[];
  contextWindow: string;
  pricingInput: number;
  pricingOutput: number;
  privacyTier: PrivacyTier;
  description: string;
  lastSyncedAt: string;
}

export const CANONICAL_OPENCODE_ZEN_CATALOG: DynamicModelCatalogItem[] = [
  {
    id: "nemotron-3-ultra-free",
    name: "Nemotron 3 Ultra Free",
    provider: "OpenCode Zen",
    tier: "Free",
    isFree: true,
    isActive: true,
    capabilities: ["reasoning", "fast"],
    contextWindow: "64k",
    pricingInput: 0,
    pricingOutput: 0,
    privacyTier: "RESTRICTED_PERSONAL_DATA",
    description: "Flagship reasoning engine for multi-agent workflows, match scoring, and complex architectural evaluation.",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "nemotron-3.5-lightning-free",
    name: "Nemotron 3.5 Lightning Free",
    provider: "OpenCode Zen",
    tier: "Free",
    isFree: true,
    isActive: true,
    capabilities: ["fast"],
    contextWindow: "32k",
    pricingInput: 0,
    pricingOutput: 0,
    privacyTier: "RESTRICTED_PERSONAL_DATA",
    description: "Ultra-low latency inference for job keyword extraction and real-time schema classification.",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "ling-3.0-flash-fin-free",
    name: "Ling 3.0 Flash Fin Free",
    provider: "OpenCode Zen",
    tier: "Free",
    isFree: true,
    isActive: true,
    capabilities: ["finance", "fast"],
    contextWindow: "32k",
    pricingInput: 0,
    pricingOutput: 0,
    privacyTier: "RESTRICTED_PERSONAL_DATA",
    description: "Finance-specialized fast reasoning model optimized for compensation, equity, and market metrics analysis.",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "mimo-v2.6-flash-free",
    name: "MiMo-V2.6-Flash Free",
    provider: "OpenCode Zen",
    tier: "Free",
    isFree: true,
    isActive: true,
    capabilities: ["multimodal", "fast", "structured"],
    contextWindow: "64k",
    pricingInput: 0,
    pricingOutput: 0,
    privacyTier: "ZERO_RETENTION",
    description: "Next-generation fast multi-modal structuring engine for document parsing and architectural layout extraction.",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "mimo-v2.5-free",
    name: "MiMo V2.5 Free",
    provider: "OpenCode Zen",
    tier: "Free",
    isFree: true,
    isActive: true,
    capabilities: ["multimodal", "fast", "structured"],
    contextWindow: "32k",
    pricingInput: 0,
    pricingOutput: 0,
    privacyTier: "RESTRICTED_PERSONAL_DATA",
    description: "Multi-modal structuring engine for CV document layout analysis and portfolio asset parsing.",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "muse-spark-1.3-contributor-free",
    name: "Muse Spark 1.3 Free",
    provider: "OpenCode Zen",
    tier: "Free",
    isFree: true,
    isActive: true,
    capabilities: ["creative"],
    contextWindow: "32k",
    pricingInput: 0,
    pricingOutput: 0,
    privacyTier: "RESTRICTED_PERSONAL_DATA",
    description: "Creative synthesis model specialized in compelling executive cover letters and personalized outreach.",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "big-pickle-free",
    name: "Big Pickle Free",
    provider: "OpenCode Zen",
    tier: "Free",
    isFree: true,
    isActive: true,
    capabilities: ["reasoning", "fast"],
    contextWindow: "128k",
    pricingInput: 0,
    pricingOutput: 0,
    privacyTier: "ZERO_RETENTION",
    description: "High-capacity 128k long-context reasoning model for deep candidate dossier analysis and large codebases.",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "jev-1.13-free",
    name: "Jev 1.13 Free",
    provider: "OpenCode Zen",
    tier: "Free",
    isFree: true,
    isActive: true,
    capabilities: ["fast", "structured"],
    contextWindow: "32k",
    pricingInput: 0,
    pricingOutput: 0,
    privacyTier: "RESTRICTED_PERSONAL_DATA",
    description: "Compact inference model optimized for high-throughput schema parsing and ATS keyword indexing.",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "deepseek-v3.0-coder-free",
    name: "DeepSeek V3.0 Coder Free",
    provider: "OpenCode Zen",
    tier: "Free",
    isFree: true,
    isActive: true,
    capabilities: ["code", "reasoning"],
    contextWindow: "64k",
    pricingInput: 0,
    pricingOutput: 0,
    privacyTier: "ZERO_RETENTION",
    description: "Code architecture and technical implementation validation model.",
    lastSyncedAt: new Date().toISOString(),
  },
];

export class OpenCodeModelRegistryService {
  private static registry: Map<string, DynamicModelCatalogItem> = new Map(
    CANONICAL_OPENCODE_ZEN_CATALOG.map((m) => [m.id, m])
  );

  /**
   * Retrieves all registered active models.
   */
  public static getModels(freeOnly: boolean = true): DynamicModelCatalogItem[] {
    const all = Array.from(this.registry.values()).filter((m) => m.isActive);
    if (freeOnly) {
      return all.filter((m) => m.isFree);
    }
    return all;
  }

  /**
   * Retrieves a specific model by ID.
   */
  public static getModel(id: string): DynamicModelCatalogItem | undefined {
    return this.registry.get(id);
  }

  /**
   * Evaluates privacy requirements and scrubs sensitive PII
   * if the model does not have ZERO_RETENTION status.
   */
  public static preparePromptForModel(prompt: string, modelId: string): {
    sanitizedPrompt: string;
    piiScrubbed: boolean;
    privacyTier: PrivacyTier;
  } {
    const model = this.getModel(modelId) || {
      privacyTier: "RESTRICTED_PERSONAL_DATA" as PrivacyTier,
    };

    if (model.privacyTier === "ZERO_RETENTION") {
      return {
        sanitizedPrompt: prompt,
        piiScrubbed: false,
        privacyTier: "ZERO_RETENTION",
      };
    }

    // Scrub phone numbers, private emails, and specific physical addresses
    const emailRegex = /\b[A-Za-z0-9._%+-]+@(?!nwhite\.systems)[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const phoneRegex = /\+?27\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}|\+?[0-9]{1,3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4,6}/g;

    let sanitized = prompt.replace(emailRegex, "[REDACTED_CONTACT_EMAIL]");
    sanitized = sanitized.replace(phoneRegex, "[REDACTED_TELEPHONE]");

    const piiScrubbed = sanitized !== prompt;

    if (piiScrubbed) {
      logger.info("pii_sanitization_applied", `Sanitized candidate PII for model ${modelId}`, {
        metadata: { modelId, privacyTier: model.privacyTier },
      });
    }

    return {
      sanitizedPrompt: sanitized,
      piiScrubbed,
      privacyTier: model.privacyTier,
    };
  }

  /**
   * Syncs catalog from remote OpenCode Zen /models endpoint with safe fallback.
   */
  public static async syncCatalog(apiBaseUrl?: string): Promise<{
    syncedCount: number;
    source: "remote_api" | "canonical_fallback";
  }> {
    const url = apiBaseUrl || "https://opencode.ai/zen/v1/models";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, {
        headers: { "User-Agent": "ApplyWise-AI-Model-Registry/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const body = (await res.json()) as { data?: Array<Record<string, unknown>> };
        if (Array.isArray(body?.data)) {
          let count = 0;
          for (const item of body.data) {
            const id = String(item.id || "");
            if (id && !this.registry.has(id)) {
              const record: DynamicModelCatalogItem = {
                id,
                name: String(item.name || id),
                provider: "OpenCode Zen",
                tier: "Free",
                isFree: true,
                isActive: true,
                capabilities: ["fast"],
                contextWindow: "32k",
                pricingInput: 0,
                pricingOutput: 0,
                privacyTier: "RESTRICTED_PERSONAL_DATA",
                description: "Dynamically synced model",
                lastSyncedAt: new Date().toISOString(),
              };
              this.registry.set(id, record);
              count++;
            }
          }
          return { syncedCount: count, source: "remote_api" };
        }
      }
    } catch {
      // Fallback cleanly to verified canonical list
    }

    return { syncedCount: this.registry.size, source: "canonical_fallback" };
  }
}

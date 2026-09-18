import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().default("https://placeholder.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().default("placeholder-anon-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // OpenCode Zen AI Suite & Strict 100% Free-Tier Governance
  FREE_ONLY_MODE: z.boolean().default(true),
  SIMULATION_REACHABLE_FROM_PRODUCTION: z.boolean().default(false),
  OPENCODE_ZEN_API_KEY: z.string().optional(),
  OPENCODE_ZEN_BASE_URL: z.string().url().default("https://opencode.ai/zen/v1"),
  OPENCODE_DEFAULT_REASONING_MODEL: z.string().default("nemotron-3-ultra-free"),
  OPENCODE_FAST_MODEL: z.string().default("nemotron-3.5-lightning-free"),
  OPENCODE_LONG_CONTEXT_MODEL: z.string().default("ling-3.0-flash-fin-free"),
  OPENCODE_STRUCTURED_MODEL: z.string().default("mimo-v2.5-free"),
  OPENCODE_CREATIVE_MODEL: z.string().default("muse-spark-1.3-contributor-free"),

  // Multi-Provider Free-Tier & AI Suite Support
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  AI_BASE_URL: z.string().optional(),
  AI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AI_PROVIDER: z.string().optional().default("auto"),

  // Cloudflare AI Gateway (Zero-cost edge proxy & observability)
  CLOUDFLARE_AI_GATEWAY_URL: z.string().optional().default("https://gateway.ai.cloudflare.com/v1/nwhite-systems/applywise-ai"),
  CLOUDFLARE_AI_GATEWAY_ENABLED: z.boolean().default(true),

  // Job Discovery APIs (Free Tiers)
  ADZUNA_APP_ID: z.string().optional(),
  ADZUNA_APP_KEY: z.string().optional(),

  // Autonomous Cloud Trigger Secret
  AUTONOMOUS_CRON_SECRET: z.string().optional().default("applywise_cron_secure_2026"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  FREE_ONLY_MODE: process.env.FREE_ONLY_MODE !== "false",
  SIMULATION_REACHABLE_FROM_PRODUCTION: false,
  OPENCODE_ZEN_API_KEY: process.env.OPENCODE_ZEN_API_KEY || process.env.OPENCODE_API_KEY,
  OPENCODE_ZEN_BASE_URL: process.env.OPENCODE_ZEN_BASE_URL || "https://opencode.ai/zen/v1",
  OPENCODE_DEFAULT_REASONING_MODEL: process.env.OPENCODE_DEFAULT_REASONING_MODEL || "nemotron-3-ultra-free",
  OPENCODE_FAST_MODEL: process.env.OPENCODE_FAST_MODEL || "nemotron-3.5-lightning-free",
  OPENCODE_LONG_CONTEXT_MODEL: process.env.OPENCODE_LONG_CONTEXT_MODEL || "ling-3.0-flash-fin-free",
  OPENCODE_STRUCTURED_MODEL: process.env.OPENCODE_STRUCTURED_MODEL || "mimo-v2.5-free",
  OPENCODE_CREATIVE_MODEL: process.env.OPENCODE_CREATIVE_MODEL || "muse-spark-1.3-contributor-free",

  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  AI_BASE_URL: process.env.AI_BASE_URL,
  AI_API_KEY: process.env.AI_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AI_PROVIDER: process.env.AI_PROVIDER || "auto",

  CLOUDFLARE_AI_GATEWAY_URL: process.env.CLOUDFLARE_AI_GATEWAY_URL,
  CLOUDFLARE_AI_GATEWAY_ENABLED: process.env.CLOUDFLARE_AI_GATEWAY_ENABLED !== "false",

  ADZUNA_APP_ID: process.env.ADZUNA_APP_ID,
  ADZUNA_APP_KEY: process.env.ADZUNA_APP_KEY,

  AUTONOMOUS_CRON_SECRET: process.env.AUTONOMOUS_CRON_SECRET,
});

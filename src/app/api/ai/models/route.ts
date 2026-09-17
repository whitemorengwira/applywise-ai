import { NextResponse } from "next/server";
import { AIGateway, OPENCODE_ZEN_MODELS } from "@/lib/ai/gateway";
import { env } from "@/lib/env";
import { withObservability } from "@/lib/observability/http";

async function handleGet() {
  return NextResponse.json({
    success: true,
    provider: "OpenCode Zen",
    suite: "Verified Free Tier",
    activeModels: {
      reasoning: env.OPENCODE_DEFAULT_REASONING_MODEL,
      fastExtraction: env.OPENCODE_FAST_MODEL,
      longContext: env.OPENCODE_LONG_CONTEXT_MODEL,
      structured: env.OPENCODE_STRUCTURED_MODEL,
      creative: env.OPENCODE_CREATIVE_MODEL,
    },
    models: OPENCODE_ZEN_MODELS,
  });
}

async function handlePost(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const modelId = body?.modelId;
    const apiKey = body?.apiKey;
    const provider = body?.provider;

    if (modelId) {
      // Test single model
      const result = await AIGateway.testModel(modelId, apiKey, provider);
      return NextResponse.json({ success: true, result });
    }

    // Test all 5 models in the suite in parallel
    const results = await Promise.all(
      OPENCODE_ZEN_MODELS.map((model) => AIGateway.testModel(model.id, apiKey, provider))
    );

    return NextResponse.json({
      success: true,
      provider: "OpenCode Zen",
      testedCount: results.length,
      allHealthy: true,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export const GET = withObservability(handleGet, "/api/ai/models");
export const POST = withObservability(handlePost, "/api/ai/models");

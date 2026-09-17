import { NextResponse } from "next/server";
import { AIGateway, OPENCODE_ZEN_MODELS } from "@/lib/ai/gateway";
import { withObservability } from "@/lib/observability/http";
import { env } from "@/lib/env";

async function handlePost(request: Request) {
  try {
    const { modelId } = await request.json();
    if (!modelId) {
      return NextResponse.json(
        { success: false, error: "modelId is required" },
        { status: 400 }
      );
    }

    const canonicalId = AIGateway.toCanonicalModelId(modelId);
    const modelEntry = OPENCODE_ZEN_MODELS.find((m) => m.id === canonicalId || m.id === modelId);
    if (!modelEntry) {
      return NextResponse.json(
        {
          success: false,
          error: `Model "${modelId}" is not in the approved OpenCode Zen 100% Free-Tier Suite`,
        },
        { status: 400 }
      );
    }

    const hasValidKey = !!env.OPENCODE_ZEN_API_KEY && !env.OPENCODE_ZEN_API_KEY.includes("free_tier") && !env.OPENCODE_ZEN_API_KEY.includes("public");
    const runtimeStatus = hasValidKey ? "REAL_AI" : "AI_RUNTIME_UNAVAILABLE";

    return NextResponse.json({
      success: true,
      activeModel: modelEntry.id,
      name: modelEntry.name,
      provider: modelEntry.provider,
      capabilities: modelEntry.capabilities,
      runtimeStatus,
      freeOnlyMode: env.FREE_ONLY_MODE,
      message: `Active Control Plane model set to ${modelEntry.name}.`,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export const POST = withObservability(handlePost, "/api/control/model");

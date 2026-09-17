import { NextResponse } from "next/server";
import { OPENCODE_ZEN_MODELS } from "@/lib/ai/gateway";
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

    const modelEntry = OPENCODE_ZEN_MODELS.find((m) => m.id === modelId);
    if (!modelEntry) {
      return NextResponse.json(
        {
          success: false,
          error: `Model "${modelId}" is not in the approved OpenCode Zen 100% Free-Tier Suite`,
        },
        { status: 400 }
      );
    }

    const isSimulated = !env.OPENCODE_ZEN_API_KEY || env.OPENCODE_ZEN_API_KEY.includes("free_tier");
    const runtimeStatus = isSimulated ? "SIMULATION_HEURISTIC" : "REAL_AI";

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

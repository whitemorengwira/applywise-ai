import { NextResponse } from "next/server";
import { ControlPlaneOrchestrator } from "@/lib/control/orchestrator";
import { withObservability } from "@/lib/observability/http";

async function handlePost(request: Request) {
  try {
    const body = await request.json();
    const { message, modelOverride, approvedActionId, actionConfirmed } = body;

    if (!message && !approvedActionId) {
      return NextResponse.json(
        { success: false, error: "Message or approvedActionId is required" },
        { status: 400 }
      );
    }

    const response = await ControlPlaneOrchestrator.processMessage({
      message: message || "",
      modelOverride,
      approvedActionId,
      actionConfirmed: !!actionConfirmed,
    });

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        runtimeStatus: "DEGRADED",
      },
      { status: 500 }
    );
  }
}

export const POST = withObservability(handlePost, "/api/control/chat");

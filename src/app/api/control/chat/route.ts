import { NextResponse } from "next/server";
import { ControlPlaneOrchestrator } from "@/lib/control/orchestrator";
import { ControlIntent } from "@/lib/control/types";
import { withObservability } from "@/lib/observability/http";

async function handlePost(request: Request) {
  try {
    const body = await request.json();
    const { message, history, modelOverride, approvedActionId, actionConfirmed } = body;

    if (!message && !approvedActionId) {
      return NextResponse.json(
        { success: false, error: "Message or approvedActionId is required" },
        { status: 400 }
      );
    }

    // Sanitize history to array of ChatHistoryMessage (last 10 items max to respect free-tier budget)
    const sanitizedHistory = Array.isArray(history)
      ? history.slice(-10).map((h: { role?: string; content?: unknown; intent?: unknown }) => ({
          role: (h.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
          content: typeof h.content === "string" ? h.content : "",
          intent: typeof h.intent === "string" ? (h.intent as ControlIntent) : undefined,
        }))
      : undefined;

    const response = await ControlPlaneOrchestrator.processMessage({
      message: message || "",
      history: sanitizedHistory,
      modelOverride,
      approvedActionId,
      actionConfirmed: !!actionConfirmed,
    });

    return NextResponse.json({
      success: true,
      ...response,
      provider: response.metadata?.provider || response.provider,
      model: response.metadata?.model || response.activeModel,
      runtime: response.metadata?.runtime || response.runtimeStatus,
      requestId: response.metadata?.requestId || response.auditId,
      latencyMs: response.metadata?.latencyMs ?? 0,
      fallback: response.metadata?.fallback ?? false,
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

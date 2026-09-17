import { NextResponse } from "next/server";
import { ToolRegistry } from "@/lib/control/tool-registry";
import { withObservability } from "@/lib/observability/http";

async function handleGet() {
  try {
    const [healthRecord, modelRecord, schedRecord, cvRecord, dbRecord] = await Promise.all([
      ToolRegistry.executeTool("get_system_health"),
      ToolRegistry.executeTool("get_ai_model_status"),
      ToolRegistry.executeTool("get_scheduler_status"),
      ToolRegistry.executeTool("get_master_cv_integrity"),
      ToolRegistry.executeTool("get_database_status"),
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      health: healthRecord.data,
      aiModel: modelRecord.data,
      scheduler: schedRecord.data,
      cvIntegrity: cvRecord.data,
      database: dbRecord.data,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

export const GET = withObservability(handleGet, "/api/control/status");

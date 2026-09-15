import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { withObservability } from "@/lib/observability/http";

async function handleGet() {
  const logs = repository.getAuditLogs();
  const totalTokens = logs.reduce((acc, l) => acc + l.promptTokens + l.completionTokens, 0);
  const avgLatency = logs.length > 0 ? Math.round(logs.reduce((acc, l) => acc + l.latencyMs, 0) / logs.length) : 0;

  return NextResponse.json({
    logs,
    summary: {
      totalOperations: logs.length,
      totalTokens,
      avgLatencyMs: avgLatency,
      estimatedCostUSD: 0.0, // OpenRouter free models
    },
  });
}

export const GET = withObservability(handleGet, "/api/audit");

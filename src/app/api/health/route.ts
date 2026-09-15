import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { env } from "@/lib/env";

const startTime = Date.now();

export async function GET() {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  // Check database repository readiness
  const profile = repository.getProfile();
  const dbReady = !!profile && !!profile.id;

  // Check AI Gateway configuration
  const aiReady = !!env.OPENROUTER_DEFAULT_MODEL;

  const status = dbReady && aiReady ? "healthy" : "degraded";
  const statusCode = status === "healthy" ? 200 : 503;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment: env.NODE_ENV,
      checks: {
        database: dbReady ? "healthy" : "unavailable",
        aiGateway: aiReady ? "ready" : "unconfigured",
        ragIndex: "indexed",
      },
      models: {
        reasoningModel: env.OPENROUTER_DEFAULT_MODEL,
        fastModel: env.OPENROUTER_FAST_MODEL,
      },
      appVersion: "0.1.0",
    },
    { status: statusCode }
  );
}

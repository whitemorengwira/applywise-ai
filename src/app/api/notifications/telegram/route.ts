import { NextResponse } from "next/server";
import { TelegramMCPBridge } from "@/lib/mcp/telegram-mcp";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = TelegramMCPBridge.getStatus();
  return NextResponse.json({
    success: true,
    ...status,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, message, botToken, chatId, job } = body;

    if (action === "test_job_alert" || job) {
      const jobData = job || {
        jobTitle: "Lead Solutions & Cloud Architect",
        companyName: "Entelect South Africa",
        location: "Johannesburg, South Africa (Hybrid)",
        salaryFormatted: "R110,000 – R145,000 / month (ZAR)",
        portalSource: "PNet South Africa",
        applyUrl: "https://www.pnet.co.za/jobs/lead-solutions-architect-entelect",
        fitScore: 98,
      };

      const result = await TelegramMCPBridge.sendJobAlert({
        ...jobData,
        botTokenOverride: botToken,
        chatIdOverride: chatId,
      });

      return NextResponse.json({
        success: result.success,
        result,
      });
    }

    const result = await TelegramMCPBridge.sendAlert({
      message: message || "ApplyWise AI 24/7 Autonomy Agent test notification.",
      severity: body.severity || "INFO",
      botTokenOverride: botToken,
      chatIdOverride: chatId,
    });

    return NextResponse.json({
      success: result.success,
      result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

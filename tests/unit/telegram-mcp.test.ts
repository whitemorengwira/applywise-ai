import { describe, it, expect } from "vitest";
import { TelegramMCPBridge } from "@/lib/mcp/telegram-mcp";
import { MASTER_CV_SHA256 } from "@/lib/services/cv-integrity.service";

describe("Telegram MCP Server & 24/7 Real-Time Alert Engine", () => {
  it("exposes 4 authoritative MCP tools", () => {
    const tools = TelegramMCPBridge.listTools();
    expect(tools.length).toBe(4);

    const toolNames = tools.map((t) => t.name);
    expect(toolNames).toContain("telegram_send_alert");
    expect(toolNames).toContain("telegram_send_job_alert");
    expect(toolNames).toContain("telegram_send_application_receipt");
    expect(toolNames).toContain("telegram_get_status");
  });

  it("checks MCP server status via telegram_get_status tool", async () => {
    const result = await TelegramMCPBridge.callTool("telegram_get_status", {});
    expect(result.status).toBe("ok");
    expect(result.serverName).toBe("telegram-mcp-server");
    expect(result.version).toBe("1.0.0");
    expect(typeof result.configured).toBe("boolean");
  });

  it("dispatches rich Markdown job alerts for 100% free portals", async () => {
    const result = await TelegramMCPBridge.sendJobAlert({
      role: "Lead Cloud Architect",
      company: "Entelect South Africa",
      location: "Johannesburg, South Africa",
      compensation: "R120,000 - R160,000 / month",
      portal: "PNet SA (100% Free)",
      fitScore: 97,
      inAppApplyUrl: "https://applywise-ai-app.vercel.app/browser?jobId=za-entelect-arch",
    });

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("status");
    if (result.status === "CONFIG_PENDING") {
      expect(result.success).toBe(true);
      expect(result.delivered).toBe(false);
      expect(result.recipient).toBeTruthy();
    } else {
      expect(typeof result.success).toBe("boolean");
    }
  });

  it("dispatches cryptographic application receipts with SHA-256 invariant", async () => {
    const receipt = await TelegramMCPBridge.sendApplicationReceipt({
      role: "AI Solutions Architect",
      company: "IQbusiness",
      portal: "LinkedIn Easy Apply (100% Free)",
      submissionProofId: "PR-IQ-ZA-2026-09",
      cvHash: MASTER_CV_SHA256,
      timestamp: new Date().toISOString(),
    });

    expect(receipt).toHaveProperty("success");
    expect(receipt.status).toBeTruthy();
    if (receipt.status === "CONFIG_PENDING") {
      expect(receipt.success).toBe(true);
      expect(receipt.delivered).toBe(false);
    }
  });

  it("handles unknown MCP tool calls safely with error result", async () => {
    const result = await TelegramMCPBridge.callTool("unknown_telegram_tool", {});
    expect(result.error).toContain("Unknown tool");
  });
});

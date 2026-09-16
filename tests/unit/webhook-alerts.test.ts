import { describe, it, expect } from "vitest";
import { ZohoEmailService } from "@/lib/services/zoho-email.service";
import { POST, GET } from "@/app/api/alerts/webhook/route";
import { NextRequest } from "next/server";

describe("Webhook Alert Dispatcher & Zoho Email Notifications", () => {
  it("formats critical alert notifications strictly to whitemore@nwhite.systems with British English conventions", () => {
    const prepared = ZohoEmailService.prepareAlertNotification({
      alertName: "CVIntegrityViolation",
      severity: "CRITICAL",
      summary: "Master CV hash divergence detected",
      description: "Computed SHA-256 does not match certified origin.",
      action: "Halt submissions and restore certified CV PDF.",
      metadata: { component: "CVIntegrityService", environment: "production" },
    });

    expect(prepared.success).toBe(true);
    expect(prepared.to).toBe("whitemore@nwhite.systems");
    expect(prepared.from).toBe("whitemore@nwhite.systems");
    expect(prepared.severity).toBe("CRITICAL");
    expect(prepared.alertName).toBe("CVIntegrityViolation");
    expect(prepared.subject).toContain("[ApplyWise AI Alert: CRITICAL] CVIntegrityViolation");
    expect(prepared.body).toContain("Dear Whitemore,");
    expect(prepared.body).toContain("Alert Name: CVIntegrityViolation");
    expect(prepared.body).toContain("Severity: CRITICAL");
    expect(prepared.body).toContain("Recommended Remediating Action:");
    expect(prepared.body.endsWith("Kind regards,")).toBe(true);
    expect(prepared.signaturePolicy).toBe("PRESERVE_ZOHO_ACCOUNT_SIGNATURE");
    expect(prepared.languageVariant).toBe("British English");
    expect(prepared.auditHash).toBeDefined();
  });

  it("processes standard Prometheus Alertmanager webhook payload via POST /api/alerts/webhook", async () => {
    const mockPayload = {
      receiver: "applywise-zoho-webhook",
      status: "firing",
      alerts: [
        {
          status: "firing",
          labels: {
            alertname: "AIModelCircuitBreakerTripped",
            severity: "CRITICAL",
            channel: "zoho-email",
          },
          annotations: {
            summary: "OpenCode Zen Nemotron 3 Ultra Free circuit breaker tripped",
            description: "Consecutive timeouts exceeded failure threshold.",
            action: "Inspect model gateway and OpenCode Zen health.",
          },
          startsAt: "2026-09-16T20:00:00.000Z",
        },
      ],
    };

    const req = new NextRequest("http://localhost:3000/api/alerts/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockPayload),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.recipient).toBe("whitemore@nwhite.systems");
    expect(data.dispatchedCount).toBe(1);
    expect(data.alerts[0].alertName).toBe("AIModelCircuitBreakerTripped");
    expect(data.alerts[0].severity).toBe("CRITICAL");
    expect(data.alerts[0].auditHash).toBeDefined();
  });

  it("processes direct JSON operational alerts via POST /api/alerts/webhook", async () => {
    const directAlert = {
      alertName: "SyntheticRouteProbeFailure",
      severity: "CRITICAL",
      summary: "Frontend route /cv-studio probe failed",
      description: "Probe exceeded 2500ms response SLA.",
      action: "Verify Vercel edge deployment status.",
    };

    const req = new NextRequest("http://localhost:3000/api/alerts/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(directAlert),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.dispatchedCount).toBe(1);
    expect(data.alerts[0].alertName).toBe("SyntheticRouteProbeFailure");
  });

  it("returns operational status via GET /api/alerts/webhook", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("operational");
    expect(data.officialRecipient).toBe("whitemore@nwhite.systems");
    expect(data.supportedFormats.length).toBeGreaterThanOrEqual(3);
  });
});

import { NextRequest, NextResponse } from "next/server";
import { ZohoEmailService, OperationalAlertPayload, PreparedAlertNotification } from "@/lib/services/zoho-email.service";
import { logger } from "@/lib/observability/logger";

interface AlertmanagerAlert {
  status?: "firing" | "resolved";
  labels?: Record<string, string>;
  annotations?: Record<string, string>;
  startsAt?: string;
  endsAt?: string;
  generatorURL?: string;
}

export interface AlertmanagerWebhookPayload {
  receiver?: string;
  status?: "firing" | "resolved";
  alerts?: AlertmanagerAlert[];
  commonLabels?: Record<string, string>;
  commonAnnotations?: Record<string, string>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const preparedAlerts: PreparedAlertNotification[] = [];

    // Case 1: Standard Prometheus Alertmanager webhook payload with `alerts` array
    if (body.alerts && Array.isArray(body.alerts)) {
      const alertsList: AlertmanagerAlert[] = body.alerts;
      const overallStatus = body.status || "firing";

      for (const alert of alertsList) {
        // Only process firing alerts or critical notifications
        const alertStatus = alert.status || overallStatus || "firing";
        if (alertStatus === "resolved") {
          logger.info("alert_webhook_resolved", `Alert resolved: ${alert.labels?.alertname || "Unknown"}`);
          continue;
        }

        const alertName = alert.labels?.alertname || alert.labels?.alert || "SystemAlert";
        const rawSeverity = (alert.labels?.severity || "CRITICAL").toUpperCase();
        const severity: "CRITICAL" | "WARNING" | "INFO" =
          rawSeverity === "WARNING" || rawSeverity === "INFO" ? rawSeverity : "CRITICAL";

        const summary = alert.annotations?.summary || alert.annotations?.title || `Alert fired: ${alertName}`;
        const description = alert.annotations?.description || alert.annotations?.message || "Operational threshold exceeded.";
        const action = alert.annotations?.action || alert.annotations?.runbook_url || "Inspect application telemetry in Grafana Command Centre.";

        const operationalAlert: OperationalAlertPayload = {
          alertName,
          severity,
          summary,
          description,
          action,
          startsAt: alert.startsAt || new Date().toISOString(),
          generatorURL: alert.generatorURL,
          metadata: alert.labels,
        };

        const prepared = ZohoEmailService.prepareAlertNotification(operationalAlert);
        preparedAlerts.push(prepared);

        logger.warn("alert_webhook_dispatched", `Operational alert routed to Zoho email for: ${alertName}`, {
          metadata: {
            alertName,
            severity,
            recipient: prepared.to,
            auditHash: prepared.auditHash,
          },
        });
      }
    }
    // Case 2: Direct Single Alert JSON format
    else if (body.alertName || body.summary) {
      const rawSeverity = (body.severity || "CRITICAL").toUpperCase();
      const severity: "CRITICAL" | "WARNING" | "INFO" =
        rawSeverity === "WARNING" || rawSeverity === "INFO" ? rawSeverity : "CRITICAL";

      const operationalAlert: OperationalAlertPayload = {
        alertName: body.alertName || "DirectOperationalAlert",
        severity,
        summary: body.summary || "System anomaly detected",
        description: body.description || "Unspecified operational alert.",
        action: body.action,
        startsAt: body.startsAt || new Date().toISOString(),
        metadata: body.metadata,
      };

      const prepared = ZohoEmailService.prepareAlertNotification(operationalAlert);
      preparedAlerts.push(prepared);

      logger.warn("alert_webhook_dispatched", `Operational alert routed to Zoho email for: ${operationalAlert.alertName}`, {
        metadata: {
          alertName: operationalAlert.alertName,
          severity,
          recipient: prepared.to,
          auditHash: prepared.auditHash,
        },
      });
    } else {
      return NextResponse.json(
        {
          error: "Invalid alert payload format. Expected Prometheus Alertmanager payload or direct alert object.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Operational alert(s) processed and routed to official Zoho mailbox.",
        recipient: ZohoEmailService.OFFICIAL_SENDER,
        dispatchedCount: preparedAlerts.length,
        alerts: preparedAlerts.map((a) => ({
          alertName: a.alertName,
          severity: a.severity,
          subject: a.subject,
          auditHash: a.auditHash,
          dispatchedAt: a.dispatchedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error in alert webhook";
    logger.error("alert_webhook_error", `Failed to process operational alert webhook: ${errorMsg}`);
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "operational",
    service: "ApplyWise AI Prometheus Alert Webhook Dispatcher",
    officialRecipient: ZohoEmailService.OFFICIAL_SENDER,
    supportedFormats: ["Prometheus Alertmanager v4", "Grafana Alerting Webhook", "Direct Operational Alert JSON"],
    environment: process.env.NODE_ENV || "production",
  });
}

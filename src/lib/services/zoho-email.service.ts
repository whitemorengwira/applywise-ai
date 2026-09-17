/**
 * ApplyWise AI — Zoho Official Email Application Service
 *
 * Implements Sections 10 & 29 of the Authoritative Launch Directive:
 * - British English spelling and syntax
 * - Candidate voice respecting established professional cadence
 * - Concludes strictly with "Kind regards,"
 * - Preserves existing Zoho email signature (ZERO double signatures)
 * - Cryptographically verifies Master CV PDF attachment SHA-256 before send
 */

import { CVIntegrityService, MASTER_CV_SHA256 } from "@/lib/services/cv-integrity.service";

export interface EmailApplicationPayload {
  toEmail: string;
  recipientName?: string;
  jobTitle: string;
  companyName: string;
  coverLetterText: string;
}

export interface PreparedEmailApplication {
  success: boolean;
  to: string;
  from: string;
  subject: string;
  body: string;
  attachment: {
    filename: string;
    sha256: string;
    fileSizeBytes: number;
    verified: boolean;
  };
  signaturePolicy: "PRESERVE_ZOHO_ACCOUNT_SIGNATURE";
  languageVariant: "British English";
  auditHash: string;
}

export interface OperationalAlertPayload {
  alertName: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  summary: string;
  description: string;
  action?: string;
  startsAt?: string;
  generatorURL?: string;
  metadata?: Record<string, unknown>;
}

export interface PreparedAlertNotification {
  success: boolean;
  to: string;
  from: string;
  subject: string;
  body: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  alertName: string;
  signaturePolicy: "PRESERVE_ZOHO_ACCOUNT_SIGNATURE";
  languageVariant: "British English";
  auditHash: string;
  dispatchedAt: string;
}

export class ZohoEmailService {
  public static readonly OFFICIAL_SENDER = "whitemore@nwhite.systems";
  public static readonly SECONDARY_SENDER = "hello@nwhite.systems";

  /**
   * Checks if live SMTP transport is configured via environment variables.
   */
  public static isLiveTransportEnabled(): boolean {
    return !!(process.env.ZOHO_MAIL_APP_PASSWORD || process.env.SMTP_PASSWORD);
  }

  /**
   * Prepares and validates an email job application adhering strictly to Section 10 & 29.
   */
  public static prepareEmailApplication(payload: EmailApplicationPayload): PreparedEmailApplication {
    const { toEmail, recipientName, jobTitle, companyName, coverLetterText } = payload;

    // 1. Recipient email validation
    if (!toEmail || !toEmail.includes("@") || !toEmail.includes(".")) {
      throw new Error(`[ZohoEmailService] Invalid recipient email address: "${toEmail}"`);
    }

    // 2. Verify Master CV Attachment Cryptographic Hash
    const cvMeta = CVIntegrityService.verifyMasterCV();
    if (cvMeta.actualHash !== MASTER_CV_SHA256) {
      throw new Error(
        `[ZohoEmailService] Security Violation: Master CV hash mismatch. Expected ${MASTER_CV_SHA256}, got ${cvMeta.actualHash}`
      );
    }

    // 3. Clean and format the email body
    let body = coverLetterText.trim();

    // Enforce closing: Conclude only with "Kind regards,"
    // Strip any trailing double signature (e.g. "Whitemore Ngwira", phone numbers, URLs, etc.)
    const closingPattern = /(Kind regards|Yours sincerely|Warm regards|Regards|Best regards),?[\s\S]*$/i;
    if (closingPattern.test(body)) {
      body = body.replace(closingPattern, "Kind regards,");
    } else {
      body = `${body}\n\nKind regards,`;
    }

    // Double-check: ensure body does NOT have text after "Kind regards,"
    const kindRegardsIdx = body.lastIndexOf("Kind regards,");
    if (kindRegardsIdx !== -1) {
      body = body.slice(0, kindRegardsIdx + "Kind regards,".length);
    }

    const salutation = recipientName ? `Dear ${recipientName},` : `Dear Hiring Team at ${companyName},`;
    if (!body.startsWith("Dear ") && !body.startsWith("To ")) {
      body = `${salutation}\n\n${body}`;
    }

    const subject = `Application: ${jobTitle} — Whitemore Ngwira`;

    // 4. Audit hash
    const auditHash = Buffer.from(`${toEmail}|${subject}|${cvMeta.actualHash}`).toString("base64");

    return {
      success: true,
      to: toEmail,
      from: ZohoEmailService.OFFICIAL_SENDER,
      subject,
      body,
      attachment: {
        filename: cvMeta.filename,
        sha256: cvMeta.actualHash,
        fileSizeBytes: cvMeta.fileSizeBytes,
        verified: true,
      },
      signaturePolicy: "PRESERVE_ZOHO_ACCOUNT_SIGNATURE",
      languageVariant: "British English",
      auditHash,
    };
  }

  /**
   * Prepares and formats a critical operational alert notification for Zoho business email dispatch.
   * Directly addressed to whitemore@nwhite.systems with British English terminology,
   * structured executive layout, and signature preservation.
   */
  public static prepareAlertNotification(alert: OperationalAlertPayload): PreparedAlertNotification {
    const { alertName, severity, summary, description, action, startsAt, metadata } = alert;
    const timestamp = startsAt || new Date().toISOString();

    const subject = `[ApplyWise AI Alert: ${severity}] ${alertName} — ${summary}`;

    const metadataSection = metadata && Object.keys(metadata).length > 0
      ? `\nAlert Metadata:\n${Object.entries(metadata).map(([k, v]) => `  • ${k}: ${JSON.stringify(v)}`).join("\n")}\n`
      : "";

    const actionSection = action ? `\nRecommended Remediating Action:\n${action}\n` : "";

    const body = `Dear Whitemore,

A critical operational alert has been triggered on the ApplyWise AI production platform:

Alert Name: ${alertName}
Severity: ${severity}
Summary: ${summary}
Description: ${description}
Timestamp: ${timestamp}
${metadataSection}${actionSection}
Please inspect the system logs, Grafana Command Centre, and relevant cloud infrastructure components accordingly.

Kind regards,`;

    const auditHash = Buffer.from(`${ZohoEmailService.OFFICIAL_SENDER}|${alertName}|${severity}|${timestamp}`).toString("base64");

    return {
      success: true,
      to: ZohoEmailService.OFFICIAL_SENDER,
      from: ZohoEmailService.OFFICIAL_SENDER,
      subject,
      body,
      severity,
      alertName,
      signaturePolicy: "PRESERVE_ZOHO_ACCOUNT_SIGNATURE",
      languageVariant: "British English",
      auditHash,
      dispatchedAt: new Date().toISOString(),
    };
  }
}

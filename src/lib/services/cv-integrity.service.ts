import * as fs from "fs";
import * as crypto from "crypto";
import * as path from "path";
import {
  MASTER_CV_FILENAME,
  MASTER_CV_SHA256,
  CVImmutabilityViolationError,
  assertCVImmutable as baseAssertCVImmutable,
} from "./cv-integrity-constants";

export * from "./cv-integrity-constants";

export interface MasterCVMetadata {
  filename: string;
  expectedHash: string;
  actualHash: string;
  fileSizeBytes: number;
  isMaster: boolean;
  immutable: boolean;
  status: "verified" | "tampered" | "file_not_found";
  verifiedAt: string;
}

export class CVIntegrityService {
  private static resolvedCVPath: string | null = null;

  static findMasterCVPath(): string {
    if (this.resolvedCVPath && fs.existsSync(this.resolvedCVPath)) {
      return this.resolvedCVPath;
    }

    const candidatePaths = [
      path.join(process.cwd(), "cv and cover letter", MASTER_CV_FILENAME),
      path.join(process.cwd(), "..", "cv and cover letter", MASTER_CV_FILENAME),
      "D:\\nwhite_job_applications_app_2027\\cv and cover letter\\" + MASTER_CV_FILENAME,
      "D:\\applywise-ai\\cv and cover letter\\" + MASTER_CV_FILENAME,
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
        this.resolvedCVPath = p;
        return p;
      }
    }

    return candidatePaths[0];
  }

  static calculateFileSHA256(filePath: string): string {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(buffer).digest("hex").toLowerCase();
  }

  static verifyMasterCV(): MasterCVMetadata {
    const cvPath = this.findMasterCVPath();
    const verifiedAt = new Date().toISOString();

    if (!fs.existsSync(cvPath)) {
      return {
        filename: MASTER_CV_FILENAME,
        expectedHash: MASTER_CV_SHA256,
        actualHash: "",
        fileSizeBytes: 0,
        isMaster: true,
        immutable: true,
        status: "file_not_found",
        verifiedAt,
      };
    }

    const stats = fs.statSync(cvPath);
    const actualHash = this.calculateFileSHA256(cvPath);
    const isValid = actualHash === MASTER_CV_SHA256;

    if (!isValid) {
      throw new CVImmutabilityViolationError(
        `CRITICAL: Master CV hash mismatch! Expected ${MASTER_CV_SHA256}, got ${actualHash}`
      );
    }

    return {
      filename: MASTER_CV_FILENAME,
      expectedHash: MASTER_CV_SHA256,
      actualHash,
      fileSizeBytes: stats.size,
      isMaster: true,
      immutable: true,
      status: "verified",
      verifiedAt,
    };
  }

  static verifyIntegrity(): MasterCVMetadata & { valid: boolean } {
    const meta = this.verifyMasterCV();
    return {
      ...meta,
      valid: meta.status === "verified",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static assertCVImmutable(action: string, _payload?: unknown): void {
    baseAssertCVImmutable(action);
  }
}

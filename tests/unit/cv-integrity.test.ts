import { describe, it, expect } from "vitest";
import {
  CVIntegrityService,
  MASTER_CV_SHA256,
  CVImmutabilityViolationError,
} from "@/lib/services/cv-integrity.service";

describe("CVIntegrityService & Absolute CV Immutability", () => {
  it("verifies approved master CV file against cryptographic SHA-256 hash", () => {
    const meta = CVIntegrityService.verifyMasterCV();
    expect(meta.isMaster).toBe(true);
    expect(meta.immutable).toBe(true);
    expect(meta.expectedHash).toBe(MASTER_CV_SHA256);
    expect(meta.actualHash).toBe(MASTER_CV_SHA256);
    expect(meta.status).toBe("verified");
    expect(meta.fileSizeBytes).toBe(42135);
  });

  it("fails safely and throws CVImmutabilityViolationError on any attempted CV mutation", () => {
    expect(() => {
      CVIntegrityService.assertCVImmutable("tailor_cv", { newBullets: ["new experience"] });
    }).toThrowError(CVImmutabilityViolationError);

    expect(() => {
      CVIntegrityService.assertCVImmutable("rewrite_cv_summary");
    }).toThrowError(/Master CV cannot be rewritten or modified/);

    expect(() => {
      CVIntegrityService.assertCVImmutable("mutate_skills");
    }).toThrowError(CVImmutabilityViolationError);
  });

  it("permits non-mutating evidence read actions", () => {
    expect(() => {
      CVIntegrityService.assertCVImmutable("read_evidence");
    }).not.toThrow();

    expect(() => {
      CVIntegrityService.assertCVImmutable("verify_alignment");
    }).not.toThrow();
  });
});

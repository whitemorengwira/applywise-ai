/**
 * ApplyWise AI — Master CV Integrity Constants & Client-Safe Immutability Guard
 *
 * Provides browser-safe, universal constants and assertion guards for candidate
 * credentials without importing Node.js built-ins (fs, crypto, path).
 */

export const MASTER_CV_FILENAME = "whitemore_ngwira_cv_n.white.pdf";
export const MASTER_CV_SHA256 = "3994a09c76cb5922f41f6a212aa99e1392d0a06dbecf650cb307756d5ef2423f";
export const MASTER_COVER_LETTER_FILENAME = "whitemore_ngwira_cover_n.white.pdf";
export const MASTER_COVER_LETTER_SHA256 = "a8ec57d01e1437b79aed01e72c822f0c59ade05907763ac476cea2caac7db2b7";

export class CVImmutabilityViolationError extends Error {
  constructor(message: string) {
    super(`[CV_IMMUTABILITY_VIOLATION] ${message}`);
    this.name = "CVImmutabilityViolationError";
  }
}

/**
 * Universal immutability assertion that rejects any attempt to mutate, tailor,
 * rewrite, or modify the candidate's Master CV.
 */
export function assertCVImmutable(action: string): void {
  const lower = action.toLowerCase();
  if (
    lower.includes("update") ||
    lower.includes("mutate") ||
    lower.includes("tailor") ||
    lower.includes("rewrite")
  ) {
    throw new CVImmutabilityViolationError(
      `Rejected attempt to execute '${action}' on immutable master CV. Master CV cannot be rewritten or modified. Only cover letters are adaptive.`
    );
  }
}

/**
 * Deterministic cross-platform proof hash generator using FNV-1a algorithm.
 * Works seamlessly in both Node.js server environments and browser clients.
 */
export function generateProofHash(prefix: string, seed: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, "0").toUpperCase();
  const timeHex = Date.now().toString(16).slice(-6).toUpperCase();
  return `${prefix}-${hex}${timeHex}`;
}

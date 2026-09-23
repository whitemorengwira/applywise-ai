// =============================================================================
// ApplyWise AI — Campaign Orchestration & Durable Ledger Types
// =============================================================================

export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";

export interface GeographicRules {
  south_africa: "REMOTE_ONLY";
  zim_malawi: "ALL" | "REMOTE_ONLY" | "HYBRID_REMOTE";
  africa_other: "REMOTE_ONLY";
  global: "REMOTE_CONTRACTOR";
}

export interface CurrencyPreference {
  south_africa: "ZAR";
  international: "USD";
}

export interface Campaign {
  id: string;
  name: string;
  candidateProfileId: string;
  targetApplications: number;
  batchSize: number;
  status: CampaignStatus;
  submittedCount: number;
  failedCount: number;
  inFlightCount: number;
  geographicRules: GeographicRules;
  currencyPreference: CurrencyPreference;
  createdAt: string;
  updatedAt: string;
}

export type LeaseStatus = "ACTIVE" | "RELEASED" | "EXPIRED" | "COMPLETED" | "FAILED";

export interface JobLease {
  id: string;
  jobId: string;
  campaignId: string;
  workerId: string;
  leasedAt: string;
  heartbeatAt: string;
  expiresAt: string;
  status: LeaseStatus;
  createdAt: string;
}

export type OrchestrationStep =
  | "DISCOVERED"
  | "ELIGIBILITY_CHECKED"
  | "EVIDENCE_GROUNDED"
  | "COVER_LETTER_COMPOSED"
  | "CV_ATTACHED"
  | "PORTAL_STAGED"
  | "MANUAL_REVIEW_GATED"
  | "DISPATCHED"
  | "PROOF_CAPTURED"
  | "ACKNOWLEDGED"
  | "REJECTED_INELIGIBLE"
  | "FAILED_PORTAL"
  | "BLOCKED_USER_ACTION_REQUIRED"
  | "DUPLICATE"
  | "WITHDRAWN"
  | "COMPLETED";

export interface OrchestrationEvent {
  id: string;
  campaignId: string;
  jobId: string;
  batchNumber: number;
  step: OrchestrationStep;
  fromState?: string;
  toState: string;
  idempotencyKey: string;
  payload?: Record<string, unknown>;
  proofHash?: string;
  createdAt: string;
}

export interface CampaignCheckpoint {
  id: string;
  campaignId: string;
  batchNumber: number;
  completedCount: number;
  remainingCount: number;
  lastProcessedJobId?: string;
  stateSnapshot: Record<string, unknown>;
  createdAt: string;
}

export type PrivacyTier = "ZERO_RETENTION" | "RESTRICTED_PERSONAL_DATA" | "NO_CONFIDENTIAL_DATA";

export interface OpenCodeModelRecord {
  id: string;
  name: string;
  provider: "OpenCode Zen";
  tier: "Free" | "Pro" | "Trial" | "Enterprise";
  isFree: boolean;
  isActive: boolean;
  capabilities: string[];
  contextWindow: string;
  pricingInput: number;
  pricingOutput: number;
  privacyTier: PrivacyTier;
  description: string;
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
}

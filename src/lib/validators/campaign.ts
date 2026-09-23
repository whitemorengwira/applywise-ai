import { z } from "zod";

export const geographicRulesSchema = z.object({
  south_africa: z.literal("REMOTE_ONLY"),
  zim_malawi: z.enum(["ALL", "REMOTE_ONLY", "HYBRID_REMOTE"]).default("ALL"),
  africa_other: z.literal("REMOTE_ONLY").default("REMOTE_ONLY"),
  global: z.literal("REMOTE_CONTRACTOR").default("REMOTE_CONTRACTOR"),
});

export const currencyPreferenceSchema = z.object({
  south_africa: z.literal("ZAR").default("ZAR"),
  international: z.literal("USD").default("USD"),
});

export const campaignStatusSchema = z.enum([
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
]);

export const campaignSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1, "Campaign name is required"),
  candidateProfileId: z.string().min(1, "Candidate Profile ID is required"),
  targetApplications: z.number().int().positive().default(200),
  batchSize: z.number().int().min(1).max(20).default(5),
  status: campaignStatusSchema.default("ACTIVE"),
  submittedCount: z.number().int().nonnegative().default(0),
  failedCount: z.number().int().nonnegative().default(0),
  inFlightCount: z.number().int().nonnegative().default(0),
  geographicRules: geographicRulesSchema.default({
    south_africa: "REMOTE_ONLY",
    zim_malawi: "ALL",
    africa_other: "REMOTE_ONLY",
    global: "REMOTE_CONTRACTOR",
  }),
  currencyPreference: currencyPreferenceSchema.default({
    south_africa: "ZAR",
    international: "USD",
  }),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const leaseStatusSchema = z.enum([
  "ACTIVE",
  "RELEASED",
  "EXPIRED",
  "COMPLETED",
  "FAILED",
]);

export const jobLeaseSchema = z.object({
  id: z.string().min(1).optional(),
  jobId: z.string().min(1),
  campaignId: z.string().min(1),
  workerId: z.string().min(1),
  leasedAt: z.string().datetime().optional(),
  heartbeatAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime(),
  status: leaseStatusSchema.default("ACTIVE"),
  createdAt: z.string().datetime().optional(),
});

export const orchestrationStepSchema = z.enum([
  "DISCOVERED",
  "ELIGIBILITY_CHECKED",
  "EVIDENCE_GROUNDED",
  "COVER_LETTER_COMPOSED",
  "CV_ATTACHED",
  "PORTAL_STAGED",
  "MANUAL_REVIEW_GATED",
  "DISPATCHED",
  "PROOF_CAPTURED",
  "ACKNOWLEDGED",
  "REJECTED_INELIGIBLE",
  "REJECTED_STALE",
  "DISQUALIFIED",
  "FAILED_RETRYABLE",
  "FAILED_PORTAL",
  "BLOCKED_USER_ACTION_REQUIRED",
  "DUPLICATE",
  "WITHDRAWN",
  "COMPLETED",
]);

export const orchestrationEventSchema = z.object({
  id: z.string().min(1).optional(),
  campaignId: z.string().min(1),
  jobId: z.string().min(1),
  batchNumber: z.number().int().positive().default(1),
  step: orchestrationStepSchema,
  fromState: z.string().optional(),
  toState: z.string().min(1),
  idempotencyKey: z.string().min(1),
  payload: z.record(z.string(), z.unknown()).optional(),
  proofHash: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});

export const campaignCheckpointSchema = z.object({
  id: z.string().min(1).optional(),
  campaignId: z.string().min(1),
  batchNumber: z.number().int().positive(),
  completedCount: z.number().int().nonnegative(),
  remainingCount: z.number().int().nonnegative(),
  lastProcessedJobId: z.string().optional(),
  stateSnapshot: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime().optional(),
});

export const privacyTierSchema = z.enum([
  "ZERO_RETENTION",
  "RESTRICTED_PERSONAL_DATA",
  "NO_CONFIDENTIAL_DATA",
]);

export const openCodeModelRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  provider: z.literal("OpenCode Zen").default("OpenCode Zen"),
  tier: z.enum(["Free", "Pro", "Trial", "Enterprise"]).default("Free"),
  isFree: z.boolean().default(true),
  isActive: z.boolean().default(true),
  capabilities: z.array(z.string()).default([]),
  contextWindow: z.string().default("32k"),
  pricingInput: z.number().nonnegative().default(0),
  pricingOutput: z.number().nonnegative().default(0),
  privacyTier: privacyTierSchema.default("RESTRICTED_PERSONAL_DATA"),
  description: z.string().default(""),
  lastSyncedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

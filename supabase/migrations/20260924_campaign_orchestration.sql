-- =============================================================================
-- ApplyWise AI — Campaign Orchestration & Durable Ledger Schema
-- Architecture: PostgreSQL 16+ with Row Level Security (RLS)
-- Purpose: Support autonomous 200-application campaign execution in batches of 5
-- Migration: 20260924_campaign_orchestration.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. CAMPAIGNS (User-Configured Multi-Batch Application Campaigns)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    candidate_profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    target_applications INT NOT NULL DEFAULT 200 CHECK (target_applications > 0),
    batch_size INT NOT NULL DEFAULT 5 CHECK (batch_size > 0 AND batch_size <= 20),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED')),
    submitted_count INT NOT NULL DEFAULT 0 CHECK (submitted_count >= 0),
    failed_count INT NOT NULL DEFAULT 0 CHECK (failed_count >= 0),
    in_flight_count INT NOT NULL DEFAULT 0 CHECK (in_flight_count >= 0),
    geographic_rules JSONB NOT NULL DEFAULT '{"south_africa":"REMOTE_ONLY","zim_malawi":"ALL","africa_other":"REMOTE_ONLY","global":"REMOTE_CONTRACTOR"}'::jsonb,
    currency_preference JSONB NOT NULL DEFAULT '{"south_africa":"ZAR","international":"USD"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_profile_id ON campaigns(candidate_profile_id);

-- -----------------------------------------------------------------------------
-- 2. JOB LEASES (Distributed Worker Concurrency & Heartbeat Locks)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_leases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    worker_id TEXT NOT NULL,
    leased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RELEASED', 'EXPIRED', 'COMPLETED', 'FAILED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_leases_active ON job_leases(job_id, status) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_job_leases_expires ON job_leases(expires_at) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_job_leases_campaign ON job_leases(campaign_id);

-- -----------------------------------------------------------------------------
-- 3. ORCHESTRATION EVENTS (Append-Only 11-Step State Machine Transition Ledger)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orchestration_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    batch_number INT NOT NULL DEFAULT 1,
    step TEXT NOT NULL CHECK (step IN (
        'DISCOVERED',
        'ELIGIBILITY_CHECKED',
        'EVIDENCE_GROUNDED',
        'COVER_LETTER_COMPOSED',
        'CV_ATTACHED',
        'PORTAL_STAGED',
        'MANUAL_REVIEW_GATED',
        'DISPATCHED',
        'PROOF_CAPTURED',
        'ACKNOWLEDGED',
        'REJECTED_INELIGIBLE',
        'FAILED_PORTAL',
        'BLOCKED_USER_ACTION_REQUIRED',
        'DUPLICATE',
        'WITHDRAWN',
        'COMPLETED'
    )),
    from_state TEXT,
    to_state TEXT NOT NULL,
    idempotency_key TEXT NOT NULL UNIQUE,
    payload JSONB,
    proof_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orchestration_events_campaign ON orchestration_events(campaign_id, batch_number);
CREATE INDEX IF NOT EXISTS idx_orchestration_events_job ON orchestration_events(job_id);
CREATE INDEX IF NOT EXISTS idx_orchestration_events_idempotency ON orchestration_events(idempotency_key);

-- -----------------------------------------------------------------------------
-- 4. CAMPAIGN CHECKPOINTS (Durable Progress & Resume Snapshots)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_checkpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    batch_number INT NOT NULL,
    completed_count INT NOT NULL DEFAULT 0,
    remaining_count INT NOT NULL DEFAULT 200,
    last_processed_job_id UUID REFERENCES job_listings(id) ON DELETE SET NULL,
    state_snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_checkpoints_campaign ON campaign_checkpoints(campaign_id, batch_number DESC);

-- -----------------------------------------------------------------------------
-- 5. OPENCODE MODEL REGISTRY (Dynamic Model Catalogue & Privacy Guard)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS opencode_model_registry (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'OpenCode Zen',
    tier TEXT NOT NULL DEFAULT 'Free' CHECK (tier IN ('Free', 'Pro', 'Trial', 'Enterprise')),
    is_free BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    capabilities TEXT[] NOT NULL DEFAULT '{}',
    context_window TEXT NOT NULL DEFAULT '32k',
    pricing_input NUMERIC(10,6) NOT NULL DEFAULT 0.000000,
    pricing_output NUMERIC(10,6) NOT NULL DEFAULT 0.000000,
    privacy_tier TEXT NOT NULL DEFAULT 'RESTRICTED_PERSONAL_DATA' CHECK (privacy_tier IN ('ZERO_RETENTION', 'RESTRICTED_PERSONAL_DATA', 'NO_CONFIDENTIAL_DATA')),
    description TEXT,
    last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opencode_model_free ON opencode_model_registry(is_free, is_active);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchestration_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE opencode_model_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active model registry" ON opencode_model_registry FOR SELECT USING (is_active = TRUE);

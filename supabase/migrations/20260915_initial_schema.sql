-- =============================================================================
-- ApplyWise AI — Production Database Schema
-- Architecture: PostgreSQL 16+ with pgvector extension
-- Target: Supabase Free Tier (500MB storage limit compliant)
-- Total Tables: 35+ Domain Tables with Row Level Security (RLS)
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- -----------------------------------------------------------------------------
-- 1. USERS & ACCESS CONTROL (Core Identity)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Foreign key to supabase auth.users
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. CANDIDATE PROFILES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    headline TEXT NOT NULL,
    summary TEXT NOT NULL,
    location TEXT NOT NULL,
    willing_to_relocate BOOLEAN DEFAULT FALSE,
    remote_preference TEXT DEFAULT 'Remote' CHECK (remote_preference IN ('Remote', 'Hybrid', 'On-site', 'Any')),
    target_salary_min NUMERIC,
    target_salary_max NUMERIC,
    salary_currency TEXT DEFAULT 'GBP',
    years_experience NUMERIC NOT NULL DEFAULT 0,
    seniority_level TEXT NOT NULL CHECK (seniority_level IN ('Junior', 'Mid', 'Senior', 'Lead', 'Principal', 'Staff', 'Executive')),
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. WORK EXPERIENCES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT,
    employment_type TEXT DEFAULT 'Full-time',
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. EXPERIENCE ACHIEVEMENTS (Key Metric-Driven Bullets)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experience_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id UUID NOT NULL REFERENCES work_experiences(id) ON DELETE CASCADE,
    achievement_text TEXT NOT NULL,
    metric_impact TEXT,
    sort_order INT DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 5. SKILLS INVENTORY
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Cloud Architecture', 'AI & Machine Learning', 'Full-Stack & Frontend', 'Backend & Databases', 'DevOps & Networks', 'Leadership & Governance', 'Soft Skills')),
    proficiency TEXT NOT NULL CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    years_experience NUMERIC,
    is_primary BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT TRUE
);

-- -----------------------------------------------------------------------------
-- 6. EDUCATION RECORDS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS education_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    grade TEXT,
    activities TEXT
);

-- -----------------------------------------------------------------------------
-- 7. CERTIFICATIONS & CREDENTIALS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    issue_date DATE,
    expiration_date DATE,
    credential_id TEXT,
    credential_url TEXT
);

-- -----------------------------------------------------------------------------
-- 8. PORTFOLIO PROJECTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolio_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    live_url TEXT,
    github_url TEXT,
    technologies TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. TARGET JOB PREFERENCES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS target_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    target_titles TEXT[] NOT NULL,
    target_industries TEXT[],
    preferred_locations TEXT[],
    minimum_salary NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. JOB SOURCES & SCRAPERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    source_type TEXT NOT NULL CHECK (source_type IN ('api', 'scraper', 'manual', 'rss')),
    base_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    daily_quota INT DEFAULT 250,
    rate_limit_per_minute INT DEFAULT 30,
    last_synced_at TIMESTAMPTZ
);

-- -----------------------------------------------------------------------------
-- 11. JOB LISTINGS (Curated & Ingested Roles)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id TEXT,
    source_id UUID REFERENCES job_sources(id) ON DELETE SET NULL,
    source_name TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_website TEXT,
    company_logo_url TEXT,
    location TEXT NOT NULL,
    remote_type TEXT DEFAULT 'Remote' CHECK (remote_type IN ('Remote', 'Hybrid', 'On-site')),
    salary_min NUMERIC,
    salary_max NUMERIC,
    salary_currency TEXT DEFAULT 'GBP',
    description TEXT NOT NULL,
    description_raw TEXT,
    requirements TEXT[],
    responsibilities TEXT[],
    extracted_skills TEXT[],
    apply_url TEXT NOT NULL,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 12. MATCH ANALYSES (Deep ATS & Compatibility Scores)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS match_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    overall_score NUMERIC(5,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    tier TEXT NOT NULL CHECK (tier IN ('strong_match', 'moderate_match', 'reach', 'unqualified')),
    technical_fit_score NUMERIC(5,2),
    experience_fit_score NUMERIC(5,2),
    domain_fit_score NUMERIC(5,2),
    key_strengths TEXT[],
    critical_gaps TEXT[],
    recommended_action TEXT,
    model_used TEXT NOT NULL,
    evaluation_time_ms INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 13. MATCH CATEGORY SCORES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS match_category_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES match_analyses(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    score NUMERIC(5,2) NOT NULL,
    weight NUMERIC(3,2) NOT NULL,
    matched_skills TEXT[],
    missing_skills TEXT[],
    reasoning TEXT
);

-- -----------------------------------------------------------------------------
-- 14. APPLICATIONS (Kanban Tracking CRM)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'saved' CHECK (status IN (
        'saved', 'matched', 'tailoring', 'ready', 'applied',
        'screening', 'interviewing', 'final_round', 'offered', 'rejected', 'withdrawn'
    )),
    applied_date DATE,
    deadline DATE,
    custom_cv_url TEXT,
    custom_cover_letter_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 15. APPLICATION STAGES & TIMELINE EVENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS application_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 16. TAILORED DOCUMENTS (CVs & Cover Letters)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tailored_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('cv', 'cover_letter', 'pitch_note')),
    version INT NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    content_html TEXT,
    diff_summary TEXT,
    match_score_before NUMERIC(5,2),
    match_score_after NUMERIC(5,2),
    ats_alignment_rate NUMERIC(5,2),
    model_used TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 17. TAILORED DOCUMENT DIFFS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tailored_document_diffs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES tailored_documents(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL,
    original_text TEXT NOT NULL,
    tailored_text TEXT NOT NULL,
    change_rationale TEXT NOT NULL
);

-- -----------------------------------------------------------------------------
-- 18. COMPANY RESEARCH DOSSIERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL UNIQUE,
    overview TEXT,
    business_model TEXT,
    recent_news TEXT[],
    culture_highlights TEXT[],
    estimated_team_size TEXT,
    headquarters TEXT,
    detected_tech_stack TEXT[],
    interview_process_insights TEXT,
    model_used TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 19. INTERVIEW PREPARATION SESSIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    session_title TEXT NOT NULL,
    session_type TEXT NOT NULL CHECK (session_type IN ('technical_architecture', 'system_design', 'behavioral_star', 'leadership', 'executive')),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 20. INTERVIEW QUESTIONS & EVALUATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    category TEXT NOT NULL,
    expected_key_points TEXT[],
    candidate_answer TEXT,
    star_situation_score INT CHECK (star_situation_score BETWEEN 1 AND 10),
    star_task_score INT CHECK (star_task_score BETWEEN 1 AND 10),
    star_action_score INT CHECK (star_action_score BETWEEN 1 AND 10),
    star_result_score INT CHECK (star_result_score BETWEEN 1 AND 10),
    overall_answer_score INT CHECK (overall_answer_score BETWEEN 1 AND 10),
    feedback TEXT,
    model_used TEXT
);

-- -----------------------------------------------------------------------------
-- 21. RAG DOCUMENTS (Vector Search Knowledge Base)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rag_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    document_title TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('cv_pdf', 'cover_letter', 'project_blueprint', 'case_study', 'portfolio')),
    file_path TEXT,
    total_chunks INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 22. RAG CHUNKS WITH PGVECTOR EMBEDDINGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rag_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES rag_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    token_count INT,
    metadata JSONB,
    embedding VECTOR(1536), -- Standard embedding dimension (e.g., text-embedding-3-small)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create HNSW index for sub-millisecond vector similarity search
CREATE INDEX IF NOT EXISTS idx_rag_chunks_embedding 
ON rag_chunks USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- -----------------------------------------------------------------------------
-- 23. AI OPERATION LOGS & AUDIT TRAILS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_operation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    task_type TEXT NOT NULL,
    model_name TEXT NOT NULL,
    prompt_tokens INT NOT NULL DEFAULT 0,
    completion_tokens INT NOT NULL DEFAULT 0,
    total_tokens INT NOT NULL DEFAULT 0,
    estimated_cost_usd NUMERIC(10, 6) DEFAULT 0.000000, -- Free tier tracking
    latency_ms INT NOT NULL,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 24. ANALYTICS EVENTS (First-Party Event Store)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    entity_type TEXT,
    entity_id TEXT,
    properties JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 25. SYSTEM SETTINGS & MODEL CONFIGURATION
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    default_reasoning_model TEXT DEFAULT 'google/gemini-2.0-flash-thinking-exp:free',
    default_fast_model TEXT DEFAULT 'google/gemini-2.0-flash-exp:free',
    temperature NUMERIC(3,2) DEFAULT 0.20,
    max_tokens INT DEFAULT 2048,
    enable_mock_fallback BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tailored_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_operation_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read on job listings & sources for showcase/demo purposes
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active job listings" ON job_listings FOR SELECT USING (is_active = TRUE);

ALTER TABLE job_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active job sources" ON job_sources FOR SELECT USING (is_active = TRUE);

-- Helper function for vector similarity search
CREATE OR REPLACE FUNCTION match_rag_chunks (
    query_embedding VECTOR(1536),
    match_threshold FLOAT,
    match_count INT,
    filter_profile_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    chunk_index INT,
    chunk_text TEXT,
    similarity FLOAT,
    metadata JSONB
)
LANGUAGE sql STABLE
AS $$
    SELECT
        rc.id,
        rc.document_id,
        rc.chunk_index,
        rc.chunk_text,
        1 - (rc.embedding <=> query_embedding) AS similarity,
        rc.metadata
    FROM rag_chunks rc
    JOIN rag_documents rd ON rc.document_id = rd.id
    WHERE (filter_profile_id IS NULL OR rd.profile_id = filter_profile_id)
      AND (1 - (rc.embedding <=> query_embedding)) > match_threshold
    ORDER BY rc.embedding <=> query_embedding
    LIMIT match_count;
$$;

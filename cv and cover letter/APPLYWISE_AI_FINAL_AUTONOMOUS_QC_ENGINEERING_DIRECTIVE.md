# APPLYWISE AI — AUTONOMOUS CAREER OPERATING SYSTEM
## Final QC, Correction & Full-Autonomy Engineering Directive

**Directive version:** 2.0  
**Date:** 16 September 2026  
**Project:** ApplyWise AI  
**Repository:** `whitemorengwira/applywise-ai`  
**Primary local workspace:** `D:\nwhite_job_applications_app_2027`  
**Primary production platform:** Vercel  
**Primary database / memory platform:** Supabase  
**Primary free-model platform:** OpenCode Zen free models  
**AI observability / gateway:** Cloudflare AI Gateway + Grafana  
**Workflow orchestration:** LangChain + LangGraph  
**Language:** British English

---

# 0. PURPOSE OF THIS DIRECTIVE

This document supersedes any implementation detail that conflicts with the requirements below.

The objective is no longer merely to have a polished SaaS demonstration.

**ApplyWise AI must become a genuinely operational, autonomous career operating system for Whitemore Ngwira.**

It must continuously:

1. understand Whitemore's verified professional profile;
2. preserve the approved CV as immutable source material;
3. understand the approved cover-letter style/template and generate tailored cover letters when appropriate;
4. understand the N.White Systems website as a second major evidence source;
5. maintain a persistent career knowledge/memory bank in Supabase;
6. discover fresh jobs continuously;
7. determine whether each job is genuinely eligible before considering application;
8. prioritise AI-related roles, followed by cloud/platform/DevOps/DevSecOps/infrastructure/systems/automation roles and other roles supported by the evidence base;
9. use agentic RAG and LangGraph orchestration rather than a simple LLM prompt;
10. use OpenCode Zen free models through a real model router;
11. use Cloudflare AI Gateway for AI traffic governance, telemetry, caching/rate limiting/fallback where technically compatible;
12. use Grafana to expose the operational state of the entire system;
13. use Supabase as the durable operational database and memory store;
14. use MCP/connectors for supported external systems, including Zoho where available;
15. run continuously in the cloud so the user's laptop can be completely switched off;
16. report results to Whitemore rather than requiring him to sit at the laptop;
17. maintain a recruiter-facing public ApplyWise repository without exposing the private implementation;
18. use Docker, Kubernetes, Helm and Terraform as real, functioning parts of the engineering system;
19. maintain strong observability, auditability, security and recovery;
20. never invent candidate qualifications, job eligibility, employers, application routes, application outcomes or evidence.

The target is ambitious:

> **Target up to 200 legitimate, evidence-supported applications per rolling seven-day period, subject to the actual availability of qualifying vacancies and valid application routes.**

This is a target, not a reason to weaken eligibility gates or manufacture applications.

---

# 1. CRITICAL QC FINDINGS FROM THE CURRENT REPORT

The previous Google Antigravity report demonstrates substantial engineering progress, but it is **not yet sufficient to declare the system fully autonomous**.

The report claims:

- production Vercel deployment;
- a Supabase project;
- Grafana telemetry;
- 25 domain tables;
- RLS;
- OpenCode Zen model integration;
- LangChain/LangGraph-related architecture;
- Docker;
- Kubernetes;
- Helm;
- Terraform;
- CI/CD;
- health/readiness/metrics endpoints;
- job discovery and matching;
- CV Studio;
- cover-letter generation;
- RAG;
- application CRM.

These are useful foundations.

However, the report also exposes several important contradictions and implementation risks that must now be corrected.

## 1.1 Geographic rules are wrong

The report currently states:

> South Africa: 100% Remote Only.

That is **incorrect and must be removed**.

The actual candidate rule is:

### South Africa
Whitemore is open to:
- 100% remote;
- hybrid;
- on-site.

### Zimbabwe
Open to:
- remote;
- hybrid;
- on-site.

### Malawi
Open to:
- remote;
- hybrid;
- on-site.

### Wider Africa
Prioritise opportunities that genuinely employ or contract African talent and explicitly verify geography/work-authorisation conditions.

### Global / international
Only treat a role as eligible where the employer explicitly permits:
- South African/African applicants;
- remote international work;
- contractor/B2B engagement where that is the employment model;
- or another verified arrangement compatible with Whitemore's circumstances.

Do **not** infer global eligibility merely because a job says "Remote".

The system must distinguish:

`job location != work eligibility`

A job can say "Remote" while still being US-only, UK-only, EU-only, or restricted to a specific country.

---

# 2. ABSOLUTE CV IMMUTABILITY

This is now a hard system invariant.

## 2.1 The CV must NEVER be altered by ApplyWise

The approved master CV is already considered complete and professionally acceptable.

ApplyWise must:

- ingest it;
- parse it;
- understand it;
- index it;
- embed it;
- cite it;
- analyse it;
- compare jobs against it;
- use it as evidence.

ApplyWise must **not**:

- rewrite it;
- shorten it;
- add skills;
- remove skills;
- invent achievements;
- change dates;
- change titles;
- change employers;
- change qualifications;
- alter the approved wording;
- generate a replacement CV automatically;
- silently create a "better" CV;
- submit an altered CV.

The existing CV is the **immutable candidate evidence source**.

## 2.2 Technical enforcement

Implement:

- immutable CV document record;
- SHA-256 hash of the approved CV;
- immutable source version;
- `is_master = true`;
- `immutable = true`;
- database trigger preventing mutation/deletion of the master record;
- read-only application service interface;
- automated regression test that attempts mutation and expects rejection;
- Git-protected canonical CV artefact;
- application submission records storing the exact CV hash used.

The UI may contain a CV viewer/analysis page.

It must not contain a normal "Edit CV" workflow.

If an application form requires a CV upload, upload the exact approved CV.

## 2.3 Remove misleading current functionality

The existing report references:

`/cv-studio`

and:

`tailor.service.ts`

If these currently support CV rewriting, disable that behaviour.

They may be repurposed into:

**CV Evidence & Verification**

The system may analyse which CV evidence supports a vacancy.

It may not alter the CV.

---

# 3. COVER LETTERS ARE THE TAILORABLE APPLICATION ASSET

The cover letter is the primary dynamic written asset.

For each qualifying vacancy, ApplyWise may create a tailored cover letter.

The generation pipeline must use:

1. approved cover-letter template/style;
2. immutable master CV;
3. verified candidate evidence;
4. N.White Systems website evidence;
5. verified project evidence;
6. relevant job description;
7. verified company information;
8. job-specific requirements;
9. appropriate tone and seniority.

The system must never invent evidence to make a cover letter stronger.

Every substantive claim should be traceable to a source.

Store:

- generated letter;
- source evidence IDs;
- job ID;
- model ID;
- prompt/version;
- timestamp;
- quality score;
- grounding score;
- final hash;
- application ID.

The system should maintain:

`MASTER COVER LETTER STYLE`

rather than a single fixed letter that is blindly copied.

---

# 4. CANDIDATE KNOWLEDGE / MEMORY BANK

Create a first-class persistent **Career Knowledge Bank**.

This must not merely be a collection of local Markdown files.

The canonical durable store must be Supabase.

## 4.1 Markdown remains important

Maintain human-readable Markdown knowledge files such as:

```text
memory/
├── candidate/
│   ├── identity.md
│   ├── professional-profile.md
│   ├── career-history.md
│   ├── skills.md
│   ├── education.md
│   ├── certifications.md
│   ├── projects.md
│   ├── leadership.md
│   ├── cloud-architecture.md
│   ├── ai-systems.md
│   ├── devops.md
│   ├── networking.md
│   ├── systems-engineering.md
│   ├── multimedia-production.md
│   └── evidence-boundaries.md
├── website/
│   ├── pages/
│   ├── services/
│   ├── portfolio/
│   └── claims.md
├── applications/
├── companies/
├── jobs/
├── cover-letters/
├── interview/
├── agent/
│   ├── operating-rules.md
│   ├── decisions.md
│   └── lessons-learned.md
└── system/
    ├── model-registry.md
    ├── source-registry.md
    └── invariants.md
```

These files are version controlled and synchronised.

## 4.2 Supabase is the durable memory layer

Create proper tables for:

- `knowledge_documents`
- `knowledge_sources`
- `knowledge_versions`
- `knowledge_chunks`
- `knowledge_embeddings`
- `knowledge_claims`
- `knowledge_evidence`
- `knowledge_tags`
- `knowledge_sync_runs`
- `knowledge_conflicts`
- `memory_events`

Use:

- PostgreSQL;
- pgvector;
- metadata;
- source URLs;
- source type;
- content hash;
- version;
- timestamps;
- embeddings;
- provenance.

A Markdown document should therefore flow:

```text
Markdown/source
      ↓
ingestion
      ↓
normalisation
      ↓
chunking
      ↓
embedding
      ↓
Supabase
      ↓
pgvector
      ↓
hybrid retrieval
      ↓
evidence verification
      ↓
LangGraph agent
```

---

# 5. N.WHITE SYSTEMS WEBSITE MUST BECOME A KNOWLEDGE SOURCE

The website is not merely a link placed on the CV.

It is a major professional evidence source.

The system must study:

`https://nwhite.systems/`

including, where publicly available:

- homepage;
- About;
- Services;
- Architecture/technology pages;
- AI-related pages;
- Cloud pages;
- infrastructure pages;
- portfolio;
- case studies;
- production/project pages;
- contact information;
- blog/articles;
- recruiter review route;
- multimedia portfolio;
- relevant linked resources;
- sitemap URLs.

The ingestion system must:

1. discover the sitemap;
2. crawl public pages;
3. extract meaningful text;
4. remove navigation/footer noise;
5. preserve source URL;
6. preserve page title;
7. create content hashes;
8. detect changes;
9. re-index changed pages;
10. avoid duplicates;
11. create embeddings;
12. attach evidence provenance.

Do not invent website claims.

The website may strengthen the candidate evidence base beyond the CV.

---

# 6. GITHUB KNOWLEDGE AND RECRUITER SHOWCASE

The private engineering repository must remain private.

Do not expose private source code.

Create or maintain a separate public recruiter-facing repository:

`whitemorengwira/applywise-ai`

or another verified public showcase repository if the repository already exists.

The public repository must contain only safe recruiter-facing material.

It should include:

```text
README.md
ARCHITECTURE.md
docs/
├── architecture/
├── ai-orchestration/
├── rag/
├── langgraph/
├── observability/
├── kubernetes/
├── helm/
├── terraform/
├── security/
├── testing/
└── recruiter-demo/
diagrams/
screenshots/
examples/
```

Include:

- architecture diagrams;
- data-flow diagrams;
- AI orchestration diagrams;
- RAG flow;
- LangGraph state machine;
- observability architecture;
- Kubernetes architecture;
- Helm explanation;
- Terraform architecture;
- CI/CD flow;
- security model;
- database model;
- recruiter demo instructions.

Never include:

- secrets;
- API keys;
- private candidate information beyond what is intentionally public;
- `.env`;
- service-role keys;
- private source;
- private job/application data;
- credentials;
- personal application answers.

Generate polished visual assets where useful.

The public repository is part of the **technical showreel**.

---

# 7. JOB INTELLIGENCE ENGINE

The job engine must be redesigned around **candidate-derived capability discovery**.

Do not search the web using a generic collection of job keywords.

First derive a structured candidate capability graph from:

1. immutable CV;
2. approved cover-letter material;
3. N.White Systems website;
4. verified project knowledge;
5. verified GitHub showcase;
6. explicit role catalogue.

Then generate search lanes.

## 7.1 Priority lanes

### Priority 1 — AI
Examples:

- AI Systems Architect
- AI Solutions Architect
- AI Applications Architect
- AI Engineer
- Applied AI Engineer
- Agentic AI Engineer
- AI Platform Engineer
- AI Automation Architect
- AI Product Engineer
- AI Infrastructure Engineer
- LLM Engineer
- RAG Engineer
- AI Integration Engineer
- AI/Cloud Architect
- AI Engineering Lead
- AI Technical Lead

### Priority 2 — Cloud / Platform
Examples:

- Cloud Architect
- Cloud Engineer
- Platform Engineer
- Cloud Infrastructure Engineer
- Solutions Architect
- Infrastructure Architect
- DevOps Engineer
- DevSecOps Engineer
- Cloud Security Engineer
- SRE
- Systems Architect

### Priority 3 — Systems / Automation
Examples:

- Systems Engineer
- Systems Architect
- Automation Engineer
- Technical Operations
- Technology Operations
- Platform Automation
- Integration Architect
- Technical Solutions Architect

### Priority 4 — broader supported roles

Only include roles where the candidate evidence genuinely supports the requirements.

Do not allow generic junior software-development or unrelated multimedia roles to dominate the search.

---

# 8. GEOGRAPHIC SEARCH ORDER

Every automated discovery cycle must execute in this order:

1. South Africa
2. Zimbabwe
3. Malawi
4. broader Africa
5. global/international roles explicitly open to African/South African talent

Within every geography, prioritise:

1. AI;
2. AI + cloud;
3. cloud/platform;
4. DevOps/DevSecOps;
5. infrastructure/systems;
6. automation/integration;
7. other verified high-fit roles.

The search engine must not assume that UK/USA/Europe roles accept African candidates.

---

# 9. ELIGIBILITY ENGINE

Create a dedicated `EligibilityAgent`.

This agent must evaluate separately:

### Geography
Where the employer allows the candidate to work.

### Work mode
- remote;
- hybrid;
- on-site.

### Work authorisation
- employee;
- contractor;
- B2B;
- country-specific authorisation;
- unknown.

### Candidate location compatibility
South Africa / Zimbabwe / Malawi / Africa / international.

### Application route
- DIRECT_PORTAL
- LINKEDIN_EASY_APPLY
- EMAIL
- EXTERNAL_JOB_BOARD
- RECRUITER
- UNKNOWN

### Payment gate
Any requirement to pay to apply is a hard rejection.

### Employer legitimacy
Verify company and role.

### Freshness
Verify that the role is still open.

### Duplicate detection
Do not apply twice to the same requisition.

---

# 10. DECISION STATES

Every opportunity must end up in one of these states:

- `APPLY`
- `CONSIDER`
- `VERIFY`
- `DO_NOT_APPLY`

Do not use a score alone.

A high numerical score cannot override a failed hard eligibility gate.

The UI must explain:

- why the role matched;
- which evidence supports the match;
- what eligibility evidence was found;
- what remains unknown;
- why it was rejected or held.

---

# 11. TARGET APPLICATION VOLUME

Target:

**200 legitimate qualified applications per rolling seven-day period.**

Calculate this dynamically.

Do not:

- lower the quality threshold;
- fabricate applications;
- apply to irrelevant roles;
- duplicate submissions;
- apply to expired roles;
- apply to roles with unknown eligibility merely to hit 200.

Create a daily quota dashboard:

```text
Weekly target: 200
Qualified opportunities discovered
Hard-gate passes
Tailored applications ready
Applications submitted
Applications blocked
Applications requiring review
Applications failed
Applications confirmed
Remaining target
```

The system should automatically increase/decrease search depth according to actual availability.

---

# 12. FULL AUTONOMOUS DAILY OPERATION

The system must continue operating when the user's laptop is:

- shut down;
- asleep;
- disconnected;
- unavailable.

The laptop is not the runtime.

The production control plane must run in cloud services.

## 12.1 Recommended control-plane flow

```text
Supabase Cron
      ↓
Job Discovery Edge Function
      ↓
Job Source Connectors / MCP
      ↓
Normalisation
      ↓
Deduplication
      ↓
EligibilityAgent
      ↓
CandidateMatchAgent
      ↓
CompanyResearchAgent
      ↓
Evidence/RAG Agent
      ↓
LangGraph Application Planner
      ↓
CoverLetterAgent
      ↓
Application Agent
      ↓
Verification Agent
      ↓
Audit + Supabase
      ↓
Grafana
      ↓
Daily Report
      ↓
Zoho Email
```

Use Vercel for the web application.

Use Supabase Cron/Edge Functions or another genuinely free cloud scheduler for background autonomous work.

Do not depend on a local Windows process.

---

# 13. SUPABASE CRON / BACKGROUND ORCHESTRATION

Implement persistent scheduled workflows.

Minimum schedules:

### Every 24 hours
Full vacancy discovery.

### More frequently where free limits permit
Freshness checks and application-state processing.

### Daily
Website knowledge refresh.

### Daily
AI/model health check.

### Daily
Application reconciliation.

### Daily
Marketing/content planning.

### Weekly
Career analytics.

The system must record every run:

- run ID;
- start time;
- end time;
- status;
- jobs discovered;
- jobs rejected;
- applications submitted;
- failures;
- models used;
- tokens;
- estimated cost;
- retries;
- fallback events.

---

# 14. REAL AGENTIC ORCHESTRATION

LangChain and LangGraph must be **genuinely used**, not listed only in documentation.

Build explicit graph workflows.

Example:

```text
START
  ↓
LOAD_CANDIDATE_CONTEXT
  ↓
LOAD_JOB
  ↓
CHECK_FRESHNESS
  ↓
CHECK_GEOGRAPHY
  ↓
CHECK_WORK_AUTHORISATION
  ↓
CHECK_MANDATORY_REQUIREMENTS
  ↓
RETRIEVE_CANDIDATE_EVIDENCE
  ↓
EVALUATE_EVIDENCE
  ↓
RESEARCH_COMPANY
  ↓
DECIDE
 ├── DO_NOT_APPLY
 ├── VERIFY
 ├── CONSIDER
 └── APPLY
          ↓
      GENERATE_COVER_LETTER
          ↓
      VERIFY_GROUNDING
          ↓
      VERIFY_CV_HASH
          ↓
      PREPARE_APPLICATION
          ↓
      SUBMIT
          ↓
      CAPTURE_PROOF
          ↓
      RECONCILE
          ↓
        END
```

Each node must have:

- typed state;
- clear input;
- clear output;
- retry policy;
- timeout;
- error state;
- telemetry;
- audit record.

---

# 15. MODEL ORCHESTRATION — NO OPENROUTER

This is a critical correction.

**OpenRouter is NOT part of the approved architecture.**

Remove/disable:

- `OPENROUTER_API_KEY`;
- OpenRouter references;
- OpenRouter primary routing;
- OpenRouter fallback;
- OpenRouter documentation;
- OpenRouter UI references;
- OpenRouter telemetry labels.

**Gemini is also NOT a primary provider.**

Do not silently replace OpenRouter with Gemini.

## 15.1 OpenCode Zen is the primary free-model layer

Use OpenCode Zen's current verified model catalogue dynamically.

As of the current official OpenCode Zen documentation, free models include:

- Big Pickle;
- MiMo-V2.5 Free;
- Ling 3.0 Flash Fin Free;
- Nemotron 3 Ultra Free;
- Nemotron 3.5 Lightning Free;
- Muse Spark 1.3 Contributor Free.

Do not hard-code stale identifiers.

At startup, fetch/verify the current model catalogue where possible.

Use model capability metadata:

```text
reasoning
fast-extraction
long-context
structured-output
creative-writing
classification
agent/tool-use
multimodal
```

Route tasks by capability.

## 15.2 Free-only enforcement

Create:

`FREE_ONLY_MODE=true`

When enabled:

- paid OpenCode Zen models are disabled;
- OpenAI paid API calls are disabled;
- Gemini paid/credit APIs are disabled;
- OpenRouter is disabled;
- paid fallback is disabled;
- automatic billing is disabled;
- automatic credit purchases are disabled.

If all free models are unavailable:

**fail closed and queue the task.**

Do not silently incur a charge.

---

# 16. CLOUDFLARE AI GATEWAY

Add Cloudflare AI Gateway as the AI traffic control and observability layer.

Cloudflare currently documents AI Gateway core functionality as available on all plans, including analytics, caching, rate limiting, logging and request retry/fallback features.

Implement it where the selected provider/API path is technically compatible.

Required telemetry:

- requests;
- successful requests;
- failures;
- latency;
- input tokens;
- output tokens;
- model;
- provider;
- cache hits;
- cache misses;
- retries;
- fallbacks;
- errors;
- estimated cost.

Do not use Cloudflare Unified Billing if it requires purchased credits.

The system must remain in free-only mode.

---

# 17. TOKEN AND MODEL DASHBOARD

Build a first-class AI Operations dashboard.

Display:

- total AI requests;
- requests per model;
- input tokens;
- output tokens;
- total tokens;
- average tokens/request;
- latency;
- error rate;
- fallback rate;
- retry rate;
- cache hit rate;
- free-model usage;
- blocked paid requests;
- model availability;
- model health;
- estimated cost;
- actual billed cost if applicable.

Grafana must receive the same telemetry.

---

# 18. SUPABASE DATABASE — PRODUCTION DATA MODEL

The current 25-table schema is a starting point, not proof of complete autonomy.

Verify and extend it.

At minimum, ensure durable entities exist for:

```text
candidate_profile
candidate_evidence
candidate_skills
candidate_projects
candidate_documents
cv_master
cover_letter_templates
cover_letters
knowledge_documents
knowledge_chunks
knowledge_embeddings
knowledge_claims
knowledge_sources
jobs
job_sources
companies
job_requirements
job_eligibility
job_matches
applications
application_events
application_answers
application_proofs
application_failures
application_reviews
interviews
agent_runs
agent_steps
agent_states
agent_messages
model_registry
model_runs
model_usage
gateway_events
rag_queries
rag_retrievals
audit_events
scheduler_runs
email_reports
social_accounts
social_posts
social_metrics
github_showcase_assets
```

Use UUIDs, foreign keys, timestamps, constraints, indexes and RLS.

---

# 19. RLS AND SECURITY

RLS must be tested, not merely enabled.

Create positive and negative tests.

Prove that:

- candidate data is isolated;
- applications are isolated;
- private knowledge is not public;
- service-role operations are server-side only;
- public recruiter documentation cannot expose private records;
- secrets never reach browser bundles;
- job data is not accidentally exposed as candidate PII;
- application answers are protected.

---

# 20. ZOHO EMAIL MCP / CONNECTOR

Whitemore's official business email is the primary application email.

Use the supported Zoho connector/MCP if available.

Do not invent a connector.

First discover the available Zoho MCP/connector actions.

The email agent must be able to:

1. identify jobs requiring email applications;
2. retrieve verified employer/application email;
3. generate a tailored email;
4. attach the exact approved CV;
5. attach the appropriate cover letter if required;
6. save a draft;
7. record the draft in Supabase;
8. send only through the configured authorised workflow;
9. capture send confirmation;
10. store message metadata.

Every email application must have:

- job ID;
- recipient;
- subject;
- body;
- attachments;
- source evidence;
- timestamp;
- send/draft status;
- message ID where available.

Never guess an email address.

---

# 21. JOB PORTAL MCP CONNECTORS

Do not assume that every job portal provides an MCP server.

Implement a connector registry:

```text
source
provider
capabilities
search
job-details
eligibility
application
status
MCP-supported
API-supported
browser-supported
manual-required
```

Use official APIs/MCP/connectors where genuinely available.

If a portal has no supported MCP/API:

- do not fabricate one;
- mark the source accordingly;
- use an approved browser workflow only where permitted;
- otherwise classify as manual.

Respect:

- terms of service;
- rate limits;
- authentication;
- CAPTCHA;
- anti-bot controls;
- privacy requirements.

Never bypass security controls.

---

# 22. APPLICATION AGENT

The application agent must:

1. receive only `APPLY` opportunities;
2. retrieve immutable CV;
3. verify CV hash;
4. generate or retrieve tailored cover letter;
5. answer application questions only from verified evidence;
6. never invent demographic/legal/work-authorisation information;
7. never invent salary history;
8. never invent references;
9. never upload an altered CV;
10. submit through the verified route;
11. capture confirmation;
12. write the application event to Supabase;
13. update Grafana metrics;
14. update the daily report.

Unknown questions go to:

`VERIFY`

not hallucinated answers.

---

# 23. APPLICATION QUALITY GATE

Before submission:

```text
JOB STILL OPEN?
        ↓ YES
EMPLOYER VERIFIED?
        ↓ YES
GEOGRAPHY VERIFIED?
        ↓ YES
WORK AUTHORISATION VERIFIED?
        ↓ YES
MANDATORY REQUIREMENTS SUPPORTED?
        ↓ YES
NO PAYMENT REQUIRED?
        ↓ YES
NO DUPLICATE?
        ↓ YES
CV HASH VERIFIED?
        ↓ YES
COVER LETTER GROUNDED?
        ↓ YES
APPLICATION ROUTE VERIFIED?
        ↓ YES
NO UNSAFE UNKNOWN QUESTIONS?
        ↓ YES
SUBMIT
```

Every rejection must have a machine-readable reason.

---

# 24. COMPANY INTELLIGENCE AGENT

For qualifying jobs, research:

- company;
- official website;
- industry;
- product/service;
- technology signals;
- location;
- hiring model;
- role context;
- recent company information;
- relevant engineering/AI initiatives;
- likely role relevance.

Use official/company sources where possible.

Store company research in the knowledge bank with timestamps.

Do not use speculative claims as facts.

---

# 25. WEBSITE + CV + JOB THREE-WAY REASONING

Matching must not be:

`job keywords → LLM → score`

It must be:

```text
JOB
 ↓
REQUIREMENTS
 ↓
CANDIDATE CAPABILITY GRAPH
 ├── CV evidence
 ├── Website evidence
 ├── Project evidence
 ├── GitHub evidence
 ├── Cover-letter evidence
 └── Verified career memory
 ↓
RAG
 ↓
EVIDENCE EVALUATION
 ↓
ELIGIBILITY
 ↓
FIT
 ↓
APPLICATION DECISION
```

This is the core intelligence of ApplyWise.

---

# 26. SOCIAL MEDIA / MARKETING AGENT

Create a separate **N.White Systems Growth Agent**.

Its purpose is not merely job searching.

It should help increase visibility of:

- Whitemore Ngwira;
- N.White Systems;
- ApplyWise AI;
- technical architecture work;
- AI systems work;
- cloud engineering;
- production engineering;
- recruiter-facing technical demonstrations.

## 26.1 Social account registry

Store:

- platform;
- profile URL;
- account ID;
- API capability;
- read capability;
- posting capability;
- analytics capability;
- credential state.

The Linktree/social links referenced by the N.White Systems website should be discovered and mapped.

## 26.2 Metrics

Where platform APIs legally expose them, track:

- profile views;
- post impressions;
- reach;
- engagement;
- clicks;
- follower growth;
- website referral traffic.

Send these to Grafana.

## 26.3 Posting

Create a content agent that can:

- propose posts;
- generate posts from verified website/project knowledge;
- generate technical content;
- promote relevant N.White Systems content;
- generate recruiter-facing technical insights.

No fabricated client claims.

No fake metrics.

No fake testimonials.

No invented project outcomes.

Only publish automatically on platforms where the authorised account/API permits automated publishing.

---

# 27. HUBSPOT

Where the existing HubSpot connection is available, integrate it.

Track:

- recruiter leads;
- employer contacts;
- application opportunities;
- follow-ups;
- company research;
- engagement;
- source;
- pipeline status.

Use HubSpot as a CRM/reporting surface, not as a replacement for Supabase's operational database.

---

# 28. EMAIL REPORTING

The autonomous system must send a daily report to Whitemore's official business email.

Report:

```text
APPLYWISE DAILY AUTONOMOUS REPORT

Date
Run status

JOBS
- discovered
- new
- duplicate
- expired
- rejected
- eligible
- applied

APPLICATIONS
- submitted
- confirmed
- failed
- pending
- verification required

TOP AI ROLES
- title
- company
- location
- eligibility
- application method
- status

MODEL OPERATIONS
- models used
- tokens
- failures
- fallbacks
- latency
- blocked paid calls

KNOWLEDGE
- CV integrity
- website pages refreshed
- knowledge records updated

MARKETING
- posts created
- posts published
- website traffic
- social growth

ISSUES
- failures
- manual actions required

WEEKLY TARGET
- 200 target
- current count
- remaining
```

---

# 29. GRAFANA — EXECUTIVE COMMAND CENTRE

Build/verify dashboards:

### 01 — Application Overview
- jobs;
- applications;
- success;
- failures;
- weekly target.

### 02 — AI Operations
- models;
- tokens;
- latency;
- errors;
- fallback.

### 03 — RAG & Agentic Intelligence
- retrieval;
- grounding;
- graph runs;
- node latency;
- failed nodes.

### 04 — Infrastructure
- Vercel;
- Docker;
- Kubernetes;
- pods;
- HPA;
- health.

### 05 — Database
- Supabase;
- query latency;
- storage;
- knowledge records;
- application records.

### 06 — Career Intelligence
- role lanes;
- geography;
- eligibility;
- match distribution;
- AI-role percentage.

### 07 — Marketing
- social traffic;
- website traffic;
- referral sources;
- follower growth.

### 08 — Autonomous Operations
- scheduler runs;
- queue depth;
- agent state;
- retries;
- failures;
- last successful run.

---

# 30. PROMETHEUS METRICS

Expose low-cardinality metrics.

Examples:

```text
applywise_jobs_discovered_total
applywise_jobs_eligible_total
applywise_jobs_rejected_total
applywise_applications_submitted_total
applywise_applications_confirmed_total
applywise_applications_failed_total
applywise_ai_requests_total
applywise_ai_tokens_input_total
applywise_ai_tokens_output_total
applywise_ai_request_duration_seconds
applywise_ai_errors_total
applywise_ai_fallbacks_total
applywise_rag_queries_total
applywise_rag_retrieval_duration_seconds
applywise_langgraph_runs_total
applywise_langgraph_failures_total
applywise_scheduler_runs_total
applywise_scheduler_failures_total
applywise_social_posts_total
applywise_social_engagement_total
```

Do not put job titles, emails, candidate names or URLs into Prometheus labels.

---

# 31. DOCKER / KUBERNETES / HELM / TERRAFORM

These technologies must be operational, not decorative.

## Docker

Verify:

- reproducible build;
- multi-stage image;
- non-root runtime;
- healthcheck;
- environment configuration;
- no secrets;
- minimal image.

## Kubernetes

Verify:

- Deployment;
- Service;
- HPA;
- NetworkPolicy;
- readiness;
- liveness;
- resource requests/limits;
- secret handling;
- rollback.

## Helm

Verify:

```bash
helm lint
helm template
```

and perform a real deployment test where a free Kubernetes environment is available.

## Terraform

Verify:

```bash
terraform fmt -check
terraform validate
terraform plan
```

Do not invent provider resources.

Use actual provider capabilities.

---

# 32. FREE-TIER REQUIREMENT

The target architecture is **$0 recurring platform cost**.

The implementation must explicitly identify the free allowance for every external service.

Create:

`docs/free-tier-matrix.md`

Columns:

```text
Service
Purpose
Free allowance
Current usage
Remaining allowance
Hard limit
Paid-trigger risk
Automatic billing disabled?
Fallback
```

No hidden paid services.

No automatic credit purchases.

No paid model fallback.

No "free" architecture that silently requires a credit card charge.

Where a free service has quotas, expose the quota state in Grafana.

---

# 33. IMPORTANT FREE-TIER REALITY

Do not falsely claim that every component has unlimited free capacity.

Examples of current platform constraints must be treated as operational constraints.

Supabase's Free plan currently includes limited database/storage/egress capacity and can pause inactive projects.

Cloudflare AI Gateway currently provides core gateway functionality on all plans, but third-party model inference may still carry provider charges if paid models are selected.

OpenCode Zen's free models are documented as free but some are available on a limited-time basis.

Therefore:

> **FREE_ONLY_MODE must be an enforced technical policy, not merely a statement in README documentation.**

---

# 34. AUTONOMOUS RECOVERY

Implement:

- retry;
- exponential backoff;
- circuit breaker;
- dead-letter queue;
- idempotency key;
- run lease;
- heartbeat;
- checkpoint;
- reconciliation.

If the system stops halfway through a 200-job campaign:

It must resume from the persisted state.

It must not restart from zero.

Create:

`context/autonomous-execution-state.md`

with:

```text
current_run
last_successful_run
current_phase
queue_depth
jobs_discovered
jobs_eligible
applications_submitted
applications_confirmed
last_job_id
last_application_id
last_error
retry_count
next_scheduled_run
```

---

# 35. AGENT SKILLS MUST BE ACTIVE BY DEFAULT

The existing skills are not documentation only.

The following skills must be invoked/loaded by default:

```text
architect
review
imprint
recover
remember
```

Add specialist skills:

```text
candidate-evidence
cv-integrity
job-discovery
job-eligibility
job-matching
company-research
cover-letter
application
zoho-email
rag
langgraph-orchestration
model-routing
observability
marketing
github-showcase
free-tier-governance
```

The agent must verify the relevant skills before executing major work.

---

# 36. SKILL EXECUTION POLICY

Every significant autonomous run should follow:

```text
remember
  ↓
load invariants
  ↓
architect
  ↓
discover
  ↓
retrieve evidence
  ↓
execute
  ↓
review
  ↓
verify
  ↓
remember
```

If an agent reports completion without evidence, the reviewer agent must reject the completion state.

---

# 37. TESTING REQUIREMENTS

Add end-to-end tests for:

### CV
- master CV cannot mutate;
- CV hash remains constant.

### Job discovery
- duplicate jobs rejected;
- stale jobs rejected;
- paid application rejected;
- unsupported geography rejected.

### Eligibility
- SA hybrid accepted;
- SA on-site accepted;
- SA remote accepted;
- Zimbabwe remote/hybrid/on-site accepted;
- Malawi remote/hybrid/on-site accepted;
- US-only role rejected/held;
- UK-only role rejected/held;
- global remote with explicit Africa acceptance accepted.

### AI
- free-only enforcement;
- paid model call blocked;
- OpenRouter blocked;
- Gemini blocked;
- OpenCode Zen routing works;
- fallback works;
- no hallucinated evidence.

### RAG
- correct evidence retrieved;
- citations stored;
- unsupported claim rejected.

### Application
- exact CV uploaded;
- correct cover letter used;
- application proof recorded;
- duplicate application prevented.

### Scheduler
- laptop-independent scheduled run;
- idempotency;
- retry;
- resume.

### Email
- Zoho draft created;
- correct recipient;
- correct attachment;
- send state recorded.

### Marketing
- only approved account;
- only verified claims;
- analytics recorded.

---

# 38. LIVE ACCEPTANCE TEST

Do not declare this system autonomous until a live test proves:

```text
1. Laptop switched off
2. Scheduled cloud run starts
3. Fresh jobs discovered
4. Jobs stored in Supabase
5. Eligibility evaluated
6. Candidate evidence retrieved
7. AI model selected
8. Cloudflare gateway telemetry recorded
9. LangGraph workflow executes
10. Cover letter generated
11. CV hash verified unchanged
12. Application prepared
13. Application submitted through supported route
14. Proof captured
15. Supabase updated
16. Grafana updated
17. Daily report generated
18. Zoho report/draft delivered
```

At least one complete live end-to-end application should be demonstrated.

---

# 39. CV INTEGRITY ACCEPTANCE TEST

Before and after the entire autonomous campaign:

```text
SHA256(master_cv_before)
=
SHA256(master_cv_after)
```

If the hash changes:

**STOP ALL APPLICATION AUTOMATION.**

This is a P0 failure.

---

# 40. NO HALLUCINATION POLICY

The following must never be invented:

- job;
- employer;
- URL;
- recruiter;
- email address;
- work authorisation;
- location;
- salary;
- candidate skill;
- candidate achievement;
- qualification;
- employment date;
- project;
- application outcome;
- company fact.

When unknown:

`UNKNOWN`

When verification is needed:

`VERIFY`

Never turn uncertainty into confidence.

---

# 41. AUTONOMOUS MARKETING SAFETY

The marketing agent may only publish:

- verified technical information;
- verified project information;
- approved professional positioning;
- genuine educational content;
- genuine website/project references.

Do not manufacture:

- clients;
- revenue;
- traffic;
- followers;
- awards;
- partnerships;
- testimonials;
- case-study results.

---

# 42. DAILY OPERATIONAL PRIORITY

Every daily run should use this sequence:

```text
A. HEALTH CHECK
B. LOAD MEMORY
C. VERIFY CV HASH
D. REFRESH WEBSITE KNOWLEDGE
E. DISCOVER JOBS
F. DEDUPLICATE
G. VERIFY ELIGIBILITY
H. PRIORITISE AI ROLES
I. MATCH CANDIDATE
J. RESEARCH COMPANIES
K. GENERATE COVER LETTERS
L. SUBMIT QUALIFIED APPLICATIONS
M. RECONCILE RESULTS
N. UPDATE CRM
O. UPDATE GRAFANA
P. UPDATE SOCIAL/WEBSITE MARKETING
Q. GENERATE REPORT
R. CHECK WEEKLY 200 TARGET
S. PERSIST STATE
```

---

# 43. IMPLEMENTATION ORDER

Do not randomly rewrite the application.

Execute in this order:

## Phase A — Repository QC
Read:

- `AGENTS.md`;
- all `.agents/skills`;
- `context/*`;
- ADRs;
- architecture;
- build plan;
- current report;
- master job-search documents.

Determine actual versus claimed implementation.

## Phase B — Candidate truth layer
Implement:

- immutable CV;
- evidence ledger;
- knowledge bank;
- website ingestion;
- cover-letter template;
- candidate capability graph.

## Phase C — Supabase
Verify/extend:

- schema;
- RLS;
- pgvector;
- memory;
- scheduler;
- audit.

## Phase D — AI
Implement:

- OpenCode Zen registry;
- model router;
- Cloudflare AI Gateway;
- free-only enforcement;
- token accounting.

## Phase E — Agentic orchestration
Implement:

- LangChain;
- LangGraph;
- explicit state machines;
- recovery;
- audit.

## Phase F — Job intelligence
Implement:

- sources;
- discovery;
- geography;
- eligibility;
- matching;
- company intelligence.

## Phase G — Applications
Implement:

- portal connectors;
- MCP registry;
- Zoho;
- cover letters;
- application submission;
- proof.

## Phase H — Observability
Implement:

- Prometheus;
- Grafana;
- AI metrics;
- application metrics;
- scheduler metrics;
- marketing metrics.

## Phase I — Marketing
Implement:

- social account registry;
- analytics;
- content agent;
- approved automated publishing.

## Phase J — Recruiter showcase
Create:

- public GitHub repo;
- diagrams;
- screenshots;
- architecture docs;
- technical demo.

## Phase K — Production autonomy
Run the live acceptance test.

---

# 44. GIT / DOCUMENTATION REQUIREMENTS

Every major implementation phase must produce:

1. code;
2. tests;
3. documentation;
4. architecture update;
5. execution-state update;
6. Git checkpoint.

Do not merely create a Markdown report saying something works.

The implementation must prove it works.

---

# 45. REQUIRED REPORT AFTER EXECUTION

When complete, produce:

`docs/APPLYWISE_AUTONOMOUS_PRODUCTION_QC_REPORT.md`

Include:

- what was implemented;
- what was verified;
- what was tested;
- live URLs;
- Supabase verification;
- Grafana verification;
- Cloudflare verification;
- OpenCode Zen verification;
- LangChain verification;
- LangGraph verification;
- job source verification;
- MCP connector verification;
- Zoho verification;
- CV hash;
- website knowledge count;
- memory-bank count;
- applications submitted;
- application confirmations;
- weekly target status;
- social metrics;
- free-tier status;
- unresolved issues.

Every claim must include evidence.

---

# 46. FINAL DEFINITION OF DONE

ApplyWise AI is complete only when all of the following are true:

- [ ] CV is immutable.
- [ ] CV hash protection is active.
- [ ] Cover letters can be tailored.
- [ ] Cover-letter generation is grounded.
- [ ] N.White Systems website is indexed.
- [ ] Career memory bank is persisted in Supabase.
- [ ] Markdown memory files are synchronised.
- [ ] pgvector retrieval is live.
- [ ] RAG is live.
- [ ] Agentic RAG is live.
- [ ] LangChain is genuinely used.
- [ ] LangGraph is genuinely used.
- [ ] OpenCode Zen is the approved free-model layer.
- [ ] OpenRouter is completely removed from the runtime path.
- [ ] Gemini is not a primary provider.
- [ ] Paid inference is technically blocked.
- [ ] Cloudflare AI Gateway is configured where compatible.
- [ ] Token usage is visible.
- [ ] Grafana receives live telemetry.
- [ ] Supabase receives live operational data.
- [ ] Scheduled cloud execution works with laptop off.
- [ ] Jobs are discovered automatically.
- [ ] AI jobs receive priority.
- [ ] South Africa supports remote/hybrid/on-site.
- [ ] Zimbabwe supports remote/hybrid/on-site.
- [ ] Malawi supports remote/hybrid/on-site.
- [ ] Global roles require verified Africa/South Africa eligibility.
- [ ] Paid job portals are rejected.
- [ ] Duplicate applications are blocked.
- [ ] Zoho integration is functional where supported.
- [ ] Job-portal MCP/API connectors are genuinely connected where available.
- [ ] Unknown application questions are held rather than hallucinated.
- [ ] Application proof is recorded.
- [ ] Daily email report works.
- [ ] HubSpot integration works where connected.
- [ ] Social analytics are visible where APIs permit.
- [ ] Marketing automation uses verified content only.
- [ ] Docker works.
- [ ] Kubernetes manifests work.
- [ ] Helm works.
- [ ] Terraform validates/plans.
- [ ] CI/CD works.
- [ ] Recovery works.
- [ ] Resume-from-checkpoint works.
- [ ] Recruiter public repository is safe and polished.
- [ ] Live end-to-end autonomous test succeeds.
- [ ] Laptop can be shut down without stopping the autonomous control plane.

---

# 47. MOST IMPORTANT OPERATING PRINCIPLE

Do not build ApplyWise as:

> "a form that sends prompts to an AI model."

Build it as:

> **a persistent, observable, evidence-grounded, autonomous career operating system.**

The intelligence must come from the combination of:

**candidate truth + website knowledge + career memory + job intelligence + eligibility reasoning + RAG + LangGraph orchestration + model routing + application automation + observability + recovery.**

The CV is immutable.

The cover letter is adaptive.

The knowledge base grows.

The job intelligence improves.

The system learns from outcomes.

The infrastructure keeps running.

The laptop is not required.

The system reports what it did.

And every important action must leave an auditable trail.

---

# 48. EXECUTION COMMAND TO GOOGLE ANTIGRAVITY

Before changing code:

1. Read this entire directive.
2. Read the current ApplyWise architecture and implementation.
3. Read all existing agent skills.
4. Read the authoritative job-search role catalogue.
5. Read the authoritative AI job-search master prompt.
6. Read the current CV and approved cover-letter material.
7. Inspect the existing Supabase schema.
8. Inspect the existing Grafana dashboards.
9. Inspect the existing AI gateway.
10. Inspect the current OpenCode Zen implementation.
11. Inspect the current job discovery implementation.
12. Inspect the current application pipeline.
13. Inspect all existing MCP/connector capabilities.
14. Inspect Git history and current working tree.

Then create a machine-readable gap report:

```text
CLAIMED
IMPLEMENTED
PARTIALLY IMPLEMENTED
SIMULATED
NOT IMPLEMENTED
BLOCKED
VERIFIED LIVE
```

Do not assume the previous report is correct simply because it says "verified".

Then implement the missing capabilities.

Do not destroy working functionality.

Do not restart the project.

Do not replace architecture merely for cosmetic reasons.

**Enhance, harden, connect and verify.**

If a platform integration genuinely does not exist, document it as:

`NOT AVAILABLE — VERIFIED`

rather than inventing an MCP server.

If a free model is unavailable, document:

`FREE MODEL UNAVAILABLE — QUEUED`

rather than silently selecting a paid model.

If job eligibility is unknown:

`UNKNOWN — VERIFY`

rather than applying.

If the application cannot be proven submitted:

`SUBMISSION UNVERIFIED`

rather than counting it.

---

# 49. PERSISTENT AUTONOMY RULE

This project is a long-running engineering engagement.

If Antigravity encounters:

- server errors;
- tool interruptions;
- browser failures;
- MCP failures;
- provider rate limits;
- model failures;
- terminal interruptions;
- network errors;

**resume from the persisted execution state.**

Do not restart.

Do not skip unfinished work.

Do not mark a phase complete because a report was written.

The filesystem, Supabase state, external platform state, tests and Git history are the source of truth.

---

# 50. FINAL SUCCESS CONDITION

The desired user experience is extremely simple:

> **Whitemore switches off his laptop.**

ApplyWise continues running.

Every day it:

- studies new jobs;
- filters them against the real candidate profile;
- prioritises AI opportunities;
- verifies geography;
- verifies eligibility;
- researches companies;
- retrieves evidence;
- creates grounded cover letters;
- submits qualified applications through supported channels;
- records proof;
- monitors outcomes;
- updates the CRM;
- tracks tokens/models;
- monitors infrastructure;
- markets N.White Systems;
- reports everything by email;
- and remains ready for the next day.

Whitemore should not have to operate the machine for the system to operate.

That is the required level of autonomy.

**Do not declare this achieved until it has been demonstrated live.**

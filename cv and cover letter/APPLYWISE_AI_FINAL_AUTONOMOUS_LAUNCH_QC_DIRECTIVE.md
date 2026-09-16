# APPLYWISE AI — FINAL AUTONOMOUS LAUNCH, QC & OPERATIONS DIRECTIVE
## Post-Antigravity Feedback Review → Final Hardening → Dry Run → Official Launch

**Date:** 16 September 2026  
**Project:** ApplyWise AI  
**Local workspace:** `D:\nwhite_job_applications_app_2027`  
**Authoritative CV:** `D:\nwhite_job_applications_app_2027\cv and cover letter\whitemore_ngwira_cv_n.white.pdf`  
**Primary production platform:** Vercel  
**Primary database/memory:** Supabase PostgreSQL + pgvector  
**Primary free-model layer:** OpenCode Zen  
**AI gateway/observability:** Cloudflare AI Gateway where genuinely compatible and verified  
**Observability:** Prometheus + Grafana  
**Agent discipline:** JSM Agent Skills + ApplyWise-specific operational skills

---

# 1. PURPOSE OF THIS DIRECTIVE

This is the **final execution directive after reviewing the latest Google Antigravity feedback**.

The objective is no longer to keep adding features indefinitely.

The objective is now:

> **FINISH → QC THE ENTIRE SYSTEM → HARDEN → DRY RUN → VERIFY → OFFICIALLY LAUNCH → OPERATE AUTONOMOUSLY**

Do not start another open-ended feature-building cycle.

The system must now transition from **engineering/build mode** into **production operations mode**, with only genuine blockers, defects, security issues, missing integrations, incorrect claims, or required hardening being fixed.

The final target is a real autonomous AI career/job-application operating system that can continuously discover, qualify, research, prepare and — where the configured application policy permits — submit legitimate high-fit jobs without depending on the laptop being powered on.

---

# 2. CRITICAL FIRST RULE — LOAD ALL SKILLS BEFORE ANY NEW WORK

## THIS MUST HAPPEN FIRST.

Before changing a single file, running migrations, changing configuration, deploying, or starting a new task:

### A. Load and read the complete existing skill system

Read:

`D:\nwhite_job_applications_app_2027\.agents\skills`

Do not merely list the directory.

Open and read **every applicable `SKILL.md`**.

The agent must load the skills into its active working context before performing new work.

At minimum, explicitly load and apply:

- `architect`
- `review`
- `remember`
- `recover`
- `imprint`
- `cv-integrity`
- `candidate-evidence`
- `job-discovery`
- `job-eligibility`
- `job-matching`
- `company-research`
- `cover-letter`
- `application`
- `zoho-email`
- `rag`
- `langgraph-orchestration`
- `model-routing`
- `observability`
- `marketing`
- `github-showcase`
- `free-tier-governance`

If additional skills exist, read those too.

### B. Read the project governance/context files

Before implementation, read:

- `AGENTS.md`
- `context/progress-tracker.md`
- `context/architecture.md`
- `context/code-standards.md`
- `context/autonomous-execution-state.md`
- all relevant ADR/spec/context files
- the final autonomous QC engineering directive
- current production-launch state
- current Git status/history

### C. Apply the JSM engineering discipline

The project must continue adhering to the official JSM methodology:

`/architect → Build → /review → Ship`

with:

- `/remember` at session start/end;
- `/recover` when failures occur;
- `/imprint` after meaningful UI changes;
- `/review` after every major correction;
- context/state persisted to disk.

The JSM skill repository remains authoritative:

`https://github.com/jsmastery-pro/jsm-agent-skill`

The newer JSM skills/workflow should also be researched and considered where useful, but **do not replace the existing JSM methodology blindly**.

---

# 3. IMPORTANT QC OF THE PREVIOUS ANTIGRAVITY REPORT

The previous report is encouraging, but several statements must NOT automatically be accepted as proof.

The agent must distinguish:

- `IMPLEMENTED`
- `CONNECTED`
- `VERIFIED LIVE`
- `SCHEDULED`
- `AUTONOMOUS`
- `SIMULATED`
- `BLOCKED`
- `REQUIRES USER ACTION`

A successful unit test is not proof of production operation.

A successful manual curl against a cron endpoint is not proof that the scheduler is actually invoking it.

A generated Grafana dashboard JSON is not proof that Grafana is receiving real telemetry.

A model list in `/api/health` is not proof that the models can actually execute real production requests.

A LangGraph graph existing in source is not proof that a real autonomous job workflow is traversing it.

A job-search service existing in source is not proof that real recently-posted jobs are being discovered.

Therefore, perform a **claims-versus-evidence audit** before declaring launch.

---

# 4. THE ACTUAL PRODUCTION GOAL

The operating target is:

## UP TO 200 HIGH-FIT, RECENTLY POSTED JOBS PER ROLLING 7-DAY PERIOD

The target is **200 qualified opportunities/applications**, not 200 random jobs.

Do NOT lower quality to hit 200.

Do NOT fabricate jobs.

Do NOT apply to stale jobs.

Do NOT duplicate jobs.

Do NOT submit to jobs for which eligibility is unknown when the unknown is material.

If only 34 legitimate high-fit opportunities exist, process 34.

The number 200 is a **capacity target**, not permission to compromise candidate quality.

---

# 5. RECENTLY POSTED IS A HARD REQUIREMENT

The job engine must prioritise genuinely recent vacancies.

Store at minimum:

- `posted_at`
- `updated_at`
- `closing_at` where available
- `first_seen_at`
- `last_seen_at`
- `source`
- `source_url`
- `canonical_url`
- `employer`
- `title`

Create an explicit freshness policy.

Suggested default:

### Preferred
Jobs posted within the last **7 days**.

### Acceptable
Jobs posted within the last **14 days**, where the vacancy remains clearly active.

### Review
Jobs older than 14 days where the source confirms the role remains open.

### Reject from normal autonomous application queue
Jobs whose age/freshness cannot be established or which appear stale/closed/reposted without reliable current evidence.

Do not pretend a job is recent because a page was crawled recently.

**Page crawl time ≠ job posting time.**

---

# 6. HIGH-FIT MATCHING MUST BE EVIDENCE-BASED

The system must assess the complete candidate:

### Candidate truth

- immutable master CV;
- verified candidate evidence;
- N.White Systems website;
- public portfolio/project evidence;
- approved professional context;
- career direction.

### Job truth

- actual job description;
- employer;
- role;
- seniority;
- location;
- work mode;
- technical requirements;
- authorisation requirements;
- application route;
- freshness.

### Company truth

- verified company identity;
- official website;
- role/company context;
- public evidence where useful.

The system must not use superficial keyword overlap as the sole match mechanism.

---

# 7. GEOGRAPHIC ELIGIBILITY — ABSOLUTE RULE

## SOUTH AFRICA

Eligible work modes:

- Remote
- Hybrid
- On-site

## ZIMBABWE

Eligible work modes:

- Remote
- Hybrid
- On-site

## MALAWI

Eligible work modes:

- Remote
- Hybrid
- On-site

## WIDER AFRICA

Prioritise employers genuinely employing African talent.

## GLOBAL

Only process if the vacancy explicitly permits the candidate to work from South Africa/Africa or otherwise establishes legitimate eligibility.

Never interpret:

`Remote`

as:

`Worldwide`

US-only, UK-only and EU-only restrictions must not be treated as automatically eligible.

Unknown eligibility:

`VERIFY`

---

# 8. CANDIDATE CV — NEVER CHANGE IT

The only approved CV is:

`D:\nwhite_job_applications_app_2027\cv and cover letter\whitemore_ngwira_cv_n.white.pdf`

It is immutable.

Do not:

- rewrite it;
- tailor it;
- regenerate it;
- create hidden variants;
- alter wording;
- alter layout;
- update it;
- "optimise" it per job;
- submit an AI-modified copy.

Every application must use the approved CV.

The stored SHA-256 must be checked before application submission.

If the submitted CV hash differs from the approved master hash:

> **ABORT SUBMISSION**

Do not continue.

---

# 9. ONLY THE COVER LETTER MAY BE TAILORED

The cover letter may be generated specifically for the vacancy.

It must be based on:

- the approved cover-letter style/template;
- immutable CV evidence;
- candidate evidence;
- N.White Systems evidence;
- verified project evidence;
- job requirements;
- company context.

Every material candidate claim must be grounded.

The system must preserve British English.

Do not invent:

- employers;
- technologies;
- qualifications;
- metrics;
- clients;
- achievements;
- responsibilities;
- locations;
- years of experience.

---

# 10. EMAIL WRITING RULES

When an application requires email:

### British English

Always use British English.

### Candidate voice

Respect the established writing style already present in the user's approved materials and previous application correspondence.

Do not make emails sound like generic AI-generated HR messages.

### Signature

The existing Zoho email signature must be preserved.

Do NOT duplicate the signature inside the generated email body.

### Closing

When the signature is already configured in the email account, the generated message should conclude with:

**Kind regards,**

and then stop.

Do not add another manually generated signature beneath it.

Do not add:

- full name;
- phone number;
- website;
- address;
- social links

unless they are explicitly required in the email body and are not already supplied by the signature.

### CV attachment

The correct immutable CV must always be attached:

`whitemore_ngwira_cv_n.white.pdf`

Verify:

- correct filename;
- correct file;
- correct SHA-256;
- attachment exists;
- attachment is not a generated CV variant.

---

# 11. DRY RUN — ONE REAL HIGH-FIT JOB FIRST

Before enabling unrestricted autonomous application submission:

## Select ONE genuine high-fit, recently posted vacancy.

It must satisfy:

- recent posting;
- strong candidate fit;
- valid employer;
- valid application route;
- geography eligibility;
- no paid application gate;
- verifiable job details.

Run the entire workflow.

### Dry-run sequence

`DISCOVER`

→ `NORMALISE`

→ `DEDUPLICATE`

→ `FRESHNESS CHECK`

→ `GEOGRAPHY CHECK`

→ `ELIGIBILITY CHECK`

→ `CANDIDATE EVIDENCE RETRIEVAL`

→ `RAG`

→ `COMPANY RESEARCH`

→ `MATCH`

→ `DECISION`

→ `GENERATE COVER LETTER`

→ `GROUNDING CHECK`

→ `VERIFY CV HASH`

→ `PREPARE APPLICATION`

→ `EMAIL/PORTAL PREPARATION`

→ `CAPTURE EVERYTHING`

For the first dry run, **do not submit externally unless the current application policy and user approval state explicitly permit the test submission**.

The dry run must prove the complete pipeline without creating an unwanted real application.

Record the result in the autonomous execution state.

---

# 12. AFTER DRY RUN — OFFICIAL AUTONOMOUS MODE

Only after the dry run passes all gates:

Set the system to its official autonomous operating state.

The operating mode should be explicit, for example:

`AUTONOMOUS_PRODUCTION_ENABLED=true`

and should be visible in operational state.

The system must not silently switch into autonomous mode.

---

# 13. DAILY NONSTOP OPERATION

The application must operate continuously from the cloud.

The laptop must NOT be the runtime dependency.

It must continue when:

- Windows is shut down;
- laptop is asleep;
- laptop is offline;
- VS Code is closed;
- Antigravity is closed.

Cloud execution should continue through the approved production architecture.

When the laptop reconnects, the local/admin environment should reconcile with the cloud state rather than restarting the entire workflow.

---

# 14. LAPTOP STARTUP EXPERIENCE

Separately from cloud autonomy, configure a local convenience layer.

When Windows starts:

- the local ApplyWise administrative/status application may start automatically;
- it should open the application/status dashboard;
- it should show current cloud execution state;
- it should reconcile pending local context.

This is a **UI/admin convenience**, not the autonomy engine.

Do not make cloud autonomy dependent on Windows startup.

---

# 15. INTERNET DISCONNECT / RECONNECT

The system must handle interruptions gracefully.

If local connectivity disappears:

- do not lose state;
- do not restart completed jobs;
- do not duplicate submissions;
- do not discard context.

When connectivity returns:

- reconcile with Supabase;
- retrieve latest checkpoint;
- resume incomplete work;
- reconcile job/application status;
- continue from the last safe state.

Cloud-side execution must remain independent where possible.

---

# 16. PERSISTENT CONTEXT

Every autonomous workflow must maintain durable context.

Use:

- Supabase;
- execution state;
- agent checkpoints;
- workflow state;
- job state;
- application state;
- evidence provenance;
- model/provider metadata;
- failure state;
- retry state.

The system must never rely on conversational memory alone.

---

# 17. LANGGRAPH MUST BE THE REAL ORCHESTRATOR

The implemented LangGraph workflow must be executed for actual autonomous job processing.

Verify real runtime traversal.

Required conceptual path:

`START`

→ `LOAD_CANDIDATE_CONTEXT`

→ `LOAD_JOB`

→ `CHECK_FRESHNESS`

→ `CHECK_GEOGRAPHY`

→ `CHECK_WORK_AUTHORISATION`

→ `CHECK_REQUIREMENTS`

→ `RETRIEVE_EVIDENCE`

→ `EVALUATE_EVIDENCE`

→ `RESEARCH_COMPANY`

→ `MATCH`

→ `DECIDE`

→ `GENERATE_COVER_LETTER`

→ `VERIFY_GROUNDING`

→ `VERIFY_CV_HASH`

→ `PREPARE_APPLICATION`

→ `SUBMIT`

→ `CAPTURE_PROOF`

→ `RECONCILE`

→ `END`

Conditional branching must be real.

---

# 18. OPENROUTER REMAINS PROHIBITED

Perform a final repository-wide search.

There must be no runtime dependency on:

- OpenRouter;
- `OPENROUTER_API_KEY`;
- OpenRouter endpoints;
- OpenRouter model IDs.

Remove stale documentation/configuration where necessary.

Do not confuse OpenAI with OpenRouter.

---

# 19. OPENCODE ZEN

OpenCode Zen remains the approved primary free-model layer.

Verify current model IDs at execution time.

Do not blindly rely on old IDs.

Verify:

- model availability;
- actual request success;
- free/paid status;
- context window;
- tool calling;
- structured output;
- latency;
- failure behaviour.

The router must select models by capability.

---

# 20. FREE-TIER GOVERNANCE

The project should remain free-tier-first.

However, do not falsely claim that every external capability is free.

For every external platform classify:

- FREE
- FREE WITH LIMITS
- PAID
- UNKNOWN
- REQUIRES USER BILLING

The user has explicitly said that if a required component is not free, that is acceptable.

But:

**never silently incur paid usage.**

No automatic billing upgrades.

No paid AI model fallback.

No hidden paid API.

---

# 21. CLOUDFLARE AI GATEWAY — REAL VERIFICATION

Verify Cloudflare AI Gateway itself, not merely source code.

Check:

- gateway exists;
- correct account/project;
- active endpoint/configuration;
- production requests actually traverse it where intended;
- logs/analytics are populated;
- model/provider metadata is visible;
- errors are captured;
- token/usage information is captured where supported.

If Cloudflare AI Gateway is not technically compatible with a particular OpenCode Zen path, document the exact limitation and do not fabricate integration.

Use Cloudflare where it genuinely improves the architecture.

---

# 22. GRAFANA — REAL TELEMETRY

Grafana must be operational, not just packaged.

Verify:

- actual Grafana Cloud workspace;
- actual Prometheus datasource;
- actual metric ingestion;
- current timestamps;
- dashboard queries returning live data;
- alerts evaluating;
- AI telemetry;
- RAG telemetry;
- LangGraph telemetry;
- job discovery telemetry;
- application telemetry;
- scheduler telemetry.

A dashboard containing panels with `No data` is not a completed observability implementation.

---

# 23. PROMETHEUS METRICS

Verify real metrics for:

- requests;
- duration;
- errors;
- status codes;
- AI requests;
- AI latency;
- model failures;
- model fallback;
- RAG retrieval;
- RAG latency;
- LangGraph execution;
- LangGraph failures;
- job discovery;
- jobs qualified;
- jobs rejected;
- applications prepared;
- applications submitted;
- email applications;
- portal applications;
- scheduler runs;
- scheduler failures;
- queue depth.

Avoid high-cardinality labels.

Never put CV contents, email bodies or secrets into metrics.

---

# 24. AUTONOMOUS SCHEDULER — CRITICAL QC

The previous report says the cloud autonomy endpoint was successfully invoked.

That is NOT sufficient.

Verify:

1. The Vercel cron configuration is actually deployed.
2. The production project has the cron registered.
3. The schedule actually fires.
4. The endpoint authenticates correctly.
5. The endpoint creates a durable run record.
6. The run acquires an idempotency/lease lock.
7. The workflow executes.
8. The run records completion/failure.
9. The next scheduled run can continue.
10. No duplicate execution occurs.

Also verify the actual Vercel plan limitations.

Do not assume "daily nonstop" means a single cron invocation can execute indefinitely.

The scheduler should trigger bounded, resumable work.

If the free plan cannot support the desired frequency/volume, design a queue/checkpoint architecture rather than pretending it can.

---

# 25. 200-JOB CAPACITY ARCHITECTURE

Do NOT attempt to process 200 jobs in one huge serverless request.

Use:

`SCHEDULER`

→ `DISCOVERY BATCH`

→ `QUEUE`

→ `WORKER`

→ `CHECKPOINT`

→ `NEXT JOB`

→ `RECONCILE`

→ `NEXT BATCH`

This makes the system resilient to:

- function timeouts;
- model latency;
- API rate limits;
- job-source limits;
- temporary failures.

The target is approximately:

**200 high-fit jobs/applications per rolling week**

through many small resumable execution units.

---

# 26. JOB SOURCE QUALITY

Every job source must have provenance.

Store:

- source name;
- source URL;
- employer URL where available;
- job URL;
- retrieved timestamp;
- posted timestamp;
- source freshness;
- application route.

Prefer:

- direct employer career pages;
- LinkedIn Easy Apply;
- reputable free job boards;
- legitimate recruiters;
- official company pages.

Avoid:

- paid application unlocks;
- suspicious aggregators;
- scraped duplicates;
- stale repost farms;
- unverifiable employers.

---

# 27. DEDUPLICATION

Before processing:

Check:

- canonical URL;
- employer;
- normalized title;
- location;
- job ID;
- description fingerprint;
- prior application state.

The same vacancy must never be submitted twice because two sources found it.

---

# 28. APPLICATION SAFETY

Before every submission:

1. Verify job freshness.
2. Verify eligibility.
3. Verify candidate evidence.
4. Verify CV hash.
5. Generate/verify cover letter.
6. Verify required answers.
7. Verify application route.
8. Verify no payment gate.
9. Verify no duplicate application.
10. Submit.
11. Capture confirmation.
12. Record exact timestamp.
13. Record CV hash.
14. Record cover-letter hash.
15. Record source and route.

If any critical gate fails:

`DO_NOT_SUBMIT`

---

# 29. EMAIL APPLICATION SAFETY

For email applications:

- use Zoho integration where supported;
- preserve existing email signature;
- British English;
- candidate voice;
- conclude only with `Kind regards,`;
- attach the immutable CV;
- attach the correct cover letter if required;
- verify recipient;
- verify subject;
- verify attachment hash;
- capture send result.

Do not send duplicate applications.

---

# 30. MCP / CONNECTOR / BROWSER SKILL AUDIT

Research and assess whether additional tools should be added.

Do not install random MCP servers merely because they exist.

Only add a tool if it solves a real production requirement.

Evaluate at minimum:

### Browser automation

**Playwright MCP** is a legitimate candidate for deterministic browser automation and structured accessibility-tree interaction.

Reference:

`https://github.com/microsoft/playwright`

If installed, use it for permitted browser workflows such as:

- job portal navigation;
- application form inspection;
- controlled form filling;
- screenshot/proof capture;
- browser-state inspection.

Do not use browser automation to bypass:

- CAPTCHA;
- anti-bot systems;
- authentication controls;
- rate limits;
- Terms of Service.

### Alternative browser automation

Evaluate Vercel's `agent-browser` where appropriate.

Do not install both unless there is a concrete reason.

Choose the smallest reliable browser stack.

### Connector audit

Inspect the available connector ecosystem for:

- Zoho;
- GitHub;
- HubSpot;
- Vercel;
- Supabase;
- email;
- browser;
- job portals.

Use official/legitimate connectors where available.

Do not invent MCP servers.

---

# 31. JSM SKILL RESEARCH

Research the current JSM skill ecosystem.

In addition to the existing:

- architect;
- review;
- remember;
- recover;
- imprint

evaluate the newer JSM workflow concepts such as:

- scope;
- audit;
- develop;
- check;
- test;
- document;
- sync;
- debug.

The current JSM public skills repository documents a phase-based engineering workflow where state is stored in project files rather than relying on chat context.

Do NOT blindly replace the project's current skills.

Instead:

1. compare;
2. identify useful additions;
3. integrate only where beneficial;
4. preserve compatibility with the existing `.agents/skills`;
5. ensure all skills are loaded before future work.

---

# 32. WEBSITE KNOWLEDGE

The system must maintain a verified knowledge representation of:

`https://nwhite.systems/`

It should periodically detect meaningful website changes.

Do not blindly overwrite trusted evidence.

Use:

- source URL;
- page title;
- content hash;
- retrieved time;
- version;
- evidence status.

If the website changes, re-ingest changed content.

---

# 33. MEMORY BANK

The memory bank must retain:

- candidate truth;
- approved CV;
- evidence;
- website evidence;
- job history;
- application history;
- company intelligence;
- model decisions;
- workflow checkpoints;
- operational state;
- failures;
- recoveries.

Supabase is the durable cloud store.

Markdown context remains useful for engineering and human-readable state.

---

# 34. REPORTING

Create operational reporting for:

### Daily

- jobs discovered;
- recently posted jobs;
- high-fit jobs;
- eligible jobs;
- rejected jobs;
- applications prepared;
- applications submitted;
- emails sent;
- responses;
- failures;
- retries;
- model usage;
- token usage where available.

### Weekly

- total qualified jobs;
- total applications;
- target progress toward 200;
- geography breakdown;
- role-family breakdown;
- source breakdown;
- application-route breakdown;
- response/interview outcomes;
- failures;
- unresolved VERIFY items.

Do not fabricate numbers.

---

# 35. GITHUB PACKAGING

The private repository remains private.

The recruiter-facing public repository should showcase the engineering without exposing:

- secrets;
- private CV data;
- private application data;
- tokens;
- credentials;
- production environment variables.

The public showcase should demonstrate:

- architecture;
- AI gateway;
- OpenCode Zen routing;
- LangGraph;
- LangChain;
- RAG;
- Supabase;
- Prometheus;
- Grafana;
- Docker;
- Kubernetes;
- Helm;
- Terraform;
- CI/CD;
- security;
- recovery;
- screenshots;
- architecture diagrams;
- operational dashboards.

No fake usage statistics.

No fake customers.

No fake job-application results.

---

# 36. GIT AND DEPLOYMENT QC

Before launch:

- verify branch;
- verify remote;
- verify latest commit;
- verify Vercel deployment commit;
- verify production URL;
- verify working tree;
- verify no secrets;
- verify no OpenRouter remnants;
- verify no accidental CV modifications.

The immutable CV hash must remain:

`3994A09C76CB5922F41F6A212AA99E1392D0A06DBECF650CB307756D5EF2423F`

If the local approved PDF does not produce this hash, stop and investigate.

---

# 37. TEST SUITE — EXPAND BEYOND THE REPORTED 39/39

The reported 39/39 passing unit tests are a good baseline.

Do not stop there.

Add/execute tests for:

### Freshness

- 1-day-old job;
- 7-day-old job;
- 14-day-old job;
- stale job;
- missing posted date.

### Geography

SA remote/hybrid/on-site.

Zimbabwe remote/hybrid/on-site.

Malawi remote/hybrid/on-site.

US-only remote.

UK-only remote.

EU-only remote.

Unknown.

### CV

- hash;
- mutation prevention;
- wrong file;
- missing file;
- altered PDF.

### Application

- duplicate;
- stale;
- ineligible;
- payment gate;
- missing application route;
- invalid recipient;
- wrong CV hash.

### AI

- free model available;
- model unavailable;
- timeout;
- fallback;
- paid model blocked.

### RAG

- retrieval;
- provenance;
- insufficient evidence;
- hallucination prevention.

### LangGraph

- normal path;
- conditional branch;
- failure;
- checkpoint;
- resume;
- duplicate prevention.

### Scheduler

- scheduled run;
- lock;
- retry;
- recovery;
- idempotency.

### Email

- British English;
- correct closing;
- signature preservation;
- correct CV attachment;
- correct attachment hash.

### Observability

- metrics;
- correlation ID;
- errors;
- Grafana ingestion where testable.

---

# 38. NO HALLUCINATION POLICY

The AI must distinguish:

`KNOWN`

`SUPPORTED BY EVIDENCE`

`INFERRED`

`UNKNOWN`

`REQUIRES VERIFICATION`

Do not convert UNKNOWN into a confident answer.

For job applications, uncertain eligibility must be conservative.

For candidate claims, unsupported claims must be rejected.

For company research, distinguish official evidence from third-party claims.

---

# 39. AUTONOMOUS OPERATING STATE MACHINE

Use explicit states.

Example:

`DISCOVERED`

→ `NORMALISED`

→ `FRESH`

→ `ELIGIBILITY_CHECKED`

→ `MATCHED`

→ `RESEARCHED`

→ `APPROVED_FOR_APPLICATION`

→ `COVER_LETTER_READY`

→ `CV_VERIFIED`

→ `APPLICATION_READY`

→ `SUBMITTED`

→ `CONFIRMED`

→ `TRACKING`

Failures:

`RETRY_PENDING`

`VERIFY_REQUIRED`

`BLOCKED`

`DO_NOT_APPLY`

Never lose the state.

---

# 40. RECOVERY AFTER RESTART

When the local machine starts:

1. Load all skills.
2. Load current project state.
3. Reconcile local Git state.
4. Connect to Supabase.
5. retrieve latest autonomous execution state.
6. reconcile unfinished workflows.
7. display current cloud state.
8. do not rerun completed work.
9. resume only safe incomplete work.

The same principle applies to Antigravity sessions.

---

# 41. AUTONOMOUS MONITORING

Google Antigravity should not continuously "watch" a cloud process by remaining open.

Instead, implement durable monitoring through:

- Supabase run state;
- Prometheus metrics;
- Grafana dashboards;
- alerts;
- execution logs;
- failure queues;
- daily/weekly reports.

Antigravity is the engineering/QC operator.

The SaaS itself is the autonomous runtime.

---

# 42. LAUNCH GATE

Do NOT officially launch autonomous application submission until all of these are true:

- [ ] all skills loaded and audited;
- [ ] JSM discipline active;
- [ ] CV hash verified;
- [ ] CV immutable;
- [ ] geography correct;
- [ ] freshness implemented;
- [ ] high-fit matching verified;
- [ ] job deduplication verified;
- [ ] OpenRouter absent;
- [ ] OpenCode Zen real requests verified;
- [ ] paid model calls blocked;
- [ ] LangGraph real execution verified;
- [ ] LangChain real execution verified;
- [ ] RAG real retrieval verified;
- [ ] website ingestion verified;
- [ ] Supabase durable state verified;
- [ ] scheduler verified;
- [ ] cloud autonomy verified;
- [ ] recovery verified;
- [ ] Zoho email integration verified where available;
- [ ] CV attachment verified;
- [ ] email signature behaviour verified;
- [ ] British English verified;
- [ ] Cloudflare AI Gateway verified where compatible;
- [ ] Grafana receives real telemetry;
- [ ] Prometheus metrics verified;
- [ ] alerts verified;
- [ ] Docker verified;
- [ ] Kubernetes verified;
- [ ] Helm verified;
- [ ] Terraform verified;
- [ ] private GitHub repo protected;
- [ ] public showcase sanitised;
- [ ] dry run passed;
- [ ] production smoke test passed;
- [ ] final QC report produced.

---

# 43. OFFICIAL LAUNCH

After the launch gate passes:

1. Enable autonomous production mode.
2. Enable scheduled discovery.
3. Enable recurring qualification.
4. Enable application processing.
5. Enable approved email workflows.
6. Enable telemetry.
7. Enable alerts.
8. Record launch timestamp.
9. Record deployed commit.
10. Record production configuration version.
11. Persist launch state in Supabase.
12. Persist engineering state locally.
13. Start the rolling 7-day target tracking.

---

# 44. FIRST PRODUCTION CYCLE

Immediately after launch:

### Cycle 1

Find a small batch of genuine recent high-fit jobs.

Do not immediately attempt all 200.

Prove the production loop.

Then progressively scale through bounded batches.

Monitor:

- AI errors;
- job-source errors;
- eligibility errors;
- duplicate detection;
- application failures;
- email failures;
- rate limits;
- Grafana telemetry;
- queue depth;
- model usage.

If the first batch is healthy, allow subsequent batches.

---

# 45. 200-JOB OPERATING TARGET

The system should work toward:

**200 high-fit, recently posted jobs/applications per rolling seven-day period.**

Track progress:

`qualified_count / 200`

and separately:

`submitted_count / 200`

Do not confuse discovery with submission.

Do not count:

- rejected jobs;
- duplicates;
- stale jobs;
- unverifiable jobs;
- ineligible jobs;
- paid-gate jobs

towards the target.

---

# 46. FINAL ENGINEERING PRINCIPLE

The build phase ends here.

Do not continue building features merely because another feature can be imagined.

From this point forward:

> **STABILITY > FEATURE COUNT**

> **EVIDENCE > CLAIMS**

> **REAL EXECUTION > MOCKS**

> **RECENT HIGH-FIT JOBS > JOB VOLUME**

> **CANDIDATE TRUTH > AI CREATIVITY**

> **IMMUTABLE CV > AUTOMATIC TAILORING**

> **GROUNDED COVER LETTER > GENERIC AI TEXT**

> **DURABLE STATE > CHAT MEMORY**

> **RECOVERY > RESTART**

> **OBSERVABILITY > ASSUMPTION**

---

# 47. FINAL REQUIRED REPORT TO ME

When this directive is complete, provide one factual final report with:

## A. Launch status

`LAUNCHED`
or
`NOT LAUNCHED`

## B. Dry-run result

Show the actual job and all major workflow states.

## C. Current job pipeline

Show:

- source;
- freshness;
- geography;
- eligibility;
- matching;
- application route.

## D. Autonomous scheduler

Show:

- actual schedule;
- actual deployment;
- actual execution;
- last run;
- next run;
- failure/retry behaviour.

## E. AI

Show:

- active provider;
- active models;
- model routing;
- fallback;
- free/paid state;
- Cloudflare gateway state.

## F. RAG

Show:

- sources;
- embeddings;
- retrieval;
- provenance.

## G. LangGraph

Show:

- graph;
- nodes;
- state;
- checkpoint;
- recovery.

## H. Email

Show:

- Zoho state;
- signature behaviour;
- British English;
- closing;
- CV attachment verification.

## I. Observability

Show:

- Prometheus;
- Grafana;
- dashboards;
- alerts;
- real telemetry.

## J. Infrastructure

Show:

- Vercel;
- Supabase;
- Docker;
- Kubernetes;
- Helm;
- Terraform;
- GitHub Actions.

## K. GitHub

Show:

- private repository;
- public recruiter showcase;
- sanitisation.

## L. Tests

Show actual results.

## M. Remaining blockers

List only real blockers.

## N. Launch evidence

Provide URLs/identifiers where appropriate.

---

# 48. FINAL COMMAND

Now execute this directive against the existing ApplyWise AI system.

**DO NOT START BY CODING.**

First:

`LOAD ALL SKILLS`

then:

`READ ALL CONTEXT`

then:

`AUDIT CLAIMS AGAINST REAL EVIDENCE`

then:

`ARCHITECT`

then:

`FIX ONLY WHAT IS ACTUALLY REQUIRED`

then:

`TEST`

then:

`REVIEW`

then:

`DRY RUN ONE HIGH-FIT RECENT JOB`

then:

`VERIFY`

then:

`OFFICIALLY LAUNCH`

then:

`MONITOR`

then:

`REPORT`

The end state is not another development report.

The end state is:

> **A FINISHED, LIVE, AUTONOMOUS, CONTEXT-AWARE, OBSERVABLE, RECOVERABLE, HIGH-FIT JOB-APPLICATION SYSTEM THAT CAN OPERATE WITHOUT THE LAPTOP AND THAT NEVER MODIFIES THE APPROVED CV.**

Do not fake completion.

Do not claim live verification without live evidence.

Do not silently incur paid usage.

Do not lower the quality bar to reach 200.

Do not modify the CV.

Do not lose context.

Do not restart from scratch.

**Finish the engineering. Launch the system. Let it operate.**

---
name: application
description: "Job application submission, connector routing, proof capture, and 200 applications/week target management"
---

# /application — Autonomous Application Submission & Proof Capture Skill

## Purpose
Governs the preparation, submission, proof capture, and tracking of job applications across supported application routes towards the rolling 7-day target (up to 200 qualified applications).

## Submission Routes
- `DIRECT_PORTAL`: Greenhouse, Lever, Workable, SmartRecruiters, Ashby.
- `LINKEDIN_EASY_APPLY`: Supported LinkedIn workflows.
- `EMAIL`: Handled via verified Zoho business email workflow.
- `EXTERNAL_JOB_BOARD`: Free job board submission.
- `RECRUITER`: Verified direct recruiter submission.
- Paid application portals are strictly rejected (`DO_NOT_APPLY`).

## Proof Capture
Every application submission requires verifiable proof:
- Route used
- Unique proof ID (e.g. `PROOF-AW-...`)
- Timestamp
- Cryptographic CV hash verified (`3994a09c...`)
- Grounded cover letter hash
- CRM status updated in Supabase database.

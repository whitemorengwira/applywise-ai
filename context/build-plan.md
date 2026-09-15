# ApplyWise AI — Build Plan

## Current Status: Phase 0 — Research & Discovery (In Progress)

---

## Phase 0 — Research & Discovery
- [x] Study reference video methodology
- [x] Inspect existing project directory and CV/cover letter assets
- [x] Research free-tier capabilities (OpenRouter, Supabase, Vercel)
- [x] Design architecture
- [x] Create implementation plan
- [/] Create context system (9 files)
- [ ] Create agent skills (5 skills)
- [ ] Create initial ADRs
- [ ] Create Project Foundation Report

**Definition of Done:** All context files, skills, ADRs created. Foundation report reviewed.

---

## Phase 1 — Project Setup
- [ ] Next.js 15 + TypeScript initialisation
- [ ] Tailwind CSS + shadcn/ui setup
- [ ] ESLint + Prettier configuration
- [ ] Vitest + Playwright configuration
- [ ] Folder structure creation
- [ ] `.env.example` with documented variables
- [ ] Git init + first commit
- [ ] GitHub repository creation + push
- [ ] README skeleton

**Definition of Done:** `npm run dev` starts successfully. `npm run lint` passes. `npm run build` passes. Git repo pushed to GitHub.

---

## Phase 2 — Design System
- [ ] Typography (Inter/Geist), colour palette (dark-first)
- [ ] shadcn/ui components initialised (Button, Input, Card, Table, Badge, Dialog, Tabs, Select, Textarea, Avatar, Dropdown, Sheet, Tooltip)
- [ ] Layout components (AppSidebar, Header, PageContainer)
- [ ] Dashboard shell with navigation
- [ ] Status badge system
- [ ] Loading/error/empty state components
- [ ] AI streaming display component

**Definition of Done:** Dashboard shell renders with sidebar navigation. All base components exist. Responsive at mobile/tablet/desktop.

---

## Phase 3 — Landing Page
- [ ] Hero section
- [ ] Features section
- [ ] Architecture showcase
- [ ] Technology stack
- [ ] CTA
- [ ] Responsive + accessible

**Definition of Done:** Landing page loads at `/`, looks professional, responsive on all breakpoints.

---

## Phase 4 — Authentication
- [ ] Supabase Auth setup
- [ ] Sign Up page (email + OAuth)
- [ ] Sign In page
- [ ] Auth middleware (protected routes)
- [ ] Sign Out
- [ ] Profile creation on first signup

**Definition of Done:** Can sign up, sign in, access protected routes, sign out. Unauthenticated users redirected to sign-in.

---

## Phase 5 — Database
- [ ] Full schema (35+ tables)
- [ ] Migrations
- [ ] RLS policies
- [ ] pgvector extension
- [ ] Indexes
- [ ] Seed data

**Definition of Done:** All tables created. RLS verified. pgvector enabled. Schema matches architecture document.

---

## Phase 6 — Analytics
- [ ] First-party event tracking
- [ ] Core events (signup, login, profile, search, AI)

**Definition of Done:** Events are recorded to `analytics_events` table on key user actions.

---

## Phase 7 — Profile System
- [ ] Profile page with all sections
- [ ] CRUD for experience, education, certifications, skills, projects
- [ ] Job preferences
- [ ] Profile completeness indicator

**Definition of Done:** User can fully populate their profile. Data persists in Supabase.

---

## Phase 8 — AI Profile Extraction
- [ ] PDF upload + parsing
- [ ] AI structured extraction
- [ ] Review/approval UI
- [ ] Save to profile

**Definition of Done:** Uploading a CV PDF extracts structured data. User can review and approve.

---

## Phase 9 — Document Intelligence (RAG)
- [ ] Ingestion pipeline
- [ ] Chunking + metadata
- [ ] Embedding generation
- [ ] pgvector storage
- [ ] Retrieval API
- [ ] Source attribution

**Definition of Done:** User's CV is chunked, embedded, stored. Semantic queries return relevant chunks with source info.

---

## Phase 10 — Resume Generation
**Definition of Done:** User can generate a base CV and a job-tailored CV with version history.

## Phase 11 — Cover Letter Generation
**Definition of Done:** User can generate a cover letter grounded in their profile + job description.

## Phase 12 — Job Discovery
**Definition of Done:** User can search and browse jobs from Adzuna/Arbeitnow with filters.

## Phase 13 — Job Matching
**Definition of Done:** Each job displays a transparent match score with methodology explanation.

## Phase 14 — Job Detail Page
**Definition of Done:** Full job detail view with match analysis, company info, application actions.

## Phase 15 — Company Research Agent
**Definition of Done:** LangGraph agent researches companies and stores findings.

## Phase 16 — Application Tracking
**Definition of Done:** Full application CRM with pipeline, timeline, notes, tasks.

## Phase 17 — Dashboard
**Definition of Done:** Dashboard shows useful metrics, high-match jobs, upcoming interviews.

## Phase 18 — AI Career Copilot
**Definition of Done:** Chat interface with agentic RAG answers career questions.

## Phase 19 — Interview Intelligence
**Definition of Done:** AI generates interview prep materials grounded in profile + job.

## Phase 20 — AI Auditability
**Definition of Done:** All AI operations have audit trails viewable in the UI.

## Phase 21 — Testing
**Definition of Done:** Unit, integration, E2E tests pass. CI pipeline runs tests on push.

## Phase 22 — Security Hardening
**Definition of Done:** Security review complete. No critical vulnerabilities.

## Phase 23 — Documentation & Polish
**Definition of Done:** README, architecture docs, screenshots complete.

## Phase 24 — Deployment
**Definition of Done:** Application deployed to Vercel, accessible via public URL, all features working.

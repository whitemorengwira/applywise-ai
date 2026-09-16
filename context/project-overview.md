# ApplyWise AI — Project Overview

## Product Name
ApplyWise AI

## Product Description
A full-stack, AI-powered Job Application Operating System built as a flagship engineering showcase. Helps senior technology professionals maintain their professional profile, discover and analyse suitable jobs, generate tailored application material grounded in verified career evidence, and track their application pipeline.

## Owner
Whitemore Ngwira — Principal Technology Architect & AI Systems Engineer

## Target Audience
- Primary user: The owner (job-seeking senior technology professional)
- Secondary audience: Recruiters, employers, technical interviewers viewing this as a portfolio showcase

## Core Value Proposition
"What JobPilot would look like if a Principal Technology Architect built an enterprise-grade agentic job-search and application operating system in 2026."

## Technology Stack Summary
| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Database | Supabase PostgreSQL + pgvector |
| Auth | Supabase Auth (Email/Password + OAuth) |
| Storage | Supabase Storage |
| AI Provider | OpenCode Zen (100% Free Tier) + Cloudflare AI Gateway proxy |
| AI Framework | LangChain.js + LangGraph.js (Stateful 10-node agent graph) |
| Job APIs | Adzuna + Arbeitnow |
| Hosting | Vercel (Hobby tier, serverless daily cron) |
| Testing | Vitest + Playwright (52/52 passing unit tests) |
| VCS | Git + GitHub (`whitemorengwira/applywise-ai`) |

## Repository
GitHub: `whitemorengwira/applywise-ai`

## Key Engineering Showcase Points
- Full-stack Next.js + TypeScript
- LangChain for AI application primitives
- LangGraph for stateful agent orchestration (10-node application lifecycle graph)
- RAG + Agentic RAG with pgvector over Master CV and N.White Systems evidence
- OpenCode Zen Free Model Suite routing with Cloudflare AI Gateway proxying
- Supabase PostgreSQL with RLS + pgvector in dedicated project
- Cryptographic Master CV immutability (SHA-256 locked, zero mutations)
- Africa-First geographic eligibility engine (SA, ZW, MW Remote/Hybrid/On-site)
- Autonomous cloud execution with zero laptop dependency via Vercel cron
- Prompt injection defence and trust boundaries
- Professional testing (52 passing unit tests across 11 suites)
- CI/CD with GitHub Actions, Docker multi-stage, Kubernetes, Helm, Terraform
- Production deployment on Vercel (`applywise-ai-app.vercel.app`)

## Engineering Methodology
Context-driven agentic development:
- 12 persistent context files (this system)
- 21 operational JSM agent skills in `.agents/skills`
- Phase-by-phase incremental development (Phases 0 through 17)
- Review gates after each milestone
- Persistent project memory across sessions

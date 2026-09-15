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
| AI Provider | OpenRouter (free-tier models) |
| AI Framework | LangChain.js + LangGraph.js |
| Job APIs | Adzuna + Arbeitnow |
| Hosting | Vercel (Hobby tier) |
| Testing | Vitest + Playwright |
| VCS | Git + GitHub |

## Repository
GitHub: `applywise-ai`

## Key Engineering Showcase Points
- Full-stack Next.js + TypeScript
- LangChain for AI application primitives
- LangGraph for agent orchestration (4 agent graphs)
- RAG + Agentic RAG with pgvector
- Model routing across free AI models via OpenRouter
- Supabase PostgreSQL with RLS + pgvector
- Prompt injection defence and trust boundaries
- Professional testing (unit, integration, E2E)
- CI/CD with GitHub Actions
- Production deployment on Vercel

## Engineering Methodology
Context-driven agentic development:
- 9 persistent context files (this system)
- 5 agent workflow skills (/architect, /review, /imprint, /recover, /remember)
- Phase-by-phase incremental development
- Review gates after each milestone
- Persistent project memory across sessions

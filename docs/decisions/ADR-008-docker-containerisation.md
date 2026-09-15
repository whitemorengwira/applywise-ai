# ADR-008: Multi-Stage Docker Containerisation Strategy

## Status
Accepted

## Date
2026-09-15

## Context
ApplyWise AI is an enterprise-grade agentic full-stack SaaS. While Vercel provides seamless serverless edge hosting, enterprise recruiters and platform engineering teams require evidence of containerisation mastery: minimal attack surface, reproducible builds, non-root execution, health probe integration, and production-grade standalone artifact creation.

## Decision
1. **Multi-Stage Build Pipeline**:
   - `deps`: Installs production and dev dependencies using `npm ci --legacy-peer-deps` on Node 20 Alpine.
   - `builder`: Builds Next.js in standalone mode with TypeScript compilation and Turbopack asset bundling.
   - `runner`: Strips all package managers, git tooling, and compilers. Copies only `.output/standalone`, `.output/static`, and `public/`.
2. **Security Hardening**:
   - Runs under dedicated unprivileged user `nextjs` (UID 1001, GID 1001).
   - Root filesystem read-only compatible.
   - Drops unnecessary Linux kernel capabilities (`ALL`).
3. **Probing**:
   - Employs native `HEALTHCHECK` pinging the zero-dependency `/api/health` HTTP endpoint every 30s.

## Consequences
- **Positive**:
  - Image size reduced to <180MB compared to >1.2GB for unoptimised images.
  - Zero development dependencies or node package manager CLI binaries in production runtime.
  - Fully compliant with CIS Docker Benchmarks and Kubernetes least-privilege pod security standards.
- **Negative**:
  - Requires maintaining standalone output configuration in `next.config.ts`.

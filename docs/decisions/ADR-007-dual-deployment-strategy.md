# ADR-007: Dual Deployment Strategy — Vercel Production and Portable Kubernetes Target

## Status
Accepted

## Context
ApplyWise AI is engineered as a flagship full-stack SaaS and agentic-AI demonstration. In production, senior technical interviewers, recruiters, and clients expect to inspect:
1. An instantly accessible, high-performance public SaaS instance running on modern serverless edge infrastructure (zero operational overhead, free-tier compliance).
2. A production-grade containerisation and Kubernetes orchestration architecture demonstrating cloud-native infrastructure engineering, multi-stage container optimization, declarative Helm packaging, Horizontal Pod Autoscaling, and least-privilege network security.

## Decision
We adopt a **Dual Deployment Architecture** operating against a single unified codebase:
1. **Primary Public Deployment (Vercel Free Tier):**
   - Serves the live public application with automatic preview deployments, edge routing, and global CDN acceleration.
   - Eliminates the need for paid cloud VM / managed Kubernetes clusters for public recruiter evaluations.
2. **Portable Container & Kubernetes Target (Local & Cloud K8s via Helm):**
   - Packaged as an optimized multi-stage Docker container utilizing Next.js `output: 'standalone'`.
   - Orchestrated via declarative Kubernetes manifests and a comprehensive Helm v3 chart (`helm/applywise-ai`).
   - Supports local zero-cost reproduction using `kind`, `minikube`, or `Docker Desktop Kubernetes`, and cloud deployment to any CNCF-certified Kubernetes cluster without code modification.

## Consequences
- Single unified codebase: No branching or forks between Vercel and Kubernetes.
- Environment parity: Configuration is strictly injected via standard environment variables (ConfigMaps/Secrets in K8s, Project Settings in Vercel).
- Clear architectural rationale: Demonstrates senior-level judgement by selecting the simplest operational model for public delivery while proving deep competency in distributed systems and container orchestration.

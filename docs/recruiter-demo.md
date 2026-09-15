# ApplyWise AI — Recruiter & Interviewer Technical Showcase

## Executive Summary

**ApplyWise AI** is an enterprise-grade, full-stack, autonomous Job Application Operating System engineered for **Whitemore Ngwira (N. White)**, Principal Technology Architect & AI Systems Engineer.

This repository demonstrates senior-level competency across full-stack software development, AI systems engineering, cloud-native containerisation, and DevOps automation.

---

## Candidate Ground Truth & Production Systems Proven

The AI models in this platform operate with **strict anti-hallucination boundaries**, drawing solely from Whitemore Ngwira's verified career milestones:
1. **EarCodeX InsurTech**: Architected AWS microservices platform handling thousands of claims with 99.9% uptime.
2. **Socinga Smart Mining**: Engineered real-time IoT and telemetry systems for harsh mining environments.
3. **Cineterns & Oasis College**: Built modern web platforms utilizing Next.js, Supabase, and Claude API integration.
4. **Broadcast Media**: Delivered 21 enterprise media automation and streaming pipelines.

---

## 5-Minute Recruiter Demo Flow

### Step 1: Open the Application
Navigate to `http://localhost:3000` (or the deployed Vercel URL).
- View the **Executive Command Center** showing live application pipeline stats, recent activity, and quick actions.

### Step 2: Ingest & Deep Match a Job Listing
1. Click **Discover Jobs** in the navigation bar.
2. Browse active roles (e.g., *Lead AI Solutions Architect*).
3. Click **Deep Match Analysis**.
4. Observe the AI match engine evaluating the candidate against requirements:
   - Overall match score (e.g., 94%)
   - Hard skill coverage breakdown
   - Verifiable strength evidence directly linked to EarCodeX and Socinga
   - Strategic positioning advice.

### Step 3: ATS Resume Tailoring in CV Studio
1. Click **CV Studio**.
2. Select a target job.
3. Click **Generate Tailored CV**.
4. Inspect the side-by-side diff comparing the Master CV against the tailored ATS version. Note that **zero facts are fabricated**; only framing and keyword weighting are optimized.

### Step 4: Semantic Career Copilot (RAG)
1. Navigate to **Career Copilot (RAG)**.
2. Ask: *"What experience does Whitemore have with real-time IoT telemetry?"*
3. Observe the response: grounded in verified chunks from the Socinga smart mining platform with clickable citation pills.

### Step 5: Interview Practice Room
1. Navigate to **Interview Prep**.
2. Choose a role and click **Generate AI Questions**.
3. Submit a STAR-formatted answer and review instant feedback from the AI evaluator.

---

## DevOps & Cloud Native Demonstration

### 1. Multi-Stage Hardened Docker
```bash
# Verify Dockerfile stages and non-root execution
docker build -t applywise-ai:local .
docker run -p 3000:3000 applywise-ai:local

# Health check inspection
curl http://localhost:3000/api/health
```

### 2. Kubernetes & Autoscaling
```bash
# Dry-run validation of all k8s resources
kubectl apply --dry-run=client -f k8s/

# Deploy with Helm
helm lint helm/applywise-ai
helm template test helm/applywise-ai -f helm/applywise-ai/values-production.yaml
```

### 3. CI/CD Pipeline
Every commit runs through:
- ESLint (zero warnings)
- TypeScript `tsc --noEmit`
- Vitest automated tests
- Next.js production build
- Multi-stage Docker build
- Helm syntax and template validation

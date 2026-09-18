# ApplyWise AI — Production Launch State

## Executive Summary
- **Product Name**: ApplyWise AI (`applywise-ai`)
- **Candidate Showcase**: Whitemore Ngwira (N. White)
- **Official Production URL**: `https://applywise-ai-app.vercel.app`
- **GitHub Repository**: `https://github.com/whitemorengwira/applywise-ai`
- **Local Directory**: `D:\applywise-ai`
- **Vercel Project**: `applywise-ai`
- **Deployment State**: READY / ACTIVE / FULLY CONFIGURED
- **Verified Timestamp**: 2026-09-16T15:10:00+02:00

---

## Production Verification Checklist

| Component | Target URL / Artifact | Status | Details |
|---|---|---|---|
| **Official Application Root** | `https://applywise-ai-app.vercel.app/` | Verified (HTTP 200) | Landing & dashboard fully rendered |
| **Liveness Probe** | `https://applywise-ai-app.vercel.app/api/health` | Verified (HTTP 200) | Database healthy, AI gateway ready, RAG indexed |
| **Readiness Probe** | `https://applywise-ai-app.vercel.app/api/ready` | Verified (HTTP 200) | Profile data OK, heap memory stable |
| **Prometheus Telemetry** | `https://applywise-ai-app.vercel.app/api/metrics` | Verified (HTTP 200) | Full Prom-client exposition for Grafana Cloud |
| **Supabase Project** | `https://vxiufajiipqdntsxmkjn.supabase.co` | Verified (HTTP 200) | Dedicated `applywise-ai` project with 25 tables |
| **Grafana Workspace** | `https://ardentcosmos829.grafana.net` | Verified (HTTP 200) | Dashboards 01 & 06 imported and active |
| **Type Check** | `npm run type-check` | Verified (0 errors) | Strict TypeScript compiler validation |
| **ESLint** | `npm run lint` | Verified (0 warnings) | ESLint code standards check |
| **Unit Tests** | `npm test` | Verified (13/13 pass) | 4 test suites covering AI Gateway, Match, RAG, Metrics |
| **Production Build** | `npm run build` | Verified (22/22 routes) | 100% route compilation success |
| **Git Working Tree** | `master` branch | Synced with origin | Clean and tracked |

---

## External Platform Configuration

### Supabase (Dedicated Project)
- **Project Name**: `applywise-ai`
- **Organization**: `nwhite-systems`
- **Project Reference**: `vxiufajiipqdntsxmkjn`
- **Region**: `eu-west-1` (Europe - Ireland)
- **Project URL**: `https://vxiufajiipqdntsxmkjn.supabase.co`
- **Database Status**: PostgreSQL 16+ active with `pgvector` extension
- **Tables**: 25 core tables deployed and verified in `public` schema
- **Row Level Security (RLS)**: Enforced on all domain tables
- **Authentication**: REST and Auth APIs tested with HTTP 200 OK
- **Credentials**: Safely populated in `.env.local` (git-ignored)

### Grafana Cloud
- **Account / Tenant**: `ardentcosmos829` (whitemorengwira2@gmail.com)
- **Workspace URL**: `https://ardentcosmos829.grafana.net/`
- **Prometheus Remote Write Endpoint**: `https://prometheus-prod-65-prod-eu-west-2.grafana.net/api/prom/push`
- **Instance ID**: `3586744`
- **API Token**: Active (`glc_...`) and verified with endpoint authentication
- **Imported Dashboards**:
  - `ApplyWise AI — Application Overview`: `https://ardentcosmos829.grafana.net/d/applywise-app-overview/applywise-ai-e28094-application-overview`
  - `06 — NWhite Systems Unified Cloud & Traffic Analytics`: `https://ardentcosmos829.grafana.net/d/nwhite-systems-unified-analytics/839c153`

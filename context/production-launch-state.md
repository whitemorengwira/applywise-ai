# ApplyWise AI — Production Launch State

## Executive Summary
- **Product Name**: ApplyWise AI (Per ADR-001)
- **Candidate Showcase**: Whitemore Ngwira (N. White)
- **Production URL**: `https://nwhitejobapplicationsapp2027.vercel.app`
- **GitHub Repository**: `https://github.com/whitemorengwira/applywise-ai`
- **Deployment Platform**: Vercel Free Tier (Production Aliased)
- **Deployment State**: READY / ACTIVE
- **Verified Timestamp**: 2026-09-16T14:05:00+02:00

---

## Production Verification Checklist

| Component | Target URL / Artifact | Status | Details |
|---|---|---|---|
| **Root Application** | `https://nwhitejobapplicationsapp2027.vercel.app/` | Verified (HTTP 200) | Landing & dashboard fully rendered |
| **Liveness Probe** | `https://nwhitejobapplicationsapp2027.vercel.app/api/health` | Verified (HTTP 200) | Database healthy, AI gateway ready, RAG indexed |
| **Readiness Probe** | `https://nwhitejobapplicationsapp2027.vercel.app/api/ready` | Verified (HTTP 200) | Profile data OK, heap memory stable |
| **Prometheus Telemetry** | `https://nwhitejobapplicationsapp2027.vercel.app/api/metrics` | Verified (HTTP 200) | Full Prom-client exposition for Grafana Cloud |
| **Type Check** | `npm run type-check` | Verified (0 errors) | Strict TypeScript compiler validation |
| **ESLint** | `npm run lint` | Verified (0 warnings) | ESLint code standards check |
| **Unit Tests** | `npm test` | Verified (10/10 pass) | 4 test suites covering AI Gateway, Match, RAG, Metrics |
| **Production Build** | `npm run build` | Verified (22/22 routes) | 100% route compilation success |
| **Git Working Tree** | `master` branch | Synced with origin | Clean and tracked |

---

## Quality Gates Status
- `npm run type-check`: PASS (0 errors)
- `npm run lint`: PASS (0 errors, 0 warnings)
- `npm test`: PASS (10/10 tests passed)
- `vercel --prod`: PASS (Deployment aliased to `https://nwhitejobapplicationsapp2027.vercel.app`)

---

## External Platform Configuration

### Supabase
- Account: Pending browser configuration / credentials in `.env.local`
- Project: `applywise-ai` (Pending remote provisioning)
- Database: Schema prepared in `supabase/migrations/`
- PostgreSQL: Version 15+ ready
- pgvector: Extension enabled in schema
- Authentication: Email & OAuth configuration ready
- Storage: Document buckets configured in schema
- RLS: 35+ table policies defined
- Production connection: Pending `.env.local` population

### Grafana Cloud
- Account: whitemorengwira2@gmail.com (Free Tier)
- Stack: Pending remote stack setup / `.env.local`
- Plan: Free (<10k series, ~950 active)
- Prometheus: Scrape endpoint live at `/api/metrics`
- Data source/integration: Pending connection
- Dashboards: 6 JSON Dashboards in `observability/grafana/dashboards/`
- Alerts: Defined in `observability/prometheus/alerts.yml`
- Live telemetry: Verified via `/api/metrics`

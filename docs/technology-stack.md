# Technology Stack Architecture & Justification Table

## Overview

Every technology integrated into **ApplyWise AI** has been selected with deliberate architectural justification. No dependency or tool is included merely as a vanity badge. The stack satisfies enterprise engineering standards while maintaining a **100% Free-Tier Operation Guarantee**.

---

## Technology Selection & Justification Matrix

| Technology | Architectural Purpose | Why Chosen | Free-Tier Strategy |
|---|---|---|---|
| **Next.js 15** | Application Platform | React Server Components, Turbopack asset bundling, App Router API routes, standalone container output. | Open source framework, zero licensing fees. |
| **TypeScript** | Static Typing & Contract Safety | Compile-time safety across AI gateway payloads, database models, and domain services; prevents runtime null pointer errors. | Open source compiler (`tsc`). |
| **React 19** | Component Architecture | Modern declarative UI, Concurrent features, accessible state management. | Open source library. |
| **Tailwind CSS v4** | Design System & Token Styling | Modern utility-first styling with custom CSS design tokens, dark mode, and responsive ergonomics. | Open source tooling. |
| **Supabase** | Managed PostgreSQL & Authentication | Enterprise relational database with Row Level Security (RLS), real-time subscriptions, and integrated vector support. | Free tier (500MB DB, 50,000 monthly active users, 1GB storage). |
| **PostgreSQL 15+** | Relational Data Store | ACID transactional integrity for applications CRM, job listings, and candidate career milestones. | Included in Supabase free tier / local Docker. |
| **pgvector** | Dense Vector Storage | Native SQL vector indexing (`vector(1536)`), semantic similarity (`<=>` cosine distance) without needing expensive third-party vector databases. | Built-in open-source PostgreSQL extension. |
| **OpenCode Zen & Cloudflare AI Gateway** | 100% Free AI Model Suite | Capability-based routing across verified free models (Nemotron 3 Ultra, Nemotron 3.5 Lightning, Ling 3.0, MiMo 2.5, Muse Spark 1.3) with edge caching and circuit breakers. | Legitimate 100% free model routing with zero silent paid fallback. |
| **LangChain.js** | AI Primitives & Tool Binding | Standardized prompt templates, text splitters, and vector store abstractions. | Open source library. |
| **LangGraph.js** | Stateful Agent Workflows | Cyclic agent loops, human-in-the-loop validation, checkpointing, and conditional routing for complex job analysis and CV tailoring. | Open source library. |
| **Docker** | Containerisation | Multi-stage build (`node:20-alpine`), non-root execution (`UID 1001`), standalone Next.js bundle (<180MB). | Open source runtime, zero cost. |
| **Docker Compose** | Local Multi-Service Orchestration | Declarative local container execution with healthcheck and resource limits. | Open source tooling. |
| **Kubernetes** | Container Orchestration | Automated deployment, self-healing, rolling updates, and autoscaling (HPA) demonstration. | Open source / Minikube / kind local cluster. |
| **Helm v3** | Kubernetes Packaging | Parameterized, repeatable releases across development and production environments (`values-development.yaml`, `values-production.yaml`). | Open source package manager. |
| **Terraform** | Infrastructure as Code (IaC) | Declarative provisioning of Grafana Cloud workspaces, folders, dashboards, and alert notification points. | Open source CLI (`terraform fmt`, `terraform validate`). |
| **Prometheus** | Metrics Collection & Time-Series | Industry-standard pull-based telemetry, low-cardinality label design, PromQL querying. | Open source engine and `prom-client` Node.js package. |
| **Grafana Cloud Free** | Centralized Observability & Dashboards | Managed SaaS observability platform, unified dashboards, and multi-channel alerting. | Grafana Cloud Free tier (10k active series, 50GB logs, 50GB traces). |
| **GitHub Actions** | CI/CD Quality Gates | Automated linting, type-checking, unit testing, container build verification, and Helm/Terraform linting. | Free for public repositories (2,000 monthly minutes on private repos). |
| **Vercel** | Serverless Edge Hosting | Global edge distribution, instant branch previews, serverless API execution. | Vercel Hobby tier (100 deployments/day, 100GB bandwidth). |

---

## Architectural Principle: Anti-Duplication Rule

1. **No Redundant Vector Databases**: We do not introduce Pinecone, Weaviate, or Qdrant because `pgvector` inside Supabase provides zero-overhead vector storage within the existing PostgreSQL database.
2. **No Heavy Commercial APMs**: We reject Datadog and Dynatrace to avoid vendor lock-in and high subscription fees.
3. **Low-Cardinality Prometheus Design**: By strictly bounding metric labels, our telemetry uses <10% of Grafana Cloud Free capacity.

# ADR-009: Kubernetes Workload Architecture and Helm Packaging

## Status
Accepted

## Date
2026-09-15

## Context
Deploying ApplyWise AI across diverse cloud and on-premises environments requires a standardised, repeatable orchestration model. The infrastructure must demonstrate cloud-native best practices: resource bounding, automated horizontal scaling, least-privilege networking, dedicated service accounts, and modular Helm chart templating.

## Decision
1. **Kubernetes Resources (`k8s/`)**:
   - `Namespace`: Isolated namespace `applywise-ai`.
   - `ServiceAccount`: Dedicated unprivileged service account with `automountServiceAccountToken: false`.
   - `Deployment`: 2 replicas with RollingUpdate (`maxSurge: 1, maxUnavailable: 0`), non-root pod security context, and granular three-tier probes (startup, liveness, readiness).
   - `Service`: `ClusterIP` exposing port 80 -> container port 3000.
   - `HorizontalPodAutoscaler (HPA)`: Autoscaling from 2 to 5 replicas based on 75% CPU and 80% memory utilization.
   - `NetworkPolicy`: Strict default egress/ingress rules allowing only required ingress (port 3000), DNS (port 53), and outbound HTTPS (port 443) for AI gateway APIs.
2. **Helm Packaging (`helm/applywise-ai`)**:
   - Version 3 chart compliant with standard semantic versioning.
   - Environment-specific value overrides: `values-development.yaml` (1 replica, reduced memory) and `values-production.yaml` (3 replicas, HPA to 10 replicas).

## Consequences
- **Positive**:
  - Declarative, reproducible deployments across Minikube, kind, EKS, GKE, and AKS.
  - Zero-downtime rolling updates with active health check verification.
  - Granular cost and compute boundaries avoiding runaway billing.
- **Negative**:
  - Requires maintaining Helm templates alongside static manifests during major schema updates.

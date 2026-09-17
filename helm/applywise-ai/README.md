# ApplyWise AI Helm Chart

Production Helm v3 chart for deploying **ApplyWise AI** on Kubernetes clusters (Minikube, kind, k3s, EKS, GKE, AKS).

## Prerequisites

- Kubernetes 1.26+
- Helm 3.10+
- Ingress controller (optional)
- Secrets configured for OpenCode Zen / Supabase credentials

## Quick Start

### 1. Lint and Validate

```bash
helm lint helm/applywise-ai
helm template test-release helm/applywise-ai --values helm/applywise-ai/values-development.yaml
```

### 2. Install Development Release

```bash
helm install applywise-dev helm/applywise-ai \
  --namespace applywise-ai \
  --create-namespace \
  --values helm/applywise-ai/values-development.yaml \
  --set secrets.opencodeZenApiKey="$OPENCODE_ZEN_API_KEY" \
  --set secrets.supabaseUrl="$NEXT_PUBLIC_SUPABASE_URL" \
  --set secrets.supabaseAnonKey="$NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

### 3. Install Production Release

```bash
helm install applywise-prod helm/applywise-ai \
  --namespace applywise-ai \
  --create-namespace \
  --values helm/applywise-ai/values-production.yaml
```

## Configuration Parameters

| Parameter | Description | Default |
|---|---|---|
| `replicaCount` | Number of pods | `2` |
| `image.repository` | Docker image repository | `applywise-ai` |
| `image.tag` | Docker image tag | `""` (chart appVersion) |
| `service.type` | Kubernetes Service type | `ClusterIP` |
| `service.port` | Service port | `80` |
| `service.targetPort` | Container port | `3000` |
| `autoscaling.enabled` | Enable HorizontalPodAutoscaler | `true` |
| `autoscaling.minReplicas` | Minimum HPA replicas | `2` |
| `autoscaling.maxReplicas` | Maximum HPA replicas | `5` |
| `networkPolicy.enabled` | Enforce strict network egress/ingress | `true` |
| `probes.startup.enabled` | Startup probe enabled | `true` |
| `probes.liveness.enabled` | Liveness probe enabled | `true` |
| `probes.readiness.enabled` | Readiness probe enabled | `true` |

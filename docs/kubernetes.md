# Kubernetes Workload Architecture — ApplyWise AI

## Architecture Overview

ApplyWise AI provides cloud-native deployment manifests inside the `k8s/` directory.

```
k8s/
├── namespace.yaml           # Isolated 'applywise-ai' namespace
├── serviceaccount.yaml      # Non-root unprivileged ServiceAccount
├── configmap.yaml           # Non-sensitive runtime variables
├── secrets.example.yaml     # Credentials template (never committed)
├── deployment.yaml          # 2-replica Deployment with probes and securityContext
├── service.yaml             # ClusterIP routing traffic to port 3000
├── hpa.yaml                 # Autoscaling policy (2 to 5 replicas)
└── network-policy.yaml      # Egress/ingress security boundary
```

## Key Architectural Decisions

### 1. Three-Tier Health Probing
- **Startup Probe**: Tolerates cold-boot initialization without premature restarts (`failureThreshold: 12`, checks every 5s for up to 60s).
- **Liveness Probe**: Detects hung event loops or process deadlocks via `/api/health` every 20s.
- **Readiness Probe**: Controls ingress traffic routing, ensuring traffic only hits pods ready to serve requests (`initialDelaySeconds: 10`, period 10s).

### 2. Pod Hardening
- `runAsNonRoot: true` with `runAsUser: 1001` and `runAsGroup: 1001`.
- `allowPrivilegeEscalation: false`.
- Kernel capabilities dropped (`ALL`).

### 3. Resource Bounds
- **Requests**: `cpu: 100m`, `memory: 128Mi`
- **Limits**: `cpu: 500m`, `memory: 512Mi`

### 4. Zero-Trust Network Policy
Allows ingress strictly on port 3000, egress for DNS (port 53) and HTTPS (port 443) to OpenRouter AI models and Supabase PostgreSQL.

## Local Deployment (Kind / Minikube)

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Apply config and secrets
kubectl apply -f k8s/serviceaccount.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.example.yaml

# 3. Deploy application and service
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/network-policy.yaml

# 4. Verify deployment
kubectl get pods -n applywise-ai
kubectl get svc -n applywise-ai
```

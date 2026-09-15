# Helm Packaging & Deployment — ApplyWise AI

## Overview

The `helm/applywise-ai` chart packages all Kubernetes resources into a parameterized, reusable release artifact following Helm v3 conventions.

## Directory Structure

```
helm/applywise-ai/
├── Chart.yaml                  # Chart metadata and versioning
├── values.yaml                 # Base configuration defaults
├── values-development.yaml     # Single-pod, low-resource profile
├── values-production.yaml      # Multi-pod, HPA, hardened profile
├── README.md                   # Chart usage instructions
└── templates/
    ├── _helpers.tpl            # Template name/label helpers
    ├── serviceaccount.yaml     # ServiceAccount manifest
    ├── configmap.yaml          # Runtime configuration
    ├── secret.yaml             # Managed secret manifest
    ├── deployment.yaml         # Workload deployment
    ├── service.yaml            # Internal cluster routing
    ├── hpa.yaml                # Autoscaler template
    └── networkpolicy.yaml      # Egress/ingress boundaries
```

## Linting & Dry Run Testing

```bash
# Lint syntax and schema
helm lint helm/applywise-ai

# Render default values
helm template test-release helm/applywise-ai

# Render development environment
helm template test-dev helm/applywise-ai -f helm/applywise-ai/values-development.yaml

# Render production environment
helm template test-prod helm/applywise-ai -f helm/applywise-ai/values-production.yaml
```

## Release Lifecycle

```bash
# Install development release
helm install applywise-dev helm/applywise-ai \
  --namespace applywise-ai \
  --create-namespace \
  -f helm/applywise-ai/values-development.yaml

# Upgrade in-place with zero downtime
helm upgrade applywise-dev helm/applywise-ai \
  --namespace applywise-ai \
  -f helm/applywise-ai/values-development.yaml

# Rollback on failure
helm rollback applywise-dev 1 -n applywise-ai
```

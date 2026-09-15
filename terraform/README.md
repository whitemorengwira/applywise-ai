# ApplyWise AI — Infrastructure as Code (Terraform)

## Overview

ApplyWise AI utilizes **Terraform** to codify cloud platform infrastructure, Grafana Cloud Free observability assets (dashboards as code, alert notification contact points, and workspace folders), and environment configurations into reproducible, version-controlled manifests.

## Architectural Separation of Concerns

To prevent resource drift and conflicting ownership:
- **Terraform**: Manages cloud platform configuration (Grafana Cloud resources, dashboards, alert contact points).
- **Helm**: Manages containerized application workloads and services inside Kubernetes.
- **Kubectl**: Used strictly for cluster inspection, debugging, and ad-hoc diagnostics.

## Directory Structure

```
terraform/
├── main.tf                    # Root composition module
├── variables.tf               # Input parameter definitions
├── outputs.tf                 # Exported resource IDs & UIDs
├── providers.tf               # Grafana Cloud provider configuration
├── versions.tf                # Provider version pins
├── terraform.tfvars.example   # Example variables template (credentials masked)
├── environments/
│   ├── development/           # Development environment profile
│   └── production/            # Production environment profile
└── modules/
    └── grafana/               # Reusable Grafana observability module
        ├── main.tf            # Folders, Dashboards, Contact Points
        ├── variables.tf       # Module inputs
        └── outputs.tf         # Module outputs
```

## Quick Start & Verification

### 1. Format Code
```bash
terraform fmt -check -recursive
```

### 2. Initialize Providers (Local or CI)
```bash
terraform init -backend=false
```

### 3. Validate Configuration
```bash
terraform validate
```

### 4. Plan Deployment
```bash
# Copy template and fill your Grafana Cloud Free credentials
cp terraform.tfvars.example terraform.tfvars

terraform plan
```

## State Management & Security

- **Strict No-Commit Rule**: State files (`*.tfstate`, `*.tfstate.backup`) and sensitive variable files (`*.tfvars`) are strictly ignored via `.gitignore`.
- **Zero Hardcoded Secrets**: All authentication tokens and endpoints are passed via environment variables (`TF_VAR_grafana_auth`) or secure CI/CD secrets.

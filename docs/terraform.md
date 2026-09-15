# Infrastructure as Code Architecture — ApplyWise AI

## 1. Why Terraform is Used

In enterprise and cloud-native software engineering, infrastructure must be deterministic, version-controlled, auditable, and reproducible. ApplyWise AI utilizes **Terraform (v1.5+)** as its Infrastructure as Code (IaC) layer to codify:
- Observability workspaces and folders.
- Production Grafana dashboards as code.
- Alerting contact points and notification channels.
- Environment configurations across development and production.

---

## 2. Separation of Concerns Matrix

To avoid conflicting ownership between tools:

| Domain | Tool | Ownership & Responsibilities |
|---|---|---|
| **Platform & Observability** | **Terraform** | Grafana Cloud folders, dashboards-as-code, alert contact points, cloud metadata. |
| **Application Workloads** | **Helm** | Kubernetes deployment replicas, service routing, ConfigMaps, Secrets, HPA, NetworkPolicy. |
| **Application Hosting** | **Vercel** | Edge network routing, Next.js serverless build artifacts, edge caching. |
| **Inspection & Diagnostics** | **Kubectl** | Live cluster triage, pod log streaming, incident response. |

---

## 3. Directory Layout

```
terraform/
├── main.tf                    # Root composition module
├── variables.tf               # Input parameter definitions with typing
├── outputs.tf                 # Exported folder UIDs & dashboard maps
├── providers.tf               # Grafana Cloud official provider block
├── versions.tf                # Provider version pins (grafana ~> 3.0)
├── terraform.tfvars.example   # Example variables template (credentials masked)
├── environments/
│   ├── development/           # Development environment module instantiation
│   └── production/            # Production environment module instantiation
└── modules/
    └── grafana/               # Reusable Grafana observability module
        ├── main.tf            # grafana_folder, grafana_dashboard, grafana_contact_point
        ├── variables.tf       # Parameter contracts
        └── outputs.tf         # Exported attributes
```

---

## 4. State Management Strategy

1. **Strict No-Commit Rule**: State files contain metadata and potential sensitive tokens. The `.gitignore` strictly rejects:
   - `*.tfstate`
   - `*.tfstate.backup`
   - `.terraform/`
   - `*.tfvars` (allowing only `*.tfvars.example`)
2. **Local Showcase vs Remote State**:
   - For local demonstration and recruiter evaluation, Terraform operates with local state (excluded from Git).
   - In production enterprise deployments, state is maintained in Supabase or an AWS S3 bucket with DynamoDB state locking and KMS encryption.

---

## 5. Automated CI/CD Validation

Every pull request and commit to `master` automatically validates Terraform code:
```bash
# 1. Check code formatting compliance
terraform fmt -check -recursive

# 2. Initialize provider plugins without backend requirement
terraform init -backend=false

# 3. Validate syntax and configuration integrity
terraform validate
```

---

## 6. Security Principles

- **Zero Hardcoded Secrets**: Secrets are never placed in `.tf` files.
- **Variable Masking**: Sensitive variables such as `grafana_auth` are declared with `sensitive = true`, preventing value leakage in console output or logs.
- **Principle of Least Privilege**: Grafana service accounts used by Terraform are granted strictly `Editor` or `Admin` permissions limited to the `applywise-ai` workspace.

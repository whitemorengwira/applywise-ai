# ADR-010: CI/CD Quality Gate and Validation Automation

## Status
Accepted

## Date
2026-09-15

## Context
A production showcase project must ensure that every pull request and commit to master passes stringent automated verification: linting, static typing, automated unit testing, production bundle generation, container build checks, and Helm template rendering.

## Decision
Implement modular GitHub Actions workflows:
1. `ci.yml`: Runs on all PRs and master commits. Executes ESLint, TypeScript `tsc --noEmit`, Vitest unit/integration suite, and `npm run build`.
2. `docker.yml`: Triggered on changes to container files or application source. Builds multi-stage Docker image with layer caching.
3. `k8s.yml`: Triggered on changes to `k8s/` or `helm/`. Executes `helm lint`, templates development and production value sets, and executes client-side dry runs against static manifests via `kubectl`.

## Consequences
- **Positive**:
  - Catches regressions, broken types, or malformed YAML before deployment.
  - Fast feedback loop with GitHub Actions cache.
  - 100% free-tier compatible on GitHub public/private repositories.
- **Negative**:
  - Adds build time to PR evaluations.

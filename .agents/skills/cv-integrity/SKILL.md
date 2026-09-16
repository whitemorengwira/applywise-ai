---
name: cv-integrity
description: "Operational skill enforcing absolute cryptographic immutability of the Master CV PDF (whitemore_ngwira_cv_n.white.pdf)"
---

# /cv-integrity — Master CV Cryptographic Integrity & Immutability Skill

## Purpose
Enforces the non-negotiable rule: **The approved Master CV is IMMUTABLE**.
Under no circumstances may any agent, workflow, or user rewrite, tailor, modify, shorten, expand, or restructure the Master CV.

## Master CV Specification
- **Master CV File**: `whitemore_ngwira_cv_n.white.pdf`
- **Authoritative SHA-256 Checksum**: `3994a09c76cb5922f41f6a212aa99e1392d0a06dbecf650cb307756d5ef2423f`
- **File Size**: 42,135 bytes
- **Master Cover Letter Baseline**: `whitemore_ngwira_cover_n.white.pdf` (`a8ec57d01e1437b79aed01e72c822f0c59ade05907763ac476cea2caac7db2b7`)

## Invariants
1. **Zero Dynamic CV Rewriting**: All attempts to rewrite or dynamically regenerate the CV fail safely with `CVImmutabilityViolationError`.
2. **Submission Verification**: Every submitted application references and submits the exact certified PDF.
3. **Adaptive Document**: Only the **Cover Letter** is tailored.
4. **Verification Call**: Always invoke `CVIntegrityService.verifyMasterCV()` prior to any application dispatch.

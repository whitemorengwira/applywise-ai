---
name: zoho-email
description: "Zoho official business email application workflow, attachment verification, and audit trail logging"
---

# /zoho-email — Zoho Email Application Workflow Skill

## Purpose
Governs email-based job applications originating from the candidate's official business email: `whitemore@nwhite.systems` / `hello@nwhite.systems`.

## Policy & Safeguards
1. **Approval Gate**: Email applications follow `PREPARE → REVIEW → APPROVE → SEND`. Direct emails are never dispatched without explicit verification of recipient legitimacy.
2. **Immutable CV Attachment**: The exact certified Master CV PDF (`whitemore_ngwira_cv_n.white.pdf`, SHA-256 `3994a09c...`) is attached.
3. **Adaptive Cover Letter**: Formatted professionally in plain text or PDF with direct citations to N.White Systems evidence.
4. **Audit Trail**: Every email application logs:
   - Recruiter email address
   - Subject line & body hash
   - CV checksum
   - Generated cover letter hash
   - Timestamp and delivery reference ID.

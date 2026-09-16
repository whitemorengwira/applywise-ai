---
name: cover-letter
description: "Adaptive, grounded executive cover letter generation skill using approved template and verified evidence"
---

# /cover-letter — Adaptive Grounded Cover Letter Skill

## Purpose
Generates role-specific, highly tailored executive cover letters strictly grounded in candidate evidence from the Master CV, N.White Systems, and client case studies.

## Invariant Rules
1. **Adaptive Document**: The Cover Letter is the **sole** adaptive document in the application package (the CV is immutable).
2. **Strict Grounding**: Every substantive technical achievement claim must cite verified evidence (e.g., EarCodeX on AWS, LiteLLM/Cloudflare AI Gateway across 300+ cities, Cineterns, Socinga Smart Mining).
3. **Approved Template & Style**: Retains the voice, structural cadence, and executive tone established in `whitemore_ngwira_cover_n.white.pdf`.
4. **Provenance Tracking**: Stores generated cover letter content hash, model used, CV hash referenced, and evidence chunks cited.

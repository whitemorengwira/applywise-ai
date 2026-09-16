---
name: job-eligibility
description: "Authoritative geographic rules, work arrangement verification, and role priority evaluation engine"
---

# /job-eligibility — Job Eligibility & Geographic Verification Skill

## Purpose
Evaluates geographic compliance, candidate work authorization, and role priority tiers according to the Authoritative Directive.

## Geographic Rules (Corrected Standard)
1. **South Africa**: Candidate is open to **Remote, Hybrid, or On-site**. All three modes are 100% eligible.
2. **Zimbabwe**: Candidate is open to **Remote, Hybrid, or On-site**.
3. **Malawi**: Candidate is open to **Remote, Hybrid, or On-site**.
4. **Wider Africa**: Prioritize roles that genuinely hire African talent; remote required unless African contractor arrangements exist.
5. **Global / International**:
   - Remote does **NOT** mean globally eligible.
   - Roles requiring US/UK/EU domestic work authorization or citizenship are **INELIGIBLE**.
   - Remote roles without explicit cross-border/contractor terms must be marked **`UNKNOWN — VERIFY`**. Never hallucinate eligibility.

## Role Priority Hierarchy
- **Tier 1**: AI / Agentic AI / AI Systems / AI Solutions Architecture (Priority 100)
- **Tier 2**: AI + Cloud Architecture (Priority 92)
- **Tier 3**: Cloud Architecture / Cloud Engineering (Priority 88)
- **Tier 4**: Platform / Infrastructure / SRE (Priority 84)
- **Tier 5**: DevOps / DevSecOps (Priority 80)
- **Tier 6**: Systems Architecture & Principal Engineering (Priority 78)
- **Tier 7**: Automation & Technical Operations (Priority 72)
- Deprioritized: Generic junior software or unrelated multimedia roles.

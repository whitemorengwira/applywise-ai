---
name: langgraph-orchestration
description: "LangGraph stateful agent workflow orchestration for autonomous application generation, verification, and proof capture"
---

# /langgraph-orchestration — LangGraph Agentic Pipeline Skill

## Purpose
Orchestrates the multi-node, stateful job application lifecycle with typed annotations, conditional branches, and persistent checkpointing.

## Pipeline Lifecycle
```mermaid
graph TD
  START --> LOAD_CANDIDATE[Load Candidate Context]
  LOAD_CANDIDATE --> FRESHNESS[Check Freshness & Deduplication]
  FRESHNESS --> ELIGIBILITY[Evaluate Geography & Eligibility]
  ELIGIBILITY --> EVIDENCE[Retrieve RAG Evidence]
  EVIDENCE --> RESEARCH[Research Company]
  RESEARCH --> DECIDE{Decide: APPLY?}
  DECIDE -- Yes --> COVER_LETTER[Generate Adaptive Cover Letter]
  DECIDE -- No --> RECONCILE[Reconcile & Checkpoint]
  COVER_LETTER --> VERIFY_CV[Verify Master CV SHA-256 Hash]
  VERIFY_CV --> SUBMIT[Prepare & Submit Application]
  SUBMIT --> RECONCILE
  RECONCILE --> END_NODE[End]
```

## State & Checkpointing
- All nodes operate on `ApplicationStateAnnotation`.
- Ineligible jobs conditionally bypass generation and submission nodes to protect candidate reputation and prevent spam.
- Submissions require both `decision === "APPLY"` and `cvHashVerified === true`.

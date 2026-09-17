/**
 * ApplyWise AI — Intelligent Control-Plane Chat & Agent Orchestrator Types
 * Authoritative Type Specifications adhering to Master Directive Sections 7, 11, 12, 17, 19, 24
 */

export type ControlIntent =
  | "CONVERSATION"
  | "SYSTEM_STATUS"
  | "JOB_DISCOVERY"
  | "JOB_ANALYSIS"
  | "JOB_ELIGIBILITY"
  | "COMPANY_RESEARCH"
  | "APPLICATION_REVIEW"
  | "APPLICATION_PREPARATION"
  | "APPLICATION_SUBMISSION"
  | "COVER_LETTER"
  | "CV_INTEGRITY"
  | "RAG_QUERY"
  | "CAREER_INTELLIGENCE"
  | "AUTONOMOUS_OPERATIONS"
  | "SCHEDULER_CONTROL"
  | "MODEL_STATUS"
  | "AI_OPERATIONS"
  | "OBSERVABILITY"
  | "INFRASTRUCTURE"
  | "DATABASE"
  | "RECOVERY"
  | "REPORTING"
  | "MARKETING"
  | "UNKNOWN";

export type GroundingCategory =
  | "FACT_FROM_SYSTEM"
  | "FACT_FROM_CANDIDATE_EVIDENCE"
  | "FACT_FROM_EXTERNAL_SOURCE"
  | "MODEL_REASONING"
  | "USER_PROVIDED"
  | "UNKNOWN";

export type ControlRuntimeStatus =
  | "REAL_AI"
  | "DEGRADED"
  | "SIMULATION_HEURISTIC"
  | "UNAVAILABLE"
  | "AI_RUNTIME_UNAVAILABLE";

export interface PendingApprovalAction {
  actionId: string;
  actionType: string;
  description: string;
  targetResource: string;
  payload: Record<string, unknown>;
  createdAt: string;
  expiresAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface ToolExecutionRecord {
  toolName: string;
  latencyMs: number;
  success: boolean;
  provenance: string;
  data?: unknown;
  error?: string;
}

export interface ControlResponseMetadata {
  provider: string;
  model: string;
  runtime: ControlRuntimeStatus;
  requestId: string;
  latencyMs: number;
  fallback: boolean;
}

export interface ControlPlaneResponse {
  message: string;
  intent: ControlIntent;
  groundingCategory: GroundingCategory;
  plan?: string;
  execution?: string;
  result?: string;
  evidence?: string;
  nextActions?: string[];
  runtimeStatus: ControlRuntimeStatus;
  activeModel: string;
  provider: string;
  toolCalls: ToolExecutionRecord[];
  requiresApproval: boolean;
  pendingAction?: PendingApprovalAction;
  auditId: string;
  timestamp: string;
  metadata?: ControlResponseMetadata;
}

export interface ControlChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  intent?: ControlIntent;
  runtimeStatus?: ControlRuntimeStatus;
  plan?: string;
  execution?: string;
  result?: string;
  evidence?: string;
  nextActions?: string[];
  toolCalls?: ToolExecutionRecord[];
  pendingAction?: PendingApprovalAction;
}

export interface ControlTool {
  name: string;
  description: string;
  isMutating: boolean;
  requiresApproval: boolean;
  execute: (params: Record<string, unknown>) => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
    provenance: string;
  }>;
}

export interface ControlAuditEvent {
  id: string;
  timestamp: string;
  eventType: string;
  intent: ControlIntent;
  toolInvoked?: string;
  status: "SUCCESS" | "FAILED" | "PENDING_APPROVAL";
  metadata: Record<string, unknown>;
}

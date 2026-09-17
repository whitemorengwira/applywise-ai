/**
 * ApplyWise AI — Intelligent Intent Classification Engine
 * Evaluates incoming user prompts before any action is taken.
 * Adheres strictly to Master Directive Sections 6, 7, 17, 18.
 */

import { ControlIntent } from "./types";

export interface IntentClassificationResult {
  intent: ControlIntent;
  confidence: number;
  extractedEntities: {
    jobId?: string;
    companyName?: string;
    technology?: string;
    location?: string;
    roleTitle?: string;
  };
  reasoning: string;
}

export class IntentClassifier {
  /**
   * Fast, deterministic classification of conversational and operational prompts.
   */
  static classify(rawInput: string): IntentClassificationResult {
    const text = rawInput.trim();
    const lower = text.toLowerCase();

    // 1. GREETINGS & CASUAL CONVERSATION (Section 6 & 18 Mandatory Requirement)
    // Simple conversational messages MUST remain conversational and not trigger operational agents or hallucinations.
    // Domain inquiries (architecture, systems, AWS, case studies, jobs, CV, etc.) MUST NEVER be misclassified as greetings.
    const hasDomainInquiryKeywords =
      lower.includes("architect") ||
      lower.includes("system") ||
      lower.includes("cloud") ||
      lower.includes("aws") ||
      lower.includes("terraform") ||
      lower.includes("project") ||
      lower.includes("case stud") ||
      lower.includes("cv") ||
      lower.includes("job") ||
      lower.includes("application") ||
      lower.includes("model") ||
      lower.includes("scheduler") ||
      lower.includes("background") ||
      lower.includes("experience") ||
      lower.includes("earcodex") ||
      lower.includes("supabets") ||
      lower.includes("nico") ||
      lower.includes("socinga") ||
      lower.includes("samf") ||
      lower.includes("evidence") ||
      lower.includes("rag");

    if (!hasDomainInquiryKeywords) {
      const greetingPatterns = [
        /^hi[\s!.,?]*$/i,
        /^hello[\s!.,?]*$/i,
        /^hey[\s!.,?]*$/i,
        /^greetings[\s!.,?]*$/i,
        /^good (morning|afternoon|evening|day)[\s!.,?]*$/i,
        /^how are you[\s!.,?]*$/i,
        /^what'?s up[\s!.,?]*$/i,
        /^yo[\s!.,?]*$/i,
      ];

      for (const pattern of greetingPatterns) {
        if (pattern.test(text)) {
          return {
            intent: "CONVERSATION",
            confidence: 1.0,
            extractedEntities: {},
            reasoning: "Exact match for conversational greeting. Handled courteously without operational tool execution.",
          };
        }
      }

      // Gratitude and conversational pleasantries
      if (/^(thanks|thank you|cheers|great|awesome|cool|ok|okay)[\s!.,]*$/i.test(text)) {
        return {
          intent: "CONVERSATION",
          confidence: 0.95,
          extractedEntities: {},
          reasoning: "Conversational acknowledgment or pleasantry.",
        };
      }
    }

    // 2. CAPABILITIES & IDENTITY ("What can you do?", "Who are you?", "Help")
    if (
      lower.includes("what can you do") ||
      lower.includes("what can you control") ||
      lower.includes("who are you") ||
      lower.includes("capabilities") ||
      lower === "help" ||
      lower === "?"
    ) {
      return {
        intent: "SYSTEM_STATUS",
        confidence: 0.98,
        extractedEntities: {},
        reasoning: "Inquiry into control-plane capabilities and system orchestration authority.",
      };
    }

    // 3. CV INTEGRITY & IMMUTABILITY
    if (
      lower.includes("cv hash") ||
      lower.includes("cv integrity") ||
      lower.includes("master cv") ||
      lower.includes("sha-256") ||
      lower.includes("sha256") ||
      (lower.includes("verify") && lower.includes("cv"))
    ) {
      return {
        intent: "CV_INTEGRITY",
        confidence: 0.95,
        extractedEntities: {},
        reasoning: "Inspection of Master CV cryptographic SHA-256 hash and immutability invariants.",
      };
    }

    // 4. AI MODEL STATUS & RUNTIME
    if (
      lower.includes("model are you using") ||
      lower.includes("what model") ||
      lower.includes("ai model") ||
      lower.includes("model status") ||
      lower.includes("opencode zen") ||
      lower.includes("runtime status") ||
      lower.includes("nemotron") ||
      lower.includes("ling-3") ||
      lower.includes("muse-spark") ||
      lower.includes("mimo") ||
      (lower.includes("model") && (lower.includes("unavailable") || lower.includes("answering") || lower.includes("running") || lower.includes("active")))
    ) {
      return {
        intent: "MODEL_STATUS",
        confidence: 0.95,
        extractedEntities: {},
        reasoning: "Query regarding active AI model, provider routing, and actual runtime execution state.",
      };
    }

    // 5. AI OPERATIONS & USAGE METRICS
    if (
      lower.includes("ai usage") ||
      lower.includes("token usage") ||
      lower.includes("ai requests") ||
      lower.includes("gateway status")
    ) {
      return {
        intent: "AI_OPERATIONS",
        confidence: 0.92,
        extractedEntities: {},
        reasoning: "Query regarding AI gateway traffic, token consumption, and model latency metrics.",
      };
    }

    // 6. SYSTEM HEALTH & READINESS
    if (
      lower.includes("system healthy") ||
      lower.includes("system status") ||
      lower.includes("health check") ||
      lower.includes("is everything working") ||
      lower.includes("uptime")
    ) {
      return {
        intent: "SYSTEM_STATUS",
        confidence: 0.95,
        extractedEntities: {},
        reasoning: "Operational system health and probe status query.",
      };
    }

    // 7. RECOVERY & ERROR INVESTIGATION (Checked before scheduler to properly handle 'What failed during last run')
    if (
      lower.includes("failed") ||
      lower.includes("failure") ||
      lower.includes("recover") ||
      lower.includes("errors") ||
      lower.includes("what broke")
    ) {
      return {
        intent: "RECOVERY",
        confidence: 0.95,
        extractedEntities: {},
        reasoning: "Diagnosis and recovery of interrupted or failed agent workflows.",
      };
    }

    // 8. SCHEDULER & AUTONOMOUS OPERATIONS
    if (
      lower.includes("scheduler") ||
      lower.includes("autonomous cycle") ||
      lower.includes("doing right now") ||
      lower.includes("cron") ||
      lower.includes("last run") ||
      lower.includes("next run") ||
      lower.includes("autonomous mode")
    ) {
      return {
        intent: "SCHEDULER_CONTROL",
        confidence: 0.94,
        extractedEntities: {},
        reasoning: "Query regarding cloud autonomous cron scheduler, execution leases, and current cycle state.",
      };
    }

    // 9. CAREER STRATEGY & OBJECTIVES (Section 15 Mandatory Provider Test)
    if (
      lower.includes("career strategy") ||
      lower.includes("career objectives") ||
      lower.includes("career plan") ||
      lower.includes("career path") ||
      (lower.includes("career") && lower.includes("strategy"))
    ) {
      return {
        intent: "CAREER_INTELLIGENCE",
        confidence: 0.95,
        extractedEntities: {},
        reasoning: "Inquiry into candidate career strategy requiring real AI inference.",
      };
    }

    // 10. RAG & CANDIDATE EVIDENCE (Deterministic tool: query_rag)
    const isRagRegexMatch =
      /know.*about.*(my|whitemore|the candidate)/i.test(text) ||
      /(professional|technical|systems|cloud|software|enterprise|solutions?)\s+(architecture|background|experience|profile|history|projects?|track\s*record)/i.test(text) ||
      /(client|enterprise|past|previous|verified)\s+(projects?|case\s*stud(y|ies)|work|deployments?|blueprints?)/i.test(text) ||
      /(systems?|cloud|enterprise|solution|technical)\s+architect(ure)?/i.test(text) ||
      /(aws|terraform|cloud|infrastructure|devops)\s+(architecture|deployments?|blueprints?|experience|multi-region)/i.test(text) ||
      /case\s*stud(y|ies)/i.test(text) ||
      /tell\s+me\s+about.*(system|architect|background|experience|cloud|aws|project)/i.test(text);

    if (
      isRagRegexMatch ||
      lower.includes("evidence") ||
      lower.includes("earcodex") ||
      lower.includes("nico life") ||
      lower.includes("supabets") ||
      lower.includes("socinga") ||
      lower.includes("samf") ||
      lower.includes("cineterns") ||
      lower.includes("oasis college") ||
      lower.includes("systems architecture") ||
      lower.includes("system architecture") ||
      lower.includes("cloud architecture") ||
      lower.includes("enterprise architecture") ||
      lower.includes("aws architecture") ||
      lower.includes("architecture background") ||
      lower.includes("architectural background") ||
      lower.includes("technical background") ||
      lower.includes("systems background") ||
      lower.includes("professional background") ||
      lower.includes("my background") ||
      lower.includes("terraform blueprints") ||
      lower.includes("terraform") ||
      lower.includes("multi-region") ||
      lower.includes("litellm") ||
      lower.includes("ai gateway") ||
      lower.includes("ai gateways") ||
      lower.includes("past projects") ||
      lower.includes("client projects") ||
      lower.includes("enterprise projects") ||
      lower.includes("case study") ||
      lower.includes("case studies") ||
      lower.includes("experience with") ||
      lower.includes("architectural experience") ||
      lower.includes("cloud experience") ||
      lower.includes("n.white systems") ||
      lower.includes("nwhite systems") ||
      lower.includes("nwhite.systems") ||
      lower.includes("about n.white") ||
      lower.includes("about nwhite") ||
      lower.includes("know about me") ||
      lower.includes("know about my") ||
      lower.includes("know about whitemore") ||
      lower.includes("what do you know") ||
      lower.includes("candidate evidence") ||
      lower.includes("verified evidence") ||
      lower.includes("evidence base") ||
      lower.includes("portfolio") ||
      lower.includes("rag")
    ) {
      return {
        intent: "RAG_QUERY",
        confidence: 0.95,
        extractedEntities: {
          technology: lower.includes("aws") ? "AWS" : lower.includes("terraform") ? "Terraform" : undefined,
          companyName: lower.includes("earcodex") ? "EarCodeX" : lower.includes("nico") ? "NICO Life" : undefined,
        },
        reasoning: "Query for verified candidate technical achievements, client case studies, or architectural blueprints.",
      };
    }

    // 9. APPLICATION SUBMISSION (Mutating action)
    if (
      (lower.includes("submit") || lower.includes("send application")) &&
      !lower.includes("how many")
    ) {
      return {
        intent: "APPLICATION_SUBMISSION",
        confidence: 0.92,
        extractedEntities: {
          companyName: lower.includes("iqbusiness") ? "IQbusiness" : lower.includes("econet") ? "Econet" : undefined,
        },
        reasoning: "Request to submit an application. Requires explicit approval confirmation.",
      };
    }

    // 10. APPLICATION PREPARATION
    if (
      lower.includes("prepare application") ||
      lower.includes("prepare an application") ||
      lower.includes("prepare the application") ||
      lower.includes("draft application") ||
      lower.includes("prepare for")
    ) {
      return {
        intent: "APPLICATION_PREPARATION",
        confidence: 0.93,
        extractedEntities: {
          companyName: lower.includes("iqbusiness") ? "IQbusiness" : lower.includes("econet") ? "Econet" : undefined,
        },
        reasoning: "Request to execute the LangGraph pipeline and prepare application package in safe non-destructive mode.",
      };
    }

    // 11. APPLICATION REVIEW & PIPELINE STATUS
    if (
      (lower.includes("application") && (lower.includes("status") || lower.includes("pipeline") || lower.includes("review") || lower.includes("list") || lower.includes("that application") || lower.includes("this application"))) ||
      lower.includes("applications") ||
      lower.includes("awaiting approval") ||
      lower.includes("submitted this week") ||
      lower.includes("pipeline")
    ) {
      return {
        intent: "APPLICATION_REVIEW",
        confidence: 0.92,
        extractedEntities: {},
        reasoning: "Inspection of active application records, submitted counts, and approvals queue.",
      };
    }

    // 12. JOB ELIGIBILITY CHECK
    if (
      lower.includes("eligible for me") ||
      lower.includes("check eligibility") ||
      lower.includes("can i apply") ||
      lower.includes("is this role eligible")
    ) {
      return {
        intent: "JOB_ELIGIBILITY",
        confidence: 0.91,
        extractedEntities: {
          location: lower.includes("south africa") ? "South Africa" : lower.includes("zimbabwe") ? "Zimbabwe" : undefined,
        },
        reasoning: "Evaluation of geographic rules (SA/ZW/MW Remote/Hybrid/On-site) and candidate work authorization.",
      };
    }

    // 13. JOB ANALYSIS & FIT REASONING
    if (
      lower.includes("why is the top result") ||
      lower.includes("explain why") ||
      lower.includes("fit analysis") ||
      lower.includes("match analysis") ||
      lower.includes("compare job")
    ) {
      return {
        intent: "JOB_ANALYSIS",
        confidence: 0.90,
        extractedEntities: {},
        reasoning: "Three-way reasoning comparing Master CV, N.White Systems evidence, and job description.",
      };
    }

    // 14. JOB DISCOVERY & SEARCH
    if (
      lower.includes("find jobs") ||
      lower.includes("search jobs") ||
      lower.includes("latest jobs") ||
      lower.includes("eligible jobs") ||
      lower.includes("ai architect jobs") ||
      lower.includes("opportunities") ||
      ((lower.includes("job") || lower.includes("jobs") || lower.includes("role") || lower.includes("roles") || lower.includes("vacanc")) &&
       (lower.includes("latest") || lower.includes("eligible") || lower.includes("south africa") || lower.includes("find") || lower.includes("search") || lower.includes("architect")) &&
       !lower.includes("eligible for me") &&
       !lower.includes("explain why") &&
       !lower.includes("is this role") &&
       !lower.includes("submit") &&
       !lower.includes("prepare"))
    ) {
      return {
        intent: "JOB_DISCOVERY",
        confidence: 0.92,
        extractedEntities: {
          roleTitle: lower.includes("architect") ? "AI Architect" : "Engineer",
          location: lower.includes("south africa") ? "South Africa" : undefined,
        },
        reasoning: "Discovery and filtering of fresh, authentic job vacancies matching candidate profile.",
      };
    }

    // 15. COVER LETTER GENERATION
    if (
      lower.includes("cover letter") ||
      lower.includes("draft cover")
    ) {
      return {
        intent: "COVER_LETTER",
        confidence: 0.94,
        extractedEntities: {},
        reasoning: "Generation of adaptive cover letter grounded in candidate evidence and British English.",
      };
    }

    // 16. OBSERVABILITY & TELEMETRY
    if (
      lower.includes("observability") ||
      lower.includes("prometheus") ||
      lower.includes("grafana") ||
      lower.includes("metrics") ||
      lower.includes("telemetry") ||
      lower.includes("dashboards")
    ) {
      return {
        intent: "OBSERVABILITY",
        confidence: 0.93,
        extractedEntities: {},
        reasoning: "Query regarding Prometheus scrape metrics and Grafana Cloud operational dashboards.",
      };
    }

    // 17. DATABASE & STORAGE
    if (
      lower.includes("database") ||
      lower.includes("supabase") ||
      lower.includes("pgvector") ||
      lower.includes("chunks count")
    ) {
      return {
        intent: "DATABASE",
        confidence: 0.93,
        extractedEntities: {},
        reasoning: "Inspection of Supabase PostgreSQL database tables and pgvector embedding records.",
      };
    }

    // 18. RECOVERY & ERROR INVESTIGATION
    if (
      lower.includes("failed") ||
      lower.includes("recover") ||
      lower.includes("errors") ||
      lower.includes("what broke")
    ) {
      return {
        intent: "RECOVERY",
        confidence: 0.91,
        extractedEntities: {},
        reasoning: "Diagnosis and recovery of interrupted or failed agent workflows.",
      };
    }

    // 19. BROAD TECHNICAL & CAREER SAFETY NET
    // Ensure recognizable technical, architectural, or career inquiries never fall to UNKNOWN
    const isTechnicalOrCareerInquiry =
      lower.includes("architect") ||
      lower.includes("system") ||
      lower.includes("cloud") ||
      lower.includes("aws") ||
      lower.includes("terraform") ||
      lower.includes("devops") ||
      lower.includes("project") ||
      lower.includes("case stud") ||
      lower.includes("experience") ||
      lower.includes("background") ||
      lower.includes("competenc") ||
      lower.includes("portfolio") ||
      lower.includes("infrastructure") ||
      lower.includes("database") ||
      lower.includes("engineering") ||
      lower.includes("whitemore") ||
      lower.includes("ngwira") ||
      lower.includes("nwhite");

    if (isTechnicalOrCareerInquiry) {
      return {
        intent: "RAG_QUERY",
        confidence: 0.88,
        extractedEntities: {
          technology: lower.includes("aws") ? "AWS" : lower.includes("terraform") ? "Terraform" : undefined,
          companyName: lower.includes("earcodex") ? "EarCodeX" : lower.includes("nico") ? "NICO Life" : undefined,
        },
        reasoning: "Recognized technical, architectural, or candidate career inquiry mapped deterministically to candidate evidence base.",
      };
    }

    // 20. CAREER ADVICE, INTERVIEW PREP & STRATEGY
    const isCareerOrInterviewQuery =
      lower.includes("interview") ||
      lower.includes("advice") ||
      lower.includes("prepare") ||
      lower.includes("prep") ||
      lower.includes("strategy") ||
      lower.includes("hire") ||
      lower.includes("hired") ||
      lower.includes("salary") ||
      lower.includes("role") ||
      lower.includes("qualify") ||
      lower.includes("strengths") ||
      lower.includes("skills") ||
      lower.includes("career") ||
      lower.includes("apply") ||
      lower.includes("recommend");

    if (isCareerOrInterviewQuery) {
      return {
        intent: "CAREER_INTELLIGENCE",
        confidence: 0.90,
        extractedEntities: {},
        reasoning: "Recognized career advisory, interview preparation, or role strategy inquiry.",
      };
    }

    // 21. UNKNOWN INTENT (Safely ask clarification without hallucinating or running destructive tasks)
    return {
      intent: "UNKNOWN",
      confidence: 0.40,
      extractedEntities: {},
      reasoning: "Intent is ambiguous or unrecognized. Requires user clarification to avoid ungrounded action.",
    };
  }
}

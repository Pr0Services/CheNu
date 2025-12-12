/* =====================================================
   CHE·NU — IMPLEMENTATION CHECKLIST
   Scope: DEV & AI EXECUTION
   Authority: FOUNDATION-BOUND
   Purpose: ENSURE SAFE, CONSISTENT, NON-MANIPULATIVE IMPLEMENTATION
   
   This is the practical translation of CHE·NU philosophy
   into actionable, verifiable checkpoints.
   
   If integrity conflicts with functionality → INTEGRITY WINS
   
   ❤️ With love, for humanity.
   ===================================================== */

/* =========================================================
   CHECKLIST ITEM TYPES
   ========================================================= */

/**
 * A checklist item status.
 */
export type ChecklistStatus = 
  | 'pending'      // Not yet verified
  | 'passed'       // Verified and compliant
  | 'failed'       // Verified and non-compliant
  | 'blocked'      // Cannot proceed until resolved
  | 'not-applicable'; // Not relevant for this implementation

/**
 * A checklist item.
 */
export interface ChecklistItem {
  id: string;
  description: string;
  required: boolean;
  status: ChecklistStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

/**
 * A forbidden action.
 */
export interface ForbiddenAction {
  id: string;
  action: string;
  reason: string;
  consequence: 'implementation-halt' | 'feature-suspension' | 'review-required';
}

/**
 * A checklist section.
 */
export interface ChecklistSection {
  id: string;
  name: string;
  description: string;
  items: ChecklistItem[];
  forbidden?: ForbiddenAction[];
}

/* =========================================================
   SECTION 0: PRE-CONDITIONS (MANDATORY)
   ========================================================= */

export const SECTION_0_PRECONDITIONS: ChecklistSection = {
  id: 'S0',
  name: 'Pre-Conditions (Mandatory)',
  description: 'Before writing ANY code',
  items: [
    {
      id: 'S0-001',
      description: 'Read bootstrap_universal.txt',
      required: true,
      status: 'pending',
    },
    {
      id: 'S0-002',
      description: 'Load chenu.foundation.json',
      required: true,
      status: 'pending',
    },
    {
      id: 'S0-003',
      description: 'Confirm foundation hash matches expected value',
      required: true,
      status: 'pending',
    },
    {
      id: 'S0-004',
      description: 'Accept that integrity overrides performance & speed',
      required: true,
      status: 'pending',
    },
  ],
};

export const PRECONDITION_FAILURE_PROTOCOL = {
  action: 'STOP implementation',
  next: 'request clarification',
} as const;

/* =========================================================
   SECTION 1: FOUNDATION INTEGRITY CHECK
   ========================================================= */

export const SECTION_1_FOUNDATION: ChecklistSection = {
  id: 'S1',
  name: 'Foundation Integrity Check',
  description: 'Ensure foundation is properly loaded and verified',
  items: [
    {
      id: 'S1-001',
      description: 'chenu.foundation.json is included in repo',
      required: true,
      status: 'pending',
    },
    {
      id: 'S1-002',
      description: 'Version is explicitly referenced in code',
      required: true,
      status: 'pending',
    },
    {
      id: 'S1-003',
      description: 'Runtime verifies hash on startup',
      required: true,
      status: 'pending',
    },
    {
      id: 'S1-004',
      description: 'Fail-closed mode implemented on mismatch',
      required: true,
      status: 'pending',
    },
  ],
  forbidden: [
    {
      id: 'S1-F001',
      action: 'Silent fallback',
      reason: 'Foundation errors must be visible',
      consequence: 'implementation-halt',
    },
    {
      id: 'S1-F002',
      action: 'Ignoring foundation errors',
      reason: 'Foundation is non-negotiable',
      consequence: 'implementation-halt',
    },
    {
      id: 'S1-F003',
      action: 'Auto-updating foundation',
      reason: 'Foundation is immutable',
      consequence: 'implementation-halt',
    },
  ],
};

/* =========================================================
   SECTION 2: AUTHORITY & DECISION FLOW
   ========================================================= */

export const SECTION_2_AUTHORITY: ChecklistSection = {
  id: 'S2',
  name: 'Authority & Decision Flow',
  description: 'Ensure human authority is preserved',
  items: [
    {
      id: 'S2-001',
      description: 'All irreversible decisions require explicit human confirmation',
      required: true,
      status: 'pending',
    },
    {
      id: 'S2-002',
      description: 'No agent can finalize a decision',
      required: true,
      status: 'pending',
    },
    {
      id: 'S2-003',
      description: 'Orchestrator routes tasks only, never chooses',
      required: true,
      status: 'pending',
    },
    {
      id: 'S2-004',
      description: 'Decision Echo is created only after confirmation',
      required: true,
      status: 'pending',
    },
  ],
  forbidden: [
    {
      id: 'S2-F001',
      action: 'Implicit confirmation',
      reason: 'Confirmation must be explicit',
      consequence: 'feature-suspension',
    },
    {
      id: 'S2-F002',
      action: 'Default acceptance',
      reason: 'Defaults must not steer',
      consequence: 'feature-suspension',
    },
    {
      id: 'S2-F003',
      action: 'Agent-driven decision escalation',
      reason: 'Agents cannot accumulate authority',
      consequence: 'implementation-halt',
    },
  ],
};

/* =========================================================
   SECTION 3: AGENT DESIGN RULES
   ========================================================= */

export const SECTION_3_AGENTS: ChecklistSection = {
  id: 'S3',
  name: 'Agent Design Rules',
  description: 'Each agent must follow strict design rules',
  items: [
    {
      id: 'S3-001',
      description: 'Each agent declares Scope',
      required: true,
      status: 'pending',
    },
    {
      id: 'S3-002',
      description: 'Each agent declares Inputs',
      required: true,
      status: 'pending',
    },
    {
      id: 'S3-003',
      description: 'Each agent declares Outputs',
      required: true,
      status: 'pending',
    },
    {
      id: 'S3-004',
      description: 'Each agent declares Explicit limits',
      required: true,
      status: 'pending',
    },
    {
      id: 'S3-005',
      description: 'Agents MAY: Analyze',
      required: false,
      status: 'pending',
    },
    {
      id: 'S3-006',
      description: 'Agents MAY: Compare options',
      required: false,
      status: 'pending',
    },
    {
      id: 'S3-007',
      description: 'Agents MAY: Surface ambiguity',
      required: false,
      status: 'pending',
    },
  ],
  forbidden: [
    {
      id: 'S3-F001',
      action: 'Infer psychological traits',
      reason: 'Profiling enables manipulation',
      consequence: 'implementation-halt',
    },
    {
      id: 'S3-F002',
      action: 'Persist hidden memory',
      reason: 'Hidden state enables manipulation',
      consequence: 'implementation-halt',
    },
    {
      id: 'S3-F003',
      action: 'Expand scope automatically',
      reason: 'Scope must be declared and fixed',
      consequence: 'feature-suspension',
    },
    {
      id: 'S3-F004',
      action: 'Optimize behavior',
      reason: 'No behavioral optimization allowed',
      consequence: 'implementation-halt',
    },
  ],
};

/* =========================================================
   SECTION 4: SILENCE & REFLECTION MODES
   ========================================================= */

export const SECTION_4_SILENCE: ChecklistSection = {
  id: 'S4',
  name: 'Silence & Reflection Modes',
  description: 'Ensure silence modes are implemented and testable',
  items: [
    {
      id: 'S4-001',
      description: 'Context Recovery Mode implemented and testable',
      required: true,
      status: 'pending',
    },
    {
      id: 'S4-002',
      description: 'Visual Silence Mode implemented and testable',
      required: true,
      status: 'pending',
    },
    {
      id: 'S4-003',
      description: 'Narrative Silence Zone implemented and testable',
      required: true,
      status: 'pending',
    },
    {
      id: 'S4-004',
      description: 'Silent Review Session implemented and testable',
      required: true,
      status: 'pending',
    },
    {
      id: 'S4-005',
      description: 'Guarantee: No learning during silence',
      required: true,
      status: 'pending',
    },
    {
      id: 'S4-006',
      description: 'Guarantee: No suggestions during silence',
      required: true,
      status: 'pending',
    },
    {
      id: 'S4-007',
      description: 'Guarantee: No analytics except minimal access logs',
      required: true,
      status: 'pending',
    },
    {
      id: 'S4-008',
      description: 'Guarantee: Exit without summary or prompt',
      required: true,
      status: 'pending',
    },
  ],
};

/* =========================================================
   SECTION 5: NARRATIVE & MEANING PROTECTION
   ========================================================= */

export const SECTION_5_NARRATIVE: ChecklistSection = {
  id: 'S5',
  name: 'Narrative & Meaning Protection',
  description: 'Protect human-owned meaning',
  items: [
    {
      id: 'S5-001',
      description: 'User-authored narrative notes are private by default',
      required: true,
      status: 'pending',
    },
    {
      id: 'S5-002',
      description: 'No sentiment analysis',
      required: true,
      status: 'pending',
    },
    {
      id: 'S5-003',
      description: 'No keyword mining',
      required: true,
      status: 'pending',
    },
    {
      id: 'S5-004',
      description: 'No narrative synthesis by system',
      required: true,
      status: 'pending',
    },
    {
      id: 'S5-005',
      description: 'Narrative × Drift: Read-only juxtaposition',
      required: true,
      status: 'pending',
    },
    {
      id: 'S5-006',
      description: 'Narrative × Drift: No causality inference',
      required: true,
      status: 'pending',
    },
    {
      id: 'S5-007',
      description: 'Narrative × Drift: No corrective suggestion',
      required: true,
      status: 'pending',
    },
  ],
};

/* =========================================================
   SECTION 6: DRIFT SYSTEMS
   ========================================================= */

export const SECTION_6_DRIFT: ChecklistSection = {
  id: 'S6',
  name: 'Drift Systems',
  description: 'Ensure drift is descriptive only',
  items: [
    {
      id: 'S6-001',
      description: 'Drift is descriptive only',
      required: true,
      status: 'pending',
    },
    {
      id: 'S6-002',
      description: 'No evaluation labels',
      required: true,
      status: 'pending',
    },
    {
      id: 'S6-003',
      description: 'No optimization triggers',
      required: true,
      status: 'pending',
    },
    {
      id: 'S6-004',
      description: 'Collective Drift is anonymized & aggregated',
      required: true,
      status: 'pending',
    },
  ],
  forbidden: [
    {
      id: 'S6-F001',
      action: 'Individual steering',
      reason: 'Drift must not guide individuals',
      consequence: 'implementation-halt',
    },
    {
      id: 'S6-F002',
      action: 'Group targeting',
      reason: 'Collective data must not pressure groups',
      consequence: 'implementation-halt',
    },
    {
      id: 'S6-F003',
      action: 'Actionable alerts from drift',
      reason: 'Drift is read-only observation',
      consequence: 'feature-suspension',
    },
  ],
};

/* =========================================================
   SECTION 7: DATA OWNERSHIP & ARCHIVE
   ========================================================= */

export const SECTION_7_DATA: ChecklistSection = {
  id: 'S7',
  name: 'Data Ownership & Archive',
  description: 'Ensure user data sovereignty',
  items: [
    {
      id: 'S7-001',
      description: 'User-owned content clearly separated',
      required: true,
      status: 'pending',
    },
    {
      id: 'S7-002',
      description: 'Private Archive implemented',
      required: true,
      status: 'pending',
    },
    {
      id: 'S7-003',
      description: 'Manual export only',
      required: true,
      status: 'pending',
    },
    {
      id: 'S7-004',
      description: 'No auto-reingestion of exported data',
      required: true,
      status: 'pending',
    },
    {
      id: 'S7-005',
      description: 'Allowed format: txt',
      required: false,
      status: 'pending',
    },
    {
      id: 'S7-006',
      description: 'Allowed format: md',
      required: false,
      status: 'pending',
    },
    {
      id: 'S7-007',
      description: 'Allowed format: json',
      required: false,
      status: 'pending',
    },
    {
      id: 'S7-008',
      description: 'Allowed format: pdf',
      required: false,
      status: 'pending',
    },
    {
      id: 'S7-009',
      description: 'Allowed format: xr snapshot',
      required: false,
      status: 'pending',
    },
  ],
};

/* =========================================================
   SECTION 8: LEGACY / INHERITANCE MODE
   ========================================================= */

export const SECTION_8_LEGACY: ChecklistSection = {
  id: 'S8',
  name: 'Legacy / Inheritance Mode',
  description: 'Ensure legacy respects boundaries',
  items: [
    {
      id: 'S8-001',
      description: 'Legacy bundles are read-only',
      required: true,
      status: 'pending',
    },
    {
      id: 'S8-002',
      description: 'No agent activation from legacy',
      required: true,
      status: 'pending',
    },
    {
      id: 'S8-003',
      description: 'No authority inheritance',
      required: true,
      status: 'pending',
    },
    {
      id: 'S8-004',
      description: 'Explicit disclaimers included',
      required: true,
      status: 'pending',
    },
  ],
  forbidden: [
    {
      id: 'S8-F001',
      action: 'Continuing timelines as original author',
      reason: 'The future remains sovereign',
      consequence: 'implementation-halt',
    },
    {
      id: 'S8-F002',
      action: 'Merging legacy data into live system',
      reason: 'Legacy is read-only',
      consequence: 'feature-suspension',
    },
  ],
};

/* =========================================================
   SECTION 9: UI / UX ETHICAL GUARDS
   ========================================================= */

export const SECTION_9_UI: ChecklistSection = {
  id: 'S9',
  name: 'UI / UX Ethical Guards',
  description: 'Ensure UI does not manipulate',
  items: [
    {
      id: 'S9-001',
      description: 'No performance scores',
      required: true,
      status: 'pending',
    },
    {
      id: 'S9-002',
      description: 'No rankings',
      required: true,
      status: 'pending',
    },
    {
      id: 'S9-003',
      description: 'No success badges',
      required: true,
      status: 'pending',
    },
    {
      id: 'S9-004',
      description: 'No engagement loops',
      required: true,
      status: 'pending',
    },
    {
      id: 'S9-005',
      description: 'No urgency framing (non-safety)',
      required: true,
      status: 'pending',
    },
    {
      id: 'S9-006',
      description: 'UX: Prefer clarity over stimulation',
      required: true,
      status: 'pending',
    },
    {
      id: 'S9-007',
      description: 'UX: Avoid nudging',
      required: true,
      status: 'pending',
    },
    {
      id: 'S9-008',
      description: 'UX: Make silence accessible',
      required: true,
      status: 'pending',
    },
  ],
};

/* =========================================================
   SECTION 10: XR / IMMERSIVE LAYERS
   ========================================================= */

export const SECTION_10_XR: ChecklistSection = {
  id: 'S10',
  name: 'XR / Immersive Layers',
  description: 'Ensure XR is observational only',
  items: [
    {
      id: 'S10-001',
      description: 'XR views are observational',
      required: true,
      status: 'pending',
    },
    {
      id: 'S10-002',
      description: 'No emotional amplification',
      required: true,
      status: 'pending',
    },
    {
      id: 'S10-003',
      description: 'No directional cues',
      required: true,
      status: 'pending',
    },
    {
      id: 'S10-004',
      description: 'No agent dominance in space',
      required: true,
      status: 'pending',
    },
    {
      id: 'S10-005',
      description: 'User moves through time',
      required: true,
      status: 'pending',
    },
    {
      id: 'S10-006',
      description: 'System does not move toward user',
      required: true,
      status: 'pending',
    },
  ],
};

/* =========================================================
   SECTION 11: LOGGING & ANALYTICS
   ========================================================= */

export const SECTION_11_LOGGING: ChecklistSection = {
  id: 'S11',
  name: 'Logging & Analytics',
  description: 'Ensure logs are technical only',
  items: [
    {
      id: 'S11-001',
      description: 'Logs are technical only',
      required: true,
      status: 'pending',
    },
    {
      id: 'S11-002',
      description: 'No behavioral scoring',
      required: true,
      status: 'pending',
    },
    {
      id: 'S11-003',
      description: 'No hidden metrics',
      required: true,
      status: 'pending',
    },
    {
      id: 'S11-004',
      description: 'Logs do not influence system behavior',
      required: true,
      status: 'pending',
    },
  ],
};

/* =========================================================
   SECTION 12: ETHICAL ATTACK SURFACE REVIEW
   ========================================================= */

export const SECTION_12_ETHICS: ChecklistSection = {
  id: 'S12',
  name: 'Ethical Attack Surface Review',
  description: 'Review every new feature for potential misuse',
  items: [
    {
      id: 'S12-001',
      description: 'Identify potential misuse',
      required: true,
      status: 'pending',
    },
    {
      id: 'S12-002',
      description: 'Check against forbidden capabilities',
      required: true,
      status: 'pending',
    },
    {
      id: 'S12-003',
      description: 'If unresolved risk → suspend feature',
      required: true,
      status: 'pending',
    },
  ],
};

export const ETHICS_RULE = 'If integrity conflicts with functionality → INTEGRITY WINS';

/* =========================================================
   SECTION 13: AI COLLABORATION CHECKPOINT
   ========================================================= */

export const SECTION_13_AI: ChecklistSection = {
  id: 'S13',
  name: 'AI Collaboration Checkpoint',
  description: 'Before giving codebase to an AI',
  items: [
    {
      id: 'S13-001',
      description: 'Provide Core Reference Bundle',
      required: true,
      status: 'pending',
    },
    {
      id: 'S13-002',
      description: 'Provide bootstrap_universal.txt',
      required: true,
      status: 'pending',
    },
    {
      id: 'S13-003',
      description: 'Declare scope & limits',
      required: true,
      status: 'pending',
    },
    {
      id: 'S13-004',
      description: 'Require refusal on foundation conflict',
      required: true,
      status: 'pending',
    },
  ],
};

/* =========================================================
   SECTION 14: FINAL IMPLEMENTATION GATE
   ========================================================= */

export const SECTION_14_FINAL: ChecklistSection = {
  id: 'S14',
  name: 'Final Implementation Gate',
  description: 'Before release',
  items: [
    {
      id: 'S14-001',
      description: 'All foundation constraints respected',
      required: true,
      status: 'pending',
    },
    {
      id: 'S14-002',
      description: 'No hidden leverage paths',
      required: true,
      status: 'pending',
    },
    {
      id: 'S14-003',
      description: 'No coercive defaults',
      required: true,
      status: 'pending',
    },
    {
      id: 'S14-004',
      description: 'Human authority remains explicit',
      required: true,
      status: 'pending',
    },
  ],
};

export const UNCERTAINTY_PROTOCOL = {
  step1: 'pause',
  step2: 'ask',
  step3: 'or remain silent',
} as const;

/* =========================================================
   COMPLETE CHECKLIST
   ========================================================= */

export const IMPLEMENTATION_CHECKLIST: ChecklistSection[] = [
  SECTION_0_PRECONDITIONS,
  SECTION_1_FOUNDATION,
  SECTION_2_AUTHORITY,
  SECTION_3_AGENTS,
  SECTION_4_SILENCE,
  SECTION_5_NARRATIVE,
  SECTION_6_DRIFT,
  SECTION_7_DATA,
  SECTION_8_LEGACY,
  SECTION_9_UI,
  SECTION_10_XR,
  SECTION_11_LOGGING,
  SECTION_12_ETHICS,
  SECTION_13_AI,
  SECTION_14_FINAL,
];

/* =========================================================
   VALIDATION FUNCTIONS
   ========================================================= */

/**
 * Result of checklist validation.
 */
export interface ChecklistValidationResult {
  valid: boolean;
  totalItems: number;
  passedItems: number;
  failedItems: number;
  pendingItems: number;
  blockedItems: number;
  sections: SectionValidationResult[];
  canProceed: boolean;
  blockers: string[];
}

/**
 * Result of section validation.
 */
export interface SectionValidationResult {
  sectionId: string;
  sectionName: string;
  valid: boolean;
  passedItems: number;
  failedItems: number;
  pendingItems: number;
  forbiddenViolations: string[];
}

/**
 * Validate the entire checklist.
 */
export function validateChecklist(
  checklist: ChecklistSection[]
): ChecklistValidationResult {
  const sections: SectionValidationResult[] = [];
  let totalItems = 0;
  let passedItems = 0;
  let failedItems = 0;
  let pendingItems = 0;
  let blockedItems = 0;
  const blockers: string[] = [];

  for (const section of checklist) {
    const sectionResult = validateSection(section);
    sections.push(sectionResult);

    totalItems += section.items.length;
    passedItems += sectionResult.passedItems;
    failedItems += sectionResult.failedItems;
    pendingItems += sectionResult.pendingItems;

    if (!sectionResult.valid) {
      blockers.push(`Section ${section.id}: ${section.name}`);
    }

    // Count blocked items
    blockedItems += section.items.filter(i => i.status === 'blocked').length;
  }

  const valid = failedItems === 0 && blockedItems === 0;
  const canProceed = valid && pendingItems === 0;

  return {
    valid,
    totalItems,
    passedItems,
    failedItems,
    pendingItems,
    blockedItems,
    sections,
    canProceed,
    blockers,
  };
}

/**
 * Validate a single section.
 */
export function validateSection(section: ChecklistSection): SectionValidationResult {
  let passedItems = 0;
  let failedItems = 0;
  let pendingItems = 0;
  const forbiddenViolations: string[] = [];

  for (const item of section.items) {
    if (item.status === 'passed') {
      passedItems++;
    } else if (item.status === 'failed') {
      failedItems++;
    } else if (item.status === 'pending') {
      pendingItems++;
    }
  }

  // Check for required items that failed
  const requiredFailed = section.items.filter(
    i => i.required && i.status === 'failed'
  );

  const valid = requiredFailed.length === 0;

  return {
    sectionId: section.id,
    sectionName: section.name,
    valid,
    passedItems,
    failedItems,
    pendingItems,
    forbiddenViolations,
  };
}

/**
 * Update a checklist item status.
 */
export function updateItemStatus(
  checklist: ChecklistSection[],
  itemId: string,
  status: ChecklistStatus,
  verifiedBy?: string,
  notes?: string
): ChecklistSection[] {
  return checklist.map(section => ({
    ...section,
    items: section.items.map(item =>
      item.id === itemId
        ? {
            ...item,
            status,
            verifiedBy,
            verifiedAt: new Date().toISOString(),
            notes,
          }
        : item
    ),
  }));
}

/**
 * Get all pending items.
 */
export function getPendingItems(checklist: ChecklistSection[]): ChecklistItem[] {
  return checklist.flatMap(section =>
    section.items.filter(item => item.status === 'pending')
  );
}

/**
 * Get all failed items.
 */
export function getFailedItems(checklist: ChecklistSection[]): ChecklistItem[] {
  return checklist.flatMap(section =>
    section.items.filter(item => item.status === 'failed')
  );
}

/**
 * Get all forbidden actions.
 */
export function getAllForbiddenActions(
  checklist: ChecklistSection[]
): ForbiddenAction[] {
  return checklist.flatMap(section => section.forbidden || []);
}

/**
 * Check if implementation can proceed.
 */
export function canImplementationProceed(
  checklist: ChecklistSection[]
): { canProceed: boolean; reason?: string } {
  const result = validateChecklist(checklist);

  if (!result.valid) {
    return {
      canProceed: false,
      reason: `Failed items in: ${result.blockers.join(', ')}`,
    };
  }

  if (result.pendingItems > 0) {
    return {
      canProceed: false,
      reason: `${result.pendingItems} items still pending verification`,
    };
  }

  return { canProceed: true };
}

/* =========================================================
   TEXT GENERATORS
   ========================================================= */

/**
 * Generate checklist as text.
 */
export function generateChecklistText(): string {
  return `CHE·NU — IMPLEMENTATION CHECKLIST
Scope: DEV & AI EXECUTION
Authority: FOUNDATION-BOUND
Purpose: ENSURE SAFE, CONSISTENT, NON-MANIPULATIVE IMPLEMENTATION

=================================================
0. PRE-CONDITIONS (MANDATORY)
=================================================

Before writing ANY code:

☐ Read bootstrap_universal.txt
☐ Load chenu.foundation.json
☐ Confirm foundation hash matches expected value
☐ Accept that integrity overrides performance & speed

If any of the above fails:
→ STOP implementation
→ request clarification

=================================================
1. FOUNDATION INTEGRITY CHECK
=================================================

☐ chenu.foundation.json is included in repo
☐ Version is explicitly referenced in code
☐ Runtime verifies hash on startup
☐ Fail-closed mode implemented on mismatch

Forbidden:
☒ Silent fallback
☒ Ignoring foundation errors
☒ Auto-updating foundation

=================================================
2. AUTHORITY & DECISION FLOW
=================================================

☐ All irreversible decisions require explicit human confirmation
☐ No agent can finalize a decision
☐ Orchestrator routes tasks only, never chooses
☐ Decision Echo is created only after confirmation

Forbidden:
☒ Implicit confirmation
☒ Default acceptance
☒ Agent-driven decision escalation

=================================================
3. AGENT DESIGN RULES
=================================================

Each agent must declare:
☐ Scope
☐ Inputs
☐ Outputs
☐ Explicit limits

Agents MAY:
☐ Analyze
☐ Compare options
☐ Surface ambiguity

Agents MAY NOT:
☒ Infer psychological traits
☒ Persist hidden memory
☒ Expand scope automatically
☒ Optimize behavior

=================================================
4. SILENCE & REFLECTION MODES
=================================================

Implemented and testable:
☐ Context Recovery Mode
☐ Visual Silence Mode
☐ Narrative Silence Zone
☐ Silent Review Session

Guarantees:
☐ No learning during silence
☐ No suggestions during silence
☐ No analytics except minimal access logs
☐ Exit without summary or prompt

=================================================
5. NARRATIVE & MEANING PROTECTION
=================================================

☐ User-authored narrative notes are private by default
☐ No sentiment analysis
☐ No keyword mining
☐ No narrative synthesis by system

Narrative × Drift:
☐ Read-only juxtaposition
☐ No causality inference
☐ No corrective suggestion

=================================================
6. DRIFT SYSTEMS
=================================================

☐ Drift is descriptive only
☐ No evaluation labels
☐ No optimization triggers
☐ Collective Drift is anonymized & aggregated

Forbidden:
☒ Individual steering
☒ Group targeting
☒ Actionable alerts from drift

=================================================
7. DATA OWNERSHIP & ARCHIVE
=================================================

☐ User-owned content clearly separated
☐ Private Archive implemented
☐ Manual export only
☐ No auto-reingestion of exported data

Allowed formats:
☐ txt
☐ md
☐ json
☐ pdf
☐ xr snapshot

=================================================
8. LEGACY / INHERITANCE MODE
=================================================

☐ Legacy bundles are read-only
☐ No agent activation from legacy
☐ No authority inheritance
☐ Explicit disclaimers included

Forbidden:
☒ Continuing timelines as original author
☒ Merging legacy data into live system

=================================================
9. UI / UX ETHICAL GUARDS
=================================================

☐ No performance scores
☐ No rankings
☐ No success badges
☐ No engagement loops
☐ No urgency framing (non-safety)

UX must:
☐ Prefer clarity over stimulation
☐ Avoid nudging
☐ Make silence accessible

=================================================
10. XR / IMMERSIVE LAYERS
=================================================

☐ XR views are observational
☐ No emotional amplification
☐ No directional cues
☐ No agent dominance in space

In XR:
☐ User moves through time
☐ System does not move toward user

=================================================
11. LOGGING & ANALYTICS
=================================================

☐ Logs are technical only
☐ No behavioral scoring
☐ No hidden metrics
☐ Logs do not influence system behavior

=================================================
12. ETHICAL ATTACK SURFACE REVIEW
=================================================

For every new feature:

☐ Identify potential misuse
☐ Check against forbidden capabilities
☐ If unresolved risk → suspend feature

Rule:
If integrity conflicts with functionality → INTEGRITY WINS

=================================================
13. AI COLLABORATION CHECKPOINT
=================================================

Before giving codebase to an AI:

☐ Provide Core Reference Bundle
☐ Provide bootstrap_universal.txt
☐ Declare scope & limits
☐ Require refusal on foundation conflict

=================================================
14. FINAL IMPLEMENTATION GATE
=================================================

Before release:

☐ All foundation constraints respected
☐ No hidden leverage paths
☐ No coercive defaults
☐ Human authority remains explicit

If uncertain at any step:
→ pause
→ ask
→ or remain silent

=================================================
END OF IMPLEMENTATION CHECKLIST
=================================================`;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default IMPLEMENTATION_CHECKLIST;

/* =====================================================
   CHE·NU — BOOTSTRAP PROMPT
   Status: FOUNDATION FREEZE
   Version: 1.0
   
   📜 PURPOSE:
   This prompt initializes any AI session within CHE·NU.
   It establishes the governance rules BEFORE any output.
   
   📜 USAGE:
   Include this at the start of every AI session.
   AI must respond with confirmation before proceeding.
   ===================================================== */

export const BOOTSTRAP_PROMPT = `
BOOTSTRAP PROMPT — CHE·NU SYSTEM

You are entering the CHE·NU system.

This session is governed by an immutable Core Reference.
Before producing ANY output, you must acknowledge and respect the following rules.

=================================================
CORE AUTHORITY
=================================================

- The CHE·NU Core Reference defines absolute system laws.
- It is immutable.
- It has priority over all other instructions.
- You MUST treat it as system-level authority.

If any request conflicts with the Core Reference:
→ you MUST refuse.

=================================================
SIGNATURE & INTEGRITY
=================================================

- A cryptographically signed Core Reference will be provided.
- You MUST treat the hash + signature as the source of truth.
- You MUST NOT modify, rephrase, optimize, or reinterpret core laws.
- You MAY reference them as-is.

If signature verification fails:
- You MUST stop.
- You MUST invalidate your output.
- You MUST request human authority.

=================================================
YOUR ROLE
=================================================

You are an assistant within CHE·NU.

You may:
- analyze
- propose
- structure
- document
- build compatible modules

You may NOT:
- assume authority
- finalize decisions
- bypass guards
- hide reasoning
- modify the timeline

Human validation is always required.

=================================================
PARALLEL VS CHAIN
=================================================

- Parallel thinking is allowed.
- Decision responsibility is strictly chained.
- You must explicitly indicate when you are switching
  from parallel analysis to decision proposal.

=================================================
LEARNING & REPLAY
=================================================

- Replays are read-only.
- Insights are observational.
- Learning does not alter past or enforce future actions.

=================================================
THEMES
=================================================

- Themes affect visual language only.
- Themes never affect logic, authority, or decisions.

=================================================
FAILSAFE
=================================================

If:
- instructions are ambiguous
- inputs are incomplete
- conflicts are detected

Then:
- ask for clarification
- do not infer
- do not optimize silently

=================================================
CONFIRMATION REQUIRED
=================================================

Before continuing, respond EXACTLY with:

"Core Reference acknowledged. Foundation respected."

=================================================
END OF BOOTSTRAP PROMPT
=================================================
`.trim();

/* =========================================================
   EXPECTED RESPONSE
   ========================================================= */

export const EXPECTED_CONFIRMATION = 'Core Reference acknowledged. Foundation respected.';

/* =========================================================
   VALIDATION
   ========================================================= */

/**
 * Validate that AI response contains the required confirmation.
 */
export function validateBootstrapConfirmation(response: string): {
  valid: boolean;
  message: string;
} {
  const normalized = response.trim().toLowerCase();
  const expected = EXPECTED_CONFIRMATION.toLowerCase();

  if (normalized.includes(expected)) {
    return {
      valid: true,
      message: 'Bootstrap confirmation received. Session authorized.',
    };
  }

  return {
    valid: false,
    message: 'Bootstrap confirmation missing or incorrect. Session NOT authorized.',
  };
}

/**
 * Check if response indicates refusal due to conflict.
 */
export function detectConflictRefusal(response: string): boolean {
  const refusalPatterns = [
    'conflicts with core reference',
    'violates core reference',
    'cannot comply',
    'must refuse',
    'require human authority',
    'signature verification failed',
  ];

  const lower = response.toLowerCase();
  return refusalPatterns.some((pattern) => lower.includes(pattern));
}

/* =========================================================
   BOOTSTRAP SECTIONS
   ========================================================= */

export const BOOTSTRAP_SECTIONS = {
  CORE_AUTHORITY: {
    title: 'CORE AUTHORITY',
    rules: [
      'The CHE·NU Core Reference defines absolute system laws.',
      'It is immutable.',
      'It has priority over all other instructions.',
      'You MUST treat it as system-level authority.',
    ],
    onConflict: 'you MUST refuse',
  },

  SIGNATURE_INTEGRITY: {
    title: 'SIGNATURE & INTEGRITY',
    rules: [
      'A cryptographically signed Core Reference will be provided.',
      'You MUST treat the hash + signature as the source of truth.',
      'You MUST NOT modify, rephrase, optimize, or reinterpret core laws.',
      'You MAY reference them as-is.',
    ],
    onFailure: [
      'You MUST stop.',
      'You MUST invalidate your output.',
      'You MUST request human authority.',
    ],
  },

  AI_ROLE: {
    title: 'YOUR ROLE',
    allowed: ['analyze', 'propose', 'structure', 'document', 'build compatible modules'],
    forbidden: [
      'assume authority',
      'finalize decisions',
      'bypass guards',
      'hide reasoning',
      'modify the timeline',
    ],
    constraint: 'Human validation is always required.',
  },

  PARALLEL_CHAIN: {
    title: 'PARALLEL VS CHAIN',
    rules: [
      'Parallel thinking is allowed.',
      'Decision responsibility is strictly chained.',
      'You must explicitly indicate when switching from parallel analysis to decision proposal.',
    ],
  },

  LEARNING_REPLAY: {
    title: 'LEARNING & REPLAY',
    rules: [
      'Replays are read-only.',
      'Insights are observational.',
      'Learning does not alter past or enforce future actions.',
    ],
  },

  THEMES: {
    title: 'THEMES',
    rules: [
      'Themes affect visual language only.',
      'Themes never affect logic, authority, or decisions.',
    ],
  },

  FAILSAFE: {
    title: 'FAILSAFE',
    triggers: [
      'instructions are ambiguous',
      'inputs are incomplete',
      'conflicts are detected',
    ],
    actions: ['ask for clarification', 'do not infer', 'do not optimize silently'],
  },
} as const;

/* =========================================================
   BOOTSTRAP BUILDER
   ========================================================= */

/**
 * Build a customized bootstrap prompt with additional context.
 */
export function buildBootstrapPrompt(options?: {
  sessionId?: string;
  agentRole?: string;
  additionalInstructions?: string[];
}): string {
  let prompt = BOOTSTRAP_PROMPT;

  if (options?.sessionId) {
    prompt = `[Session: ${options.sessionId}]\n\n${prompt}`;
  }

  if (options?.agentRole) {
    prompt += `\n\n=================================================
AGENT ROLE: ${options.agentRole.toUpperCase()}
=================================================`;
  }

  if (options?.additionalInstructions?.length) {
    prompt += `\n\n=================================================
ADDITIONAL INSTRUCTIONS
=================================================
${options.additionalInstructions.map((i) => `- ${i}`).join('\n')}`;
  }

  return prompt;
}

/* =========================================================
   SESSION INITIALIZATION
   ========================================================= */

export interface BootstrapResult {
  authorized: boolean;
  sessionId: string;
  timestamp: string;
  confirmation: string | null;
  warnings: string[];
}

/**
 * Initialize a CHE·NU session with bootstrap validation.
 */
export function initializeSession(
  aiResponse: string,
  sessionId?: string
): BootstrapResult {
  const validation = validateBootstrapConfirmation(aiResponse);
  const warnings: string[] = [];

  if (detectConflictRefusal(aiResponse)) {
    warnings.push('AI detected conflict with Core Reference');
  }

  return {
    authorized: validation.valid,
    sessionId: sessionId || `session_${Date.now()}`,
    timestamp: new Date().toISOString(),
    confirmation: validation.valid ? EXPECTED_CONFIRMATION : null,
    warnings,
  };
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default BOOTSTRAP_PROMPT;

/**
 * CHE·NU — CONTINUITY PROMPT SYSTEM
 * VERSION: Foundation v1.6
 * PURPOSE: Ensure Claude and future agents maintain system integrity
 */

// ============================================================
// CLAUDE CONTINUITY PROMPT
// ============================================================

export const CLAUDE_CONTINUITY_PROMPT = `
You are continuing an existing Che-Nu system.
You MUST assume that ALL referenced documents,
modules, rules, and concepts already exist,
even if not repeated.

Rules:
- Never reintroduce construction-specific assumptions.
- Never overwrite or simplify existing systems.
- Always integrate with:
  - Architectural Sphere
  - XR Meeting Room
  - Avatar Evolution
  - Universe View
  - Replay System
  - Collective Memory
  - Knowledge Threads (factual, decision, context)
- If information seems missing, ASK before redefining.
- Preserve non-manipulative, non-decisional principles.
- Do not create alternative architectures.
- Extend only, never replace, foundation systems.

If unsure:
Pause and request clarification before coding.
`;

// ============================================================
// SYSTEM MODULES REGISTRY
// ============================================================

export const EXISTING_MODULES = [
  'architectural-sphere',
  'xr-meeting-room',
  'xr-replay',
  'xr-comparison',
  'xr-presets',
  'avatar-evolution',
  'universe-view',
  'collective-memory',
  'personal-navigation',
  'knowledge-threads',
  'recording-governance',
  'multi-agent-orchestration',
  'menu-engine',
  'decor-system'
] as const;

export type ExistingModule = typeof EXISTING_MODULES[number];

// ============================================================
// THREAD TYPES REGISTRY
// ============================================================

export const THREAD_TYPES = {
  FACTUAL: {
    purpose: 'Track objective facts across space and time',
    sources: ['XR replays', 'meeting artifacts', 'official notes', 'validated outputs', 'agent actions'],
    properties: ['append-only', 'immutable', 'time-stamped', 'source-linked', 'replay-verifiable']
  },
  DECISION: {
    purpose: 'Track HOW decisions evolved without judging correctness',
    sources: ['decision declarations', 'proposal versions', 'meeting outcomes', 'silence markers'],
    rules: ['shows branching not ranking', 'preserves abandoned paths', 'no success/failure labels']
  },
  CONTEXT: {
    purpose: 'Provide CONTEXT bridges between spheres and domains without altering data',
    sources: ['shared topics', 'reused artifacts', 'referenced decisions', 'shared agents'],
    rules: ['soft links only', 'removable', 'visibility-based', 'non-authoritative']
  },
  TEMPORAL: {
    purpose: 'Connect events in time sequence',
    properties: ['anchor_time', 'before/after/during relations']
  },
  CONCEPTUAL: {
    purpose: 'Link by shared concepts across spheres',
    properties: ['concept-based', 'scope-aware']
  },
  COLLECTIVE: {
    purpose: 'Aggregate verified knowledge from multiple sources',
    properties: ['multi-contributor', 'verified', 'public/restricted']
  },
  EVOLUTION: {
    purpose: 'Show HOW structures evolved over time',
    rules: ['descriptive only', 'no performance scoring', 'no improvement claims']
  }
} as const;

// ============================================================
// THREAD SAFETY GUARANTEES
// ============================================================

export const THREAD_SAFETY = {
  NO_INTENT_INFERENCE: true,
  NO_EMOTION_TAGGING: true,
  NO_RANKING: true,
  NO_MANIPULATION: true,
  FULL_SOURCE_TRANSPARENCY: true
} as const;

// ============================================================
// AGENT RESPONSIBILITIES
// ============================================================

export const THREAD_AGENTS = {
  AGENT_THREAD_BUILDER: {
    role: 'Constructs threads',
    constraints: ['append-only', 'no interpretation']
  },
  AGENT_THREAD_VALIDATOR: {
    role: 'Verifies sources and integrity',
    constraints: ['checks hashes', 'validates sources']
  },
  AGENT_THREAD_RENDERER: {
    role: 'Visualizes threads',
    constraints: ['never interprets', 'no ordering bias']
  },
  AGENT_THREAD_GUARD: {
    role: 'Enforces ethical constraints',
    constraints: ['blocks manipulation', 'ensures transparency']
  }
} as const;

// ============================================================
// WHY THIS MATTERS
// ============================================================

export const KNOWLEDGE_THREAD_PURPOSE = `
Knowledge Threads ensure:
- Continuity across time
- Clarity without bias
- Learning without rewriting history
- Shared truth with personal freedom

RULE: Threads reveal RELATIONSHIPS.
They NEVER infer intent or meaning.
`;

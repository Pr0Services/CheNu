/* =====================================================
   CHE·NU — SPHERE GENERATOR
   Status: FOUNDATIONAL
   Purpose: Factory for creating compliant spheres
   
   This generator creates spheres from simple input while
   enforcing all foundational constraints automatically.
   
   Inheritance is NON-NEGOTIABLE.
   Privacy is NON-NEGOTIABLE.
   Human sovereignty is NON-NEGOTIABLE.
   
   ❤️ With love, for humanity.
   ===================================================== */

import { SphereSchema } from './sphereSchema.types';

/* =========================================================
   INPUT TYPES
   ========================================================= */

/**
 * Minimal input required to create a sphere.
 * The generator will enforce all foundational constraints.
 */
export type SphereInput = {
  /** Human-readable name */
  name: string;
  /** Unique identifier slug */
  id: string;
  /** Visual emoji */
  emoji: string;
  /** Human-readable description */
  description: string;

  /** Scope definition */
  scope: {
    /** What this sphere includes */
    included: string[];
    /** What this sphere excludes */
    excluded: string[];
  };

  /** Agent configuration (optional) */
  agents?: {
    /** Whether agents are enabled */
    enabled: boolean;
    /** Notes about agent usage */
    notes?: string;
  };

  /** Allow inter-sphere interaction (optional, defaults to false) */
  inter_sphere_interaction?: boolean;
};

/* =========================================================
   GENERATED SPHERE TYPE
   ========================================================= */

/**
 * Extended sphere with scope information.
 */
export interface GeneratedSphere extends Omit<SphereSchema, 'sphere'> {
  sphere: SphereSchema['sphere'];
  scope: {
    included: string[];
    excluded: string[];
    /** These are NEVER interpreted - hardcoded protection */
    never_interprets: readonly ['identity', 'worth', 'psychological_traits'];
  };
}

/* =========================================================
   CONSTANTS
   ========================================================= */

/**
 * Inherited laws - NON-NEGOTIABLE.
 * Every sphere MUST inherit these.
 */
const INHERITED_LAWS = {
  foundation: true,
  privacy: true,
  global_structural_laws: true,
  silence_modes: true,
} as const;

/**
 * Things a sphere NEVER interprets.
 * This is a hardcoded protection.
 */
const NEVER_INTERPRETS = [
  'identity',
  'worth',
  'psychological_traits',
] as const;

/**
 * Forbidden agent capabilities.
 * These are NEVER allowed.
 */
const FORBIDDEN_CAPABILITIES = [
  'profiling',
  'implicit_memory',
  'cross_sphere_observation',
] as const;

/* =========================================================
   SPHERE GENERATOR
   ========================================================= */

/**
 * Generate a compliant sphere from minimal input.
 * 
 * This function enforces all foundational constraints automatically.
 * You cannot create a sphere that violates the foundation.
 * 
 * @param input - Minimal sphere definition
 * @returns Complete sphere with all protections
 * @throws Error if input is invalid
 * 
 * @example
 * ```typescript
 * const personal = generateSphere({
 *   name: "Personal",
 *   id: "personal",
 *   emoji: "👤",
 *   description: "Espace privé de l'individu",
 *   scope: {
 *     included: ["notes", "reflection", "private goals"],
 *     excluded: ["performance scoring", "external metrics"],
 *   },
 *   agents: { enabled: true },
 *   inter_sphere_interaction: false,
 * });
 * ```
 */
export function generateSphere(input: SphereInput): GeneratedSphere {
  // =========================================
  // 1. Validate identity
  // =========================================
  if (!input.name || !input.id) {
    throw new Error('Sphere must have a name and id');
  }

  if (!input.emoji) {
    throw new Error('Sphere must have an emoji');
  }

  if (!input.description) {
    throw new Error('Sphere must have a description');
  }

  if (!input.scope?.included || !input.scope?.excluded) {
    throw new Error('Sphere must define scope (included and excluded)');
  }

  // =========================================
  // 2. Enforce inheritance (NON-NEGOTIABLE)
  // =========================================
  const inheritedLaws = { ...INHERITED_LAWS };

  // =========================================
  // 3. Build sphere model
  // =========================================
  const sphere: GeneratedSphere = {
    // Identity
    sphere: {
      name: input.name,
      id: input.id,
      emoji: input.emoji,
      description: input.description,
      version: '1.0.0',
    },

    // Inheritance - ENFORCED
    inherits: inheritedLaws,

    // Scope - with hardcoded protections
    scope: {
      included: input.scope.included,
      excluded: input.scope.excluded,
      never_interprets: NEVER_INTERPRETS,
    },

    // Context isolation - ENFORCED
    context: {
      isolated_by_default: true,
      requires_explicit_bridge: true,
      bridge_types: ['manual_reference', 'explicit_user_action'],
    },

    // Time - local, no pressure
    time: {
      local_timeline: true,
      states: ['active', 'dormant', 'archived'],
      no_global_pressure: true,
    },

    // Agents - with forbidden capabilities ENFORCED
    agents: {
      allowed: input.agents?.enabled ?? true,
      scope_limited: true,
      can_create_subagents: true,
      forbidden_capabilities: [...FORBIDDEN_CAPABILITIES],
    },

    // Data sovereignty - ENFORCED
    data: {
      ownership: 'human',
      private_by_default: true,
      exportable: true,
      deletable_without_justification: true,
    },

    // Silence modes - all available
    silence_modes: {
      available: ['context_recovery', 'visual_silence', 'silent_review'],
      behavior_during_silence: {
        learning: false,
        suggestion: false,
        analytics: 'minimal',
      },
    },

    // UX - human-centered ENFORCED
    ux: {
      default_state: 'minimal',
      progressive_disclosure: true,
      no_urgency_patterns: true,
      no_performance_indicators: true,
    },

    // Reversibility - ENFORCED
    reversibility: {
      enabled: true,
      reversible_actions: ['agent_creation', 'workflow_change', 'structure_edit'],
      irreversible_only_with_consent: true,
    },

    // Interactions - user-controlled
    interactions: {
      allowed: input.inter_sphere_interaction ?? false,
      requires_explicit_user_action: true,
      no_automatic_sync: true,
    },

    // Validation - ENFORCED
    validation: {
      respects_all_global_laws: true,
      no_privacy_violation: true,
      no_behavioral_optimization: true,
      reversible_by_default: true,
      approved_by_human: true,
    },
  };

  // =========================================
  // 4. Final validation gate
  // =========================================
  if (!sphere.inherits.foundation) {
    throw new Error('FATAL: Sphere violates foundation inheritance');
  }

  if (!sphere.inherits.privacy) {
    throw new Error('FATAL: Sphere violates privacy inheritance');
  }

  if (!sphere.data.private_by_default) {
    throw new Error('FATAL: Sphere violates privacy-by-default');
  }

  if (sphere.data.ownership !== 'human') {
    throw new Error('FATAL: Sphere violates human data ownership');
  }

  // Run full validation
  if (!validateSphere(sphere)) {
    throw new Error('FATAL: Sphere failed validation');
  }

  return sphere;
}

/* =========================================================
   VALIDATION
   ========================================================= */

/**
 * Validate a sphere against foundational constraints.
 * 
 * @param sphere - Sphere to validate
 * @returns true if valid, false otherwise
 */
export function validateSphere(sphere: GeneratedSphere): boolean {
  // Foundation inheritance
  if (sphere.inherits.foundation !== true) {
    return false;
  }

  // Privacy inheritance
  if (sphere.inherits.privacy !== true) {
    return false;
  }

  // Private by default
  if (sphere.data.private_by_default !== true) {
    return false;
  }

  // Human ownership
  if (sphere.data.ownership !== 'human') {
    return false;
  }

  // Never interprets identity
  if (!sphere.scope.never_interprets.includes('identity')) {
    return false;
  }

  // Reversibility enabled
  if (sphere.reversibility.enabled !== true) {
    return false;
  }

  // No urgency patterns
  if (sphere.ux.no_urgency_patterns !== true) {
    return false;
  }

  // Forbidden capabilities enforced
  const requiredForbidden = ['profiling', 'implicit_memory', 'cross_sphere_observation'];
  for (const cap of requiredForbidden) {
    if (!sphere.agents.forbidden_capabilities.includes(cap as any)) {
      return false;
    }
  }

  return true;
}

/**
 * Get detailed validation errors.
 */
export function getValidationErrors(sphere: GeneratedSphere): string[] {
  const errors: string[] = [];

  if (sphere.inherits.foundation !== true) {
    errors.push('Missing foundation inheritance');
  }

  if (sphere.inherits.privacy !== true) {
    errors.push('Missing privacy inheritance');
  }

  if (sphere.data.private_by_default !== true) {
    errors.push('Data must be private by default');
  }

  if (sphere.data.ownership !== 'human') {
    errors.push('Data ownership must be human');
  }

  if (!sphere.scope.never_interprets.includes('identity')) {
    errors.push('Must never interpret identity');
  }

  if (sphere.reversibility.enabled !== true) {
    errors.push('Reversibility must be enabled');
  }

  if (sphere.ux.no_urgency_patterns !== true) {
    errors.push('Urgency patterns are forbidden');
  }

  return errors;
}

/* =========================================================
   FILE GENERATION
   ========================================================= */

/**
 * Sphere file structure.
 * 
 * /spheres/<sphere_id>/
 *  ├─ sphere.yaml
 *  ├─ sphere.manifest.md
 *  ├─ sphere.validation.json
 *  └─ README.md
 */
export interface SphereFiles {
  yaml: string;
  manifest: string;
  validation: string;
  readme: string;
}

/**
 * Generate all files for a sphere.
 */
export function generateSphereFiles(sphere: GeneratedSphere): SphereFiles {
  const yaml = generateSphereYaml(sphere);
  const manifest = generateSphereManifest(sphere);
  const validation = generateSphereValidation(sphere);
  const readme = generateSphereReadme(sphere);

  return { yaml, manifest, validation, readme };
}

/**
 * Generate sphere.yaml content.
 */
function generateSphereYaml(sphere: GeneratedSphere): string {
  return `# CHE·NU — Sphere Definition
# Generated automatically by Sphere Generator
# DO NOT EDIT inherits, data, or validation sections

sphere:
  name: "${sphere.sphere.name}"
  id: "${sphere.sphere.id}"
  emoji: "${sphere.sphere.emoji}"
  description: "${sphere.sphere.description}"
  version: "${sphere.sphere.version}"

inherits:
  foundation: true
  privacy: true
  global_structural_laws: true
  silence_modes: true

scope:
  included:
${sphere.scope.included.map(i => `    - "${i}"`).join('\n')}
  excluded:
${sphere.scope.excluded.map(e => `    - "${e}"`).join('\n')}
  never_interprets:
    - "identity"
    - "worth"
    - "psychological_traits"

context:
  isolated_by_default: true
  requires_explicit_bridge: true
  bridge_types:
    - "manual_reference"
    - "explicit_user_action"

agents:
  allowed: ${sphere.agents.allowed}
  scope_limited: true
  forbidden_capabilities:
    - profiling
    - implicit_memory
    - cross_sphere_observation

data:
  ownership: "human"
  private_by_default: true
  exportable: true
  deletable_without_justification: true

interactions:
  allowed: ${sphere.interactions.allowed}
  requires_explicit_user_action: true
  no_automatic_sync: true
`;
}

/**
 * Generate sphere.manifest.md content.
 */
function generateSphereManifest(sphere: GeneratedSphere): string {
  return `# ${sphere.sphere.emoji} ${sphere.sphere.name}

> ${sphere.sphere.description}

## Identity

- **ID:** \`${sphere.sphere.id}\`
- **Version:** ${sphere.sphere.version}

## Scope

### Included
${sphere.scope.included.map(i => `- ${i}`).join('\n')}

### Excluded
${sphere.scope.excluded.map(e => `- ${e}`).join('\n')}

### Never Interprets
- Identity
- Worth
- Psychological traits

## Protections

| Protection | Status |
|------------|--------|
| Foundation inheritance | ✅ Enforced |
| Privacy inheritance | ✅ Enforced |
| Human data ownership | ✅ Enforced |
| Private by default | ✅ Enforced |
| Reversibility | ✅ Enabled |
| No urgency patterns | ✅ Enforced |

## Agents

- **Enabled:** ${sphere.agents.allowed ? 'Yes' : 'No'}
- **Scope limited:** Yes
- **Forbidden:** profiling, implicit_memory, cross_sphere_observation

## Interactions

- **Cross-sphere:** ${sphere.interactions.allowed ? 'Allowed (explicit only)' : 'Disabled'}
- **Auto-sync:** Never

---

*Generated by CHE·NU Sphere Generator*
`;
}

/**
 * Generate sphere.validation.json content.
 */
function generateSphereValidation(sphere: GeneratedSphere): string {
  const validation = {
    sphere_id: sphere.sphere.id,
    generated_at: new Date().toISOString(),
    valid: validateSphere(sphere),
    checks: {
      foundation_inheritance: sphere.inherits.foundation === true,
      privacy_inheritance: sphere.inherits.privacy === true,
      human_ownership: sphere.data.ownership === 'human',
      private_by_default: sphere.data.private_by_default === true,
      never_interprets_identity: sphere.scope.never_interprets.includes('identity'),
      reversibility_enabled: sphere.reversibility.enabled === true,
      no_urgency_patterns: sphere.ux.no_urgency_patterns === true,
      profiling_forbidden: sphere.agents.forbidden_capabilities.includes('profiling'),
      implicit_memory_forbidden: sphere.agents.forbidden_capabilities.includes('implicit_memory'),
      cross_sphere_observation_forbidden: sphere.agents.forbidden_capabilities.includes('cross_sphere_observation'),
    },
  };

  return JSON.stringify(validation, null, 2);
}

/**
 * Generate README.md content.
 */
function generateSphereReadme(sphere: GeneratedSphere): string {
  return `# ${sphere.sphere.emoji} ${sphere.sphere.name} Sphere

${sphere.sphere.description}

## Files

- \`sphere.yaml\` - Complete sphere definition
- \`sphere.manifest.md\` - Human-readable manifest
- \`sphere.validation.json\` - Validation results
- \`README.md\` - This file

## Quick Reference

\`\`\`yaml
id: ${sphere.sphere.id}
agents: ${sphere.agents.allowed ? 'enabled' : 'disabled'}
interactions: ${sphere.interactions.allowed ? 'allowed' : 'disabled'}
\`\`\`

## Foundational Protections

This sphere inherits and enforces:

- ✅ Foundation laws
- ✅ Privacy guarantees
- ✅ Human data ownership
- ✅ Reversibility
- ✅ No behavioral optimization

---

*CHE·NU — Governed Intelligence Operating System*
`;
}

/* =========================================================
   EXPORTS
   ========================================================= */

export {
  INHERITED_LAWS,
  NEVER_INTERPRETS,
  FORBIDDEN_CAPABILITIES,
};

export default generateSphere;

/*
 * =====================================================
 * CHE·NU — SPHERE GENERATOR UI
 * Status: FOUNDATIONAL
 * Type: React + TypeScript
 * Mode: Foundation-locked
 * Purpose: Human-guided sphere creation with live validation
 *
 * This UI allows humans to create spheres visually while
 * enforcing all foundational constraints in real-time.
 *
 * ❤️ With love, for humanity.
 * =====================================================
 */

import React, { useState, useMemo, useCallback } from 'react';
import { generateSphere, validateSphere, GeneratedSphere } from './sphereGenerator';

/* =========================================================
   TYPES
   ========================================================= */

/**
 * UI input state for sphere creation.
 */
export type SphereUIInput = {
  name: string;
  id: string;
  emoji: string;
  description: string;
  scope: {
    included: string[];
    excluded: string[];
  };
  agentsEnabled: boolean;
  interSphereInteraction: boolean;
};

/**
 * Validation result.
 */
export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

/* =========================================================
   VALIDATION
   ========================================================= */

/**
 * Validate sphere input before generation.
 */
export function validateSphereInput(input: SphereUIInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!input.name.trim()) {
    errors.push('Sphere name is required.');
  }

  if (!input.id.trim()) {
    errors.push('Sphere id is required.');
  } else if (!/^[a-z0-9_-]+$/.test(input.id)) {
    errors.push('Sphere id must be lowercase, no spaces (use _ or -).');
  }

  if (!input.emoji.trim()) {
    warnings.push('Consider adding an emoji for visual identification.');
  }

  if (!input.description.trim()) {
    errors.push('Description is required.');
  } else if (input.description.length < 10) {
    warnings.push('Consider a more detailed description.');
  }

  // Scope validation
  if (input.scope.included.length === 0) {
    errors.push('Scope must include at least one element.');
  }

  // Check for overlap
  const overlap = input.scope.included.filter(x => 
    input.scope.excluded.includes(x)
  );
  if (overlap.length > 0) {
    errors.push(`Scope included & excluded overlap: ${overlap.join(', ')}`);
  }

  // Warnings for best practices
  if (input.interSphereInteraction && !input.agentsEnabled) {
    warnings.push('Inter-sphere interaction without agents may be limited.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/* =========================================================
   STYLES
   ========================================================= */

const styles = {
  container: {
    maxWidth: 800,
    margin: '0 auto',
    padding: 32,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  } as React.CSSProperties,

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  } as React.CSSProperties,

  title: {
    fontSize: 24,
    fontWeight: 600,
    margin: 0,
  } as React.CSSProperties,

  subtitle: {
    fontSize: 14,
    color: '#666',
    margin: 0,
  } as React.CSSProperties,

  section: {
    marginBottom: 24,
    padding: 20,
    background: '#f8f9fa',
    borderRadius: 12,
    border: '1px solid #e9ecef',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#495057',
    marginBottom: 16,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  field: {
    marginBottom: 16,
  } as React.CSSProperties,

  label: {
    display: 'block',
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
    color: '#212529',
  } as React.CSSProperties,

  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 14,
    border: '1px solid #ced4da',
    borderRadius: 8,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 14,
    border: '1px solid #ced4da',
    borderRadius: 8,
    outline: 'none',
    minHeight: 80,
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 0',
  } as React.CSSProperties,

  checkbox: {
    width: 18,
    height: 18,
    cursor: 'pointer',
  } as React.CSSProperties,

  checkboxLabel: {
    fontSize: 14,
    cursor: 'pointer',
  } as React.CSSProperties,

  errorsBox: {
    padding: 16,
    background: '#fff5f5',
    border: '1px solid #fc8181',
    borderRadius: 8,
    marginBottom: 16,
  } as React.CSSProperties,

  errorItem: {
    color: '#c53030',
    fontSize: 14,
    marginBottom: 4,
  } as React.CSSProperties,

  warningsBox: {
    padding: 16,
    background: '#fffbeb',
    border: '1px solid #f6ad55',
    borderRadius: 8,
    marginBottom: 16,
  } as React.CSSProperties,

  warningItem: {
    color: '#c05621',
    fontSize: 14,
    marginBottom: 4,
  } as React.CSSProperties,

  preview: {
    background: '#1a1a2e',
    color: '#00ff88',
    padding: 20,
    borderRadius: 12,
    fontFamily: 'Monaco, Consolas, monospace',
    fontSize: 13,
    overflow: 'auto',
    maxHeight: 400,
  } as React.CSSProperties,

  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    background: '#2d6a4f',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.2s',
  } as React.CSSProperties,

  buttonDisabled: {
    background: '#adb5bd',
    cursor: 'not-allowed',
  } as React.CSSProperties,

  foundationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    background: '#d4edda',
    color: '#155724',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
  } as React.CSSProperties,

  protectionsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 8,
    marginTop: 12,
  } as React.CSSProperties,

  protectionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#495057',
  } as React.CSSProperties,
};

/* =========================================================
   COMPONENT
   ========================================================= */

export interface SphereGeneratorUIProps {
  /** Callback when sphere is generated */
  onGenerate?: (sphere: GeneratedSphere) => void;
  /** Initial values */
  initialValues?: Partial<SphereUIInput>;
}

/**
 * Sphere Generator UI Component.
 * Allows humans to create spheres with live validation.
 */
export default function SphereGeneratorUI({
  onGenerate,
  initialValues,
}: SphereGeneratorUIProps = {}) {
  // State
  const [input, setInput] = useState<SphereUIInput>({
    name: initialValues?.name ?? '',
    id: initialValues?.id ?? '',
    emoji: initialValues?.emoji ?? '🌐',
    description: initialValues?.description ?? '',
    scope: initialValues?.scope ?? { included: [], excluded: [] },
    agentsEnabled: initialValues?.agentsEnabled ?? true,
    interSphereInteraction: initialValues?.interSphereInteraction ?? false,
  });

  const [generated, setGenerated] = useState<GeneratedSphere | null>(null);
  const [scopeIncludedText, setScopeIncludedText] = useState('');
  const [scopeExcludedText, setScopeExcludedText] = useState('');

  // Validation
  const validation = useMemo(() => validateSphereInput(input), [input]);

  // Update helper
  const update = useCallback(<K extends keyof SphereUIInput>(
    key: K,
    value: SphereUIInput[K]
  ) => {
    setInput(prev => ({ ...prev, [key]: value }));
  }, []);

  // Scope update helper
  const updateScope = useCallback((
    type: 'included' | 'excluded',
    value: string
  ) => {
    const items = value
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
    
    update('scope', {
      ...input.scope,
      [type]: items,
    });

    if (type === 'included') {
      setScopeIncludedText(value);
    } else {
      setScopeExcludedText(value);
    }
  }, [input.scope, update]);

  // Generate sphere
  const handleGenerate = useCallback(() => {
    if (!validation.valid) return;

    try {
      const sphere = generateSphere({
        name: input.name,
        id: input.id,
        emoji: input.emoji,
        description: input.description,
        scope: input.scope,
        agents: { enabled: input.agentsEnabled },
        inter_sphere_interaction: input.interSphereInteraction,
      });

      setGenerated(sphere);
      onGenerate?.(sphere);
    } catch (error) {
      console.error('Sphere generation failed:', error);
    }
  }, [input, validation.valid, onGenerate]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🌳 Create a Sphere</h2>
          <p style={styles.subtitle}>CHE·NU — Governed Intelligence Operating System</p>
        </div>
        <span style={styles.foundationBadge}>
          🔒 Foundation-Locked
        </span>
      </div>

      {/* Identity Section */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Identity</div>

        <div style={styles.field}>
          <label style={styles.label}>Name *</label>
          <input
            style={styles.input}
            value={input.name}
            onChange={e => update('name', e.target.value)}
            placeholder="e.g., Personal, Business, Creative..."
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>ID * (lowercase, no spaces)</label>
          <input
            style={styles.input}
            value={input.id}
            onChange={e => update('id', e.target.value.toLowerCase().replace(/\s/g, '-'))}
            placeholder="e.g., personal, business, creative..."
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Emoji</label>
          <input
            style={{ ...styles.input, width: 80 }}
            value={input.emoji}
            onChange={e => update('emoji', e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description *</label>
          <textarea
            style={styles.textarea}
            value={input.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Describe the purpose of this sphere..."
          />
        </div>
      </div>

      {/* Scope Section */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Scope</div>

        <div style={styles.field}>
          <label style={styles.label}>Included (comma-separated) *</label>
          <input
            style={styles.input}
            value={scopeIncludedText}
            onChange={e => updateScope('included', e.target.value)}
            placeholder="e.g., notes, reflection, private goals..."
          />
          <small style={{ color: '#6c757d', fontSize: 12 }}>
            What this sphere contains
          </small>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Excluded (comma-separated)</label>
          <input
            style={styles.input}
            value={scopeExcludedText}
            onChange={e => updateScope('excluded', e.target.value)}
            placeholder="e.g., performance scoring, external metrics..."
          />
          <small style={{ color: '#6c757d', fontSize: 12 }}>
            What this sphere explicitly excludes
          </small>
        </div>
      </div>

      {/* Options Section */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Options</div>

        <div style={styles.checkboxRow}>
          <input
            type="checkbox"
            id="agentsEnabled"
            style={styles.checkbox}
            checked={input.agentsEnabled}
            onChange={e => update('agentsEnabled', e.target.checked)}
          />
          <label htmlFor="agentsEnabled" style={styles.checkboxLabel}>
            Enable agents in this sphere
          </label>
        </div>

        <div style={styles.checkboxRow}>
          <input
            type="checkbox"
            id="interSphereInteraction"
            style={styles.checkbox}
            checked={input.interSphereInteraction}
            onChange={e => update('interSphereInteraction', e.target.checked)}
          />
          <label htmlFor="interSphereInteraction" style={styles.checkboxLabel}>
            Allow inter-sphere interaction (explicit user action only)
          </label>
        </div>
      </div>

      {/* Foundation Protections */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>🛡️ Foundation Protections (Auto-Applied)</div>
        <div style={styles.protectionsList}>
          <div style={styles.protectionItem}>✅ Foundation inheritance</div>
          <div style={styles.protectionItem}>✅ Privacy inheritance</div>
          <div style={styles.protectionItem}>✅ Human data ownership</div>
          <div style={styles.protectionItem}>✅ Private by default</div>
          <div style={styles.protectionItem}>✅ Reversibility enabled</div>
          <div style={styles.protectionItem}>✅ No urgency patterns</div>
          <div style={styles.protectionItem}>❌ Profiling forbidden</div>
          <div style={styles.protectionItem}>❌ Implicit memory forbidden</div>
          <div style={styles.protectionItem}>❌ Cross-sphere observation forbidden</div>
          <div style={styles.protectionItem}>✅ Never interprets identity</div>
        </div>
      </div>

      {/* Validation */}
      {validation.errors.length > 0 && (
        <div style={styles.errorsBox}>
          {validation.errors.map(err => (
            <div key={err} style={styles.errorItem}>• {err}</div>
          ))}
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div style={styles.warningsBox}>
          {validation.warnings.map(warn => (
            <div key={warn} style={styles.warningItem}>⚠️ {warn}</div>
          ))}
        </div>
      )}

      {/* Preview */}
      {validation.valid && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Preview</div>
          <pre style={styles.preview}>
{JSON.stringify(
  {
    sphere: {
      name: input.name,
      id: input.id,
      emoji: input.emoji,
      description: input.description,
      version: '1.0.0',
    },
    inherits: {
      foundation: true,
      privacy: true,
      global_structural_laws: true,
      silence_modes: true,
    },
    scope: {
      ...input.scope,
      never_interprets: ['identity', 'worth', 'psychological_traits'],
    },
    agents: {
      allowed: input.agentsEnabled,
      forbidden: ['profiling', 'implicit_memory', 'cross_sphere_observation'],
    },
    interactions: {
      allowed: input.interSphereInteraction,
      requires_explicit_user_action: true,
    },
  },
  null,
  2
)}
          </pre>
        </div>
      )}

      {/* Generate Button */}
      <button
        style={{
          ...styles.button,
          ...(validation.valid ? {} : styles.buttonDisabled),
        }}
        disabled={!validation.valid}
        onClick={handleGenerate}
      >
        🌱 Generate Sphere
      </button>

      {/* Generated Result */}
      {generated && (
        <div style={{ ...styles.section, marginTop: 24, background: '#d4edda' }}>
          <div style={styles.sectionTitle}>✅ Sphere Generated Successfully</div>
          <p style={{ margin: 0, color: '#155724' }}>
            {generated.sphere.emoji} <strong>{generated.sphere.name}</strong> ({generated.sphere.id}) is ready.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#155724' }}>
            All foundation protections have been applied automatically.
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   EXPORTS
   ========================================================= */

export { SphereGeneratorUI };

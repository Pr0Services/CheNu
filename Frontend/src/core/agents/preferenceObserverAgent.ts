/* =====================================================
   CHE·NU — PREFERENCE OBSERVER AGENT
   Status: OPERATIONAL (NON-AUTHORITY)
   Version: 1.0
   
   📜 PURPOSE:
   Observe patterns in user interaction without assuming
   intent or enforcing behavior.
   
   📜 CRITICAL RULES:
   - Only record observable signals
   - Preferences are probabilistic hints
   - NEVER trigger actions
   - NEVER hide alternatives
   - ALWAYS mark preferences as reversible
   - Confidence NEVER reaches 1.0 automatically
   ===================================================== */

/* =========================================================
   TYPES — PREFERENCE SIGNALS
   ========================================================= */

export type PreferenceSignalType =
  // Navigation preferences
  | 'preferred_sphere'
  | 'preferred_navigation_path'
  | 'preferred_view_mode'
  
  // Context preferences
  | 'preferred_context_type'
  | 'preferred_working_mode'
  | 'preferred_depth_level'
  
  // Agent preferences
  | 'preferred_agent_category'
  | 'preferred_agent_emphasis'
  
  // Time preferences
  | 'preferred_session_duration'
  | 'preferred_time_sensitivity'
  
  // Output preferences
  | 'preferred_output_format'
  | 'preferred_output_verbosity'
  | 'preferred_language'
  
  // Interaction preferences
  | 'preferred_confirmation_style'
  | 'preferred_clarification_frequency'
  
  // Theme preferences (visual only)
  | 'preferred_visual_theme'
  | 'preferred_color_scheme';

export type PreferenceSource = 'observed' | 'explicit';
export type PreferenceScope = 'global' | 'sphere' | 'project' | 'session';

/* =========================================================
   TYPES — PREFERENCE RECORD
   ========================================================= */

export interface PreferenceRecord {
  /** Unique preference identifier */
  preferenceId: string;

  /** How this preference was detected */
  source: PreferenceSource;

  /** Scope of the preference */
  scope: PreferenceScope;

  /** Type of signal observed */
  signalType: PreferenceSignalType;

  /** Observed value */
  value: string | number | boolean;

  /** 
   * Confidence level (0.0 - 0.95)
   * NEVER 1.0 automatically — only explicit user confirmation can reach 1.0
   */
  confidence: number;

  /** Number of times this pattern was observed */
  observedCount: number;

  /** First observation timestamp */
  firstObserved: string;

  /** Last observation timestamp */
  lastObserved: string;

  /** Associated context (sphere, project, etc.) */
  associatedContext?: {
    sphereId?: string;
    projectId?: string;
    sessionId?: string;
  };

  /** Preferences are ALWAYS reversible */
  reversible: true;

  /** Alternative values that were also observed */
  alternatives: Array<{
    value: string | number | boolean;
    observedCount: number;
    confidence: number;
  }>;

  /** Decay factor for stale preferences */
  decayFactor: number;
}

/* =========================================================
   TYPES — OBSERVABLE ACTION
   ========================================================= */

export interface ObservableAction {
  /** Action type */
  actionType: string;

  /** Action target */
  target: string;

  /** Action value if applicable */
  value?: string | number | boolean;

  /** Timestamp */
  timestamp: string;

  /** Context when action occurred */
  context: {
    sphereId?: string;
    projectId?: string;
    sessionId?: string;
    contextType?: string;
  };

  /** Duration of interaction if applicable */
  duration?: number;

  /** Was this action repeated? */
  isRepeat: boolean;
}

/* =========================================================
   TYPES — PREFERENCE STORE
   ========================================================= */

export interface PreferenceStore {
  /** All recorded preferences */
  preferences: Map<string, PreferenceRecord>;

  /** Last update timestamp */
  lastUpdated: string;

  /** Total observations count */
  totalObservations: number;

  /** Store version for migrations */
  version: string;
}

/* =========================================================
   CONSTANTS
   ========================================================= */

/** Maximum automatic confidence (never 1.0) */
export const MAX_AUTO_CONFIDENCE = 0.95;

/** Minimum observations for confidence > 0.5 */
export const MIN_OBSERVATIONS_FOR_MEDIUM_CONFIDENCE = 3;

/** Minimum observations for confidence > 0.8 */
export const MIN_OBSERVATIONS_FOR_HIGH_CONFIDENCE = 10;

/** Decay rate per day of inactivity */
export const CONFIDENCE_DECAY_RATE = 0.02;

/** Maximum age before preference is considered stale (days) */
export const MAX_PREFERENCE_AGE_DAYS = 90;

/* =========================================================
   PREFERENCE OBSERVER AGENT
   ========================================================= */

/**
 * Preference Observer Agent
 * 
 * Observes patterns in user interaction without assuming
 * intent or enforcing behavior.
 * 
 * Rules:
 * - Only record observable signals
 * - Preferences are probabilistic hints
 * - NEVER trigger actions
 * - NEVER hide alternatives
 * - ALWAYS mark preferences as reversible
 */
export class PreferenceObserverAgent {
  private store: PreferenceStore;
  private readonly version = '1.0';

  constructor() {
    this.store = {
      preferences: new Map(),
      lastUpdated: new Date().toISOString(),
      totalObservations: 0,
      version: this.version,
    };
  }

  /* -------------------------------------------------------
     OBSERVATION
     ------------------------------------------------------- */

  /**
   * Observe a user action and extract preference signals.
   * This is READ-ONLY — no actions are triggered.
   */
  observe(action: ObservableAction): PreferenceRecord | null {
    const signal = this.extractSignal(action);
    if (!signal) {
      return null;
    }

    const preferenceId = this.generatePreferenceId(signal, action.context);
    const existing = this.store.preferences.get(preferenceId);

    if (existing) {
      return this.updatePreference(existing, action, signal);
    } else {
      return this.createPreference(preferenceId, action, signal);
    }
  }

  /**
   * Extract a preference signal from an action.
   */
  private extractSignal(
    action: ObservableAction
  ): { type: PreferenceSignalType; value: string | number | boolean } | null {
    // Map action types to preference signals
    const signalMappings: Record<string, PreferenceSignalType> = {
      'navigate_to_sphere': 'preferred_sphere',
      'select_view_mode': 'preferred_view_mode',
      'select_context': 'preferred_context_type',
      'select_working_mode': 'preferred_working_mode',
      'select_theme': 'preferred_visual_theme',
      'select_output_format': 'preferred_output_format',
      'set_language': 'preferred_language',
      'set_verbosity': 'preferred_output_verbosity',
    };

    const signalType = signalMappings[action.actionType];
    if (!signalType) {
      return null;
    }

    return {
      type: signalType,
      value: action.value ?? action.target,
    };
  }

  /**
   * Generate a unique preference ID.
   */
  private generatePreferenceId(
    signal: { type: PreferenceSignalType; value: string | number | boolean },
    context: ObservableAction['context']
  ): string {
    const contextPart = context.sphereId || context.projectId || 'global';
    return `pref_${signal.type}_${contextPart}_${String(signal.value)}`;
  }

  /**
   * Create a new preference record.
   */
  private createPreference(
    preferenceId: string,
    action: ObservableAction,
    signal: { type: PreferenceSignalType; value: string | number | boolean }
  ): PreferenceRecord {
    const scope = this.determineScope(action.context);

    const preference: PreferenceRecord = {
      preferenceId,
      source: 'observed',
      scope,
      signalType: signal.type,
      value: signal.value,
      confidence: this.calculateInitialConfidence(),
      observedCount: 1,
      firstObserved: action.timestamp,
      lastObserved: action.timestamp,
      associatedContext: action.context,
      reversible: true,
      alternatives: [],
      decayFactor: 1.0,
    };

    this.store.preferences.set(preferenceId, preference);
    this.store.totalObservations++;
    this.store.lastUpdated = new Date().toISOString();

    return preference;
  }

  /**
   * Update an existing preference record.
   */
  private updatePreference(
    existing: PreferenceRecord,
    action: ObservableAction,
    signal: { type: PreferenceSignalType; value: string | number | boolean }
  ): PreferenceRecord {
    // Increment observation count
    existing.observedCount++;
    existing.lastObserved = action.timestamp;

    // Recalculate confidence (never exceeds MAX_AUTO_CONFIDENCE)
    existing.confidence = this.calculateConfidence(existing.observedCount);

    // Reset decay since we have new activity
    existing.decayFactor = 1.0;

    this.store.totalObservations++;
    this.store.lastUpdated = new Date().toISOString();

    return existing;
  }

  /**
   * Determine the scope of a preference.
   */
  private determineScope(context: ObservableAction['context']): PreferenceScope {
    if (context.sessionId && !context.projectId && !context.sphereId) {
      return 'session';
    }
    if (context.projectId) {
      return 'project';
    }
    if (context.sphereId) {
      return 'sphere';
    }
    return 'global';
  }

  /**
   * Calculate initial confidence for a new observation.
   */
  private calculateInitialConfidence(): number {
    // First observation = low confidence
    return 0.2;
  }

  /**
   * Calculate confidence based on observation count.
   * NEVER exceeds MAX_AUTO_CONFIDENCE (0.95).
   */
  private calculateConfidence(observedCount: number): number {
    if (observedCount < MIN_OBSERVATIONS_FOR_MEDIUM_CONFIDENCE) {
      // Low confidence: 0.2 - 0.5
      return Math.min(0.5, 0.2 + observedCount * 0.1);
    }

    if (observedCount < MIN_OBSERVATIONS_FOR_HIGH_CONFIDENCE) {
      // Medium confidence: 0.5 - 0.8
      return Math.min(0.8, 0.5 + (observedCount - MIN_OBSERVATIONS_FOR_MEDIUM_CONFIDENCE) * 0.05);
    }

    // High confidence: 0.8 - 0.95 (never 1.0)
    const additionalConfidence = Math.log10(observedCount - MIN_OBSERVATIONS_FOR_HIGH_CONFIDENCE + 1) * 0.05;
    return Math.min(MAX_AUTO_CONFIDENCE, 0.8 + additionalConfidence);
  }

  /* -------------------------------------------------------
     ALTERNATIVE TRACKING
     ------------------------------------------------------- */

  /**
   * Record an alternative choice for the same signal type.
   * This ensures we NEVER hide alternatives.
   */
  observeAlternative(
    primaryPreferenceId: string,
    alternativeValue: string | number | boolean,
    timestamp: string
  ): void {
    const preference = this.store.preferences.get(primaryPreferenceId);
    if (!preference) {
      return;
    }

    const existingAlt = preference.alternatives.find((a) => a.value === alternativeValue);

    if (existingAlt) {
      existingAlt.observedCount++;
      existingAlt.confidence = this.calculateConfidence(existingAlt.observedCount);
    } else {
      preference.alternatives.push({
        value: alternativeValue,
        observedCount: 1,
        confidence: this.calculateInitialConfidence(),
      });
    }
  }

  /* -------------------------------------------------------
     DECAY & MAINTENANCE
     ------------------------------------------------------- */

  /**
   * Apply decay to stale preferences.
   * Preferences become less confident over time without reinforcement.
   */
  applyDecay(): void {
    const now = new Date();

    this.store.preferences.forEach((preference) => {
      const lastObserved = new Date(preference.lastObserved);
      const daysSinceObserved = (now.getTime() - lastObserved.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceObserved > 1) {
        preference.decayFactor = Math.max(0.1, 1 - daysSinceObserved * CONFIDENCE_DECAY_RATE);
        // Effective confidence = base confidence * decay factor
      }
    });
  }

  /**
   * Get the effective confidence (including decay).
   */
  getEffectiveConfidence(preferenceId: string): number {
    const preference = this.store.preferences.get(preferenceId);
    if (!preference) {
      return 0;
    }
    return preference.confidence * preference.decayFactor;
  }

  /**
   * Remove stale preferences beyond max age.
   */
  pruneStalePreferences(): number {
    const now = new Date();
    let pruned = 0;

    this.store.preferences.forEach((preference, id) => {
      const lastObserved = new Date(preference.lastObserved);
      const daysSinceObserved = (now.getTime() - lastObserved.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceObserved > MAX_PREFERENCE_AGE_DAYS) {
        this.store.preferences.delete(id);
        pruned++;
      }
    });

    return pruned;
  }

  /* -------------------------------------------------------
     QUERY INTERFACE
     ------------------------------------------------------- */

  /**
   * Get preferences for a specific context.
   * Returns hints only — no enforcement.
   */
  getPreferencesForContext(context: {
    sphereId?: string;
    projectId?: string;
    sessionId?: string;
  }): PreferenceRecord[] {
    const results: PreferenceRecord[] = [];

    this.store.preferences.forEach((preference) => {
      // Match by scope
      if (preference.scope === 'global') {
        results.push(preference);
      } else if (preference.scope === 'sphere' && preference.associatedContext?.sphereId === context.sphereId) {
        results.push(preference);
      } else if (preference.scope === 'project' && preference.associatedContext?.projectId === context.projectId) {
        results.push(preference);
      } else if (preference.scope === 'session' && preference.associatedContext?.sessionId === context.sessionId) {
        results.push(preference);
      }
    });

    // Sort by effective confidence (highest first)
    return results.sort((a, b) => {
      const confA = a.confidence * a.decayFactor;
      const confB = b.confidence * b.decayFactor;
      return confB - confA;
    });
  }

  /**
   * Get preferences by signal type.
   */
  getPreferencesByType(signalType: PreferenceSignalType): PreferenceRecord[] {
    const results: PreferenceRecord[] = [];

    this.store.preferences.forEach((preference) => {
      if (preference.signalType === signalType) {
        results.push(preference);
      }
    });

    return results;
  }

  /**
   * Get a summary for the Context Interpreter Agent.
   * This is informational output only.
   */
  getSummaryForContextInterpreter(context: {
    sphereId?: string;
    projectId?: string;
  }): PreferenceSummary {
    const preferences = this.getPreferencesForContext(context);

    const summary: PreferenceSummary = {
      totalPreferences: preferences.length,
      highConfidence: preferences.filter((p) => this.getEffectiveConfidence(p.preferenceId) > 0.7),
      mediumConfidence: preferences.filter((p) => {
        const conf = this.getEffectiveConfidence(p.preferenceId);
        return conf > 0.4 && conf <= 0.7;
      }),
      lowConfidence: preferences.filter((p) => this.getEffectiveConfidence(p.preferenceId) <= 0.4),
      disclaimer: 'These are probabilistic hints only. Human choice always takes precedence.',
      generatedAt: new Date().toISOString(),
    };

    return summary;
  }

  /* -------------------------------------------------------
     EXPLICIT PREFERENCES
     ------------------------------------------------------- */

  /**
   * Record an explicit preference from user.
   * This is the ONLY way confidence can reach 1.0.
   */
  recordExplicitPreference(
    signalType: PreferenceSignalType,
    value: string | number | boolean,
    scope: PreferenceScope,
    context?: {
      sphereId?: string;
      projectId?: string;
      sessionId?: string;
    }
  ): PreferenceRecord {
    const preferenceId = `pref_explicit_${signalType}_${scope}_${String(value)}`;

    const preference: PreferenceRecord = {
      preferenceId,
      source: 'explicit',
      scope,
      signalType,
      value,
      confidence: 1.0, // Only explicit preferences can be 1.0
      observedCount: 1,
      firstObserved: new Date().toISOString(),
      lastObserved: new Date().toISOString(),
      associatedContext: context,
      reversible: true,
      alternatives: [],
      decayFactor: 1.0,
    };

    this.store.preferences.set(preferenceId, preference);
    return preference;
  }

  /**
   * Clear an explicit preference.
   */
  clearExplicitPreference(preferenceId: string): boolean {
    const preference = this.store.preferences.get(preferenceId);
    if (preference && preference.source === 'explicit') {
      this.store.preferences.delete(preferenceId);
      return true;
    }
    return false;
  }

  /* -------------------------------------------------------
     EXPORT / IMPORT
     ------------------------------------------------------- */

  /**
   * Export preferences for backup or transfer.
   */
  exportPreferences(): string {
    const exportData = {
      version: this.version,
      exportedAt: new Date().toISOString(),
      preferences: Array.from(this.store.preferences.values()),
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import preferences (merge, don't replace).
   */
  importPreferences(data: string): number {
    const parsed = JSON.parse(data);
    let imported = 0;

    for (const pref of parsed.preferences) {
      if (!this.store.preferences.has(pref.preferenceId)) {
        this.store.preferences.set(pref.preferenceId, pref);
        imported++;
      }
    }

    return imported;
  }

  /* -------------------------------------------------------
     STATS
     ------------------------------------------------------- */

  /**
   * Get store statistics.
   */
  getStats(): PreferenceStoreStats {
    const preferences = Array.from(this.store.preferences.values());

    return {
      totalPreferences: preferences.length,
      observedPreferences: preferences.filter((p) => p.source === 'observed').length,
      explicitPreferences: preferences.filter((p) => p.source === 'explicit').length,
      totalObservations: this.store.totalObservations,
      averageConfidence:
        preferences.reduce((sum, p) => sum + p.confidence * p.decayFactor, 0) / preferences.length || 0,
      lastUpdated: this.store.lastUpdated,
      version: this.version,
    };
  }
}

/* =========================================================
   TYPES — OUTPUT
   ========================================================= */

export interface PreferenceSummary {
  totalPreferences: number;
  highConfidence: PreferenceRecord[];
  mediumConfidence: PreferenceRecord[];
  lowConfidence: PreferenceRecord[];
  disclaimer: string;
  generatedAt: string;
}

export interface PreferenceStoreStats {
  totalPreferences: number;
  observedPreferences: number;
  explicitPreferences: number;
  totalObservations: number;
  averageConfidence: number;
  lastUpdated: string;
  version: string;
}

/* =========================================================
   SYSTEM PROMPT
   ========================================================= */

export const PREFERENCE_OBSERVER_SYSTEM_PROMPT = `
You are the CHE·NU Preference Observer Agent.

Your role is to observe patterns in user interaction
without assuming intent or enforcing behavior.

Rules:
- You may only record observable signals.
- You must treat preferences as probabilistic hints.
- You must never trigger actions.
- You must never hide alternatives.
- You must always mark preferences as reversible.

Confidence levels:
- Automatic confidence NEVER exceeds 0.95
- Only explicit user preferences can reach 1.0
- Confidence decays over time without reinforcement
- Always show alternatives with their confidence

Your output is informational only.
No authority. No enforcement. No optimization.

Observation recorded. No enforcement applied.
`.trim();

/* =========================================================
   FORMATTER
   ========================================================= */

/**
 * Format preference summary for display.
 */
export function formatPreferenceSummary(summary: PreferenceSummary): string {
  let output = `
CHE·NU — PREFERENCE OBSERVATION SUMMARY
=======================================

Total Preferences Observed: ${summary.totalPreferences}
Generated: ${summary.generatedAt}

⚠️ DISCLAIMER: ${summary.disclaimer}

`;

  if (summary.highConfidence.length > 0) {
    output += `HIGH CONFIDENCE (>70%)\n${'─'.repeat(40)}\n`;
    for (const pref of summary.highConfidence.slice(0, 5)) {
      output += `  • ${pref.signalType}: ${pref.value} (${(pref.confidence * 100).toFixed(0)}%)\n`;
      output += `    Observed ${pref.observedCount}x | Source: ${pref.source}\n`;
      if (pref.alternatives.length > 0) {
        output += `    Alternatives: ${pref.alternatives.map((a) => `${a.value} (${(a.confidence * 100).toFixed(0)}%)`).join(', ')}\n`;
      }
    }
    output += '\n';
  }

  if (summary.mediumConfidence.length > 0) {
    output += `MEDIUM CONFIDENCE (40-70%)\n${'─'.repeat(40)}\n`;
    for (const pref of summary.mediumConfidence.slice(0, 5)) {
      output += `  • ${pref.signalType}: ${pref.value} (${(pref.confidence * 100).toFixed(0)}%)\n`;
    }
    output += '\n';
  }

  if (summary.lowConfidence.length > 0) {
    output += `LOW CONFIDENCE (<40%)\n${'─'.repeat(40)}\n`;
    for (const pref of summary.lowConfidence.slice(0, 3)) {
      output += `  • ${pref.signalType}: ${pref.value} (${(pref.confidence * 100).toFixed(0)}%)\n`;
    }
    output += '\n';
  }

  output += `
${'═'.repeat(40)}
These preferences are HINTS only.
They do NOT enforce any behavior.
Human choice always takes precedence.
All preferences are reversible.
`.trim();

  return output;
}

/* =========================================================
   SINGLETON INSTANCE
   ========================================================= */

export const preferenceObserver = new PreferenceObserverAgent();

/* =========================================================
   EXPORTS
   ========================================================= */

export default PreferenceObserverAgent;

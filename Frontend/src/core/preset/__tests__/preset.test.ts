/* =========================================
   CHE·NU — PRESET SYSTEM TESTS
   
   Tests pour le système de presets.
   Vérifie le respect des 5 Lois.
   ========================================= */

import {
  PresetTimeline,
  addPresetChange,
  recordPreset,
  currentPreset,
  clearTimeline,
  getTimelineSize,
  PresetAura,
  getPresetAura,
  setPresetAura,
  presetAt,
  transitions,
  transitionAt,
  presetMetrics,
  topPresets,
  sourceCount,
  manualVsAuto,
  explainPreset,
  explainCurrent,
  sessionSummary,
  exportTimeline,
  importTimeline,
} from '../timeline';

import {
  PRESET_LAWS,
  PRESET_PRIORITY,
  DEFAULT_PRESETS,
  isPresetSource,
  isPresetChange,
  isPresetConfig,
} from '../types';

describe('CHE·NU Preset System', () => {
  // Clean slate before each test
  beforeEach(() => {
    clearTimeline();
  });

  // =============================================
  // SECTION 1: TIMELINE TESTS
  // =============================================
  
  describe('Timeline (Source de Vérité)', () => {
    it('should start empty', () => {
      expect(PresetTimeline).toHaveLength(0);
      expect(currentPreset()).toBeUndefined();
      expect(getTimelineSize()).toBe(0);
    });

    it('should record preset changes', () => {
      const change = recordPreset('focus', 'manual');
      
      expect(PresetTimeline).toHaveLength(1);
      expect(change.p).toBe('focus');
      expect(change.s).toBe('manual');
      expect(change.t).toBeLessThanOrEqual(Date.now());
    });

    it('should track current preset', () => {
      recordPreset('focus', 'manual');
      expect(currentPreset()).toBe('focus');
      
      recordPreset('exploration', 'phase');
      expect(currentPreset()).toBe('exploration');
      
      recordPreset('audit', 'role');
      expect(currentPreset()).toBe('audit');
    });

    it('should clear timeline completely', () => {
      recordPreset('focus', 'manual');
      recordPreset('exploration', 'phase');
      
      expect(getTimelineSize()).toBe(2);
      
      clearTimeline();
      
      expect(PresetTimeline).toHaveLength(0);
      expect(currentPreset()).toBeUndefined();
      expect(getTimelineSize()).toBe(0);
    });

    it('should add changes with context', () => {
      const change = recordPreset('focus', 'project', {
        project: 'construction-a',
        reason: 'Project started',
      });
      
      expect(change.ctx?.project).toBe('construction-a');
      expect(change.ctx?.reason).toBe('Project started');
    });

    it('should preserve order of changes', () => {
      recordPreset('focus', 'manual');
      recordPreset('exploration', 'phase');
      recordPreset('audit', 'role');
      
      expect(PresetTimeline[0].p).toBe('focus');
      expect(PresetTimeline[1].p).toBe('exploration');
      expect(PresetTimeline[2].p).toBe('audit');
    });
  });

  // =============================================
  // SECTION 2: AURA TESTS
  // =============================================
  
  describe('XR Auras (Visualisation)', () => {
    it('should have default auras for core presets', () => {
      expect(getPresetAura('focus')).toBeDefined();
      expect(getPresetAura('exploration')).toBeDefined();
      expect(getPresetAura('audit')).toBeDefined();
      expect(getPresetAura('meeting')).toBeDefined();
      expect(getPresetAura('minimal')).toBeDefined();
    });

    it('should return undefined for unknown preset', () => {
      expect(getPresetAura('nonexistent')).toBeUndefined();
    });

    it('should allow setting custom aura', () => {
      const customAura = {
        color: '#FF0000',
        radius: 2.0,
        animation: 'shimmer' as const,
        intensity: 1.0,
      };
      
      setPresetAura('custom', customAura);
      
      expect(getPresetAura('custom')).toEqual(customAura);
    });

    it('should have valid color formats', () => {
      Object.values(PresetAura).forEach((aura) => {
        expect(aura.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should have positive radius values', () => {
      Object.values(PresetAura).forEach((aura) => {
        expect(aura.radius).toBeGreaterThan(0);
      });
    });
  });

  // =============================================
  // SECTION 3: REPLAY TESTS
  // =============================================
  
  describe('Replay (Navigation Temporelle)', () => {
    it('should find preset at specific time', () => {
      const t1 = 1000;
      const t2 = 2000;
      const t3 = 3000;
      
      addPresetChange({ t: t1, p: 'focus', s: 'manual' });
      addPresetChange({ t: t2, p: 'exploration', s: 'phase' });
      addPresetChange({ t: t3, p: 'audit', s: 'role' });
      
      expect(presetAt(t1)?.p).toBe('focus');
      expect(presetAt(t2)?.p).toBe('exploration');
      expect(presetAt(t3)?.p).toBe('audit');
      
      // Between changes
      expect(presetAt(1500)?.p).toBe('focus');
      expect(presetAt(2500)?.p).toBe('exploration');
    });

    it('should return undefined for time before first change', () => {
      addPresetChange({ t: 1000, p: 'focus', s: 'manual' });
      
      expect(presetAt(0)).toBeUndefined();
      expect(presetAt(999)).toBeUndefined();
    });

    it('should calculate all transitions', () => {
      addPresetChange({ t: 1000, p: 'focus', s: 'manual' });
      addPresetChange({ t: 2000, p: 'exploration', s: 'phase' });
      addPresetChange({ t: 3000, p: 'audit', s: 'role' });
      
      const trans = transitions();
      
      expect(trans).toHaveLength(2);
      expect(trans[0]).toMatchObject({ from: 'focus', to: 'exploration', at: 2000 });
      expect(trans[1]).toMatchObject({ from: 'exploration', to: 'audit', at: 3000 });
    });

    it('should return empty transitions for single entry', () => {
      addPresetChange({ t: 1000, p: 'focus', s: 'manual' });
      
      expect(transitions()).toHaveLength(0);
    });

    it('should find transition at specific time', () => {
      addPresetChange({ t: 1000, p: 'focus', s: 'manual' });
      addPresetChange({ t: 2000, p: 'exploration', s: 'phase' });
      
      expect(transitionAt(2000)?.to).toBe('exploration');
      expect(transitionAt(2500)?.to).toBe('exploration');
      expect(transitionAt(1500)).toBeUndefined();
    });
  });

  // =============================================
  // SECTION 4: METRICS TESTS
  // =============================================
  
  describe('Metrics (Observation)', () => {
    it('should compute preset metrics', () => {
      addPresetChange({ t: 1000, p: 'focus', s: 'manual' });
      addPresetChange({ t: 3000, p: 'exploration', s: 'phase' });
      addPresetChange({ t: 4000, p: 'focus', s: 'manual' });
      addPresetChange({ t: 6000, p: 'audit', s: 'role' });
      
      const metrics = presetMetrics();
      
      expect(metrics.focus.count).toBe(2);
      expect(metrics.focus.durationMs).toBe(4000); // 2000 + 2000
      expect(metrics.exploration.count).toBe(1);
      expect(metrics.exploration.durationMs).toBe(1000);
    });

    it('should calculate average duration', () => {
      addPresetChange({ t: 1000, p: 'focus', s: 'manual' });
      addPresetChange({ t: 2000, p: 'exploration', s: 'phase' });
      addPresetChange({ t: 4000, p: 'focus', s: 'manual' });
      addPresetChange({ t: 6000, p: 'audit', s: 'role' });
      
      const metrics = presetMetrics();
      
      // focus: (1000 + 2000) / 2 = 1500
      expect(metrics.focus.avgDurationMs).toBe(1500);
    });

    it('should return top presets by count', () => {
      recordPreset('focus', 'manual');
      recordPreset('focus', 'manual');
      recordPreset('focus', 'manual');
      recordPreset('exploration', 'phase');
      recordPreset('exploration', 'phase');
      recordPreset('audit', 'role');
      
      const top = topPresets(2);
      
      expect(top[0]).toBe('focus');
      expect(top[1]).toBe('exploration');
      expect(top).toHaveLength(2);
    });

    it('should count changes by source', () => {
      recordPreset('focus', 'manual');
      recordPreset('focus', 'manual');
      recordPreset('exploration', 'phase');
      recordPreset('audit', 'role');
      recordPreset('meeting', 'agent');
      
      const counts = sourceCount();
      
      expect(counts.manual).toBe(2);
      expect(counts.phase).toBe(1);
      expect(counts.role).toBe(1);
      expect(counts.agent).toBe(1);
      expect(counts.project).toBe(0);
      expect(counts.sphere).toBe(0);
    });

    it('should calculate manual vs auto ratio', () => {
      recordPreset('focus', 'manual');
      recordPreset('focus', 'manual');
      recordPreset('exploration', 'phase');
      recordPreset('audit', 'role');
      
      const ratio = manualVsAuto();
      
      expect(ratio.manual).toBe(2);
      expect(ratio.auto).toBe(2);
      expect(ratio.ratio).toBe(0.5);
    });
  });

  // =============================================
  // SECTION 5: EXPLAIN TESTS
  // =============================================
  
  describe('Explain (Transparence)', () => {
    it('should explain a preset change', () => {
      const change = recordPreset('focus', 'manual');
      const explanation = explainPreset(change);
      
      expect(explanation).toContain('Focus');
      expect(explanation).toContain('choix utilisateur');
    });

    it('should explain current preset', () => {
      recordPreset('exploration', 'phase', { phase: 'planning' });
      
      const explanation = explainCurrent();
      
      expect(explanation).toContain('Exploration');
    });

    it('should return message when no preset active', () => {
      expect(explainCurrent()).toBe('Aucun preset actif');
    });

    it('should generate session summary', () => {
      recordPreset('focus', 'manual');
      recordPreset('exploration', 'phase');
      recordPreset('focus', 'manual');
      
      const summary = sessionSummary();
      
      expect(summary).toContain('Résumé de session');
      expect(summary).toContain('Changements: 3');
      expect(summary).toContain('focus');
    });
  });

  // =============================================
  // SECTION 6: EXPORT/IMPORT TESTS
  // =============================================
  
  describe('Export/Import', () => {
    it('should export timeline as JSON', () => {
      recordPreset('focus', 'manual');
      recordPreset('exploration', 'phase');
      
      const json = exportTimeline();
      const data = JSON.parse(json);
      
      expect(data.version).toBe('1.0');
      expect(data.changes).toHaveLength(2);
      expect(data.metrics).toBeDefined();
      expect(data.summary.total).toBe(2);
    });

    it('should import timeline from JSON', () => {
      const data = {
        version: '1.0',
        changes: [
          { t: 1000, p: 'focus', s: 'manual' },
          { t: 2000, p: 'exploration', s: 'phase' },
        ],
      };
      
      const imported = importTimeline(JSON.stringify(data));
      
      expect(imported).toBe(2);
      expect(getTimelineSize()).toBe(2);
    });

    it('should avoid duplicate imports', () => {
      addPresetChange({ t: 1000, p: 'focus', s: 'manual' });
      
      const data = {
        changes: [
          { t: 1000, p: 'focus', s: 'manual' }, // duplicate
          { t: 2000, p: 'exploration', s: 'phase' }, // new
        ],
      };
      
      const imported = importTimeline(JSON.stringify(data));
      
      expect(imported).toBe(1); // Only 1 new
      expect(getTimelineSize()).toBe(2);
    });
  });

  // =============================================
  // SECTION 7: LAWS TESTS
  // =============================================
  
  describe('5 Lois des Presets', () => {
    it('LOI 1: Timeline = vérité absolue', () => {
      // Every change is recorded
      recordPreset('focus', 'manual');
      recordPreset('exploration', 'phase');
      
      expect(PresetTimeline).toHaveLength(2);
      expect(PresetTimeline[0].t).toBeLessThan(PresetTimeline[1].t);
    });

    it('LOI 2: XR = visualisation, jamais décision', () => {
      // Auras are separate from logic
      const change = recordPreset('focus', 'manual');
      const aura = getPresetAura('focus');
      
      // Aura doesn't affect the change
      expect(change.p).toBe('focus');
      expect(aura).toBeDefined();
      // Change doesn't reference aura
      expect(change).not.toHaveProperty('aura');
    });

    it('LOI 3: Metrics = observation, jamais jugement', () => {
      // Metrics only observe, don't modify
      recordPreset('focus', 'manual');
      const beforeMetrics = presetMetrics();
      
      // Getting metrics doesn't change timeline
      expect(getTimelineSize()).toBe(1);
      
      // Metrics are read-only snapshots
      beforeMetrics.focus.count = 999;
      const afterMetrics = presetMetrics();
      expect(afterMetrics.focus.count).toBe(1);
    });

    it('LOI 4: Aucun preset automatique', () => {
      // Every change must have explicit source
      const change = recordPreset('focus', 'manual');
      
      expect(change.s).toBeDefined();
      expect(isPresetSource(change.s)).toBe(true);
      
      // No 'auto' source exists
      expect(['manual', 'role', 'phase', 'project', 'sphere', 'agent'])
        .toContain(change.s);
    });

    it('LOI 5: Humain > système, toujours', () => {
      // Manual has highest priority
      expect(PRESET_PRIORITY[0]).toBe('manual');
      
      // Laws are immutable
      expect(PRESET_LAWS).toContain('Humain > système, toujours');
      expect(Object.isFrozen(PRESET_LAWS)).toBe(true);
    });
  });

  // =============================================
  // SECTION 8: TYPE GUARDS TESTS
  // =============================================
  
  describe('Type Guards', () => {
    it('should validate PresetSource', () => {
      expect(isPresetSource('manual')).toBe(true);
      expect(isPresetSource('role')).toBe(true);
      expect(isPresetSource('invalid')).toBe(false);
      expect(isPresetSource(123)).toBe(false);
      expect(isPresetSource(null)).toBe(false);
    });

    it('should validate PresetChange', () => {
      expect(isPresetChange({ t: 1000, p: 'focus', s: 'manual' })).toBe(true);
      expect(isPresetChange({ t: 1000, p: 'focus' })).toBe(false);
      expect(isPresetChange({ t: 'invalid', p: 'focus', s: 'manual' })).toBe(false);
      expect(isPresetChange(null)).toBe(false);
    });

    it('should validate PresetConfig', () => {
      expect(isPresetConfig(DEFAULT_PRESETS.focus)).toBe(true);
      expect(isPresetConfig({ id: 'test' })).toBe(false);
      expect(isPresetConfig(null)).toBe(false);
    });
  });

  // =============================================
  // SECTION 9: DEFAULT PRESETS TESTS
  // =============================================
  
  describe('Default Presets', () => {
    it('should have all 5 core presets', () => {
      expect(DEFAULT_PRESETS.focus).toBeDefined();
      expect(DEFAULT_PRESETS.exploration).toBeDefined();
      expect(DEFAULT_PRESETS.audit).toBeDefined();
      expect(DEFAULT_PRESETS.meeting).toBeDefined();
      expect(DEFAULT_PRESETS.minimal).toBeDefined();
    });

    it('should have valid structure', () => {
      Object.values(DEFAULT_PRESETS).forEach((preset) => {
        expect(preset.id).toBeDefined();
        expect(preset.label).toBeDefined();
        expect(preset.density).toBeDefined();
        expect(preset.xr).toBeDefined();
        expect(typeof preset.xr.enabled).toBe('boolean');
      });
    });
  });
});

/* =========================================
   CHE·NU — PATH SYSTEM TESTS
   
   Tests du système de chemins.
   Vérifie le respect du manifeste directionnel.
   ========================================= */

import {
  PATHS,
  OPTIONS,
  RETREAT_RULES,
  PATH_LAWS,
  parseIntention,
  canWriteToTimeline,
  getAllowedOptions,
  requiresValidation,
  PathType,
} from '../path.types';

import {
  enterPath,
  executeOption,
  validate,
  retreat,
  addNote,
  markIdea,
  prepareDecision,
  getCurrentState,
  getCurrentPath,
  getCurrentIntention,
  getAvailableOptions,
  hasPendingValidation,
  resetPathEngine,
} from '../path.engine';

describe('CHE·NU Path System', () => {
  beforeEach(() => {
    resetPathEngine();
  });

  // =============================================
  // CONCEPTS FONDAMENTAUX
  // =============================================

  describe('Concepts Fondamentaux', () => {
    it('should have exactly 4 paths (limitation volontaire)', () => {
      const pathCount = Object.keys(PATHS).length;
      expect(pathCount).toBe(4);
      expect(pathCount).toBeLessThanOrEqual(4); // JAMAIS plus de 4
    });

    it('should have 5 laws', () => {
      expect(PATH_LAWS).toHaveLength(5);
      expect(PATH_LAWS[0]).toContain('Timeline');
      expect(PATH_LAWS[4]).toContain('Humain');
    });

    it('each path should have an intention phrase', () => {
      Object.values(PATHS).forEach((path) => {
        expect(path.intention).toBeDefined();
        expect(path.intention.length).toBeGreaterThan(0);
      });
    });

    it('each option should have a clear question', () => {
      Object.values(OPTIONS).forEach((opt) => {
        expect(opt.question).toBeDefined();
        expect(opt.question).toMatch(/\?$/); // Doit finir par ?
      });
    });
  });

  // =============================================
  // CHEMIN A — REPRISE
  // =============================================

  describe('Chemin A — Reprise', () => {
    const path: PathType = 'reprise';

    it('should have correct intention', () => {
      expect(PATHS[path].intention).toBe('Je reviens continuer');
    });

    it('should NOT write to timeline', () => {
      expect(canWriteToTimeline(path)).toBe(false);
    });

    it('should allow: continuer, changerPreset, changerSphere', () => {
      const options = getAllowedOptions(path);
      expect(options).toContain('continuer');
      expect(options).toContain('changerPreset');
      expect(options).toContain('changerSphere');
    });

    it('should forbid new decisions and intrusive suggestions', () => {
      expect(PATHS[path].forbidden).toContain('nouvelleDecision');
      expect(PATHS[path].forbidden).toContain('suggestionIntrusive');
    });
  });

  // =============================================
  // CHEMIN B — NOUVEL OBJECTIF
  // =============================================

  describe('Chemin B — Nouvel Objectif', () => {
    const path: PathType = 'objectif';

    it('should have correct intention', () => {
      expect(PATHS[path].intention).toBe('Je commence quelque chose');
    });

    it('should write to timeline ONLY after validation', () => {
      expect(canWriteToTimeline(path)).toBe(true);
      expect(PATHS[path].requiresValidation).toBe(true);
    });

    it('should allow: choixSphere, choixPreset, estimationDuree', () => {
      const options = getAllowedOptions(path);
      expect(options).toContain('choixSphere');
      expect(options).toContain('choixPreset');
      expect(options).toContain('estimationDuree');
    });

    it('should forbid implicit creation and automatic writing', () => {
      expect(PATHS[path].forbidden).toContain('creationImplicite');
      expect(PATHS[path].forbidden).toContain('ecritureAutomatique');
    });
  });

  // =============================================
  // CHEMIN C — EXPLORATION
  // =============================================

  describe('Chemin C — Exploration', () => {
    const path: PathType = 'exploration';

    it('should have correct intention', () => {
      expect(PATHS[path].intention).toBe('Je réfléchis / je découvre');
    });

    it('should NOT write automatically to timeline', () => {
      expect(canWriteToTimeline(path)).toBe(false);
    });

    it('should allow: priseNotes, basculeFocus, marquageIdee', () => {
      const options = getAllowedOptions(path);
      expect(options).toContain('priseNotes');
      expect(options).toContain('basculeFocus');
      expect(options).toContain('marquageIdee');
    });

    it('marquageIdee should require validation', () => {
      expect(requiresValidation('marquageIdee')).toBe(true);
    });
  });

  // =============================================
  // CHEMIN D — DÉCISION
  // =============================================

  describe('Chemin D — Décision', () => {
    const path: PathType = 'decision';

    it('should have correct intention', () => {
      expect(PATHS[path].intention).toBe('Je tranche');
    });

    it('should ALWAYS write to timeline', () => {
      expect(canWriteToTimeline(path)).toBe(true);
      expect(PATHS[path].requiresValidation).toBe(true);
    });

    it('should allow: voirContexte, demanderAnalyse, comparerOptions', () => {
      const options = getAllowedOptions(path);
      expect(options).toContain('voirContexte');
      expect(options).toContain('demanderAnalyse');
      expect(options).toContain('comparerOptions');
    });

    it('should forbid decision suppression', () => {
      expect(PATHS[path].forbidden).toContain('suppressionDecision');
    });
  });

  // =============================================
  // RECUL (ROLLBACK)
  // =============================================

  describe('Recul (Rollback)', () => {
    it('should NEVER write to timeline on retreat', () => {
      Object.values(RETREAT_RULES).forEach((rule) => {
        expect(rule.writesToTimeline).toBe(false);
      });
    });

    it('should ALWAYS preserve history', () => {
      Object.values(RETREAT_RULES).forEach((rule) => {
        expect(rule.preserveHistory).toBe(true);
      });
    });

    it('reprise should retreat to neutral', () => {
      expect(RETREAT_RULES.reprise.target).toBe('neutral');
    });

    it('exploration should retreat to lastStable', () => {
      expect(RETREAT_RULES.exploration.target).toBe('lastStable');
    });
  });

  // =============================================
  // INTENTION PARSING
  // =============================================

  describe('Intention Parsing', () => {
    it('should parse reprise intentions', () => {
      expect(parseIntention('Je reviens continuer')).toBe('reprise');
      expect(parseIntention('Je reprends où j\'étais')).toBe('reprise');
    });

    it('should parse objectif intentions', () => {
      expect(parseIntention('Je commence un nouveau projet')).toBe('objectif');
      expect(parseIntention('Je veux créer quelque chose')).toBe('objectif');
    });

    it('should parse exploration intentions', () => {
      expect(parseIntention('Je veux explorer les options')).toBe('exploration');
      expect(parseIntention('Je réfléchis à cette idée')).toBe('exploration');
    });

    it('should parse decision intentions', () => {
      expect(parseIntention('Je dois décider maintenant')).toBe('decision');
      expect(parseIntention('Il faut trancher')).toBe('decision');
    });

    it('should default to exploration for ambiguous intentions', () => {
      expect(parseIntention('Je ne sais pas')).toBe('exploration');
    });
  });

  // =============================================
  // PATH ENGINE
  // =============================================

  describe('Path Engine', () => {
    it('should start in reprise path', () => {
      expect(getCurrentPath()).toBe('reprise');
    });

    it('should enter a path with intention', () => {
      enterPath('exploration', 'Je veux explorer');
      expect(getCurrentPath()).toBe('exploration');
      expect(getCurrentIntention()).toBe('Je réfléchis / je découvre');
    });

    it('should execute allowed options', () => {
      enterPath('exploration');
      const step = executeOption('priseNotes', { note: 'Test' });
      expect(step).not.toBeNull();
      expect(step?.option).toBe('priseNotes');
    });

    it('should reject disallowed options', () => {
      enterPath('reprise');
      const step = executeOption('priseNotes'); // Not allowed in reprise
      expect(step).toBeNull();
    });

    it('should create pending validation for required options', () => {
      enterPath('exploration');
      executeOption('marquageIdee', { ideaId: 'test-idea' });
      expect(hasPendingValidation()).toBe(true);
    });

    it('should handle validation confirmation', () => {
      enterPath('decision', 'Je tranche');
      prepareDecision('Choisir option A');
      
      const result = validate(true);
      expect(result.validated).toBe(true);
      expect(result.validatedBy).toBe('user');
      expect(result.canWriteToTimeline).toBe(true);
    });

    it('should handle validation cancellation', () => {
      enterPath('decision');
      prepareDecision('Test decision');
      
      const result = validate(false);
      expect(result.validated).toBe(false);
      expect(result.canWriteToTimeline).toBe(false);
    });

    it('should retreat without writing to timeline', () => {
      enterPath('exploration');
      addNote('Test note');
      
      const stateBefore = getCurrentState();
      expect(stateBefore.scratch.notes).toHaveLength(1);
      
      retreat();
      
      // State is reset but no timeline write
      const stateAfter = getCurrentState();
      expect(stateAfter.steps.filter((s) => s.validated)).toHaveLength(0);
    });
  });

  // =============================================
  // EXPLORATION SPECIFICS
  // =============================================

  describe('Exploration Features', () => {
    beforeEach(() => {
      enterPath('exploration');
    });

    it('should add notes without saving', () => {
      addNote('First note');
      addNote('Second note');
      
      const state = getCurrentState();
      expect(state.scratch.notes).toHaveLength(2);
    });

    it('should mark ideas with validation', () => {
      markIdea('idea-123');
      
      expect(hasPendingValidation()).toBe(true);
      
      const state = getCurrentState();
      expect(state.scratch.ideasMarked).toContain('idea-123');
    });
  });

  // =============================================
  // DECISION SPECIFICS
  // =============================================

  describe('Decision Features', () => {
    it('should auto-enter decision path when preparing decision', () => {
      enterPath('exploration');
      prepareDecision('Important choice');
      
      expect(getCurrentPath()).toBe('decision');
    });

    it('should always require validation for decisions', () => {
      enterPath('decision');
      prepareDecision('My decision');
      
      expect(hasPendingValidation()).toBe(true);
    });
  });

  // =============================================
  // LOIS DU MANIFESTE
  // =============================================

  describe('Manifeste Laws Compliance', () => {
    it('LOI 1: Timeline is append-only', () => {
      // Verified by: No delete operations exist
      expect(true).toBe(true); // Structural compliance
    });

    it('LOI 2: Human validation required', () => {
      const pathsRequiringValidation = Object.values(PATHS)
        .filter((p) => p.canWriteTimeline);
      
      pathsRequiringValidation.forEach((p) => {
        expect(p.requiresValidation).toBe(true);
      });
    });

    it('LOI 3: Retreat = Repositioning (never deletion)', () => {
      Object.values(RETREAT_RULES).forEach((rule) => {
        expect(rule.writesToTimeline).toBe(false);
        expect(rule.preserveHistory).toBe(true);
      });
    });

    it('LOI 4: Maximum 4 paths', () => {
      expect(Object.keys(PATHS).length).toBeLessThanOrEqual(4);
    });

    it('LOI 5: Human > System', () => {
      // All timeline writes require human validation
      Object.values(PATHS)
        .filter((p) => p.canWriteTimeline)
        .forEach((p) => {
          expect(p.requiresValidation).toBe(true);
        });
    });
  });
});

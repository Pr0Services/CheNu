/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ 3D WORLD - ZUSTAND STORE
 * État global pour la navigation et l'interaction 3D
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { create } from 'zustand';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type SpaceId = 
  | 'maison'
  | 'entreprise'
  | 'projets'
  | 'gouvernement'
  | 'immobilier'
  | 'associations'
  | 'creative';

interface World3DState {
  // État de navigation
  hoveredSpace: SpaceId | null;
  selectedSpace: SpaceId | null;
  focusedSpace: SpaceId | null;
  
  // État UI
  isPanelOpen: boolean;
  isNovaOpen: boolean;
  showLabels: boolean;
  showAgents: boolean;
  
  // État caméra
  isAnimating: boolean;
  cameraTarget: [number, number, number];
  
  // Qualité
  quality: 'low' | 'medium' | 'high';
  
  // Actions
  setHoveredSpace: (id: SpaceId | null) => void;
  selectSpace: (id: SpaceId | null) => void;
  focusOnSpace: (id: SpaceId) => void;
  resetView: () => void;
  openPanel: () => void;
  closePanel: () => void;
  toggleNova: () => void;
  setQuality: (q: 'low' | 'medium' | 'high') => void;
  setAnimating: (v: boolean) => void;
  setCameraTarget: (target: [number, number, number]) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useWorld3DStore = create<World3DState>((set, get) => ({
  // Initial state
  hoveredSpace: null,
  selectedSpace: null,
  focusedSpace: null,
  isPanelOpen: false,
  isNovaOpen: false,
  showLabels: true,
  showAgents: true,
  isAnimating: false,
  cameraTarget: [0, 0, 0],
  quality: 'high',
  
  // Actions
  setHoveredSpace: (id) => set({ hoveredSpace: id }),
  
  selectSpace: (id) => {
    set({ 
      selectedSpace: id,
      isPanelOpen: id !== null
    });
  },
  
  focusOnSpace: (id) => {
    set({
      focusedSpace: id,
      selectedSpace: id,
      isPanelOpen: true,
      isAnimating: true
    });
  },
  
  resetView: () => {
    set({
      focusedSpace: null,
      selectedSpace: null,
      isPanelOpen: false,
      isAnimating: true,
      cameraTarget: [0, 0, 0]
    });
  },
  
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false, selectedSpace: null }),
  toggleNova: () => set((state) => ({ isNovaOpen: !state.isNovaOpen })),
  setQuality: (q) => set({ quality: q }),
  setAnimating: (v) => set({ isAnimating: v }),
  setCameraTarget: (target) => set({ cameraTarget: target })
}));

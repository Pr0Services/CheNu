import { MethodologySelection, MethodologyApplication } from "../types/methodology";

const KEY = "chenu_methodology";

const DEFAULT_STATE: MethodologySelection = {
  selectedId: null,
  history: [],
};

export function loadMethodologyState(): MethodologySelection {
  const raw = localStorage.getItem(KEY);
  if (!raw) return DEFAULT_STATE;

  try {
    const parsed = JSON.parse(raw);
    // Restore Date objects
    parsed.history = parsed.history.map((h: MethodologyApplication) => ({
      ...h,
      appliedAt: new Date(h.appliedAt),
    }));
    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveMethodologyState(state: MethodologySelection) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function selectMethodology(methodologyId: string, context: string, sphereId?: string) {
  const state = loadMethodologyState();

  const application: MethodologyApplication = {
    id: `app-${Date.now()}`,
    methodologyId,
    appliedAt: new Date(),
    context,
    sphereId,
  };

  const newState: MethodologySelection = {
    selectedId: methodologyId,
    history: [...state.history, application],
  };

  saveMethodologyState(newState);
  return newState;
}

export function clearMethodologySelection() {
  const state = loadMethodologyState();
  saveMethodologyState({
    ...state,
    selectedId: null,
  });
}

export function getMethodologyHistory(): MethodologyApplication[] {
  return loadMethodologyState().history;
}

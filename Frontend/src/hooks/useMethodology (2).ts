import { useState, useCallback } from "react";
import {
  loadMethodologyState,
  selectMethodology as storeSelectMethodology,
  clearMethodologySelection,
} from "../state/methodologyStore";
import { getMethodologyById } from "../data/methodologyRegistry";
import { Methodology, MethodologyApplication } from "../types/methodology";

export function useMethodology() {
  const [state, setState] = useState(() => loadMethodologyState());

  const refresh = useCallback(() => {
    setState(loadMethodologyState());
  }, []);

  const select = useCallback(
    (methodologyId: string, context: string, sphereId?: string) => {
      const newState = storeSelectMethodology(methodologyId, context, sphereId);
      setState(newState);
      return newState;
    },
    []
  );

  const clear = useCallback(() => {
    clearMethodologySelection();
    refresh();
  }, [refresh]);

  const currentMethodology: Methodology | null = state.selectedId
    ? getMethodologyById(state.selectedId) || null
    : null;

  const history: MethodologyApplication[] = state.history;

  return {
    selectedId: state.selectedId,
    currentMethodology,
    history,
    select,
    clear,
    refresh,
  };
}

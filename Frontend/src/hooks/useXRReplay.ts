import { useState, useCallback } from "react";
import {
  loadXRReplayState,
  setXRMode,
  setXREventIndex,
  resetXRReplay,
} from "../state/xrReplayStore";
import { XRMode } from "../types/xr";

export function useXRReplay(roomId?: string) {
  const [state, setState] = useState(() => loadXRReplayState());

  const refresh = useCallback(() => {
    setState(loadXRReplayState());
  }, []);

  const enterReplay = useCallback(() => {
    setXRMode("replay", roomId);
    refresh();
  }, [roomId, refresh]);

  const exitReplay = useCallback(() => {
    setXRMode("live");
    refresh();
  }, [refresh]);

  const setEventIndex = useCallback(
    (index: number) => {
      setXREventIndex(index);
      refresh();
    },
    [refresh]
  );

  const reset = useCallback(() => {
    resetXRReplay();
    refresh();
  }, [refresh]);

  const isReplay = state.mode === "replay";
  const isLive = state.mode === "live";

  return {
    mode: state.mode as XRMode,
    currentEventIndex: state.currentEventIndex,
    isReplay,
    isLive,
    enterReplay,
    exitReplay,
    setEventIndex,
    reset,
  };
}

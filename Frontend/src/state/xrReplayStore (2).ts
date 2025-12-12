import { XRReplayState, XRMode } from "../types/xr";

const KEY = "chenu_xr_replay";

const DEFAULT_STATE: XRReplayState = {
  mode: "live",
  currentEventIndex: 0,
  roomId: null,
};

export function loadXRReplayState(): XRReplayState {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : DEFAULT_STATE;
}

export function saveXRReplayState(state: XRReplayState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function setXRMode(mode: XRMode, roomId?: string) {
  const state = loadXRReplayState();
  saveXRReplayState({
    ...state,
    mode,
    roomId: roomId ?? state.roomId,
    currentEventIndex: mode === "live" ? 0 : state.currentEventIndex,
  });
}

export function setXREventIndex(index: number) {
  const state = loadXRReplayState();
  saveXRReplayState({
    ...state,
    currentEventIndex: index,
  });
}

export function resetXRReplay() {
  saveXRReplayState(DEFAULT_STATE);
}

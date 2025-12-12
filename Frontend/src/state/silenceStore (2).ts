import { SilenceState } from "../types/silence";

const KEY = "chenu_silence";

export function loadSilence(): SilenceState {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : { enabled: false };
}

export function setSilence(enabled: boolean) {
  const state: SilenceState = {
    enabled,
    since: enabled ? Date.now() : undefined,
  };
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function toggleSilence() {
  const current = loadSilence();
  setSilence(!current.enabled);
}

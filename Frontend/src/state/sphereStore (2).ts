import { SphereRuntime, SphereStatus } from "../types/sphereState";

const KEY = "chenu_sphere_states";

export function loadSphereStates(): SphereRuntime[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveSphereStates(states: SphereRuntime[]) {
  localStorage.setItem(KEY, JSON.stringify(states));
}

export function getSphereState(id: string): SphereRuntime {
  const states = loadSphereStates();
  const existing = states.find((s) => s.id === id);
  return existing ?? { id, status: "active" };
}

export function setSphereStatus(id: string, status: SphereStatus) {
  const states = loadSphereStates();
  const next = states.filter((s) => s.id !== id);
  next.push({ id, status });
  saveSphereStates(next);
}

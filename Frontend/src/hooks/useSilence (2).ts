import { useEffect, useState } from "react";
import { loadSilence, toggleSilence } from "../state/silenceStore";

export function useSilence() {
  const [silence, setState] = useState(loadSilence());

  useEffect(() => {
    const handler = () => setState(loadSilence());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return {
    silence,
    toggle: () => {
      toggleSilence();
      setState(loadSilence());
    },
  };
}

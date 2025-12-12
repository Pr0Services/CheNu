import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { saveSession } from "../state/sessionStore";

export function useSessionTracker() {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    saveSession({
      lastRoute: location.pathname,
      lastSphereId: params.id,
      startedAt: Date.now(),
    });
  }, [location.pathname, params.id]);
}

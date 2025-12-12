import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { SPHERES } from "../data/spheres";
import { getSphereState, setSphereStatus } from "../state/sphereStore";
import { AppLayout } from "../components/AppLayout";
import { useSessionTracker } from "../hooks/useSessionTracker";
import { usePTC } from "../hooks/usePTC";
import AgentPanel from "../components/AgentPanel";
import { PTCStatusBar } from "../components/ptc/PTCStatusBar";
import { DirectiveAlert } from "../components/ptc/DirectiveAlert";
import type { SphereStatus } from "../types/sphereState";

export default function SphereView() {
  useSessionTracker();
  const { id } = useParams();
  const navigate = useNavigate();
  const sphere = SPHERES.find((s) => s.id === id);
  const { hasActiveTask, lastCheck, checkAction } = usePTC();

  const [state, setState] = useState(() => (id ? getSphereState(id) : null));
  const [showAlert, setShowAlert] = useState(true);

  if (!sphere || !state) {
    return (
      <AppLayout title="CHE·NU">
        <p>Sphère introuvable.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            marginTop: "16px",
            background: "#f5f5f5",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          Retour au Tronc
        </button>
      </AppLayout>
    );
  }

  const updateStatus = (status: SphereStatus) => {
    setSphereStatus(sphere.id, status);
    setState({ ...state, status });

    // Vérifier APRÈS l'action (pas avant)
    if (hasActiveTask) {
      checkAction({
        type: "data_access",
        dataType: "standard",
        sphereId: sphere.id,
      });
    }
  };

  const statusColors = {
    active: { bg: "#e8f5e9", border: "#a5d6a7", text: "#2e7d32" },
    dormant: { bg: "#fff3e0", border: "#ffcc80", text: "#e65100" },
    archived: { bg: "#f5f5f5", border: "#ccc", text: "#666" },
  };

  const colors = statusColors[state.status];

  return (
    <AppLayout
      title={`${sphere.emoji} ${sphere.name}`}
      showBack
      onBack={() => navigate("/")}
    >
      {/* Directive Alert - non bloquant */}
      {showAlert && lastCheck && (
        <DirectiveAlert result={lastCheck} onDismiss={() => setShowAlert(false)} />
      )}

      {/* PTC Status - si actif */}
      {hasActiveTask && (
        <section style={{ marginBottom: "16px" }}>
          <PTCStatusBar />
        </section>
      )}

      <section
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #eee",
        }}
      >
        <p style={{ color: "#666", marginBottom: "16px" }}>{sphere.description}</p>

        <div>
          <strong>État de la sphère :</strong>
          <p
            style={{
              marginTop: "8px",
              padding: "4px 12px",
              display: "inline-block",
              borderRadius: "4px",
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            {state.status}
          </p>

          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button
              onClick={() => updateStatus("active")}
              disabled={state.status === "active"}
              style={{
                padding: "8px 16px",
                cursor: state.status === "active" ? "default" : "pointer",
                opacity: state.status === "active" ? 0.5 : 1,
                background: "#e8f5e9",
                border: "1px solid #a5d6a7",
                borderRadius: "4px",
              }}
            >
              Activer
            </button>
            <button
              onClick={() => updateStatus("dormant")}
              disabled={state.status === "dormant"}
              style={{
                padding: "8px 16px",
                cursor: state.status === "dormant" ? "default" : "pointer",
                opacity: state.status === "dormant" ? 0.5 : 1,
                background: "#fff3e0",
                border: "1px solid #ffcc80",
                borderRadius: "4px",
              }}
            >
              Mettre en sommeil
            </button>
            <button
              onClick={() => updateStatus("archived")}
              disabled={state.status === "archived"}
              style={{
                padding: "8px 16px",
                cursor: state.status === "archived" ? "default" : "pointer",
                opacity: state.status === "archived" ? 0.5 : 1,
                background: "#f5f5f5",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              Archiver
            </button>
          </div>
        </div>
      </section>

      <AgentPanel />
    </AppLayout>
  );
}

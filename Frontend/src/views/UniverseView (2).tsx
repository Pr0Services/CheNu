import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SPHERES } from "../data/spheres";
import { getSphereState } from "../state/sphereStore";
import { clearSession } from "../state/sessionStore";
import { SphereRuntime } from "../types/sphereState";
import { useSessionTracker } from "../hooks/useSessionTracker";
import { AppLayout } from "../components/AppLayout";
import SphereCard from "../components/SphereCard";

export default function UniverseView() {
  useSessionTracker();
  const navigate = useNavigate();
  const [sphereStates, setSphereStates] = useState<Record<string, SphereRuntime>>({});

  useEffect(() => {
    const states: Record<string, SphereRuntime> = {};
    SPHERES.forEach((s) => {
      states[s.id] = getSphereState(s.id);
    });
    setSphereStates(states);
  }, []);

  return (
    <AppLayout title="🌳 CHE·NU — Universe View">
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Orientation globale. Choisis une sphère pour travailler dans un contexte précis.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {SPHERES.map((s) => (
          <SphereCard
            key={s.id}
            sphere={s}
            status={sphereStates[s.id]?.status ?? "active"}
            onOpen={(id) => navigate(`/sphere/${id}`)}
          />
        ))}
      </section>

      {/* XR Access */}
      <section
        style={{
          marginTop: "24px",
          padding: "16px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>🕶️ Espaces XR</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              Rejoindre une salle de réunion ou de présence partagée
            </p>
          </div>
          <button
            onClick={() => navigate("/xr")}
            style={{
              padding: "10px 20px",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Entrer
          </button>
        </div>
      </section>

      {/* Methodology Access */}
      <section
        style={{
          marginTop: "16px",
          padding: "16px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>📋 Méthodologies</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              Sélectionner une approche de travail adaptée au projet
            </p>
          </div>
          <button
            onClick={() => navigate("/methodology")}
            style={{
              padding: "10px 20px",
              background: "#5c6bc0",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Gérer
          </button>
        </div>
      </section>

      {/* PTC Access */}
      <section
        style={{
          marginTop: "16px",
          padding: "16px",
          background: "#fff",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>🛡️ Contextes de tâche</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              Définir le cadre avant d'agir — transparence totale
            </p>
          </div>
          <button
            onClick={() => navigate("/ptc")}
            style={{
              padding: "10px 20px",
              background: "#26a69a",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Gérer
          </button>
        </div>
      </section>

      {/* Session controls */}
      <section style={{ marginTop: "24px", borderTop: "1px solid #ddd", paddingTop: "12px" }}>
        <button
          onClick={clearSession}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          ⏹️ Arrêter la session
        </button>
      </section>
    </AppLayout>
  );
}

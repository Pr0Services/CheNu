import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { useSessionTracker } from "../hooks/useSessionTracker";
import { useMethodology } from "../hooks/useMethodology";
import { MethodologySelector } from "../components/methodology/MethodologySelector";
import { MethodologyHistory } from "../components/methodology/MethodologyHistory";

export default function MethodologyView() {
  useSessionTracker();
  const navigate = useNavigate();
  const { selectedId, currentMethodology, history, select, clear } = useMethodology();

  return (
    <AppLayout title="📋 Méthodologies" showBack onBack={() => navigate("/")}>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Sélectionnez une méthodologie de travail. L'utilisateur choisit toujours — aucune
        recommandation automatique.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Left: Selector */}
        <MethodologySelector
          selectedId={selectedId}
          onSelect={select}
          onClear={clear}
        />

        {/* Right: History */}
        <MethodologyHistory history={history} />
      </div>

      {/* Current methodology steps (if selected) */}
      {currentMethodology && (
        <div
          style={{
            marginTop: "24px",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #ddd",
            padding: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#333" }}>
            📍 Étapes de la méthodologie active
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {currentMethodology.steps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "12px",
                  background: "#f9f9f9",
                  borderRadius: "6px",
                  border: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#4a90d9",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

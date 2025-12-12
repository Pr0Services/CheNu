import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { useSessionTracker } from "../hooks/useSessionTracker";
import { PTCStatusBar } from "../components/ptc/PTCStatusBar";
import { PTCCreator } from "../components/ptc/PTCCreator";
import { PTCList } from "../components/ptc/PTCList";

export default function PTCView() {
  useSessionTracker();
  const navigate = useNavigate();
  const [showCreator, setShowCreator] = useState(false);

  return (
    <AppLayout title="📋 Contextes de tâche" showBack onBack={() => navigate("/")}>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Définissez le cadre de vos tâches avant de les exécuter. Le système vérifiera la conformité
        de vos actions par rapport au contexte choisi — sans blocage, en toute transparence.
      </p>

      {/* Status bar */}
      <section style={{ marginBottom: "24px" }}>
        <PTCStatusBar />
      </section>

      {/* Create new */}
      <section style={{ marginBottom: "24px" }}>
        {!showCreator ? (
          <button
            onClick={() => setShowCreator(true)}
            style={{
              width: "100%",
              padding: "12px",
              background: "#4a90d9",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            + Créer un nouveau contexte
          </button>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px" }}>Nouveau contexte</h3>
              <button
                onClick={() => setShowCreator(false)}
                style={{
                  padding: "4px 12px",
                  background: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
            </div>
            <PTCCreator onCreated={() => setShowCreator(false)} />
          </div>
        )}
      </section>

      {/* Existing contexts */}
      <section>
        <h3 style={{ fontSize: "16px", marginBottom: "12px" }}>Contextes existants</h3>
        <PTCList />
      </section>

      {/* Principles reminder */}
      <section
        style={{
          marginTop: "32px",
          padding: "16px",
          background: "#f5f5f5",
          borderRadius: "8px",
          fontSize: "12px",
          color: "#888",
        }}
      >
        <strong>Principes CHE·NU:</strong>
        <ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
          <li>L'utilisateur reste responsable de ses actions</li>
          <li>Le cadre est explicite, jamais supposé</li>
          <li>Aucun agent n'impose une règle</li>
          <li>Le Guard observe, il ne gouverne pas</li>
          <li>Mode Silence &gt; Tout le reste</li>
        </ul>
      </section>
    </AppLayout>
  );
}

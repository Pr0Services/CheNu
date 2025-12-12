import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { useSessionTracker } from "../hooks/useSessionTracker";
import { XR_ROOMS } from "../data/xrMockData";

export default function XRUniverseView() {
  useSessionTracker();
  const navigate = useNavigate();

  return (
    <AppLayout title="🕶️ XR — Espaces de présence" showBack onBack={() => navigate("/")}>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Espaces XR disponibles. Entrez dans une salle pour rejoindre une réunion ou une session.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {XR_ROOMS.map((room) => (
          <div
            key={room.id}
            style={{
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "16px",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{room.name}</h3>
            <p style={{ margin: "0 0 12px 0", color: "#666", fontSize: "14px" }}>
              {room.description}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "12px", color: "#888" }}>
                👥 {room.participantCount} participant{room.participantCount > 1 ? "s" : ""}
              </span>
              <button
                onClick={() => navigate(`/xr/meeting/${room.id}`)}
                style={{
                  padding: "8px 16px",
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
          </div>
        ))}
      </section>
    </AppLayout>
  );
}

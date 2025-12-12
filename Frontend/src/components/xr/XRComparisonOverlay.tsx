import { XRDecision, XRDecisionBranch } from "../../types/xr";

type XRComparisonOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  decisions: XRDecision[];
  branches: XRDecisionBranch[];
  silenceMode: boolean;
};

export function XRComparisonOverlay({
  isOpen,
  onClose,
  decisions,
  branches,
  silenceMode,
}: XRComparisonOverlayProps) {
  if (!isOpen) return null;

  // Group decisions by branch for comparison
  const decisionsByBranch: Record<string, XRDecision[]> = {};
  branches.forEach((b) => {
    decisionsByBranch[b.id] = decisions.filter((d) => d.branchId === b.id);
  });

  // Get branches that have decisions
  const activeBranches = branches.filter(
    (b) => decisionsByBranch[b.id] && decisionsByBranch[b.id].length > 0
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflow: "auto",
          padding: "24px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px" }}>📊 Comparaison des décisions</h3>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              background: "#f5f5f5",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ✕ Fermer
          </button>
        </div>

        {/* Info notice */}
        <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#666" }}>
          Vue comparative neutre — aucune hiérarchie, aucun score
        </p>

        {/* Silence mode notice */}
        {silenceMode && (
          <div
            style={{
              padding: "8px 12px",
              background: "#f5f5f5",
              borderRadius: "4px",
              marginBottom: "16px",
              fontSize: "13px",
              color: "#666",
            }}
          >
            🔕 Mode silence — Affichage statique
          </div>
        )}

        {/* Comparison grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${activeBranches.length}, minmax(200px, 1fr))`,
            gap: "16px",
          }}
        >
          {activeBranches.map((branch) => (
            <div
              key={branch.id}
              style={{
                background: "#fafafa",
                borderRadius: "8px",
                padding: "16px",
                border: `2px solid ${branch.color}20`,
              }}
            >
              {/* Branch header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                  paddingBottom: "8px",
                  borderBottom: `2px solid ${branch.color}`,
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: branch.color,
                  }}
                />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>{branch.name}</span>
              </div>

              {/* Decisions in this branch */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {decisionsByBranch[branch.id].map((decision) => (
                  <div
                    key={decision.id}
                    style={{
                      background: "#fff",
                      borderRadius: "4px",
                      padding: "12px",
                      border: "1px solid #eee",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 500 }}>
                      {decision.label}
                    </p>
                    <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#666" }}>
                      {decision.context}
                    </p>
                    <p
                      style={{
                        margin: "8px 0 0 0",
                        fontSize: "11px",
                        color: "#999",
                        fontFamily: "monospace",
                      }}
                    >
                      {new Date(decision.timestamp * 1000).toLocaleTimeString("fr-CA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

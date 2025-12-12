import { XRDecision, XRDecisionBranch } from "../../types/xr";

type XRDecisionTracksProps = {
  decisions: XRDecision[];
  branches: XRDecisionBranch[];
  focusedDecisionId: string | null;
  onDecisionSelect: (decision: XRDecision) => void;
  silenceMode: boolean;
};

export function XRDecisionTracks({
  decisions,
  branches,
  focusedDecisionId,
  onDecisionSelect,
  silenceMode,
}: XRDecisionTracksProps) {
  // Group decisions by branch
  const decisionsByBranch: Record<string, XRDecision[]> = {};
  branches.forEach((b) => {
    decisionsByBranch[b.id] = decisions.filter((d) => d.branchId === b.id);
  });

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #ddd",
        padding: "16px",
        overflow: "auto",
      }}
    >
      <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#666" }}>
        📊 Trajectoires de décision
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {branches.map((branch) => {
          const branchDecisions = decisionsByBranch[branch.id] || [];
          if (branchDecisions.length === 0) return null;

          return (
            <div key={branch.id}>
              {/* Branch header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: branch.color,
                  }}
                />
                <span style={{ fontSize: "13px", fontWeight: 500 }}>{branch.name}</span>
              </div>

              {/* Track line with decisions */}
              <div
                style={{
                  position: "relative",
                  marginLeft: "6px",
                  paddingLeft: "16px",
                  borderLeft: `2px solid ${branch.color}`,
                }}
              >
                {branchDecisions.map((decision, index) => {
                  const isFocused = focusedDecisionId === decision.id;

                  return (
                    <div
                      key={decision.id}
                      onClick={() => onDecisionSelect(decision)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        padding: "8px",
                        marginBottom: index < branchDecisions.length - 1 ? "8px" : 0,
                        background: isFocused ? "#f5f5f5" : "transparent",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: silenceMode ? "none" : "background 0.15s ease",
                      }}
                    >
                      {/* Decision dot */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-5px",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: isFocused ? branch.color : "#fff",
                          border: `2px solid ${branch.color}`,
                        }}
                      />

                      {/* Decision content */}
                      <div style={{ flex: 1, marginLeft: "4px" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            fontWeight: isFocused ? 500 : 400,
                          }}
                        >
                          {decision.label}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            fontSize: "11px",
                            color: "#888",
                          }}
                        >
                          {decision.context}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { XRDecision, XRDecisionBranch } from "../../types/xr";

type XRDecisionFocusProps = {
  decision: XRDecision | null;
  branch: XRDecisionBranch | null;
  onClose: () => void;
};

export function XRDecisionFocus({ decision, branch, onClose }: XRDecisionFocusProps) {
  if (!decision || !branch) return null;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        border: `2px solid ${branch.color}`,
        padding: "16px",
        marginTop: "12px",
      }}
    >
      {/* Header with close */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: branch.color,
            }}
          />
          <span style={{ fontSize: "12px", color: "#666" }}>{branch.name}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: "4px 8px",
            background: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Decision details */}
      <h4 style={{ margin: "0 0 8px 0", fontSize: "15px" }}>{decision.label}</h4>

      <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#555" }}>
        {decision.context}
      </p>

      {/* Metadata */}
      <div
        style={{
          padding: "8px",
          background: "#f9f9f9",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Timestamp:</span>
          <span style={{ fontFamily: "monospace" }}>
            {new Date(decision.timestamp * 1000).toLocaleString("fr-CA", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span>ID:</span>
          <span style={{ fontFamily: "monospace" }}>{decision.id}</span>
        </div>
      </div>

      {/* Notice */}
      <p
        style={{
          margin: "12px 0 0 0",
          fontSize: "11px",
          color: "#999",
          textAlign: "center",
        }}
      >
        Lecture seule — aucune modification possible
      </p>
    </div>
  );
}

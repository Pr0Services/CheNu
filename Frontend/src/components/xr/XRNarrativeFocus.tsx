import { XRStoryNode, XRStoryLink } from "../../types/xr";

type XRNarrativeFocusProps = {
  node: XRStoryNode | null;
  links: XRStoryLink[];
  allNodes: XRStoryNode[];
  onClose: () => void;
};

const KIND_LABELS = {
  decision: "Décision",
  note: "Note",
  silence: "Silence",
};

const KIND_COLORS = {
  decision: { bg: "#e8eaf6", border: "#9fa8da", text: "#3f51b5" },
  note: { bg: "#eceff1", border: "#b0bec5", text: "#546e7a" },
  silence: { bg: "#f5f5f5", border: "#e0e0e0", text: "#757575" },
};

const RELATION_LABELS = {
  context: "contexte",
  causal: "causal",
  echo: "écho",
  contrast: "contraste",
};

export function XRNarrativeFocus({ node, links, allNodes, onClose }: XRNarrativeFocusProps) {
  if (!node) return null;

  const colors = KIND_COLORS[node.kind];

  // Get incoming and outgoing links
  const incomingLinks = links.filter((l) => l.to === node.id);
  const outgoingLinks = links.filter((l) => l.from === node.id);

  // Get node by ID
  const getNode = (id: string) => allNodes.find((n) => n.id === id);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        border: `2px solid ${colors.border}`,
        padding: "16px",
        marginTop: "12px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "4px",
              background: colors.bg,
              color: colors.text,
              fontSize: "11px",
              fontWeight: 500,
            }}
          >
            {KIND_LABELS[node.kind]}
          </span>
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

      {/* Node label */}
      <h4 style={{ margin: "0 0 8px 0", fontSize: "15px" }}>{node.label}</h4>

      {/* Timestamp */}
      <p
        style={{
          margin: "0 0 16px 0",
          fontSize: "12px",
          color: "#888",
          fontFamily: "monospace",
        }}
      >
        {new Date(node.timestamp * 1000).toLocaleString("fr-CA", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </p>

      {/* Incoming links */}
      {incomingLinks.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <p style={{ margin: "0 0 6px 0", fontSize: "11px", color: "#666", fontWeight: 500 }}>
            ← Liens entrants ({incomingLinks.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {incomingLinks.map((link, i) => {
              const fromNode = getNode(link.from);
              return (
                <div
                  key={i}
                  style={{
                    padding: "6px 8px",
                    background: "#f9f9f9",
                    borderRadius: "4px",
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#555" }}>
                    {fromNode?.label || link.from}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "1px 6px",
                      borderRadius: "2px",
                      background: "#e0e0e0",
                      color: "#666",
                    }}
                  >
                    {RELATION_LABELS[link.relation]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Outgoing links */}
      {outgoingLinks.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <p style={{ margin: "0 0 6px 0", fontSize: "11px", color: "#666", fontWeight: 500 }}>
            → Liens sortants ({outgoingLinks.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {outgoingLinks.map((link, i) => {
              const toNode = getNode(link.to);
              return (
                <div
                  key={i}
                  style={{
                    padding: "6px 8px",
                    background: "#f9f9f9",
                    borderRadius: "4px",
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#555" }}>
                    {toNode?.label || link.to}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "1px 6px",
                      borderRadius: "2px",
                      background: "#e0e0e0",
                      color: "#666",
                    }}
                  >
                    {RELATION_LABELS[link.relation]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No links message */}
      {incomingLinks.length === 0 && outgoingLinks.length === 0 && (
        <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
          Aucun lien direct
        </p>
      )}

      {/* Notice */}
      <p
        style={{
          margin: "12px 0 0 0",
          fontSize: "11px",
          color: "#999",
          textAlign: "center",
          paddingTop: "8px",
          borderTop: "1px solid #eee",
        }}
      >
        Lecture seule — aucune interprétation
      </p>
    </div>
  );
}

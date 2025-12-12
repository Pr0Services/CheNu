import { XRStoryNode, XRStoryLink, XRStoryRelation } from "../../types/xr";

type XRConstellationViewProps = {
  nodes: XRStoryNode[];
  links: XRStoryLink[];
  selectedNodeId: string | null;
  onNodeSelect: (node: XRStoryNode) => void;
  silenceMode: boolean;
};

const KIND_COLORS = {
  decision: "#5c6bc0",
  note: "#78909c",
  silence: "#b0bec5",
};

const RELATION_COLORS: Record<XRStoryRelation, string> = {
  context: "#90a4ae",
  causal: "#7986cb",
  echo: "#a5d6a7",
  contrast: "#ffcc80",
};

export function XRConstellationView({
  nodes,
  links,
  selectedNodeId,
  onNodeSelect,
  silenceMode,
}: XRConstellationViewProps) {
  // Calculate bounds for viewBox
  const padding = 60;
  const minX = Math.min(...nodes.map((n) => n.position.x)) - padding;
  const maxX = Math.max(...nodes.map((n) => n.position.x)) + padding;
  const minY = Math.min(...nodes.map((n) => n.position.y)) - padding;
  const maxY = Math.max(...nodes.map((n) => n.position.y)) + padding;

  const width = maxX - minX;
  const height = maxY - minY;

  // Get node position by ID
  const getNodePosition = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    return node ? node.position : { x: 0, y: 0 };
  };

  return (
    <div
      style={{
        background: "#fafafa",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        overflow: "hidden",
      }}
    >
      {/* Legend */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          fontSize: "11px",
          color: "#666",
        }}
      >
        <span style={{ fontWeight: 500 }}>Nœuds:</span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: KIND_COLORS.decision,
            }}
          />
          Décision
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: KIND_COLORS.note,
            }}
          />
          Note
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              background: KIND_COLORS.silence,
            }}
          />
          Silence
        </span>
      </div>

      {/* SVG Constellation */}
      <svg
        viewBox={`${minX} ${minY} ${width} ${height}`}
        style={{
          width: "100%",
          height: "280px",
          display: "block",
        }}
      >
        {/* Links */}
        {links.map((link, i) => {
          const from = getNodePosition(link.from);
          const to = getNodePosition(link.to);
          const isHighlighted =
            selectedNodeId === link.from || selectedNodeId === link.to;

          return (
            <line
              key={`link-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={RELATION_COLORS[link.relation]}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeOpacity={isHighlighted ? 0.9 : 0.4}
              strokeDasharray={link.relation === "echo" ? "4,4" : undefined}
              style={{
                transition: silenceMode ? "none" : "all 0.2s ease",
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isSilence = node.kind === "silence";

          return (
            <g
              key={node.id}
              transform={`translate(${node.position.x}, ${node.position.y})`}
              onClick={() => onNodeSelect(node)}
              style={{ cursor: "pointer" }}
            >
              {/* Node shape */}
              {isSilence ? (
                <rect
                  x={-8}
                  y={-8}
                  width={16}
                  height={16}
                  rx={2}
                  fill={KIND_COLORS[node.kind]}
                  stroke={isSelected ? "#333" : "transparent"}
                  strokeWidth={2}
                  style={{
                    transition: silenceMode ? "none" : "all 0.15s ease",
                  }}
                />
              ) : (
                <circle
                  r={node.kind === "decision" ? 10 : 8}
                  fill={KIND_COLORS[node.kind]}
                  stroke={isSelected ? "#333" : "transparent"}
                  strokeWidth={2}
                  style={{
                    transition: silenceMode ? "none" : "all 0.15s ease",
                  }}
                />
              )}

              {/* Label */}
              <text
                y={24}
                textAnchor="middle"
                fontSize="10"
                fill="#555"
                style={{
                  fontWeight: isSelected ? 500 : 400,
                  pointerEvents: "none",
                }}
              >
                {node.label.length > 20
                  ? node.label.substring(0, 18) + "…"
                  : node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Link legend */}
      <div
        style={{
          padding: "8px 16px",
          borderTop: "1px solid #eee",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          fontSize: "10px",
          color: "#888",
        }}
      >
        <span style={{ fontWeight: 500 }}>Liens:</span>
        {Object.entries(RELATION_COLORS).map(([rel, color]) => (
          <span key={rel} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{
                width: "16px",
                height: "2px",
                background: color,
                borderRadius: "1px",
              }}
            />
            {rel}
          </span>
        ))}
      </div>
    </div>
  );
}

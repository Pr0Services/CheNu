import { XRSnapshot } from "../../types/xr";

type XRExportPanelProps = {
  snapshot: XRSnapshot | null;
  onDownloadPNG: () => void;
  onDownloadPDF: () => void;
  onClear: () => void;
};

export function XRExportPanel({
  snapshot,
  onDownloadPNG,
  onDownloadPDF,
  onClear,
}: XRExportPanelProps) {
  if (!snapshot) {
    return (
      <div
        style={{
          background: "#f9f9f9",
          borderRadius: "8px",
          border: "1px solid #eee",
          padding: "12px",
          fontSize: "13px",
          color: "#888",
        }}
      >
        <p style={{ margin: 0 }}>
          📸 Aucune capture disponible.
        </p>
        <p style={{ margin: "8px 0 0 0", fontSize: "12px" }}>
          Utilisez le bouton "Capturer" pour créer un snapshot.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #ddd",
        padding: "12px",
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#666" }}>
        📥 Export disponible
      </h4>

      {/* Preview thumbnail */}
      <div
        style={{
          marginBottom: "12px",
          borderRadius: "4px",
          overflow: "hidden",
          border: "1px solid #eee",
        }}
      >
        <img
          src={snapshot.imageDataUrl}
          alt="Aperçu du snapshot"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>

      {/* Metadata */}
      <div
        style={{
          marginBottom: "12px",
          padding: "8px",
          background: "#f5f5f5",
          borderRadius: "4px",
          fontSize: "11px",
          color: "#666",
        }}
      >
        <div><strong>Mode:</strong> {getModeLabel(snapshot.mode)}</div>
        <div><strong>Date:</strong> {formatDate(snapshot.timestamp)}</div>
        <div><strong>Titre:</strong> {snapshot.title}</div>
      </div>

      {/* Export buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          onClick={onDownloadPNG}
          style={{
            padding: "10px 16px",
            background: "#4a90d9",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          🖼️ Télécharger PNG
        </button>

        <button
          onClick={onDownloadPDF}
          style={{
            padding: "10px 16px",
            background: "#e65100",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          📄 Télécharger PDF
        </button>

        <button
          onClick={onClear}
          style={{
            padding: "8px 16px",
            background: "#f5f5f5",
            color: "#666",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            marginTop: "4px",
          }}
        >
          ✕ Effacer la capture
        </button>
      </div>
    </div>
  );
}

// Helpers
function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getModeLabel(mode: string): string {
  switch (mode) {
    case "timeline":
      return "Timeline";
    case "comparison":
      return "Comparaison";
    case "narrative":
      return "Narrative";
    default:
      return mode;
  }
}

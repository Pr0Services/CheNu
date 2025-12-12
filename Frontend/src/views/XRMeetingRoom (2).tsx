import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { AppLayout } from "../components/AppLayout";
import { useSessionTracker } from "../hooks/useSessionTracker";
import { useSilence } from "../hooks/useSilence";
import { useXRReplay } from "../hooks/useXRReplay";
import { useXRExport } from "../hooks/useXRExport";
import {
  XR_ROOMS,
  XR_PARTICIPANTS,
  XR_TIMELINE,
  XR_DECISIONS,
  XR_DECISION_BRANCHES,
  XR_STORY_NODES,
  XR_STORY_LINKS,
} from "../data/xrMockData";
import { XRAvatar, XRAvatar2D } from "../components/xr/XRAvatar";
import { XRMeetingTimeline } from "../components/xr/XRMeetingTimeline";
import { XRTimeScrubber } from "../components/xr/XRTimeScrubber";
import { XRReplayBadge } from "../components/xr/XRReplayBadge";
import { XRDecisionTracks } from "../components/xr/XRDecisionTracks";
import { XRDecisionFocus } from "../components/xr/XRDecisionFocus";
import { XRComparisonOverlay } from "../components/xr/XRComparisonOverlay";
import { XRConstellationView } from "../components/xr/XRConstellationView";
import { XRNarrativeFocus } from "../components/xr/XRNarrativeFocus";
import { XRSnapshotButton } from "../components/xr/XRSnapshotButton";
import { XRExportPanel } from "../components/xr/XRExportPanel";
import { XRDecision, XRStoryNode, XRExportMode } from "../types/xr";

type ViewMode = "live" | "replay" | "comparison" | "narrative";

function viewModeToExportMode(viewMode: ViewMode): XRExportMode {
  switch (viewMode) {
    case "replay":
      return "timeline";
    case "comparison":
      return "comparison";
    case "narrative":
      return "narrative";
    default:
      return "timeline";
  }
}

function XRScene({ roomId }: { roomId: string }) {
  const participants = XR_PARTICIPANTS[roomId] || [];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.5, -4]}>
        <boxGeometry args={[10, 4, 0.1]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Side walls */}
      <mesh position={[-5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 4, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[8, 4, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Avatars */}
      {participants.map((p) => (
        <XRAvatar key={p.id} participant={p} />
      ))}
    </>
  );
}

function XRRoom2D({ roomId }: { roomId: string }) {
  const participants = XR_PARTICIPANTS[roomId] || [];

  return (
    <div
      style={{
        background: "#f0f0f0",
        borderRadius: "8px",
        padding: "24px",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ color: "#666", marginBottom: "16px" }}>
        Vue 2D (WebGL non disponible)
      </p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        {participants.map((p) => (
          <XRAvatar2D key={p.id} participant={p} />
        ))}
      </div>
    </div>
  );
}

export default function XRMeetingRoom() {
  useSessionTracker();
  const { id } = useParams();
  const navigate = useNavigate();
  const { silence } = useSilence();
  const { isReplay, currentEventIndex, enterReplay, exitReplay, setEventIndex } = useXRReplay(id);
  const [webglSupported, setWebglSupported] = useState(true);

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("live");

  // Decision comparison state
  const [focusedDecision, setFocusedDecision] = useState<XRDecision | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  // Narrative state
  const [focusedNode, setFocusedNode] = useState<XRStoryNode | null>(null);

  // Reference to the XR content area for capture
  const xrContentRef = useRef<HTMLDivElement>(null);

  const room = XR_ROOMS.find((r) => r.id === id);
  const timeline = id ? XR_TIMELINE[id] || [] : [];
  const participants = id ? XR_PARTICIPANTS[id] || [] : [];
  const decisions = id ? XR_DECISIONS[id] || [] : [];
  const storyNodes = id ? XR_STORY_NODES[id] || [] : [];
  const storyLinks = id ? XR_STORY_LINKS[id] || [] : [];

  // Export hook
  const {
    snapshot,
    isCapturing,
    captureXRView,
    downloadPNG,
    downloadPDF,
    clearSnapshot,
  } = useXRExport({
    mode: viewModeToExportMode(viewMode),
    title: room?.name || "XR Meeting",
  });

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebglSupported(!!gl);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Sync replay state with viewMode
  useEffect(() => {
    if (isReplay && viewMode !== "replay") {
      setViewMode("replay");
    }
  }, [isReplay, viewMode]);

  // Reset replay when leaving
  useEffect(() => {
    return () => {
      if (isReplay) {
        exitReplay();
      }
    };
  }, [isReplay, exitReplay]);

  // Clear snapshot when changing modes
  useEffect(() => {
    clearSnapshot();
  }, [viewMode, clearSnapshot]);

  // Switch to a view mode
  const switchMode = (mode: ViewMode) => {
    // Exit current mode
    if (isReplay) exitReplay();
    setFocusedDecision(null);
    setOverlayOpen(false);
    setFocusedNode(null);

    // Enter new mode
    setViewMode(mode);
    if (mode === "replay") {
      enterReplay();
    }
  };

  // Exit to live mode
  const exitToLive = () => {
    switchMode("live");
  };

  // Handle capture
  const handleCapture = () => {
    captureXRView(xrContentRef.current);
  };

  // Get branch for focused decision
  const focusedBranch = focusedDecision
    ? XR_DECISION_BRANCHES.find((b) => b.id === focusedDecision.branchId) || null
    : null;

  if (!room || !id) {
    return (
      <AppLayout title="XR Meeting">
        <p>Salle introuvable.</p>
        <button
          onClick={() => navigate("/xr")}
          style={{
            padding: "8px 16px",
            marginTop: "16px",
            background: "#f5f5f5",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retour aux salles XR
        </button>
      </AppLayout>
    );
  }

  const isSpecialMode = viewMode !== "live";

  return (
    <AppLayout title={`🕶️ ${room.name}`} showBack onBack={() => navigate("/xr")}>
      {/* Comparison Overlay */}
      <XRComparisonOverlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        decisions={decisions}
        branches={XR_DECISION_BRANCHES}
        silenceMode={silence.enabled}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px" }}>
        {/* Main XR view */}
        <div>
          {/* Mode banner */}
          {isSpecialMode && (
            <div
              style={{
                padding: "12px 16px",
                background:
                  viewMode === "replay"
                    ? "#fff3e0"
                    : viewMode === "comparison"
                    ? "#e8eaf6"
                    : "#e8f5e9",
                border: `1px solid ${
                  viewMode === "replay"
                    ? "#ffcc80"
                    : viewMode === "comparison"
                    ? "#9fa8da"
                    : "#a5d6a7"
                }`,
                borderRadius: "8px",
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color:
                    viewMode === "replay"
                      ? "#e65100"
                      : viewMode === "comparison"
                      ? "#3f51b5"
                      : "#2e7d32",
                }}
              >
                {viewMode === "replay" && "⏪ Mode Replay — Lecture seule"}
                {viewMode === "comparison" && "📊 Mode Comparaison — Lecture seule"}
                {viewMode === "narrative" && "🌌 Mode Narrative — Lecture seule"}
              </span>
              <button
                onClick={exitToLive}
                style={{
                  padding: "6px 12px",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                ▶️ Retour Live
              </button>
            </div>
          )}

          {/* XR Content Area - Capturable */}
          <div ref={xrContentRef}>
            {/* XR Canvas or 2D Fallback */}
            <div
              style={{
                background: "#e8e8e8",
                borderRadius: "8px",
                overflow: "hidden",
                height: isSpecialMode ? "200px" : "400px",
                position: "relative",
              }}
            >
              {/* Replay Badge */}
              <XRReplayBadge visible={viewMode === "replay"} />

              {webglSupported && !silence.enabled ? (
                <Canvas
                  camera={{ position: [0, 2, 6], fov: 50 }}
                  style={{ width: "100%", height: "100%" }}
                >
                  <XRScene roomId={id} />
                </Canvas>
              ) : (
                <XRRoom2D roomId={id} />
              )}
            </div>

            {/* COMPARISON MODE CONTENT */}
            {viewMode === "comparison" && decisions.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <XRDecisionTracks
                  decisions={decisions}
                  branches={XR_DECISION_BRANCHES}
                  focusedDecisionId={focusedDecision?.id || null}
                  onDecisionSelect={(d) => setFocusedDecision(d)}
                  silenceMode={silence.enabled}
                />

                <button
                  onClick={() => setOverlayOpen(true)}
                  style={{
                    marginTop: "12px",
                    padding: "10px 20px",
                    background: "#5c6bc0",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                  }}
                >
                  📊 Vue comparaison complète
                </button>

                <XRDecisionFocus
                  decision={focusedDecision}
                  branch={focusedBranch}
                  onClose={() => setFocusedDecision(null)}
                />
              </div>
            )}

            {/* NARRATIVE MODE CONTENT */}
            {viewMode === "narrative" && storyNodes.length > 0 && (
              <div style={{ marginTop: "12px" }}>
                <XRConstellationView
                  nodes={storyNodes}
                  links={storyLinks}
                  selectedNodeId={focusedNode?.id || null}
                  onNodeSelect={(n) => setFocusedNode(n)}
                  silenceMode={silence.enabled}
                />

                <XRNarrativeFocus
                  node={focusedNode}
                  links={storyLinks}
                  allNodes={storyNodes}
                  onClose={() => setFocusedNode(null)}
                />
              </div>
            )}

            {/* Timeline in replay mode (inside capturable area) */}
            {viewMode === "replay" && (
              <div style={{ marginTop: "12px" }}>
                <XRMeetingTimeline
                  events={timeline}
                  currentIndex={currentEventIndex}
                  isReplay={true}
                />
              </div>
            )}
          </div>

          {/* Room info */}
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <p style={{ margin: 0, color: "#666" }}>{room.description}</p>
            <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#888" }}>
              👥 {participants.length} participant{participants.length > 1 ? "s" : ""} présent
              {participants.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Silence mode notice */}
          {silence.enabled && (
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                background: "#f5f5f5",
                borderRadius: "8px",
                color: "#666",
                fontSize: "13px",
              }}
            >
              🔕 Mode silence — Vue statique uniquement
            </div>
          )}

          {/* Action buttons */}
          <div style={{ marginTop: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {/* Mode buttons - only in live mode */}
            {viewMode === "live" && (
              <>
                <button
                  onClick={() => switchMode("replay")}
                  style={{
                    padding: "12px 20px",
                    background: "#ff9800",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  ⏪ Replay
                </button>

                {decisions.length > 0 && (
                  <button
                    onClick={() => switchMode("comparison")}
                    style={{
                      padding: "12px 20px",
                      background: "#5c6bc0",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    📊 Comparaison
                  </button>
                )}

                {storyNodes.length > 0 && (
                  <button
                    onClick={() => switchMode("narrative")}
                    style={{
                      padding: "12px 20px",
                      background: "#43a047",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    🌌 Narrative
                  </button>
                )}
              </>
            )}

            {/* Exit room button - always visible */}
            <button
              onClick={() => navigate("/xr")}
              style={{
                padding: "12px 24px",
                background: "#d32f2f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                marginLeft: "auto",
              }}
            >
              🚪 Quitter la salle
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Participants list */}
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "16px",
            }}
          >
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#666" }}>
              👥 Participants
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {participants.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: p.color,
                    }}
                  />
                  <span style={{ fontSize: "13px" }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Scrubber - only in Replay mode */}
          {viewMode === "replay" && (
            <XRTimeScrubber
              events={timeline}
              currentIndex={currentEventIndex}
              onIndexChange={setEventIndex}
              disabled={silence.enabled}
            />
          )}

          {/* Timeline (outside capturable area for non-replay) */}
          {viewMode !== "replay" && (
            <XRMeetingTimeline
              events={timeline}
              currentIndex={currentEventIndex}
              isReplay={false}
            />
          )}

          {/* EXPORT SECTION - only in special modes */}
          {isSpecialMode && (
            <div
              style={{
                background: "#fff",
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "16px",
              }}
            >
              <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#666" }}>
                📤 Export
              </h4>

              {/* Capture button */}
              <div style={{ marginBottom: "12px" }}>
                <XRSnapshotButton
                  onCapture={handleCapture}
                  isCapturing={isCapturing}
                  hasSnapshot={!!snapshot}
                />
              </div>

              {/* Export panel */}
              <XRExportPanel
                snapshot={snapshot}
                onDownloadPNG={downloadPNG}
                onDownloadPDF={downloadPDF}
                onClear={clearSnapshot}
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

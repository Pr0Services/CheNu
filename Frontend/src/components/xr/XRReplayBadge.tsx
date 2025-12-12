type XRReplayBadgeProps = {
  visible: boolean;
};

export function XRReplayBadge({ visible }: XRReplayBadgeProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "12px",
        left: "12px",
        padding: "6px 12px",
        background: "#ff5722",
        color: "#fff",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      ⏪ REPLAY MODE
    </div>
  );
}

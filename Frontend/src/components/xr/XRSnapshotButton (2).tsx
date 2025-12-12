type XRSnapshotButtonProps = {
  onCapture: () => void;
  isCapturing: boolean;
  hasSnapshot: boolean;
  disabled?: boolean;
};

export function XRSnapshotButton({
  onCapture,
  isCapturing,
  hasSnapshot,
  disabled = false,
}: XRSnapshotButtonProps) {
  const isDisabled = disabled || isCapturing;

  return (
    <button
      onClick={onCapture}
      disabled={isDisabled}
      style={{
        padding: "8px 16px",
        background: isDisabled ? "#ccc" : hasSnapshot ? "#7cb342" : "#4a90d9",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: isDisabled ? "not-allowed" : "pointer",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "none", // No animation per CHE·NU rules
      }}
    >
      {isCapturing ? (
        <>⏳ Capture...</>
      ) : hasSnapshot ? (
        <>✓ Capture prête</>
      ) : (
        <>📸 Capturer cette vue</>
      )}
    </button>
  );
}

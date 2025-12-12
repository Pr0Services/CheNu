import { XRTimelineEvent } from "../../types/xr";

type XRTimeScrubberProps = {
  events: XRTimelineEvent[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  disabled?: boolean;
};

export function XRTimeScrubber({
  events,
  currentIndex,
  onIndexChange,
  disabled = false,
}: XRTimeScrubberProps) {
  const maxIndex = Math.max(0, events.length - 1);
  const currentEvent = events[currentIndex];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value, 10);
    onIndexChange(newIndex);
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #ddd",
        padding: "16px",
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#666" }}>
        ⏱️ Time Scrubber
      </h4>

      {/* Current event display */}
      <div
        style={{
          marginBottom: "12px",
          padding: "8px 12px",
          background: "#f5f5f5",
          borderRadius: "4px",
          fontSize: "13px",
        }}
      >
        <span style={{ fontFamily: "monospace", color: "#666" }}>
          {currentEvent?.timestamp || "--:--"}
        </span>
        <span style={{ margin: "0 8px", color: "#ccc" }}>|</span>
        <span style={{ color: "#333" }}>{currentEvent?.label || "Aucun événement"}</span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={maxIndex}
        value={currentIndex}
        onChange={handleChange}
        disabled={disabled}
        style={{
          width: "100%",
          height: "8px",
          cursor: disabled ? "not-allowed" : "pointer",
          accentColor: "#4a90d9",
        }}
      />

      {/* Time markers */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
          fontSize: "11px",
          color: "#888",
          fontFamily: "monospace",
        }}
      >
        <span>{events[0]?.timestamp || ""}</span>
        <span>
          {currentIndex + 1} / {events.length}
        </span>
        <span>{events[maxIndex]?.timestamp || ""}</span>
      </div>
    </div>
  );
}

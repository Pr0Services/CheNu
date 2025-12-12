import { XRTimelineEvent } from "../../types/xr";

type XRTimelineProps = {
  events: XRTimelineEvent[];
};

export function XRTimeline({ events }: XRTimelineProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #ddd",
        padding: "16px",
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#666" }}>
        📋 Timeline
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {events.map((event, index) => (
          <div
            key={event.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            {/* Timeline dot and line */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: index === 0 ? "#4a90d9" : "#ccc",
                  flexShrink: 0,
                }}
              />
              {index < events.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    height: "24px",
                    background: "#eee",
                  }}
                />
              )}
            </div>

            {/* Event content */}
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontSize: "11px",
                  color: "#888",
                  fontFamily: "monospace",
                }}
              >
                {event.timestamp}
              </span>
              <p
                style={{
                  margin: "2px 0 0 0",
                  fontSize: "13px",
                  color: "#333",
                }}
              >
                {event.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

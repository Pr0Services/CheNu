import { XRTimelineEvent } from "../../types/xr";

type XRMeetingTimelineProps = {
  events: XRTimelineEvent[];
  currentIndex?: number;
  isReplay?: boolean;
};

const eventTypeColors = {
  system: { bg: "#e3f2fd", border: "#90caf9", text: "#1565c0" },
  note: { bg: "#f3e5f5", border: "#ce93d8", text: "#7b1fa2" },
  decision: { bg: "#e8f5e9", border: "#a5d6a7", text: "#2e7d32" },
};

const eventTypeIcons = {
  system: "⚙️",
  note: "📝",
  decision: "✅",
};

export function XRMeetingTimeline({
  events,
  currentIndex = 0,
  isReplay = false,
}: XRMeetingTimelineProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #ddd",
        padding: "16px",
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#666" }}>
        📋 Timeline du meeting
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {events.map((event, index) => {
          const eventType = event.type || "note";
          const colors = eventTypeColors[eventType];
          const icon = eventTypeIcons[eventType];
          const isActive = isReplay && index === currentIndex;

          return (
            <div
              key={event.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "8px",
                borderRadius: "6px",
                background: isActive ? colors.bg : "transparent",
                border: isActive ? `1px solid ${colors.border}` : "1px solid transparent",
                transition: "none", // No animation per spec
              }}
            >
              {/* Timeline dot and line */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: "4px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: isActive ? colors.text : "#ccc",
                    flexShrink: 0,
                  }}
                />
                {index < events.length - 1 && (
                  <div
                    style={{
                      width: "2px",
                      height: "20px",
                      background: "#eee",
                      marginTop: "4px",
                    }}
                  />
                )}
              </div>

              {/* Event content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px" }}>{icon}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#888",
                      fontFamily: "monospace",
                    }}
                  >
                    {event.timestamp}
                  </span>
                </div>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "13px",
                    color: isActive ? colors.text : "#333",
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {event.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

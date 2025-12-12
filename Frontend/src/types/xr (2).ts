export type XRRoom = {
  id: string;
  name: string;
  description: string;
  participantCount: number;
};

export type XRParticipant = {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
};

export type XREventType = "system" | "note" | "decision";

export type XRTimelineEvent = {
  id: string;
  timestamp: string;
  label: string;
  type?: XREventType;
};

export type XRMode = "live" | "replay";

export type XRReplayState = {
  mode: XRMode;
  currentEventIndex: number;
  roomId: string | null;
};

export type XRDecision = {
  id: string;
  timestamp: number;
  label: string;
  context: string;
  branchId: string;
};

export type XRDecisionBranch = {
  id: string;
  name: string;
  color: string;
};

export type XRExportMode = "timeline" | "comparison" | "narrative";

export type XRSnapshot = {
  imageDataUrl: string;
  mode: XRExportMode;
  timestamp: Date;
  title: string;
};

export type XRStoryNodeKind = "decision" | "note" | "silence";

export type XRStoryNode = {
  id: string;
  timestamp: number;
  label: string;
  kind: XRStoryNodeKind;
  sphereId?: string;
  position: { x: number; y: number };
};

export type XRStoryRelation = "context" | "causal" | "echo" | "contrast";

export type XRStoryLink = {
  from: string;
  to: string;
  relation: XRStoryRelation;
};

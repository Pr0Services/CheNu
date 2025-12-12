export type MethodologyComplexity = "low" | "medium" | "high";
export type MethodologyVolume = "small" | "medium" | "large";

export type Methodology = {
  id: string;
  name: string;
  description: string;
  suitedFor: {
    complexity: MethodologyComplexity;
    volume: MethodologyVolume;
    domains: string[];
  };
  steps: string[];
};

export type MethodologyApplication = {
  id: string;
  methodologyId: string;
  appliedAt: Date;
  context: string;
  sphereId?: string;
};

export type MethodologySelection = {
  selectedId: string | null;
  history: MethodologyApplication[];
};

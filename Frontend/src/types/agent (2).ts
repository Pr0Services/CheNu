// ============================================
// CHE·NU — AGENT CONTRACT
// ============================================
// Les agents ne décident jamais.
// Toute délégation est volontaire.
// Toute chaîne passe par l'utilisateur.
// Silence > Agent.
// Replay = lecture seule.
// ============================================

export type AgentRequest = {
  input: string;
};

export type AgentResponse = {
  output: string;
  createdAt: number;
};

// Agent roles — strictly limited
export type AgentRole =
  | "analysis"
  | "methodology"
  | "comparison"
  | "presentation";

// Official Agent Contract
export type AgentDefinition = {
  id: string;
  name: string;
  role: AgentRole;
  description: string;

  // Ce que l'agent fait (lisible par l'utilisateur)
  does: string[];

  // Ce que l'agent ne fait JAMAIS
  neverDoes: string[];

  // Contexte autorisé
  allowedContexts: {
    live: boolean;
    replay: boolean;
    silence: false; // TOUJOURS false — INTERDIT en silence
  };

  inputSchema: string;
  outputSchema: string;
};

// Input source tracking — always explicit
export type AgentInputSource = "user" | "agent-output";

// Call trace for auditability
export type AgentCallTrace = {
  timestamp: number;
  calledBy: "user"; // TOUJOURS "user" — jamais automatique
  agentId: string;
  context: "live" | "replay";
  inputSource: AgentInputSource;
  inputPreview: string; // max 200 chars
};

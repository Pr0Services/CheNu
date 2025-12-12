import { AgentRequest, AgentResponse } from "../types/agent";

export async function callSimpleAgent(
  request: AgentRequest
): Promise<AgentResponse> {
  return {
    output: `Agent response:\n${request.input}`,
    createdAt: Date.now(),
  };
}

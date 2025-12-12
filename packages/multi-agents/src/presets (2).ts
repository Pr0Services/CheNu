import { AgentTypeConfig, DepartmentConfig, Agent, AgentMessage, TaskExecution, AgentLevel, AgentType, Department, MessageType, MessagePriority, TaskState, ReasoningStep } from './types';

export const AGENT_TYPES: AgentTypeConfig[] = [
  { type: 'guardian', name: 'Guardian', icon: '⚖️', levels: [0], description: 'Constitutional enforcement' },
  { type: 'coordinator', name: 'Coordinator', icon: '🎯', levels: [1], description: 'Cross-agent orchestration' },
  { type: 'analyzer', name: 'Analyzer', icon: '📊', levels: [2], description: 'Data processing, insights' },
  { type: 'executor', name: 'Executor', icon: '⚡', levels: [3], description: 'Task execution' },
  { type: 'validator', name: 'Validator', icon: '🛡️', levels: [2, 3], description: 'Output verification' },
];

export const DEPARTMENTS: DepartmentConfig[] = [
  { id: 'construction', name: 'Construction', icon: '🏗️', sphere: 'business', agent_count: 25 },
  { id: 'finance', name: 'Finance', icon: '💰', sphere: 'business', agent_count: 15 },
  { id: 'legal', name: 'Legal', icon: '⚖️', sphere: 'business', agent_count: 12 },
  { id: 'creative', name: 'Creative', icon: '🎨', sphere: 'creative', agent_count: 18 },
  { id: 'research', name: 'Research', icon: '🔬', sphere: 'scholar', agent_count: 20 },
  { id: 'operations', name: 'Operations', icon: '⚙️', sphere: 'all', agent_count: 15 },
];

export const LEVEL_CONFIGS = [
  { level: 0 as AgentLevel, name: 'CONSTITUTIONAL', role: 'Tree Laws enforcement, veto power', count: 3, color: '#DC2626' },
  { level: 1 as AgentLevel, name: 'STRATEGIC', role: 'Department coordination', count: 12, color: '#7C3AED' },
  { level: 2 as AgentLevel, name: 'TACTICAL', role: 'Sphere management', count: 45, color: '#2563EB' },
  { level: 3 as AgentLevel, name: 'OPERATIONAL', role: 'Task execution', count: 108, color: '#10B981' },
];

export const AGENT_CONSTRAINTS = [
  'Tree Laws compliance required',
  'Human approval for decisions',
  'No autonomous final actions',
  'Resource limits enforced',
  'Reasoning trace mandatory',
  'Audit log immutable',
];

export function createAgent(name: string, type: AgentType, level: AgentLevel, department: Department, reportsTo: string | null, capabilities: string[]): Agent {
  return {
    id: `agent_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    name,
    type,
    level,
    department,
    sphere: DEPARTMENTS.find(d => d.id === department)?.sphere || 'business',
    capabilities,
    constraints: AGENT_CONSTRAINTS.slice(0, 3),
    reports_to: reportsTo,
    supervised_by: [],
    active: true,
    created_at: new Date().toISOString(),
  };
}

export function createMessage(type: MessageType, fromAgent: string, toAgent: string, payload: Record<string, any>, priority: MessagePriority = 'normal'): AgentMessage {
  return {
    id: `msg_${Date.now()}`,
    type,
    from_agent: fromAgent,
    to_agent: toAgent,
    payload,
    priority,
    requires_ack: type !== 'status_update',
    timestamp: new Date().toISOString(),
    trace_id: `trace_${Date.now()}`,
    acknowledged: false,
  };
}

export function createTask(agentId: string, input: Record<string, any>, humanApprovalRequired: boolean = false): TaskExecution {
  return {
    task_id: `task_${Date.now()}`,
    agent_id: agentId,
    state: 'pending',
    input,
    reasoning_trace: [],
    resources_used: [],
    violations: [],
    human_approval_required: humanApprovalRequired,
  };
}

export function addReasoningStep(task: TaskExecution, action: string, detail: string): TaskExecution {
  const step: ReasoningStep = {
    step: task.reasoning_trace.length + 1,
    action,
    detail,
    timestamp: new Date().toISOString(),
  };
  return { ...task, reasoning_trace: [...task.reasoning_trace, step] };
}

/**
 * CHE·NU — MULTI-AGENT ORCHESTRATION SYSTEM
 * Types & Interfaces - AGENT.v1.0
 * 
 * Agents ASSIST, never DECIDE for humans.
 * All actions traceable. All reasoning visible.
 */

// ============================================================
// HIERARCHY LEVELS
// ============================================================

export type AgentLevel = 0 | 1 | 2 | 3;

export const LEVEL_NAMES: Record<AgentLevel, string> = {
  0: 'CONSTITUTIONAL',
  1: 'STRATEGIC',
  2: 'TACTICAL',
  3: 'OPERATIONAL',
};

export const LEVEL_COLORS: Record<AgentLevel, string> = {
  0: '#DC2626',  // Red
  1: '#7C3AED',  // Purple
  2: '#2563EB',  // Blue
  3: '#10B981',  // Green
};

// ============================================================
// AGENT TYPES
// ============================================================

export type AgentType = 'guardian' | 'coordinator' | 'analyzer' | 'executor' | 'validator';

export interface AgentTypeConfig {
  type: AgentType;
  name: string;
  icon: string;
  levels: AgentLevel[];
  description: string;
}

// ============================================================
// AGENT DEFINITION
// ============================================================

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  level: AgentLevel;
  department: string;
  sphere: string;
  capabilities: string[];
  constraints: string[];
  reports_to: string | null;
  supervised_by: string[];
  active: boolean;
  created_at: string;
}

// ============================================================
// DEPARTMENTS
// ============================================================

export type Department = 'construction' | 'finance' | 'legal' | 'creative' | 'research' | 'operations';

export interface DepartmentConfig {
  id: Department;
  name: string;
  icon: string;
  sphere: string;
  agent_count: number;
}

// ============================================================
// INTER-AGENT COMMUNICATION
// ============================================================

export type MessageType = 'task_request' | 'task_response' | 'status_update' | 'escalation' | 'veto' | 'audit_request';
export type MessagePriority = 'low' | 'normal' | 'high' | 'critical';

export interface AgentMessage {
  id: string;
  type: MessageType;
  from_agent: string;
  to_agent: string;
  payload: Record<string, any>;
  priority: MessagePriority;
  requires_ack: boolean;
  timestamp: string;
  trace_id: string;
  acknowledged: boolean;
  acknowledged_at?: string;
}

// ============================================================
// TASK EXECUTION
// ============================================================

export type TaskState = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'vetoed' | 'cancelled';

export interface TaskExecution {
  task_id: string;
  agent_id: string;
  state: TaskState;
  started_at?: string;
  ended_at?: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  reasoning_trace: ReasoningStep[];
  resources_used: string[];
  violations: string[];
  human_approval_required: boolean;
  human_approved?: boolean;
}

// ============================================================
// REASONING TRACE (MANDATORY)
// ============================================================

export interface ReasoningStep {
  step: number;
  action: string;
  detail: string;
  timestamp: string;
}

export interface ReasoningTrace {
  task_id: string;
  steps: ReasoningStep[];
  constraints_checked: string[];
  complete: boolean;
}

// ============================================================
// ORCHESTRATION STATE
// ============================================================

export interface AgentOrchestrationState {
  agents: Agent[];
  messages: AgentMessage[];
  tasks: TaskExecution[];
  
  // Filters
  level_filter: AgentLevel | null;
  department_filter: Department | null;
  type_filter: AgentType | null;
  
  // Active
  selected_agent: string | null;
  active_tasks: string[];
  
  // Stats
  total_agents: number;
  agents_by_level: Record<AgentLevel, number>;
  
  // UI
  is_loading: boolean;
  error: string | null;
}

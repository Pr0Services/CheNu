/* =====================================================
   CHE·NU — Agent System Types
   core/agents/agent.types.ts
   ===================================================== */

import { SphereType, AgentLevel } from '../theme/theme.types';

// ─────────────────────────────────────────────────────
// Core Agent Types
// ─────────────────────────────────────────────────────

export interface Agent {
  id: string;
  name: string;
  displayName: string;
  description: string;
  
  // Classification
  level: AgentLevel;
  role: AgentRole;
  sphere: SphereType | 'trunk';  // trunk = cross-sphere
  
  // Capabilities
  capabilities: AgentCapability[];
  limitations: string[];
  
  // State
  status: AgentStatus;
  influenceLevel: number;  // 0-1, used for visual positioning
  
  // Visual
  avatar: AgentAvatar;
  
  // Governance
  permissions: AgentPermission[];
  requiresHumanApproval: boolean;
  auditLevel: 'minimal' | 'standard' | 'full';
}

// ─────────────────────────────────────────────────────
// Agent Role
// ─────────────────────────────────────────────────────

export type AgentRole = 
  // L0 - Supreme
  | 'orchestrator'
  
  // L1 - Directors
  | 'strategic_director'
  | 'operations_director'
  | 'creative_director'
  | 'knowledge_director'
  
  // L2 - Managers
  | 'sphere_manager'
  | 'project_manager'
  | 'team_coordinator'
  
  // L3 - Analysts
  | 'data_analyst'
  | 'research_analyst'
  | 'market_analyst'
  | 'financial_analyst'
  
  // L4 - Executors
  | 'task_executor'
  | 'content_creator'
  | 'document_generator'
  | 'code_executor'
  
  // L5 - Observers
  | 'audit_observer'
  | 'memory_keeper'
  | 'compliance_monitor'
  | 'performance_tracker';

// ─────────────────────────────────────────────────────
// Agent Status
// ─────────────────────────────────────────────────────

export type AgentStatus = 
  | 'idle'
  | 'thinking'
  | 'working'
  | 'waiting_approval'
  | 'paused'
  | 'error'
  | 'offline';

// ─────────────────────────────────────────────────────
// Agent Capabilities
// ─────────────────────────────────────────────────────

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: CapabilityCategory;
  requiresApproval: boolean;
}

export type CapabilityCategory = 
  | 'analysis'
  | 'generation'
  | 'communication'
  | 'execution'
  | 'monitoring'
  | 'memory'
  | 'coordination';

// ─────────────────────────────────────────────────────
// Agent Permissions
// ─────────────────────────────────────────────────────

export interface AgentPermission {
  resource: string;
  actions: PermissionAction[];
  scope: PermissionScope;
  expiresAt?: Date;
}

export type PermissionAction = 'read' | 'write' | 'execute' | 'delete' | 'share';

export interface PermissionScope {
  spheres?: SphereType[];
  projects?: string[];
  users?: string[];
  global?: boolean;
}

// ─────────────────────────────────────────────────────
// Agent Avatar
// ─────────────────────────────────────────────────────

export interface AgentAvatar {
  type: 'icon' | 'image' | 'generated' | '3d';
  icon?: string;       // Emoji or icon name
  imageUrl?: string;   // URL to image
  modelUrl?: string;   // URL to 3D model
  color: string;       // Primary color
  accentColor?: string;
  animation?: AvatarAnimation;
}

export type AvatarAnimation = 
  | 'pulse'
  | 'orbit'
  | 'breathe'
  | 'glow'
  | 'none';

// ─────────────────────────────────────────────────────
// Agent Communication
// ─────────────────────────────────────────────────────

export interface AgentMessage {
  id: string;
  timestamp: Date;
  from: string;        // Agent ID
  to: string;          // Agent ID or 'human'
  type: MessageType;
  content: string;
  metadata?: Record<string, unknown>;
  requiresResponse: boolean;
}

export type MessageType = 
  | 'query'
  | 'response'
  | 'suggestion'
  | 'warning'
  | 'error'
  | 'status_update'
  | 'approval_request'
  | 'approval_response';

// ─────────────────────────────────────────────────────
// Agent Context (for UI)
// ─────────────────────────────────────────────────────

export interface AgentContext {
  phase?: string;
  hasHumanDecisionMaker: boolean;
  isCriticalDecision: boolean;
  currentSphere?: SphereType;
  activeMeeting?: string;
}

// ─────────────────────────────────────────────────────
// Agent Action
// ─────────────────────────────────────────────────────

export interface AgentAction {
  id: string;
  agentId: string;
  type: ActionType;
  description: string;
  status: ActionStatus;
  startedAt: Date;
  completedAt?: Date;
  result?: unknown;
  error?: string;
}

export type ActionType = 
  | 'analyze'
  | 'generate'
  | 'search'
  | 'summarize'
  | 'recommend'
  | 'execute'
  | 'validate';

export type ActionStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

// ─────────────────────────────────────────────────────
// Agent Registry Entry
// ─────────────────────────────────────────────────────

export interface AgentRegistryEntry {
  agent: Agent;
  isActive: boolean;
  lastActive?: Date;
  statistics: AgentStatistics;
}

export interface AgentStatistics {
  totalActions: number;
  successfulActions: number;
  averageResponseTime: number;  // ms
  approvalRate: number;         // 0-1
}
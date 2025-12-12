/**
 * CHE·NU — MULTI-AGENT ORCHESTRATION
 * React Components
 */

import React, { useState, CSSProperties } from 'react';
import { useAgentOrchestration } from './AgentContext';
import { AGENT_TYPES, DEPARTMENTS, LEVEL_CONFIGS, AGENT_CONSTRAINTS } from './presets';
import { AgentLevel, AgentType, Department, LEVEL_COLORS } from './types';

const styles: Record<string, CSSProperties> = {
  container: { fontFamily: 'system-ui, sans-serif', padding: 20, maxWidth: 1100, margin: '0 auto' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: 600, color: '#1f2937', margin: '0 0 12px 0' },
  button: { padding: '8px 16px', fontSize: 13, fontWeight: 500, border: 'none', borderRadius: 8, cursor: 'pointer' },
};

// Hierarchy Pyramid
export function HierarchyPyramid() {
  const { state, setLevelFilter } = useAgentOrchestration();
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📊 Agent Hierarchy (L0-L3)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        {LEVEL_CONFIGS.map(lvl => (
          <button key={lvl.level} onClick={() => setLevelFilter(state.level_filter === lvl.level ? null : lvl.level)}
            style={{
              width: `${50 + lvl.level * 50}%`, padding: 12, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: state.level_filter === lvl.level ? lvl.color : `${lvl.color}CC`,
              color: '#fff', opacity: state.level_filter === null || state.level_filter === lvl.level ? 1 : 0.5,
            }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>L{lvl.level}: {lvl.name}</div>
            <div style={{ fontSize: 10, opacity: 0.9 }}>{lvl.role}</div>
            <div style={{ fontSize: 9, marginTop: 4 }}>Agents: {state.agents_by_level[lvl.level]} / {lvl.count}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Agent Types Panel
export function AgentTypesPanel() {
  const { state, setDepartmentFilter } = useAgentOrchestration();
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🤖 Agent Types</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {AGENT_TYPES.map(t => (
          <div key={t.type} style={{ padding: 10, background: '#f3f4f6', borderRadius: 8, flex: '1 1 80px', textAlign: 'center' }}>
            <div style={{ fontSize: 24 }}>{t.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 600 }}>{t.name}</div>
            <div style={{ fontSize: 8, color: '#6b7280' }}>L{t.levels.join(',')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Create Agent Panel
export function CreateAgentPanel() {
  const { addAgent } = useAgentOrchestration();
  const [name, setName] = useState('');
  const [type, setType] = useState<AgentType>('executor');
  const [level, setLevel] = useState<AgentLevel>(3);
  const [dept, setDept] = useState<Department>('construction');
  
  const handleCreate = () => {
    if (!name.trim()) { alert('Name required!'); return; }
    addAgent(name, type, level, dept, null, ['default_capability']);
    setName('');
  };
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>➕ Create Agent</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Agent name..."
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }} />
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Type</label>
          <select value={type} onChange={e => setType(e.target.value as AgentType)}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}>
            {AGENT_TYPES.map(t => <option key={t.type} value={t.type}>{t.icon} {t.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Level</label>
          <select value={level} onChange={e => setLevel(Number(e.target.value) as AgentLevel)}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}>
            {LEVEL_CONFIGS.map(l => <option key={l.level} value={l.level}>L{l.level}: {l.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Department</label>
          <select value={dept} onChange={e => setDept(e.target.value as Department)}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}>
            {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.icon} {d.name}</option>)}
          </select>
        </div>
      </div>
      
      <button onClick={handleCreate} style={{ ...styles.button, background: '#7C3AED', color: '#fff', width: '100%' }}>
        Create Agent
      </button>
    </div>
  );
}

// Agents List
export function AgentsList() {
  const { state, getFilteredAgents, selectAgent, toggleAgent } = useAgentOrchestration();
  const agents = getFilteredAgents();
  
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📋 Agents ({state.total_agents} active)</h3>
      
      {agents.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#9CA3AF' }}>No agents match filters</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
          {agents.map(agent => (
            <div key={agent.id} onClick={() => selectAgent(agent.id)}
              style={{
                padding: 10, borderRadius: 8, cursor: 'pointer',
                background: state.selected_agent === agent.id ? '#EDE9FE' : '#f9fafb',
                border: `2px solid ${state.selected_agent === agent.id ? LEVEL_COLORS[agent.level] : '#e5e7eb'}`,
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{agent.name}</span>
                  <span style={{ fontSize: 9, marginLeft: 8, padding: '2px 6px', borderRadius: 4, background: LEVEL_COLORS[agent.level], color: '#fff' }}>
                    L{agent.level}
                  </span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleAgent(agent.id); }}
                  style={{ ...styles.button, fontSize: 9, padding: '2px 8px', background: agent.active ? '#10B981' : '#EF4444', color: '#fff' }}>
                  {agent.active ? 'Active' : 'Inactive'}
                </button>
              </div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 4 }}>
                {AGENT_TYPES.find(t => t.type === agent.type)?.icon} {agent.type} | {DEPARTMENTS.find(d => d.id === agent.department)?.icon} {agent.department}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Active Tasks Panel
export function ActiveTasksPanel() {
  const { state, createTask, addReasoningStep, completeTask, vetoTask } = useAgentOrchestration();
  const activeTasks = state.tasks.filter(t => ['pending', 'running'].includes(t.state));
  
  const handleDemoTask = () => {
    if (state.agents.length === 0) { alert('Create an agent first!'); return; }
    const taskId = createTask(state.agents[0].id, { action: 'demo_task', data: 'test' });
    setTimeout(() => addReasoningStep(taskId, 'Received input', 'Processing demo task'), 500);
    setTimeout(() => addReasoningStep(taskId, 'Validated constraints', 'Tree Laws checked'), 1000);
  };
  
  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ ...styles.title, margin: 0 }}>⚡ Active Tasks ({activeTasks.length})</h3>
        <button onClick={handleDemoTask} style={{ ...styles.button, fontSize: 10, padding: '4px 10px', background: '#2563EB', color: '#fff' }}>
          + Demo Task
        </button>
      </div>
      
      {activeTasks.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#9CA3AF' }}>No active tasks</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeTasks.map(task => (
            <div key={task.task_id} style={{ padding: 10, background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>Task: {task.task_id.slice(0, 15)}...</span>
                <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: '#2563EB', color: '#fff' }}>{task.state}</span>
              </div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 4 }}>
                Agent: {task.agent_id.slice(0, 15)}... | Steps: {task.reasoning_trace.length}
              </div>
              {task.reasoning_trace.length > 0 && (
                <div style={{ marginTop: 8, padding: 6, background: '#EDE9FE', borderRadius: 4 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#7C3AED' }}>Reasoning Trace:</div>
                  {task.reasoning_trace.slice(-3).map(step => (
                    <div key={step.step} style={{ fontSize: 8, color: '#5B21B6' }}>
                      {step.step}. {step.action}: {step.detail}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button onClick={() => completeTask(task.task_id, { result: 'success' })}
                  style={{ ...styles.button, flex: 1, fontSize: 9, padding: '4px', background: '#10B981', color: '#fff' }}>
                  ✓ Complete
                </button>
                <button onClick={() => vetoTask(task.task_id)}
                  style={{ ...styles.button, flex: 1, fontSize: 9, padding: '4px', background: '#DC2626', color: '#fff' }}>
                  ✗ L0 Veto
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Constraints Panel
export function ConstraintsPanel() {
  return (
    <div style={styles.card}>
      <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🛡️ Agent Constraints</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {AGENT_CONSTRAINTS.map(c => (
          <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 6, background: '#D1FAE5', borderRadius: 4 }}>
            <span style={{ color: '#059669' }}>✓</span>
            <span style={{ fontSize: 10 }}>{c}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: 8, background: '#FEE2E2', borderRadius: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#DC2626' }}>⚠️ Agents NEVER:</div>
        <div style={{ fontSize: 9, color: '#7F1D1D' }}>Make final decisions • Hide reasoning • Bypass L0 • Modify audit logs</div>
      </div>
    </div>
  );
}

// Full Dashboard
export function AgentOrchestrationDashboard() {
  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>🤖 CHE·NU Multi-Agent Orchestration</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>168+ Agents • L0-L3 Hierarchy • Agents ASSIST, never DECIDE</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <HierarchyPyramid />
          <CreateAgentPanel />
          <AgentsList />
        </div>
        <div>
          <AgentTypesPanel />
          <ActiveTasksPanel />
          <ConstraintsPanel />
        </div>
      </div>
    </div>
  );
}

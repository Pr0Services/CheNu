// ═══════════════════════════════════════════════════════════════════════════════
// ROADY V20 - ADVANCED FEATURES
// Drag & Drop Widgets, PDF Export, Real-time Team Chat
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// C1. DRAG & DROP DASHBOARD WIDGETS
// ═══════════════════════════════════════════════════════════════════════════════

const DraggableWidget = ({ id, children, onDragStart, onDragEnd, onDragOver, onDrop, isDragging }) => (
  <div
    draggable
    onDragStart={(e) => { e.dataTransfer.setData('widgetId', id); onDragStart?.(id); }}
    onDragEnd={onDragEnd}
    onDragOver={(e) => { e.preventDefault(); onDragOver?.(id); }}
    onDrop={(e) => { e.preventDefault(); onDrop?.(id, e.dataTransfer.getData('widgetId')); }}
    style={{
      opacity: isDragging ? 0.5 : 1,
      cursor: 'grab',
      transition: 'all 0.2s ease'
    }}
  >
    {children}
  </div>
);

export const DashboardWidgets = ({ T, widgets, setWidgets }) => {
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  const availableWidgets = [
    { id: 'stats', title: '📊 Statistics', size: 'large' },
    { id: 'projects', title: '📁 Active Projects', size: 'medium' },
    { id: 'calendar', title: '📅 Upcoming Events', size: 'medium' },
    { id: 'tasks', title: '✅ My Tasks', size: 'medium' },
    { id: 'team', title: '👥 Team Activity', size: 'small' },
    { id: 'weather', title: '🌤️ Site Weather', size: 'small' },
    { id: 'ai-insights', title: '🧠 AI Insights', size: 'large' },
    { id: 'quick-actions', title: '⚡ Quick Actions', size: 'small' },
  ];

  const handleDrop = (targetId, sourceId) => {
    if (sourceId === targetId) return;
    
    const sourceIndex = widgets.findIndex(w => w.id === sourceId);
    const targetIndex = widgets.findIndex(w => w.id === targetId);
    
    const newWidgets = [...widgets];
    const [removed] = newWidgets.splice(sourceIndex, 1);
    newWidgets.splice(targetIndex, 0, removed);
    
    setWidgets(newWidgets);
    setDraggingId(null);
    setDragOverId(null);
  };

  const addWidget = (widgetId) => {
    const widget = availableWidgets.find(w => w.id === widgetId);
    if (widget && !widgets.find(w => w.id === widgetId)) {
      setWidgets([...widgets, widget]);
    }
  };

  const removeWidget = (widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  return (
    <div>
      {/* Widget Palette */}
      <div style={{ marginBottom: 24, padding: 16, background: T.bg.card, borderRadius: 12, border: `1px solid ${T.border}` }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: T.text.primary, marginBottom: 12 }}>➕ Add Widget</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {availableWidgets.filter(w => !widgets.find(x => x.id === w.id)).map(widget => (
            <button
              key={widget.id}
              onClick={() => addWidget(widget.id)}
              style={{
                padding: '8px 12px', background: T.bg.hover, border: `1px solid ${T.border}`,
                borderRadius: 8, cursor: 'pointer', fontSize: 12, color: T.text.primary
              }}
            >
              {widget.title}
            </button>
          ))}
        </div>
      </div>

      {/* Widgets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {widgets.map(widget => (
          <DraggableWidget
            key={widget.id}
            id={widget.id}
            isDragging={draggingId === widget.id}
            onDragStart={setDraggingId}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={setDragOverId}
            onDrop={handleDrop}
          >
            <div style={{
              background: T.bg.card, borderRadius: 12, padding: 16,
              border: `2px solid ${dragOverId === widget.id ? T.accent.primary : T.border}`,
              minHeight: widget.size === 'large' ? 200 : widget.size === 'medium' ? 150 : 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: T.text.primary }}>{widget.title}</h4>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ cursor: 'grab', padding: 4 }}>⋮⋮</span>
                  <button onClick={() => removeWidget(widget.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.text.muted }}>✕</button>
                </div>
              </div>
              <div style={{ color: T.text.muted, fontSize: 12 }}>Widget content for {widget.id}</div>
            </div>
          </DraggableWidget>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// C2. PDF EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const PDFExporter = ({ T, data, type = 'report' }) => {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const templates = {
    report: { title: 'Project Report', icon: '📊' },
    invoice: { title: 'Invoice', icon: '🧾' },
    contract: { title: 'Contract', icon: '📝' },
    proposal: { title: 'Proposal', icon: '💼' },
    timesheet: { title: 'Timesheet', icon: '⏱️' },
  };

  const generatePDF = async () => {
    setGenerating(true);
    setProgress(0);

    // Simulate PDF generation steps
    const steps = ['Collecting data...', 'Generating layout...', 'Adding charts...', 'Finalizing...'];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setProgress((i + 1) * 25);
    }

    // In real implementation, use jsPDF or similar
    // const doc = new jsPDF();
    // doc.text("ROADY Report", 10, 10);
    // doc.save("report.pdf");

    // Simulate download
    const blob = new Blob(['PDF Content'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roady-${type}-${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

    setGenerating(false);
    setProgress(0);
  };

  return (
    <div style={{ background: T.bg.card, borderRadius: 12, padding: 20, border: `1px solid ${T.border}` }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text.primary, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        📄 Export to PDF
      </h3>

      {/* Template Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginBottom: 20 }}>
        {Object.entries(templates).map(([key, template]) => (
          <button
            key={key}
            style={{
              padding: 16, background: type === key ? `${T.accent.primary}20` : T.bg.hover,
              border: `2px solid ${type === key ? T.accent.primary : T.border}`,
              borderRadius: 8, cursor: 'pointer', textAlign: 'center'
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>{template.icon}</div>
            <div style={{ fontSize: 11, color: T.text.primary }}>{template.title}</div>
          </button>
        ))}
      </div>

      {/* Options */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.text.secondary, marginBottom: 8 }}>
          <input type="checkbox" defaultChecked /> Include charts & graphs
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.text.secondary, marginBottom: 8 }}>
          <input type="checkbox" defaultChecked /> Include company logo
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.text.secondary }}>
          <input type="checkbox" /> Password protect
        </label>
      </div>

      {/* Progress */}
      {generating && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ height: 8, background: T.bg.hover, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: T.accent.primary, transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: 11, color: T.text.muted, marginTop: 4 }}>{progress}% - Generating...</div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generatePDF}
        disabled={generating}
        style={{
          width: '100%', padding: '12px 24px', background: T.accent.primary,
          border: 'none', borderRadius: 8, color: '#000', fontWeight: 600,
          cursor: generating ? 'wait' : 'pointer', opacity: generating ? 0.7 : 1
        }}
      >
        {generating ? '⏳ Generating...' : '📥 Generate PDF'}
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// C3. REAL-TIME TEAM CHAT
// ═══════════════════════════════════════════════════════════════════════════════

export const TeamChat = ({ T, currentUser, teamMembers }) => {
  const [messages, setMessages] = useState([
    { id: 1, userId: 'user2', text: 'Hey team! The foundation work is complete 🎉', time: '10:30 AM', reactions: ['👍', '🎉'] },
    { id: 2, userId: 'user3', text: 'Great work! Ready for inspection tomorrow?', time: '10:32 AM', reactions: [] },
    { id: 3, userId: 'user1', text: 'Yes, all set. Documents are uploaded.', time: '10:35 AM', reactions: ['✅'] },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef(null);

  const members = teamMembers || [
    { id: 'user1', name: 'Jo', avatar: 'JO', status: 'online' },
    { id: 'user2', name: 'Marie D.', avatar: 'MD', status: 'online' },
    { id: 'user3', name: 'Pierre B.', avatar: 'PB', status: 'away' },
    { id: 'user4', name: 'Sophie M.', avatar: 'SM', status: 'offline' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      userId: currentUser?.id || 'user1',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const addReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId 
        ? { ...m, reactions: m.reactions.includes(emoji) ? m.reactions.filter(r => r !== emoji) : [...m.reactions, emoji] }
        : m
    ));
  };

  const getMember = (userId) => members.find(m => m.id === userId) || { name: 'Unknown', avatar: '?' };

  return (
    <div style={{ display: 'flex', height: 500, background: T.bg.card, borderRadius: 12, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
      {/* Members Sidebar */}
      <div style={{ width: showMembers ? 200 : 0, borderRight: `1px solid ${T.border}`, transition: 'width 0.2s', overflow: 'hidden' }}>
        <div style={{ padding: 16 }}>
          <h4 style={{ fontSize: 12, fontWeight: 600, color: T.text.muted, marginBottom: 12, textTransform: 'uppercase' }}>Team Members</h4>
          {members.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{m.avatar}</div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: m.status === 'online' ? '#22c55e' : m.status === 'away' ? '#f59e0b' : '#6b7280', border: `2px solid ${T.bg.card}` }} />
              </div>
              <span style={{ fontSize: 13, color: T.text.primary }}>{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: 16, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: T.text.primary }}>💬 Team Chat</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowMembers(!showMembers)} style={{ padding: '6px 12px', background: T.bg.hover, border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: T.text.primary }}>
              👥 {members.length}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {messages.map(msg => {
            const member = getMember(msg.userId);
            const isOwn = msg.userId === (currentUser?.id || 'user1');
            
            return (
              <div key={msg.id} style={{ display: 'flex', gap: 12, marginBottom: 16, flexDirection: isOwn ? 'row-reverse' : 'row' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {member.avatar}
                </div>
                <div style={{ maxWidth: '70%' }}>
                  <div style={{ fontSize: 11, color: T.text.muted, marginBottom: 4, textAlign: isOwn ? 'right' : 'left' }}>
                    {member.name} • {msg.time}
                  </div>
                  <div style={{
                    padding: '10px 14px', borderRadius: 12,
                    background: isOwn ? T.accent.primary : T.bg.hover,
                    color: isOwn ? '#000' : T.text.primary,
                    fontSize: 14
                  }}>
                    {msg.text}
                  </div>
                  {msg.reactions.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 4, justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
                      {msg.reactions.map((r, i) => (
                        <span key={i} style={{ background: T.bg.hover, padding: '2px 6px', borderRadius: 10, fontSize: 12, cursor: 'pointer' }} onClick={() => addReaction(msg.id, r)}>{r}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {isTyping.length > 0 && (
            <div style={{ fontSize: 12, color: T.text.muted, fontStyle: 'italic' }}>
              {isTyping.join(', ')} typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: 16, borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: 10, background: T.bg.hover, border: 'none', borderRadius: 8, cursor: 'pointer' }}>📎</button>
            <button style={{ padding: 10, background: T.bg.hover, border: 'none', borderRadius: 8, cursor: 'pointer' }}>😊</button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              style={{ flex: 1, padding: '10px 14px', background: T.bg.input, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text.primary, fontSize: 14 }}
            />
            <button onClick={sendMessage} style={{ padding: '10px 20px', background: T.accent.primary, border: 'none', borderRadius: 8, color: '#000', fontWeight: 600, cursor: 'pointer' }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// C4. CALENDAR EXTERNAL SYNC
// ═══════════════════════════════════════════════════════════════════════════════

export const CalendarSync = ({ T, onSync }) => {
  const [syncing, setSyncing] = useState({});
  const [connected, setConnected] = useState({ google: true, outlook: false, apple: false });

  const providers = [
    { id: 'google', name: 'Google Calendar', icon: '📅', color: '#4285f4' },
    { id: 'outlook', name: 'Outlook', icon: '📆', color: '#0078d4' },
    { id: 'apple', name: 'Apple Calendar', icon: '🍎', color: '#000' },
  ];

  const toggleConnection = async (providerId) => {
    setSyncing(prev => ({ ...prev, [providerId]: true }));
    
    // Simulate OAuth flow
    await new Promise(r => setTimeout(r, 1500));
    
    setConnected(prev => ({ ...prev, [providerId]: !prev[providerId] }));
    setSyncing(prev => ({ ...prev, [providerId]: false }));
    
    onSync?.(providerId, !connected[providerId]);
  };

  const syncNow = async (providerId) => {
    setSyncing(prev => ({ ...prev, [providerId]: true }));
    await new Promise(r => setTimeout(r, 2000));
    setSyncing(prev => ({ ...prev, [providerId]: false }));
  };

  return (
    <div style={{ background: T.bg.card, borderRadius: 12, padding: 20, border: `1px solid ${T.border}` }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text.primary, marginBottom: 16 }}>🔗 Calendar Sync</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {providers.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: T.bg.hover, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24 }}>{p.icon}</span>
              <div>
                <div style={{ fontWeight: 500, color: T.text.primary }}>{p.name}</div>
                <div style={{ fontSize: 11, color: connected[p.id] ? '#22c55e' : T.text.muted }}>
                  {connected[p.id] ? '✓ Connected' : 'Not connected'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {connected[p.id] && (
                <button
                  onClick={() => syncNow(p.id)}
                  disabled={syncing[p.id]}
                  style={{ padding: '6px 12px', background: T.bg.card, border: `1px solid ${T.border}`, borderRadius: 6, cursor: 'pointer', fontSize: 12, color: T.text.primary }}
                >
                  {syncing[p.id] ? '⏳' : '🔄'} Sync
                </button>
              )}
              <button
                onClick={() => toggleConnection(p.id)}
                disabled={syncing[p.id]}
                style={{
                  padding: '6px 12px',
                  background: connected[p.id] ? T.bg.card : p.color,
                  border: `1px solid ${connected[p.id] ? T.border : p.color}`,
                  borderRadius: 6, cursor: 'pointer', fontSize: 12,
                  color: connected[p.id] ? T.text.primary : '#fff'
                }}
              >
                {syncing[p.id] ? '...' : connected[p.id] ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default { DashboardWidgets, PDFExporter, TeamChat, CalendarSync };

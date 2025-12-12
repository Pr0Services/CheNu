/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — MESSAGING MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * Module Messagerie complet - Chat temps réel, Groupes, Fichiers
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef } from 'react';

const tokens = {
  colors: {
    sacredGold: '#D8B26A', cenoteTurquoise: '#3EB4A2', jungleEmerald: '#3F7249',
    ancientStone: '#8D8371', earthEmber: '#7A593A', darkSlate: '#1A1A1A',
    bg: { primary: '#0f1217', secondary: '#161B22', tertiary: '#1E242C', card: 'rgba(22, 27, 34, 0.95)' },
    text: { primary: '#E9E4D6', secondary: '#A0998A', muted: '#6B6560' },
    border: 'rgba(216, 178, 106, 0.15)',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  fonts: { heading: "'Lora', serif", body: "'Inter', sans-serif" },
};

const mockConversations = [
  { id: 1, type: 'direct', name: 'Marie Côté', avatar: 'MC', color: '#D94A6A', status: 'online', lastMessage: 'Les plans sont prêts pour révision', lastTime: '10:45', unread: 2 },
  { id: 2, type: 'group', name: 'Équipe Projet Tremblay', avatar: '👥', color: tokens.colors.cenoteTurquoise, lastMessage: 'Pierre: J\'ai terminé l\'inspection', lastTime: '09:30', unread: 5, members: 4 },
  { id: 3, type: 'direct', name: 'Pierre Lavoie', avatar: 'PL', color: '#6AD94A', status: 'busy', lastMessage: 'OK, je m\'en occupe', lastTime: 'Hier', unread: 0 },
  { id: 4, type: 'channel', name: '# général', avatar: '#', color: tokens.colors.ancientStone, lastMessage: 'Anne: Réunion reportée à 14h', lastTime: 'Hier', unread: 0 },
];

const mockMessages = [
  { id: 1, sender: 'Marie Côté', avatar: 'MC', color: '#D94A6A', content: 'Bonjour! J\'ai finalisé les plans pour le projet Tremblay.', time: '10:30', isSent: false },
  { id: 2, sender: 'Moi', avatar: 'JT', color: tokens.colors.cenoteTurquoise, content: 'Super! Tu peux me les envoyer?', time: '10:32', isSent: true },
  { id: 3, sender: 'Marie Côté', avatar: 'MC', color: '#D94A6A', content: 'Bien sûr! Je te les envoie par email aussi.', time: '10:35', isSent: false },
  { id: 4, sender: 'Marie Côté', avatar: 'MC', color: '#D94A6A', content: 'Les plans sont prêts pour révision 📄', time: '10:45', isSent: false, attachment: { name: 'Plans_v3.pdf', size: '2.4 MB' } },
];

const MessagingModule = () => {
  const [selectedConv, setSelectedConv] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  
  const statusColors = { online: tokens.colors.jungleEmerald, busy: tokens.colors.sacredGold, offline: tokens.colors.ancientStone };
  
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: tokens.colors.bg.primary, fontFamily: tokens.fonts.body }}>
      {/* Sidebar */}
      <div style={{ width: 320, backgroundColor: tokens.colors.bg.secondary, borderRight: `1px solid ${tokens.colors.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: tokens.spacing.lg, borderBottom: `1px solid ${tokens.colors.border}` }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: tokens.colors.text.primary, marginBottom: tokens.spacing.md }}>💬 Messages</div>
          <input style={{ width: '100%', padding: '10px 16px', fontSize: 14, backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.lg, color: tokens.colors.text.primary, outline: 'none', boxSizing: 'border-box' }} placeholder="🔍 Rechercher..." />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {mockConversations.map((conv) => (
            <div key={conv.id} onClick={() => setSelectedConv(conv)} style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md, padding: tokens.spacing.md, cursor: 'pointer', backgroundColor: selectedConv?.id === conv.id ? tokens.colors.bg.tertiary : 'transparent', borderLeft: selectedConv?.id === conv.id ? `3px solid ${tokens.colors.sacredGold}` : '3px solid transparent' }}>
              <div style={{ width: 48, height: 48, borderRadius: tokens.radius.lg, backgroundColor: conv.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: '#fff', position: 'relative' }}>
                {conv.avatar}
                {conv.status && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: tokens.radius.full, backgroundColor: statusColors[conv.status], border: `3px solid ${tokens.colors.bg.secondary}` }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: tokens.colors.text.primary }}>{conv.name}</div>
                <div style={{ fontSize: 13, color: tokens.colors.text.secondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.lastMessage}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: tokens.spacing.xs }}>
                <span style={{ fontSize: 11, color: tokens.colors.text.muted }}>{conv.lastTime}</span>
                {conv.unread > 0 && <span style={{ minWidth: 20, height: 20, borderRadius: tokens.radius.full, backgroundColor: tokens.colors.sacredGold, color: tokens.colors.darkSlate, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{conv.unread}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: tokens.spacing.md, borderBottom: `1px solid ${tokens.colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: tokens.colors.bg.secondary }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
            <div style={{ width: 44, height: 44, borderRadius: tokens.radius.lg, backgroundColor: selectedConv?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: '#fff' }}>{selectedConv?.avatar}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: tokens.colors.text.primary }}>{selectedConv?.name}</div>
              <div style={{ fontSize: 12, color: tokens.colors.text.muted }}>{selectedConv?.status === 'online' ? '🟢 En ligne' : selectedConv?.status === 'busy' ? '🟡 Occupé' : '⚫ Hors ligne'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
            {['📞', '📹', 'ℹ️'].map((icon, i) => (
              <button key={i} onClick={i === 2 ? () => setShowDetails(!showDetails) : undefined} style={{ width: 40, height: 40, borderRadius: tokens.radius.md, border: 'none', backgroundColor: i === 2 && showDetails ? tokens.colors.sacredGold : tokens.colors.bg.tertiary, color: i === 2 && showDetails ? tokens.colors.darkSlate : tokens.colors.text.secondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</button>
            ))}
          </div>
        </div>
        
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: tokens.spacing.lg, display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md, padding: `${tokens.spacing.md}px 0` }}>
            <div style={{ flex: 1, height: 1, backgroundColor: tokens.colors.border }} />
            <span style={{ fontSize: 12, color: tokens.colors.text.muted, padding: '4px 12px', backgroundColor: tokens.colors.bg.secondary, borderRadius: tokens.radius.full }}>Aujourd'hui</span>
            <div style={{ flex: 1, height: 1, backgroundColor: tokens.colors.border }} />
          </div>
          {mockMessages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', gap: tokens.spacing.md, flexDirection: msg.isSent ? 'row-reverse' : 'row' }}>
              {!msg.isSent && <div style={{ width: 36, height: 36, borderRadius: tokens.radius.md, backgroundColor: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff' }}>{msg.avatar}</div>}
              <div style={{ maxWidth: '70%' }}>
                {!msg.isSent && <div style={{ fontSize: 12, fontWeight: 500, color: tokens.colors.text.secondary, marginBottom: tokens.spacing.xs }}>{msg.sender}</div>}
                <div style={{ padding: '12px 16px', borderRadius: tokens.radius.xl, fontSize: 14, lineHeight: 1.5, ...(msg.isSent ? { background: `linear-gradient(135deg, ${tokens.colors.sacredGold} 0%, ${tokens.colors.earthEmber} 100%)`, color: tokens.colors.darkSlate, borderBottomRightRadius: tokens.radius.sm } : { backgroundColor: tokens.colors.bg.tertiary, color: tokens.colors.text.primary, borderBottomLeftRadius: tokens.radius.sm }) }}>
                  {msg.content}
                  {msg.attachment && <div style={{ marginTop: tokens.spacing.sm, padding: tokens.spacing.sm, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: tokens.radius.md, display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}><span>📄</span><div><div style={{ fontSize: 13, fontWeight: 500 }}>{msg.attachment.name}</div><div style={{ fontSize: 11, opacity: 0.7 }}>{msg.attachment.size}</div></div></div>}
                </div>
                <div style={{ fontSize: 11, color: tokens.colors.text.muted, marginTop: tokens.spacing.xs, textAlign: msg.isSent ? 'right' : 'left' }}>{msg.time}</div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, padding: tokens.spacing.sm, fontSize: 12, color: tokens.colors.text.muted }}>
            <div style={{ display: 'flex', gap: 4 }}>{[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: tokens.radius.full, backgroundColor: tokens.colors.text.muted }} />)}</div>
            <span>Marie écrit...</span>
          </div>
        </div>
        
        {/* Input */}
        <div style={{ padding: tokens.spacing.md, borderTop: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.bg.secondary }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: tokens.spacing.sm, backgroundColor: tokens.colors.bg.tertiary, borderRadius: tokens.radius.xl, padding: tokens.spacing.sm, border: `1px solid ${tokens.colors.border}` }}>
            <div style={{ display: 'flex', gap: tokens.spacing.xs }}>
              {['📎', '😊'].map((icon, i) => <button key={i} style={{ width: 36, height: 36, borderRadius: tokens.radius.md, border: 'none', backgroundColor: 'transparent', color: tokens.colors.text.secondary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</button>)}
            </div>
            <textarea style={{ flex: 1, padding: '8px 12px', fontSize: 14, backgroundColor: 'transparent', border: 'none', color: tokens.colors.text.primary, outline: 'none', resize: 'none', fontFamily: tokens.fonts.body, minHeight: 24 }} placeholder="Écrivez un message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={1} />
            <button style={{ width: 40, height: 40, borderRadius: tokens.radius.lg, border: 'none', backgroundColor: tokens.colors.sacredGold, color: tokens.colors.darkSlate, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>➤</button>
          </div>
        </div>
      </div>
      
      {/* Details Panel */}
      {showDetails && (
        <div style={{ width: 300, backgroundColor: tokens.colors.bg.secondary, borderLeft: `1px solid ${tokens.colors.border}`, padding: tokens.spacing.lg }}>
          <div style={{ textAlign: 'center', marginBottom: tokens.spacing.xl }}>
            <div style={{ width: 80, height: 80, borderRadius: tokens.radius.xl, backgroundColor: selectedConv?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 600, color: '#fff', margin: '0 auto', marginBottom: tokens.spacing.md }}>{selectedConv?.avatar}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: tokens.colors.text.primary }}>{selectedConv?.name}</div>
            <div style={{ fontSize: 13, color: tokens.colors.text.secondary }}>{selectedConv?.status === 'online' ? '🟢 En ligne' : '⚫ Hors ligne'}</div>
          </div>
          <div style={{ marginBottom: tokens.spacing.lg }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: tokens.colors.text.muted, textTransform: 'uppercase', marginBottom: tokens.spacing.md }}>Fichiers partagés</div>
            {['📄 Plans_v3.pdf', '🖼️ Photo_chantier.jpg', '📊 Devis_final.xlsx'].map((file, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, padding: tokens.spacing.sm, borderRadius: tokens.radius.md, cursor: 'pointer', fontSize: 13, color: tokens.colors.text.primary }}>{file}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingModule;

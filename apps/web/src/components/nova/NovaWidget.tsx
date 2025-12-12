/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU - NOVA AI WIDGET                                ║
 * ║                                                                              ║
 * ║  Chatbot flottant discret - toujours accessible sans encombrer              ║
 * ║  Police compacte, panel coulissant, n'obstrue pas les sphères               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'nova';
  content: string;
  timestamp: Date;
}

interface NovaWidgetProps {
  isAuthenticated?: boolean;
}

export const NovaWidget: React.FC<NovaWidgetProps> = ({ isAuthenticated = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'nova',
      content: 'Bonjour! Je suis Nova, votre assistante CHE·NU. Comment puis-je vous aider?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Don't render if not authenticated
  if (!isAuthenticated) return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/nova/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      });
      const data = await res.json();

      const novaMessage: Message = {
        id: `msg_${Date.now()}_nova`,
        role: 'nova',
        content: data.response || "Je suis là pour vous aider avec vos projets de construction.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, novaMessage]);
    } catch {
      setMessages(prev => [...prev, {
        id: `msg_${Date.now()}_error`,
        role: 'nova',
        content: "Connexion interrompue. Réessayez dans un moment.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick actions for common tasks
  const quickActions = [
    { icon: '📊', label: 'Devis', action: 'Génère un devis pour mon projet' },
    { icon: '📋', label: 'Tâches', action: 'Quelles sont mes tâches du jour?' },
    { icon: '⚠️', label: 'Sécurité', action: 'Vérifie la conformité CNESST' },
    { icon: '📅', label: 'Planning', action: 'Montre mon calendrier' },
  ];

  return (
    <>
      {/* Floating Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: isOpen 
            ? 'linear-gradient(135deg, #3F7249 0%, #2F5A39 100%)'
            : 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
        title={isOpen ? 'Fermer Nova' : 'Parler à Nova'}
      >
        <span style={{ fontSize: 24 }}>{isOpen ? '✕' : '✨'}</span>
      </button>

      {/* Chat Panel - Slide in from right, doesn't cover full width */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: isMinimized ? 280 : 340,
            height: isMinimized ? 48 : 420,
            background: 'rgba(18, 22, 18, 0.98)',
            borderRadius: 12,
            border: '1px solid rgba(216, 178, 106, 0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 999,
            transition: 'all 0.3s ease',
          }}
        >
          {/* Header - Compact */}
          <div
            style={{
              padding: '10px 12px',
              background: 'linear-gradient(135deg, rgba(216, 178, 106, 0.15) 0%, rgba(63, 114, 73, 0.15) 100%)',
              borderBottom: '1px solid rgba(216, 178, 106, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D8B26A 0%, #3F7249 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                }}
              >
                ✨
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#E8F0E8' }}>Nova</div>
                <div style={{ fontSize: 9, color: '#8B9B8B' }}>Assistant IA CHE·NU</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8B9B8B',
                  cursor: 'pointer',
                  fontSize: 14,
                  padding: 4,
                }}
              >
                {isMinimized ? '▲' : '▼'}
              </button>
            </div>
          </div>

          {/* Content - Only show when not minimized */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                    }}
                  >
                    <div
                      style={{
                        padding: '8px 10px',
                        borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #3F7249 0%, #2F5A39 100%)'
                          : 'rgba(216, 178, 106, 0.1)',
                        border: msg.role === 'nova' ? '1px solid rgba(216, 178, 106, 0.2)' : 'none',
                        fontSize: 11,
                        lineHeight: 1.4,
                        color: '#E8F0E8',
                      }}
                    >
                      {msg.content}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: '#6B7B6B',
                        marginTop: 2,
                        textAlign: msg.role === 'user' ? 'right' : 'left',
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div style={{ alignSelf: 'flex-start', padding: '8px 10px', background: 'rgba(216, 178, 106, 0.1)', borderRadius: 12, fontSize: 11 }}>
                    <span style={{ animation: 'pulse 1s infinite' }}>Nova réfléchit...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div
                style={{
                  padding: '6px 10px',
                  borderTop: '1px solid rgba(216, 178, 106, 0.1)',
                  display: 'flex',
                  gap: 4,
                  overflowX: 'auto',
                }}
              >
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(action.action); inputRef.current?.focus(); }}
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(63, 114, 73, 0.2)',
                      border: '1px solid rgba(63, 114, 73, 0.3)',
                      borderRadius: 6,
                      color: '#A8C8A8',
                      fontSize: 9,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Input */}
              <div
                style={{
                  padding: 10,
                  borderTop: '1px solid rgba(216, 178, 106, 0.1)',
                  display: 'flex',
                  gap: 8,
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Écrivez votre message..."
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(216, 178, 106, 0.2)',
                    borderRadius: 8,
                    color: '#E8F0E8',
                    fontSize: 11,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  style={{
                    padding: '8px 12px',
                    background: input.trim() && !isTyping
                      ? 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)'
                      : 'rgba(216, 178, 106, 0.2)',
                    border: 'none',
                    borderRadius: 8,
                    color: input.trim() && !isTyping ? '#1A1A1A' : '#6B7B6B',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  }}
                >
                  ↗
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};

export default NovaWidget;

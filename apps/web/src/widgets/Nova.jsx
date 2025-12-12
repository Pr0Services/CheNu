import React, { useState, useEffect, useCallback, useRef } from 'react';
import { colors, radius, shadows, transitions, space, typography, zIndex } from '../../design-system/tokens';
import { Button } from '../ui/Button';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — NOVA ASSISTANT IA PROACTIF
 * ═══════════════════════════════════════════════════════════════════════════════
 * P3-03: Assistant IA avec suggestions contextuelles
 * 
 * Features:
 * - Bulle flottante Nova (bottom-right)
 * - Suggestions proactives basées sur le contexte
 * - Chat intégré avec historique
 * - Actions rapides suggérées
 * - Modes: chat, suggestions, commandes
 * - Raccourci ⌘/
 * 
 * Usage:
 *   <NovaAssistant 
 *     currentPage="projects"
 *     userData={user}
 *     onAction={handleNovaAction}
 *   />
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// SUGGESTIONS CONTEXTUELLES
// ─────────────────────────────────────────────────────────────────────────────

const contextualSuggestions = {
  dashboard: [
    { id: 'dash-1', text: 'Voulez-vous voir le résumé de la semaine?', action: 'weekly-summary', icon: '📊' },
    { id: 'dash-2', text: 'Vous avez 3 tâches en retard', action: 'show-overdue', icon: '⚠️', urgent: true },
    { id: 'dash-3', text: 'Générer un rapport mensuel?', action: 'monthly-report', icon: '📈' },
  ],
  projects: [
    { id: 'proj-1', text: 'Créer un nouveau projet?', action: 'create-project', icon: '➕' },
    { id: 'proj-2', text: 'Projet "Tremblay" à 90% - finaliser?', action: 'finalize-project', icon: '🏁' },
    { id: 'proj-3', text: 'Analyser la rentabilité des projets?', action: 'analyze-profitability', icon: '💰' },
  ],
  calendar: [
    { id: 'cal-1', text: 'Vous avez 2 conflits d\'horaire', action: 'show-conflicts', icon: '⚠️', urgent: true },
    { id: 'cal-2', text: 'Planifier une réunion d\'équipe?', action: 'schedule-meeting', icon: '👥' },
    { id: 'cal-3', text: 'Synchroniser avec Google Calendar?', action: 'sync-calendar', icon: '🔄' },
  ],
  email: [
    { id: 'email-1', text: '5 emails non lus importants', action: 'show-important', icon: '📧', urgent: true },
    { id: 'email-2', text: 'Rédiger un email avec l\'IA?', action: 'compose-ai', icon: '✨' },
    { id: 'email-3', text: 'Archiver les emails de +30 jours?', action: 'cleanup-old', icon: '🗑️' },
  ],
  finance: [
    { id: 'fin-1', text: '3 factures en attente de paiement', action: 'show-pending', icon: '💳', urgent: true },
    { id: 'fin-2', text: 'Générer les rapports de TVQ/TPS?', action: 'tax-report', icon: '📋' },
    { id: 'fin-3', text: 'Prévisions de trésorerie?', action: 'cash-forecast', icon: '📈' },
  ],
  team: [
    { id: 'team-1', text: '2 demandes de congé en attente', action: 'show-requests', icon: '📝', urgent: true },
    { id: 'team-2', text: 'Voir les disponibilités de l\'équipe?', action: 'team-availability', icon: '📅' },
    { id: 'team-3', text: 'Envoyer le planning hebdomadaire?', action: 'send-schedule', icon: '📤' },
  ],
  default: [
    { id: 'def-1', text: 'Comment puis-je vous aider?', action: 'open-chat', icon: '💬' },
    { id: 'def-2', text: 'Voir les raccourcis clavier?', action: 'show-shortcuts', icon: '⌨️' },
    { id: 'def-3', text: 'Explorer les fonctionnalités IA?', action: 'ai-features', icon: '🧠' },
  ],
};

// Quick actions disponibles
const quickActions = [
  { id: 'qa-1', label: 'Résumer ma journée', icon: '📋', action: 'summarize-day' },
  { id: 'qa-2', label: 'Créer une tâche', icon: '☑️', action: 'create-task' },
  { id: 'qa-3', label: 'Envoyer un rappel', icon: '🔔', action: 'send-reminder' },
  { id: 'qa-4', label: 'Analyser les données', icon: '📊', action: 'analyze-data' },
  { id: 'qa-5', label: 'Rédiger un email', icon: '✉️', action: 'compose-email' },
  { id: 'qa-6', label: 'Chercher un document', icon: '🔍', action: 'search-docs' },
];

// ─────────────────────────────────────────────────────────────────────────────
// NOVA ASSISTANT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function NovaAssistant({
  currentPage = 'dashboard',
  userData = {},
  onAction,
  position = 'bottom-right',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mode, setMode] = useState('suggestions'); // suggestions, chat, actions
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  // Suggestions basées sur le contexte
  const suggestions = contextualSuggestions[currentPage] || contextualSuggestions.default;
  const urgentSuggestions = suggestions.filter(s => s.urgent);

  // Raccourci ⌘/
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
        setMode('chat');
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Simuler une réponse IA
  const simulateResponse = useCallback((userMessage) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const responses = [
        `Je comprends votre demande concernant "${userMessage}". Voici ce que je peux faire...`,
        `Bien sûr! Je vais m'occuper de "${userMessage}" immédiatement.`,
        `Pour "${userMessage}", je suggère les étapes suivantes...`,
        `J'ai analysé votre demande. Voici mes recommandations pour "${userMessage}"...`,
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
      }]);
      
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  }, []);

  // Envoyer un message
  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    simulateResponse(userMessage.content);
  }, [inputValue, simulateResponse]);

  // Exécuter une action
  const handleAction = useCallback((action) => {
    onAction?.(action);
    
    // Ajouter au chat comme confirmation
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'assistant',
      content: `✓ Action "${action}" exécutée avec succès.`,
      timestamp: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
      isAction: true,
    }]);
  }, [onAction]);

  // Position styles
  const positionStyles = {
    'bottom-right': { bottom: space.lg, right: space.lg },
    'bottom-left': { bottom: space.lg, left: space.lg },
    'top-right': { top: space.lg, right: space.lg },
    'top-left': { top: space.lg, left: space.lg },
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div
          data-tour="nova"
          style={{
            position: 'fixed',
            ...positionStyles[position],
            zIndex: zIndex.modal - 1,
          }}
        >
          {/* Notification bubble */}
          {showBubble && urgentSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              marginBottom: space.sm,
              padding: space.sm,
              maxWidth: '280px',
              background: colors.background.secondary,
              border: `1px solid ${colors.border.gold}`,
              borderRadius: radius.lg,
              boxShadow: shadows.lg,
              animation: 'chenu-bubble-appear 300ms ease',
            }}>
              <button
                onClick={() => setShowBubble(false)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  color: colors.text.muted,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                ✕
              </button>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: space.sm,
              }}>
                <span style={{ fontSize: '20px' }}>{urgentSuggestions[0].icon}</span>
                <div>
                  <p style={{
                    margin: 0,
                    fontSize: typography.fontSize.sm,
                    color: colors.text.primary,
                    lineHeight: 1.4,
                  }}>
                    {urgentSuggestions[0].text}
                  </p>
                  <button
                    onClick={() => {
                      handleAction(urgentSuggestions[0].action);
                      setShowBubble(false);
                    }}
                    style={{
                      marginTop: space.xs,
                      padding: '4px 12px',
                      background: colors.sacredGold,
                      color: colors.darkSlate,
                      border: 'none',
                      borderRadius: radius.sm,
                      fontSize: typography.fontSize.sm,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Voir
                  </button>
                </div>
              </div>
              
              {/* Arrow */}
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                right: '24px',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: `8px solid ${colors.background.secondary}`,
              }} />
            </div>
          )}

          {/* Nova Button */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Ouvrir Nova"
            style={{
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${colors.sacredGold} 0%, ${colors.cenoteTurquoise} 100%)`,
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              boxShadow: shadows.goldGlow,
              transition: transitions.smooth,
              animation: 'chenu-nova-pulse 3s ease-in-out infinite',
            }}
          >
            <span style={{ fontSize: '28px' }}>🧠</span>
          </button>

          {/* Badge notifications */}
          {urgentSuggestions.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: colors.status.error,
              color: '#fff',
              borderRadius: '50%',
              fontSize: '11px',
              fontWeight: 600,
            }}>
              {urgentSuggestions.length}
            </span>
          )}
        </div>
      )}

      {/* Nova Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            ...positionStyles[position],
            width: isMinimized ? '320px' : '400px',
            height: isMinimized ? 'auto' : '560px',
            background: colors.background.secondary,
            borderRadius: radius.xl,
            boxShadow: shadows.xl,
            border: `1px solid ${colors.border.gold}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: zIndex.modal,
            animation: 'chenu-panel-appear 200ms ease',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: space.md,
            background: `linear-gradient(135deg, ${colors.sacredGold}15 0%, ${colors.cenoteTurquoise}15 100%)`,
            borderBottom: `1px solid ${colors.border.default}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
              <span style={{ fontSize: '24px' }}>🧠</span>
              <div>
                <div style={{
                  fontSize: typography.fontSize.md,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text.primary,
                }}>
                  Nova
                </div>
                <div style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.cenoteTurquoise,
                }}>
                  Assistant IA • En ligne
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: space.xs }}>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: colors.background.tertiary,
                  border: 'none',
                  borderRadius: radius.sm,
                  cursor: 'pointer',
                  color: colors.text.muted,
                  fontSize: '14px',
                }}
              >
                {isMinimized ? '▢' : '─'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: colors.background.tertiary,
                  border: 'none',
                  borderRadius: radius.sm,
                  cursor: 'pointer',
                  color: colors.text.muted,
                  fontSize: '14px',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Mode tabs */}
              <div style={{
                display: 'flex',
                borderBottom: `1px solid ${colors.border.default}`,
              }}>
                {['suggestions', 'chat', 'actions'].map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    style={{
                      flex: 1,
                      padding: space.sm,
                      background: mode === m ? `${colors.sacredGold}15` : 'transparent',
                      border: 'none',
                      borderBottom: mode === m ? `2px solid ${colors.sacredGold}` : '2px solid transparent',
                      cursor: 'pointer',
                      color: mode === m ? colors.sacredGold : colors.text.secondary,
                      fontSize: typography.fontSize.sm,
                      fontWeight: mode === m ? 500 : 400,
                      textTransform: 'capitalize',
                    }}
                  >
                    {m === 'suggestions' ? '💡' : m === 'chat' ? '💬' : '⚡'} {m}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Suggestions Mode */}
                {mode === 'suggestions' && (
                  <div style={{ padding: space.md, overflow: 'auto' }}>
                    <p style={{
                      margin: `0 0 ${space.md}`,
                      fontSize: typography.fontSize.sm,
                      color: colors.text.secondary,
                    }}>
                      Suggestions pour <strong>{currentPage}</strong>:
                    </p>
                    
                    {suggestions.map(suggestion => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleAction(suggestion.action)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: space.sm,
                          padding: space.sm,
                          marginBottom: space.xs,
                          background: suggestion.urgent ? colors.status.warningBg : colors.background.tertiary,
                          border: suggestion.urgent ? `1px solid ${colors.sacredGold}50` : `1px solid ${colors.border.default}`,
                          borderRadius: radius.md,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: transitions.fast,
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{suggestion.icon}</span>
                        <span style={{
                          flex: 1,
                          fontSize: typography.fontSize.sm,
                          color: colors.text.primary,
                        }}>
                          {suggestion.text}
                        </span>
                        <span style={{ color: colors.text.muted }}>→</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Chat Mode */}
                {mode === 'chat' && (
                  <>
                    <div
                      ref={chatRef}
                      style={{
                        flex: 1,
                        padding: space.md,
                        overflow: 'auto',
                      }}
                    >
                      {messages.length === 0 ? (
                        <div style={{
                          textAlign: 'center',
                          padding: space.xl,
                          color: colors.text.muted,
                        }}>
                          <span style={{ fontSize: '48px', opacity: 0.5 }}>🧠</span>
                          <p style={{ margin: `${space.md} 0 0` }}>
                            Comment puis-je vous aider?
                          </p>
                          <p style={{ fontSize: typography.fontSize.sm }}>
                            Tapez votre question ou demande...
                          </p>
                        </div>
                      ) : (
                        messages.map(msg => (
                          <ChatMessage key={msg.id} message={msg} />
                        ))
                      )}
                      
                      {isTyping && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: space.xs,
                          padding: space.sm,
                        }}>
                          <span style={{ fontSize: '20px' }}>🧠</span>
                          <div style={{
                            padding: `${space.sm} ${space.md}`,
                            background: colors.background.tertiary,
                            borderRadius: radius.lg,
                          }}>
                            <TypingIndicator />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input */}
                    <div style={{
                      padding: space.sm,
                      borderTop: `1px solid ${colors.border.default}`,
                    }}>
                      <div style={{
                        display: 'flex',
                        gap: space.xs,
                      }}>
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                          placeholder="Écrivez votre message..."
                          style={{
                            flex: 1,
                            padding: space.sm,
                            background: colors.background.input,
                            border: `1px solid ${colors.border.default}`,
                            borderRadius: radius.md,
                            color: colors.text.primary,
                            fontSize: typography.fontSize.sm,
                            outline: 'none',
                          }}
                        />
                        <button
                          onClick={handleSend}
                          disabled={!inputValue.trim()}
                          style={{
                            padding: `${space.sm} ${space.md}`,
                            background: inputValue.trim() ? colors.sacredGold : colors.background.tertiary,
                            color: inputValue.trim() ? colors.darkSlate : colors.text.muted,
                            border: 'none',
                            borderRadius: radius.md,
                            cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                            fontWeight: 500,
                          }}
                        >
                          ↵
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Actions Mode */}
                {mode === 'actions' && (
                  <div style={{
                    padding: space.md,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: space.sm,
                  }}>
                    {quickActions.map(action => (
                      <button
                        key={action.id}
                        onClick={() => handleAction(action.action)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: space.xs,
                          padding: space.md,
                          background: colors.background.tertiary,
                          border: `1px solid ${colors.border.default}`,
                          borderRadius: radius.md,
                          cursor: 'pointer',
                          transition: transitions.fast,
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>{action.icon}</span>
                        <span style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.text.secondary,
                          textAlign: 'center',
                        }}>
                          {action.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Animations */}
      <style>
        {`
          @keyframes chenu-nova-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(216, 178, 106, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(216, 178, 106, 0.5); }
          }
          
          @keyframes chenu-bubble-appear {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes chenu-panel-appear {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}
      </style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAT MESSAGE
// ─────────────────────────────────────────────────────────────────────────────

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: space.sm,
    }}>
      {!isUser && <span style={{ fontSize: '20px', marginRight: space.xs }}>🧠</span>}
      
      <div style={{
        maxWidth: '80%',
        padding: `${space.sm} ${space.md}`,
        background: isUser ? colors.sacredGold : colors.background.tertiary,
        color: isUser ? colors.darkSlate : colors.text.primary,
        borderRadius: radius.lg,
        borderBottomRightRadius: isUser ? radius.sm : radius.lg,
        borderBottomLeftRadius: isUser ? radius.lg : radius.sm,
      }}>
        <p style={{
          margin: 0,
          fontSize: typography.fontSize.sm,
          lineHeight: 1.5,
        }}>
          {message.content}
        </p>
        <span style={{
          display: 'block',
          marginTop: space.xs,
          fontSize: typography.fontSize.xs,
          opacity: 0.7,
        }}>
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPING INDICATOR
// ─────────────────────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: '6px',
            height: '6px',
            background: colors.text.muted,
            borderRadius: '50%',
            animation: `chenu-typing 1.4s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>
        {`
          @keyframes chenu-typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-4px); }
          }
        `}
      </style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { contextualSuggestions, quickActions };

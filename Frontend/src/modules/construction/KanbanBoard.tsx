/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V5.0 - KANBAN BOARD                                      ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  Tableau Kanban drag & drop style Trello:                                    ║
 * ║  - Colonnes personnalisables                                                 ║
 * ║  - Drag & drop des cartes                                                    ║
 * ║  - Labels et tags colorés                                                    ║
 * ║  - Assignation de membres                                                    ║
 * ║  - Due dates et priorités                                                    ║
 * ║  - Filtres et recherche                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════

const colors = {
  gold: '#D8B26A',
  stone: '#8D8371',
  emerald: '#3F7249',
  turquoise: '#3EB4A2',
  moss: '#2F4C39',
  ember: '#7A593A',
  slate: '#1E1F22',
  sand: '#E9E4D6',
  dark: '#0f1217',
  card: 'rgba(22, 27, 34, 0.95)',
  border: 'rgba(216, 178, 106, 0.15)',
  red: '#E54D4D',
  blue: '#4D8BE5',
  purple: '#8B5CF6',
  pink: '#EC4899',
  orange: '#F97316',
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Label {
  id: string;
  name: string;
  color: string;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
}

interface Card {
  id: string;
  title: string;
  description?: string;
  labels: string[];
  members: string[];
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  checklist?: { id: string; text: string; completed: boolean }[];
  comments: number;
  attachments: number;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
  color: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

const defaultLabels: Label[] = [
  { id: 'l1', name: 'Bug', color: colors.red },
  { id: 'l2', name: 'Feature', color: colors.blue },
  { id: 'l3', name: 'Urgent', color: colors.orange },
  { id: 'l4', name: 'Design', color: colors.purple },
  { id: 'l5', name: 'Backend', color: colors.emerald },
  { id: 'l6', name: 'Frontend', color: colors.turquoise },
];

const defaultMembers: Member[] = [
  { id: 'm1', name: 'Alice Martin', avatar: '👩‍💼' },
  { id: 'm2', name: 'Bob Dupont', avatar: '👨‍💻' },
  { id: 'm3', name: 'Claire Roy', avatar: '👩‍🎨' },
  { id: 'm4', name: 'David Chen', avatar: '👨‍🔧' },
];

const initialColumns: Column[] = [
  {
    id: 'col-1',
    title: '📥 À faire',
    color: colors.stone,
    cards: [
      {
        id: 'card-1',
        title: 'Intégrer le système de paiement Stripe',
        description: 'Ajouter le checkout et la gestion des abonnements',
        labels: ['l2', 'l5'],
        members: ['m1', 'm2'],
        dueDate: '2024-12-15',
        priority: 'high',
        checklist: [
          { id: 'c1', text: 'Créer compte Stripe', completed: true },
          { id: 'c2', text: 'Intégrer SDK', completed: false },
          { id: 'c3', text: 'Tester webhooks', completed: false },
        ],
        comments: 5,
        attachments: 2,
      },
      {
        id: 'card-2',
        title: 'Refactoriser le module de notifications',
        labels: ['l5'],
        members: ['m2'],
        priority: 'medium',
        comments: 2,
        attachments: 0,
      },
      {
        id: 'card-3',
        title: 'Corriger bug affichage mobile',
        description: 'Le menu ne se ferme pas correctement sur iOS',
        labels: ['l1', 'l6'],
        members: ['m3'],
        dueDate: '2024-12-10',
        priority: 'high',
        comments: 8,
        attachments: 3,
      },
    ],
  },
  {
    id: 'col-2',
    title: '🔄 En cours',
    color: colors.turquoise,
    cards: [
      {
        id: 'card-4',
        title: 'Nouveau design Dashboard',
        description: 'Refonte complète de la page principale',
        labels: ['l4', 'l6'],
        members: ['m3'],
        dueDate: '2024-12-12',
        priority: 'medium',
        checklist: [
          { id: 'c4', text: 'Wireframes', completed: true },
          { id: 'c5', text: 'Mockups HD', completed: true },
          { id: 'c6', text: 'Intégration', completed: false },
        ],
        comments: 12,
        attachments: 5,
      },
      {
        id: 'card-5',
        title: 'API Endpoints v2',
        labels: ['l2', 'l5'],
        members: ['m2', 'm4'],
        priority: 'high',
        comments: 3,
        attachments: 1,
      },
    ],
  },
  {
    id: 'col-3',
    title: '👀 En revue',
    color: colors.gold,
    cards: [
      {
        id: 'card-6',
        title: 'Documentation API',
        description: 'Swagger + examples',
        labels: ['l2'],
        members: ['m1'],
        priority: 'low',
        comments: 1,
        attachments: 2,
      },
    ],
  },
  {
    id: 'col-4',
    title: '✅ Terminé',
    color: colors.emerald,
    cards: [
      {
        id: 'card-7',
        title: 'Setup CI/CD Pipeline',
        labels: ['l5'],
        members: ['m4'],
        priority: 'high',
        comments: 6,
        attachments: 0,
      },
      {
        id: 'card-8',
        title: 'Tests unitaires module Auth',
        labels: ['l5'],
        members: ['m2'],
        priority: 'medium',
        comments: 2,
        attachments: 1,
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// Priority Badge
const PriorityBadge = ({ priority }: { priority: Card['priority'] }) => {
  const config = {
    low: { color: colors.emerald, label: '🟢 Basse' },
    medium: { color: colors.gold, label: '🟡 Moyenne' },
    high: { color: colors.red, label: '🔴 Haute' },
  };
  
  return (
    <span style={{
      padding: '2px 8px',
      background: `${config[priority].color}20`,
      color: config[priority].color,
      borderRadius: 4,
      fontSize: 10,
      fontWeight: 500,
    }}>
      {config[priority].label}
    </span>
  );
};

// Label Tag
const LabelTag = ({ label }: { label: Label }) => (
  <span style={{
    padding: '2px 8px',
    background: label.color,
    color: '#fff',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 500,
  }}>
    {label.name}
  </span>
);

// Member Avatar
const MemberAvatar = ({ member, size = 28 }: { member: Member; size?: number }) => (
  <div 
    title={member.name}
    style={{
      width: size,
      height: size,
      background: `linear-gradient(135deg, ${colors.emerald}, ${colors.moss})`,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.5,
      border: `2px solid ${colors.dark}`,
      marginLeft: -8,
    }}
  >
    {member.avatar}
  </div>
);

// Checklist Progress
const ChecklistProgress = ({ checklist }: { checklist: Card['checklist'] }) => {
  if (!checklist || checklist.length === 0) return null;
  
  const completed = checklist.filter(item => item.completed).length;
  const total = checklist.length;
  const percentage = (completed / total) * 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: colors.slate, borderRadius: 2 }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: percentage === 100 ? colors.emerald : colors.turquoise,
          borderRadius: 2,
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span style={{ color: colors.stone, fontSize: 11 }}>{completed}/{total}</span>
    </div>
  );
};

// Kanban Card Component
const KanbanCard = ({ 
  card, 
  labels, 
  members,
  onDragStart,
  onClick,
}: { 
  card: Card; 
  labels: Label[];
  members: Member[];
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  onClick: () => void;
}) => {
  const cardLabels = labels.filter(l => card.labels.includes(l.id));
  const cardMembers = members.filter(m => card.members.includes(m.id));
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      onClick={onClick}
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        cursor: 'grab',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.gold;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Labels */}
      {cardLabels.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
          {cardLabels.map(label => (
            <LabelTag key={label.id} label={label} />
          ))}
        </div>
      )}

      {/* Title */}
      <h4 style={{ 
        color: colors.sand, 
        fontSize: 14, 
        fontWeight: 500, 
        margin: '0 0 8px',
        lineHeight: 1.4,
      }}>
        {card.title}
      </h4>

      {/* Description preview */}
      {card.description && (
        <p style={{ 
          color: colors.stone, 
          fontSize: 12, 
          margin: '0 0 10px',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {card.description}
        </p>
      )}

      {/* Checklist Progress */}
      {card.checklist && card.checklist.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <ChecklistProgress checklist={card.checklist} />
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginTop: 10,
      }}>
        {/* Left: Due date & Priority */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {card.dueDate && (
            <span style={{
              padding: '3px 8px',
              background: isOverdue ? `${colors.red}20` : colors.slate,
              color: isOverdue ? colors.red : colors.stone,
              borderRadius: 4,
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              📅 {new Date(card.dueDate).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' })}
            </span>
          )}
          <PriorityBadge priority={card.priority} />
        </div>

        {/* Right: Meta & Members */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Comments & Attachments */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {card.comments > 0 && (
              <span style={{ color: colors.stone, fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                💬 {card.comments}
              </span>
            )}
            {card.attachments > 0 && (
              <span style={{ color: colors.stone, fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
                📎 {card.attachments}
              </span>
            )}
          </div>

          {/* Members */}
          {cardMembers.length > 0 && (
            <div style={{ display: 'flex', marginLeft: 8 }}>
              {cardMembers.slice(0, 3).map(member => (
                <MemberAvatar key={member.id} member={member} size={26} />
              ))}
              {cardMembers.length > 3 && (
                <div style={{
                  width: 26, height: 26,
                  background: colors.slate,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  color: colors.stone,
                  marginLeft: -8,
                  border: `2px solid ${colors.dark}`,
                }}>
                  +{cardMembers.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Column Component
const KanbanColumn = ({ 
  column, 
  labels, 
  members,
  onDragStart,
  onDragOver,
  onDrop,
  onCardClick,
  onAddCard,
}: { 
  column: Column;
  labels: Label[];
  members: Member[];
  onDragStart: (e: React.DragEvent, cardId: string, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  onCardClick: (card: Card) => void;
  onAddCard: (columnId: string) => void;
}) => {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
      style={{
        width: 300,
        minWidth: 300,
        background: colors.slate,
        borderRadius: 16,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      {/* Column Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 4px',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 4,
            height: 20,
            background: column.color,
            borderRadius: 2,
          }} />
          <h3 style={{ color: colors.sand, fontSize: 15, fontWeight: 600, margin: 0 }}>
            {column.title}
          </h3>
          <span style={{
            background: colors.dark,
            color: colors.stone,
            padding: '2px 8px',
            borderRadius: 10,
            fontSize: 12,
          }}>
            {column.cards.length}
          </span>
        </div>
        <button
          onClick={() => onAddCard(column.id)}
          style={{
            background: 'none',
            border: 'none',
            color: colors.stone,
            fontSize: 18,
            cursor: 'pointer',
            padding: 4,
          }}
        >
          +
        </button>
      </div>

      {/* Cards */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        paddingRight: 4,
      }}>
        {column.cards.map(card => (
          <KanbanCard
            key={card.id}
            card={card}
            labels={labels}
            members={members}
            onDragStart={(e, cardId) => onDragStart(e, cardId, column.id)}
            onClick={() => onCardClick(card)}
          />
        ))}
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => onAddCard(column.id)}
        style={{
          width: '100%',
          padding: '10px',
          background: 'transparent',
          border: `1px dashed ${colors.border}`,
          borderRadius: 8,
          color: colors.stone,
          fontSize: 13,
          cursor: 'pointer',
          marginTop: 8,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.gold;
          e.currentTarget.style.color = colors.gold;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = colors.border;
          e.currentTarget.style.color = colors.stone;
        }}
      >
        + Ajouter une carte
      </button>
    </div>
  );
};

// Card Detail Modal
const CardDetailModal = ({
  card,
  labels,
  members,
  onClose,
  onUpdate,
}: {
  card: Card;
  labels: Label[];
  members: Member[];
  onClose: () => void;
  onUpdate: (card: Card) => void;
}) => {
  const [editedCard, setEditedCard] = useState(card);
  const cardLabels = labels.filter(l => editedCard.labels.includes(l.id));
  const cardMembers = members.filter(m => editedCard.members.includes(m.id));

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '60px 20px',
      overflow: 'auto',
    }}>
      <div style={{
        background: colors.dark,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        width: '100%',
        maxWidth: 700,
      }}>
        {/* Header */}
        <div style={{
          padding: 24,
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={editedCard.title}
              onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: colors.sand,
                fontSize: 20,
                fontWeight: 600,
                outline: 'none',
              }}
            />
            {/* Labels */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {cardLabels.map(label => (
                <LabelTag key={label.id} label={label} />
              ))}
              <button style={{
                padding: '2px 8px',
                background: colors.slate,
                border: `1px dashed ${colors.border}`,
                borderRadius: 4,
                color: colors.stone,
                fontSize: 10,
                cursor: 'pointer',
              }}>
                + Label
              </button>
            </div>
          </div>
          <button onClick={onClose} style={{ 
            background: 'none', 
            border: 'none', 
            color: colors.stone, 
            fontSize: 24, 
            cursor: 'pointer',
            padding: 4,
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex' }}>
          {/* Main Content */}
          <div style={{ flex: 1, padding: 24 }}>
            {/* Description */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ color: colors.sand, fontSize: 14, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                📝 Description
              </h4>
              <textarea
                value={editedCard.description || ''}
                onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                placeholder="Ajouter une description..."
                style={{
                  width: '100%',
                  minHeight: 100,
                  padding: 12,
                  background: colors.slate,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  color: colors.sand,
                  fontSize: 14,
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Checklist */}
            {editedCard.checklist && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ color: colors.sand, fontSize: 14, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  ✅ Checklist
                </h4>
                <ChecklistProgress checklist={editedCard.checklist} />
                <div style={{ marginTop: 12 }}>
                  {editedCard.checklist.map(item => (
                    <label key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 0',
                      cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {
                          const newChecklist = editedCard.checklist!.map(i =>
                            i.id === item.id ? { ...i, completed: !i.completed } : i
                          );
                          setEditedCard({ ...editedCard, checklist: newChecklist });
                        }}
                        style={{ width: 18, height: 18 }}
                      />
                      <span style={{
                        color: item.completed ? colors.stone : colors.sand,
                        textDecoration: item.completed ? 'line-through' : 'none',
                        fontSize: 14,
                      }}>
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div>
              <h4 style={{ color: colors.sand, fontSize: 14, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                💬 Commentaires ({editedCard.comments})
              </h4>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 36, height: 36,
                  background: `linear-gradient(135deg, ${colors.emerald}, ${colors.moss})`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>👤</div>
                <input
                  type="text"
                  placeholder="Écrire un commentaire..."
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    background: colors.slate,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    color: colors.sand,
                    fontSize: 14,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div style={{ 
            width: 200, 
            padding: 24, 
            background: colors.slate,
            borderLeft: `1px solid ${colors.border}`,
          }}>
            <h4 style={{ color: colors.stone, fontSize: 12, margin: '0 0 12px', textTransform: 'uppercase' }}>
              Actions
            </h4>

            {/* Members */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: colors.sand, fontSize: 13, marginBottom: 8 }}>👥 Membres</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {cardMembers.map(member => (
                  <MemberAvatar key={member.id} member={member} />
                ))}
                <button style={{
                  width: 28, height: 28,
                  background: colors.dark,
                  border: `1px dashed ${colors.border}`,
                  borderRadius: '50%',
                  color: colors.stone,
                  cursor: 'pointer',
                  fontSize: 14,
                }}>+</button>
              </div>
            </div>

            {/* Due Date */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: colors.sand, fontSize: 13, marginBottom: 8 }}>📅 Échéance</div>
              <input
                type="date"
                value={editedCard.dueDate || ''}
                onChange={(e) => setEditedCard({ ...editedCard, dueDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: colors.dark,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  color: colors.sand,
                  fontSize: 13,
                }}
              />
            </div>

            {/* Priority */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: colors.sand, fontSize: 13, marginBottom: 8 }}>🎯 Priorité</div>
              <select
                value={editedCard.priority}
                onChange={(e) => setEditedCard({ ...editedCard, priority: e.target.value as Card['priority'] })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  background: colors.dark,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  color: colors.sand,
                  fontSize: 13,
                }}
              >
                <option value="low">🟢 Basse</option>
                <option value="medium">🟡 Moyenne</option>
                <option value="high">🔴 Haute</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
              <button style={{
                padding: '8px 12px',
                background: colors.dark,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: colors.sand,
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'left',
              }}>
                📎 Pièce jointe
              </button>
              <button style={{
                padding: '8px 12px',
                background: colors.dark,
                border: `1px solid ${colors.border}`,
                borderRadius: 6,
                color: colors.sand,
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'left',
              }}>
                ✅ Checklist
              </button>
              <button style={{
                padding: '8px 12px',
                background: `${colors.red}20`,
                border: `1px solid ${colors.red}`,
                borderRadius: 6,
                color: colors.red,
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'left',
              }}>
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: 16,
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: colors.slate,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              color: colors.sand,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onUpdate(editedCard);
              onClose();
            }}
            style={{
              padding: '10px 20px',
              background: colors.gold,
              border: 'none',
              borderRadius: 8,
              color: colors.dark,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            💾 Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [labels] = useState<Label[]>(defaultLabels);
  const [members] = useState<Member[]>(defaultMembers);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; sourceColumnId: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabel, setFilterLabel] = useState<string | null>(null);

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, cardId: string, columnId: string) => {
    setDraggedCard({ cardId, sourceColumnId: columnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedCard) return;

    const { cardId, sourceColumnId } = draggedCard;
    if (sourceColumnId === targetColumnId) return;

    setColumns(prev => {
      const sourceColumn = prev.find(col => col.id === sourceColumnId);
      const card = sourceColumn?.cards.find(c => c.id === cardId);
      if (!card) return prev;

      return prev.map(col => {
        if (col.id === sourceColumnId) {
          return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
        }
        if (col.id === targetColumnId) {
          return { ...col, cards: [...col.cards, card] };
        }
        return col;
      });
    });

    setDraggedCard(null);
  };

  // Add new card
  const handleAddCard = (columnId: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title: 'Nouvelle tâche',
      labels: [],
      members: [],
      priority: 'medium',
      comments: 0,
      attachments: 0,
    };

    setColumns(prev => prev.map(col => {
      if (col.id === columnId) {
        return { ...col, cards: [...col.cards, newCard] };
      }
      return col;
    }));

    setSelectedCard(newCard);
  };

  // Update card
  const handleUpdateCard = (updatedCard: Card) => {
    setColumns(prev => prev.map(col => ({
      ...col,
      cards: col.cards.map(card => card.id === updatedCard.id ? updatedCard : card),
    })));
  };

  // Filter cards
  const filteredColumns = columns.map(col => ({
    ...col,
    cards: col.cards.filter(card => {
      const matchesSearch = searchQuery === '' || 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLabel = filterLabel === null || card.labels.includes(filterLabel);
      return matchesSearch && matchesLabel;
    }),
  }));

  // Stats
  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0);
  const completedCards = columns.find(col => col.title.includes('Terminé'))?.cards.length || 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.dark,
      color: colors.sand,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 32px',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            📋 Kanban Board
          </h1>
          <p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 13 }}>
            {totalCards} tâches • {completedCards} terminées
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Rechercher..."
            style={{
              padding: '10px 16px',
              background: colors.slate,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              color: colors.sand,
              fontSize: 14,
              width: 200,
            }}
          />

          {/* Label Filter */}
          <select
            value={filterLabel || ''}
            onChange={(e) => setFilterLabel(e.target.value || null)}
            style={{
              padding: '10px 16px',
              background: colors.slate,
              border: `1px solid ${colors.border}`,
              borderRadius: 10,
              color: colors.sand,
              fontSize: 14,
            }}
          >
            <option value="">Tous les labels</option>
            {labels.map(label => (
              <option key={label.id} value={label.id}>{label.name}</option>
            ))}
          </select>

          {/* Members */}
          <div style={{ display: 'flex', marginLeft: 8 }}>
            {members.map(member => (
              <MemberAvatar key={member.id} member={member} size={36} />
            ))}
          </div>
        </div>
      </div>

      {/* Board */}
      <div style={{
        padding: 24,
        overflowX: 'auto',
      }}>
        <div style={{ display: 'flex', gap: 20, minWidth: 'fit-content' }}>
          {filteredColumns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              labels={labels}
              members={members}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onCardClick={setSelectedCard}
              onAddCard={handleAddCard}
            />
          ))}

          {/* Add Column Button */}
          <button
            style={{
              minWidth: 300,
              height: 50,
              background: 'transparent',
              border: `2px dashed ${colors.border}`,
              borderRadius: 16,
              color: colors.stone,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            + Ajouter une colonne
          </button>
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          labels={labels}
          members={members}
          onClose={() => setSelectedCard(null)}
          onUpdate={handleUpdateCard}
        />
      )}
    </div>
  );
};

export default KanbanBoard;

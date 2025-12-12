/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU V25 - FORUM                                              ║
 * ║              Discussion Boards, Threads & Q&A                                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Features:
 * - Category-based forums
 * - Threaded discussions
 * - Q&A with best answers
 * - Upvotes & reputation
 * - User badges & ranks
 * - Search & filters
 * - Moderation tools
 */

import React, { useState } from 'react';

const colors = {
  gold: '#D8B26A', goldDark: '#B89040', stone: '#8D8371', emerald: '#3F7249',
  turquoise: '#3EB4A2', moss: '#2F4C39', slate: '#1E1F22', card: '#242424',
  sand: '#E9E4D6', border: '#2A2A2A'
};

// Forum Categories
const CATEGORIES = [
  { id: 'general', name: 'Discussions générales', icon: '💬', description: 'Discussions libres sur tous les sujets', threads: 1234, posts: 8901 },
  { id: 'construction', name: 'Construction', icon: '🏗️', description: 'Techniques, matériaux et méthodes', threads: 567, posts: 3456 },
  { id: 'legal', name: 'Réglementation & RBQ', icon: '⚖️', description: 'Questions légales et conformité', threads: 234, posts: 1234 },
  { id: 'tech', name: 'Technologies & BIM', icon: '💻', description: 'Logiciels, BIM et innovations', threads: 345, posts: 2345 },
  { id: 'business', name: 'Gestion d\'entreprise', icon: '💼', description: 'Finances, RH et administration', threads: 189, posts: 987 },
  { id: 'jobs', name: 'Emplois & Carrières', icon: '👔', description: 'Offres, conseils et networking', threads: 456, posts: 1567 },
  { id: 'showcase', name: 'Projets & Réalisations', icon: '🏆', description: 'Partagez vos réalisations', threads: 123, posts: 678 },
  { id: 'help', name: 'Support CHE·NU', icon: '🆘', description: 'Aide sur la plateforme', threads: 89, posts: 345 }
];

// Mock Threads
const THREADS = [
  { id: '1', title: 'Comment bien choisir ses sous-traitants en 2024?', category: 'construction', author: { name: 'Pierre M.', avatar: '👷', rank: 'Expert', reputation: 2340 }, replies: 45, views: 1234, votes: 89, lastActivity: 'il y a 2h', pinned: true, solved: false, tags: ['sous-traitance', 'conseils'] },
  { id: '2', title: '[RÉSOLU] Nouvelle réglementation RBQ - Ce qui change', category: 'legal', author: { name: 'Marie D.', avatar: '👩‍⚖️', rank: 'Modérateur', reputation: 5670 }, replies: 78, views: 3456, votes: 156, lastActivity: 'il y a 5h', pinned: true, solved: true, tags: ['rbq', '2024', 'réglementation'] },
  { id: '3', title: 'Revit vs ArchiCAD - Votre avis?', category: 'tech', author: { name: 'Jean L.', avatar: '💻', rank: 'Contributeur', reputation: 890 }, replies: 123, views: 2345, votes: 67, lastActivity: 'il y a 1j', pinned: false, solved: false, tags: ['bim', 'logiciels', 'comparatif'] },
  { id: '4', title: 'Recherche électricien certifié région Montréal', category: 'jobs', author: { name: 'Construction ABC', avatar: '🏢', rank: 'Entreprise', reputation: 1200 }, replies: 12, views: 456, votes: 8, lastActivity: 'il y a 3h', pinned: false, solved: false, tags: ['emploi', 'montréal', 'électricien'] },
  { id: '5', title: 'Mon premier projet: rénovation complète d\'un duplex', category: 'showcase', author: { name: 'Sophie T.', avatar: '👩‍🔧', rank: 'Membre', reputation: 340 }, replies: 34, views: 890, votes: 45, lastActivity: 'il y a 6h', pinned: false, solved: false, tags: ['rénovation', 'projet', 'duplex'] }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY CARD
// ═══════════════════════════════════════════════════════════════════════════════

const CategoryCard = ({ category, onClick }: { category: any; onClick: () => void }) => {
  return (
    <div onClick={onClick} style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 48, height: 48, background: colors.moss, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
          {category.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: colors.sand, margin: '0 0 4px', fontSize: 15, fontWeight: 600 }}>{category.name}</h4>
          <p style={{ color: colors.stone, margin: 0, fontSize: 12 }}>{category.description}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: colors.sand, fontSize: 14, fontWeight: 600 }}>{category.threads.toLocaleString()}</div>
          <div style={{ color: colors.stone, fontSize: 11 }}>discussions</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD ROW
// ═══════════════════════════════════════════════════════════════════════════════

const ThreadRow = ({ thread, onClick }: { thread: any; onClick: () => void }) => {
  const rankColors: Record<string, string> = {
    'Expert': colors.gold,
    'Modérateur': colors.turquoise,
    'Contributeur': colors.emerald,
    'Entreprise': '#3B82F6',
    'Membre': colors.stone
  };

  return (
    <div onClick={onClick} style={{ background: colors.slate, border: `1px solid ${thread.pinned ? colors.gold + '50' : colors.moss}`, borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', gap: 16 }}>
        {/* Vote Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 50 }}>
          <button style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 18 }}>▲</button>
          <span style={{ color: colors.gold, fontWeight: 700, fontSize: 16 }}>{thread.votes}</span>
          <button style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 18 }}>▼</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            {thread.pinned && <span style={{ background: colors.gold, color: colors.slate, padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>📌 Épinglé</span>}
            {thread.solved && <span style={{ background: colors.emerald, color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>✓ Résolu</span>}
          </div>
          
          <h4 style={{ color: colors.sand, margin: '0 0 8px', fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>{thread.title}</h4>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {thread.tags.map((tag: string) => (
              <span key={tag} style={{ background: colors.card, color: colors.turquoise, padding: '3px 8px', borderRadius: 6, fontSize: 11 }}>#{tag}</span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>{thread.author.avatar}</span>
              <div>
                <span style={{ color: colors.sand, fontSize: 13, fontWeight: 500 }}>{thread.author.name}</span>
                <span style={{ color: rankColors[thread.author.rank] || colors.stone, fontSize: 11, marginLeft: 8 }}>{thread.author.rank}</span>
              </div>
            </div>
            <span style={{ color: colors.stone, fontSize: 12 }}>💬 {thread.replies}</span>
            <span style={{ color: colors.stone, fontSize: 12 }}>👁️ {thread.views.toLocaleString()}</span>
            <span style={{ color: colors.stone, fontSize: 12, marginLeft: 'auto' }}>{thread.lastActivity}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD DETAIL VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const ThreadDetail = ({ thread, onBack }: { thread: any; onBack: () => void }) => {
  const [replyContent, setReplyContent] = useState('');

  const replies = [
    { id: '1', author: { name: 'Jean D.', avatar: '👨‍🔧', rank: 'Expert', reputation: 1890 }, content: 'Excellente question! Voici mon expérience avec les sous-traitants...\n\n1. Toujours vérifier les licences RBQ\n2. Demander des références de projets similaires\n3. Établir un contrat clair avec des jalons de paiement', votes: 34, time: 'il y a 2h', isBestAnswer: true },
    { id: '2', author: { name: 'Marie L.', avatar: '👩‍💼', rank: 'Contributeur', reputation: 670 }, content: 'Je suis d\'accord avec Jean. J\'ajouterais aussi l\'importance de la communication régulière.', votes: 12, time: 'il y a 1h', isBestAnswer: false },
    { id: '3', author: { name: 'Pierre T.', avatar: '👷', rank: 'Membre', reputation: 230 }, content: 'Merci pour ces conseils! Est-ce que quelqu\'un a des recommandations spécifiques pour la région de Québec?', votes: 5, time: 'il y a 30min', isBestAnswer: false }
  ];

  return (
    <div>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', marginBottom: 20, fontSize: 14 }}>
        ← Retour au forum
      </button>

      {/* Thread Header */}
      <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {thread.pinned && <span style={{ background: colors.gold, color: colors.slate, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>📌 Épinglé</span>}
          {thread.solved && <span style={{ background: colors.emerald, color: 'white', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>✓ Résolu</span>}
          <span style={{ background: colors.card, color: colors.stone, padding: '4px 10px', borderRadius: 6, fontSize: 11 }}>{CATEGORIES.find(c => c.id === thread.category)?.name}</span>
        </div>

        <h1 style={{ color: colors.sand, fontSize: 22, margin: '0 0 16px', lineHeight: 1.4 }}>{thread.title}</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 16, borderTop: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>{thread.author.avatar}</span>
            <div>
              <div style={{ color: colors.sand, fontWeight: 600 }}>{thread.author.name}</div>
              <div style={{ color: colors.gold, fontSize: 12 }}>{thread.author.rank} · {thread.author.reputation.toLocaleString()} rep</div>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
            <span style={{ color: colors.stone, fontSize: 13 }}>👁️ {thread.views.toLocaleString()} vues</span>
            <span style={{ color: colors.stone, fontSize: 13 }}>💬 {thread.replies} réponses</span>
            <span style={{ color: colors.stone, fontSize: 13 }}>{thread.lastActivity}</span>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div style={{ marginBottom: 20 }}>
        {replies.map((reply) => (
          <div key={reply.id} style={{ background: reply.isBestAnswer ? `${colors.emerald}10` : colors.slate, border: `1px solid ${reply.isBestAnswer ? colors.emerald : colors.moss}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
            {reply.isBestAnswer && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: colors.emerald }}>
                <span>✓</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Meilleure réponse</span>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: 16 }}>
              {/* Vote */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <button style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 16 }}>▲</button>
                <span style={{ color: colors.gold, fontWeight: 600 }}>{reply.votes}</span>
                <button style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 16 }}>▼</button>
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{reply.author.avatar}</span>
                  <div>
                    <span style={{ color: colors.sand, fontWeight: 600 }}>{reply.author.name}</span>
                    <span style={{ color: colors.gold, fontSize: 11, marginLeft: 8 }}>{reply.author.rank}</span>
                    <div style={{ color: colors.stone, fontSize: 11 }}>{reply.author.reputation.toLocaleString()} reputation · {reply.time}</div>
                  </div>
                </div>
                <p style={{ color: colors.sand, fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{reply.content}</p>
                
                <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
                  <button style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 12 }}>💬 Répondre</button>
                  <button style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 12 }}>🔗 Partager</button>
                  <button style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer', fontSize: 12 }}>⚑ Signaler</button>
                  {!reply.isBestAnswer && (
                    <button style={{ background: 'none', border: 'none', color: colors.emerald, cursor: 'pointer', fontSize: 12, marginLeft: 'auto' }}>✓ Marquer comme meilleure réponse</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Box */}
      <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 20 }}>
        <h4 style={{ color: colors.sand, margin: '0 0 16px', fontSize: 14 }}>✍️ Votre réponse</h4>
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Partagez votre expérience ou posez une question..."
          style={{ width: '100%', minHeight: 120, padding: 16, background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, color: colors.sand, fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: colors.card, border: 'none', borderRadius: 6, padding: '8px 12px', color: colors.stone, cursor: 'pointer' }}>📷</button>
            <button style={{ background: colors.card, border: 'none', borderRadius: 6, padding: '8px 12px', color: colors.stone, cursor: 'pointer' }}>🔗</button>
            <button style={{ background: colors.card, border: 'none', borderRadius: 6, padding: '8px 12px', color: colors.stone, cursor: 'pointer' }}>📝</button>
          </div>
          <button style={{ padding: '12px 24px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.slate, fontWeight: 600, cursor: 'pointer' }}>
            Publier la réponse
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEADERBOARD SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

const LeaderboardSidebar = () => {
  const topUsers = [
    { name: 'Marie D.', avatar: '👩‍⚖️', reputation: 5670, rank: 'Modérateur' },
    { name: 'Jean L.', avatar: '👨‍🔧', reputation: 3450, rank: 'Expert' },
    { name: 'Pierre M.', avatar: '👷', reputation: 2340, rank: 'Expert' },
    { name: 'Sophie T.', avatar: '👩‍💼', reputation: 1890, rank: 'Contributeur' },
    { name: 'Marc B.', avatar: '🧑‍💻', reputation: 1560, rank: 'Contributeur' }
  ];

  return (
    <div>
      {/* Top Contributors */}
      <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <h4 style={{ color: colors.sand, margin: '0 0 16px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          🏆 Top contributeurs
        </h4>
        {topUsers.map((user, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topUsers.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
            <span style={{ color: colors.gold, fontWeight: 700, width: 20 }}>#{i + 1}</span>
            <span style={{ fontSize: 24 }}>{user.avatar}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: colors.sand, fontSize: 13, fontWeight: 500 }}>{user.name}</div>
              <div style={{ color: colors.stone, fontSize: 11 }}>{user.rank}</div>
            </div>
            <div style={{ color: colors.gold, fontSize: 12, fontWeight: 600 }}>{user.reputation.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 16, padding: 16 }}>
        <h4 style={{ color: colors.sand, margin: '0 0 16px', fontSize: 14 }}>📊 Statistiques du forum</h4>
        {[
          { label: 'Discussions', value: '3,456' },
          { label: 'Messages', value: '24,567' },
          { label: 'Membres', value: '12,890' },
          { label: 'En ligne', value: '234' }
        ].map((stat, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? `1px solid ${colors.border}` : 'none' }}>
            <span style={{ color: colors.stone, fontSize: 12 }}>{stat.label}</span>
            <span style={{ color: colors.sand, fontSize: 12, fontWeight: 600 }}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function Forum() {
  const [view, setView] = useState<'categories' | 'threads'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
    setView('threads');
  };

  if (selectedThread) {
    return <ThreadDetail thread={selectedThread} onBack={() => setSelectedThread(null)} />;
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: colors.sand, fontSize: 26, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            💬 Forum
            {selectedCategory && (
              <span style={{ color: colors.stone, fontWeight: 400, fontSize: 18 }}>/ {selectedCategory.name}</span>
            )}
          </h1>
          <p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 14 }}>
            Discussions, questions et partage de connaissances
          </p>
        </div>
        <button style={{ padding: '12px 24px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.slate, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          ✏️ Nouvelle discussion
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        {/* Main Content */}
        <div>
          {view === 'categories' ? (
            <>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <input placeholder="🔍 Rechercher dans le forum..." style={{ flex: 1, padding: 14, background: colors.slate, border: `1px solid ${colors.moss}`, borderRadius: 10, color: colors.sand }} />
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {CATEGORIES.map(cat => (
                  <CategoryCard key={cat.id} category={cat} onClick={() => handleCategoryClick(cat)} />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Breadcrumb & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <button onClick={() => { setView('categories'); setSelectedCategory(null); }} style={{ background: 'none', border: 'none', color: colors.turquoise, cursor: 'pointer', fontSize: 13 }}>
                  ← Toutes les catégories
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['recent', 'popular', 'unanswered'].map(sort => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort as any)}
                      style={{
                        padding: '8px 14px', background: sortBy === sort ? colors.moss : colors.card,
                        border: 'none', borderRadius: 8, color: sortBy === sort ? colors.gold : colors.stone,
                        cursor: 'pointer', fontSize: 12
                      }}
                    >
                      {sort === 'recent' ? '🕐 Récent' : sort === 'popular' ? '🔥 Populaire' : '❓ Sans réponse'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Threads List */}
              <div style={{ display: 'grid', gap: 12 }}>
                {THREADS.filter(t => !selectedCategory || t.category === selectedCategory.id).map(thread => (
                  <ThreadRow key={thread.id} thread={thread} onClick={() => setSelectedThread(thread)} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <LeaderboardSidebar />
      </div>
    </div>
  );
}

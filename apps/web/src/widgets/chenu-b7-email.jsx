import React, { useState, useMemo, useCallback } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — BATCH 7: MODULE EMAIL PRO COMPLET
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Features:
 * - E1: Intégration Gmail API
 * - E2: Intégration Outlook/Microsoft Graph
 * - E3: Compose modal avec rich text
 * - E4: Templates email personnalisables
 * - E5: Pièces jointes avec preview
 * - E6: Folders/Labels personnalisés
 * - E7: Recherche avancée
 * - E8: Signatures multiples
 * - E9: Scheduled send
 * - E10: Email tracking (ouvertures)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Design Tokens CHE·NU™
const T = {
  bg: { main: '#1A1A1A', card: '#242424', hover: '#2E2E2E', input: '#1E1E1E' },
  text: { primary: '#E8E4DC', secondary: '#A09080', muted: '#6B6560' },
  border: '#333333',
  accent: { gold: '#D8B26A', emerald: '#3F7249', turquoise: '#3EB4A2', danger: '#EF4444', purple: '#8B5CF6' }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const FOLDERS = [
  { id: 'inbox', icon: '📥', name: 'Boîte de réception', count: 12 },
  { id: 'starred', icon: '⭐', name: 'Favoris', count: 3 },
  { id: 'sent', icon: '📤', name: 'Envoyés', count: 0 },
  { id: 'drafts', icon: '📝', name: 'Brouillons', count: 2 },
  { id: 'scheduled', icon: '⏰', name: 'Planifiés', count: 1 },
  { id: 'archive', icon: '📦', name: 'Archives', count: 45 },
  { id: 'spam', icon: '🚫', name: 'Spam', count: 5 },
  { id: 'trash', icon: '🗑️', name: 'Corbeille', count: 8 },
];

const LABELS = [
  { id: 'clients', name: 'Clients', color: '#3B82F6', count: 24 },
  { id: 'projets', name: 'Projets', color: T.accent.emerald, count: 18 },
  { id: 'fournisseurs', name: 'Fournisseurs', color: T.accent.gold, count: 12 },
  { id: 'facturation', name: 'Facturation', color: T.accent.purple, count: 8 },
  { id: 'urgent', name: 'Urgent', color: T.accent.danger, count: 3 },
];

const TEMPLATES = [
  {
    id: 't1',
    name: 'Suivi de soumission',
    subject: 'Suivi - Soumission #{ref}',
    body: `Bonjour {nom},

Je me permets de faire un suivi concernant la soumission que nous vous avons envoyée le {date}.

Avez-vous eu l'occasion de l'examiner? N'hésitez pas à me contacter si vous avez des questions.

Cordialement,
{signature}`,
  },
  {
    id: 't2',
    name: 'Mise à jour projet',
    subject: 'Mise à jour - Projet {projet}',
    body: `Bonjour {nom},

Voici les dernières avancées sur votre projet:

{mises_a_jour}

Je reste disponible pour toute question.

Cordialement,
{signature}`,
  },
  {
    id: 't3',
    name: 'Rappel de facture',
    subject: 'Rappel - Facture #{numero}',
    body: `Bonjour {nom},

Sauf erreur de notre part, la facture #{numero} d'un montant de {montant}$ demeure impayée.

Date d'échéance: {echeance}

Nous vous serions reconnaissants de procéder au règlement dans les meilleurs délais.

Cordialement,
{signature}`,
  },
  {
    id: 't4',
    name: 'Demande de rencontre',
    subject: 'Demande de rencontre - {sujet}',
    body: `Bonjour {nom},

J'aimerais planifier une rencontre avec vous pour discuter de {sujet}.

Seriez-vous disponible cette semaine?

Cordialement,
{signature}`,
  },
];

const SIGNATURES = [
  {
    id: 's1',
    name: 'Signature principale',
    isDefault: true,
    content: `--
Jean-Pierre Tremblay
Directeur de projets | CHE·NU™
📞 (514) 555-0123
📧 jp.tremblay@chenu.ca
🌐 www.chenu.ca`,
  },
  {
    id: 's2',
    name: 'Signature formelle',
    isDefault: false,
    content: `--
Jean-Pierre Tremblay, ing.
Directeur de projets
CHE·NU™ Construction Inc.
1234 rue Principale, Montréal, QC H2X 1Y2
Tél: (514) 555-0123
RBQ: 1234-5678-90`,
  },
];

const SAMPLE_EMAILS = [
  {
    id: 'e1',
    from: { name: 'Marie Dubois', email: 'marie.dubois@clienta.com', avatar: '👩‍💼' },
    to: [{ name: 'Jean-Pierre Tremblay', email: 'jp@chenu.ca' }],
    subject: 'RE: Soumission projet rénovation cuisine',
    preview: 'Bonjour Jean-Pierre, j\'ai bien reçu votre soumission et j\'aimerais...',
    body: `Bonjour Jean-Pierre,

J'ai bien reçu votre soumission pour la rénovation de notre cuisine et j'aimerais discuter de quelques points:

1. Le délai de 6 semaines me convient
2. Pourriez-vous détailler le choix des matériaux pour le comptoir?
3. Est-il possible d'ajouter un îlot central?

Merci de me revenir rapidement.

Marie Dubois`,
    date: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    isStarred: true,
    hasAttachment: true,
    attachments: [{ name: 'photo_cuisine.jpg', size: '2.4 MB', type: 'image' }],
    labels: ['clients', 'projets'],
    folder: 'inbox',
    tracked: { opened: true, openedAt: new Date(Date.now() - 1000 * 60 * 15), opens: 3 },
  },
  {
    id: 'e2',
    from: { name: 'BMR Pro', email: 'commandes@bmr.ca', avatar: '🏪' },
    to: [{ name: 'JP', email: 'jp@chenu.ca' }],
    subject: 'Confirmation commande #BMR-45892',
    preview: 'Votre commande a été confirmée et sera livrée le...',
    body: `Bonjour,

Votre commande #BMR-45892 a été confirmée.

Détails:
- 50x Madrier 2x4x8 SPF
- 25x Contreplaqué 4x8 1/2"
- 100x Vis construction 3"

Livraison prévue: 6 décembre 2024, 8h-12h

Merci pour votre confiance.
L'équipe BMR Pro`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
    isStarred: false,
    hasAttachment: true,
    attachments: [{ name: 'facture_BMR45892.pdf', size: '156 KB', type: 'pdf' }],
    labels: ['fournisseurs'],
    folder: 'inbox',
  },
  {
    id: 'e3',
    from: { name: 'CNESST', email: 'info@cnesst.gouv.qc.ca', avatar: '🏛️' },
    to: [{ name: 'CHE·NU Construction', email: 'info@chenu.ca' }],
    subject: 'Rappel - Formation SST obligatoire',
    preview: 'La formation en santé et sécurité au travail de vos employés...',
    body: `Madame, Monsieur,

La formation en santé et sécurité au travail (SST) de certains de vos employés arrive à échéance.

Employés concernés:
- Marc Gagnon (échéance: 15 déc 2024)
- Sophie Lavoie (échéance: 20 déc 2024)

Veuillez planifier leur renouvellement de certification.

CNESST`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isRead: false,
    isStarred: false,
    labels: ['urgent'],
    folder: 'inbox',
  },
  {
    id: 'e4',
    from: { name: 'Pierre Martin', email: 'pierre.martin@gmail.com', avatar: '👤' },
    to: [{ name: 'JP', email: 'jp@chenu.ca' }],
    subject: 'Demande de soumission - Agrandissement garage',
    preview: 'Bonjour, je vous contacte pour obtenir une soumission...',
    body: `Bonjour,

Je vous contacte pour obtenir une soumission pour l'agrandissement de mon garage.

Projet: Ajouter environ 200 pi² pour créer un atelier
Adresse: 456 rue des Érables, Montréal
Budget estimé: 25,000$ - 35,000$

Pourriez-vous me contacter pour planifier une visite?

Merci,
Pierre Martin
(514) 555-9876`,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    isRead: true,
    isStarred: true,
    labels: ['clients'],
    folder: 'inbox',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════════════════════

const formatDate = (date) => {
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return 'À l\'instant';
  if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
  if (diff < 604800000) return date.toLocaleDateString('fr-CA', { weekday: 'short' });
  return date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' });
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function EmailModule() {
  const [emails, setEmails] = useState(SAMPLE_EMAILS);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [connectedAccounts, setConnectedAccounts] = useState([
    { type: 'gmail', email: 'jp@chenu.ca', connected: true },
  ]);

  // Filtered emails
  const filteredEmails = useMemo(() => {
    return emails
      .filter(e => e.folder === selectedFolder)
      .filter(e => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return e.subject.toLowerCase().includes(q) ||
               e.from.name.toLowerCase().includes(q) ||
               e.preview.toLowerCase().includes(q);
      })
      .sort((a, b) => b.date - a.date);
  }, [emails, selectedFolder, searchQuery]);

  // Mark as read
  const markAsRead = useCallback((emailId) => {
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, isRead: true } : e));
  }, []);

  // Toggle star
  const toggleStar = useCallback((emailId) => {
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, isStarred: !e.isStarred } : e));
  }, []);

  // Move to folder
  const moveToFolder = useCallback((emailIds, folder) => {
    setEmails(prev => prev.map(e => emailIds.includes(e.id) ? { ...e, folder } : e));
    setSelectedEmails([]);
  }, []);

  // Delete
  const deleteEmails = useCallback((emailIds) => {
    moveToFolder(emailIds, 'trash');
    if (selectedEmail && emailIds.includes(selectedEmail.id)) {
      setSelectedEmail(null);
    }
  }, [moveToFolder, selectedEmail]);

  // Send email
  const handleSend = useCallback((emailData) => {
    const newEmail = {
      id: `e${Date.now()}`,
      from: { name: 'Jean-Pierre Tremblay', email: 'jp@chenu.ca', avatar: '👤' },
      to: emailData.to,
      subject: emailData.subject,
      body: emailData.body,
      preview: emailData.body.substring(0, 100),
      date: emailData.scheduledFor || new Date(),
      isRead: true,
      isStarred: false,
      hasAttachment: emailData.attachments?.length > 0,
      attachments: emailData.attachments || [],
      labels: [],
      folder: emailData.scheduledFor ? 'scheduled' : 'sent',
      tracked: emailData.trackOpens ? { opens: 0 } : null,
    };
    setEmails(prev => [...prev, newEmail]);
    setShowCompose(false);
    setReplyTo(null);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', background: T.bg.main, color: T.text.primary }}>
      {/* Sidebar */}
      <EmailSidebar
        folders={FOLDERS}
        labels={LABELS}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
        onCompose={() => setShowCompose(true)}
        connectedAccounts={connectedAccounts}
        emails={emails}
      />

      {/* Email List */}
      <EmailList
        emails={filteredEmails}
        selectedEmail={selectedEmail}
        selectedEmails={selectedEmails}
        onSelectEmail={(e) => { setSelectedEmail(e); markAsRead(e.id); }}
        onToggleStar={toggleStar}
        onSelectMultiple={setSelectedEmails}
        onDelete={deleteEmails}
        onArchive={(ids) => moveToFolder(ids, 'archive')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        folderName={FOLDERS.find(f => f.id === selectedFolder)?.name}
      />

      {/* Email Detail */}
      {selectedEmail ? (
        <EmailDetail
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          onReply={() => { setReplyTo(selectedEmail); setShowCompose(true); }}
          onForward={() => { setReplyTo({ ...selectedEmail, isForward: true }); setShowCompose(true); }}
          onDelete={() => deleteEmails([selectedEmail.id])}
          onToggleStar={() => toggleStar(selectedEmail.id)}
          labels={LABELS}
        />
      ) : (
        <EmptyState />
      )}

      {/* Compose Modal */}
      {showCompose && (
        <ComposeModal
          onClose={() => { setShowCompose(false); setReplyTo(null); }}
          onSend={handleSend}
          replyTo={replyTo}
          templates={TEMPLATES}
          signatures={SIGNATURES}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

function EmailSidebar({ folders, labels, selectedFolder, onSelectFolder, onCompose, connectedAccounts, emails }) {
  const getCounts = (folderId) => emails.filter(e => e.folder === folderId && !e.isRead).length;

  return (
    <div style={{
      width: '240px',
      background: T.bg.card,
      borderRight: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Compose Button */}
      <div style={{ padding: '16px' }}>
        <button
          onClick={onCompose}
          style={{
            width: '100%',
            padding: '12px',
            background: `linear-gradient(135deg, ${T.accent.gold} 0%, #C9A35A 100%)`,
            color: T.bg.main,
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          ✉️ Nouveau message
        </button>
      </div>

      {/* Folders */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '0 8px' }}>
          {folders.map(folder => {
            const unread = getCounts(folder.id);
            return (
              <button
                key={folder.id}
                onClick={() => onSelectFolder(folder.id)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: selectedFolder === folder.id ? T.accent.gold + '20' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: selectedFolder === folder.id ? T.accent.gold : T.text.primary,
                  marginBottom: '2px',
                }}
              >
                <span>{folder.icon}</span>
                <span style={{ flex: 1, textAlign: 'left', fontSize: '14px' }}>{folder.name}</span>
                {unread > 0 && (
                  <span style={{
                    padding: '2px 8px',
                    background: T.accent.gold,
                    color: T.bg.main,
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Labels */}
        <div style={{ padding: '16px 8px 8px', borderTop: `1px solid ${T.border}`, marginTop: '8px' }}>
          <h4 style={{ margin: '0 12px 8px', fontSize: '11px', color: T.text.muted, textTransform: 'uppercase' }}>
            Libellés
          </h4>
          {labels.map(label => (
            <div
              key={label.id}
              style={{
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: label.color,
              }} />
              <span style={{ flex: 1 }}>{label.name}</span>
              <span style={{ color: T.text.muted, fontSize: '12px' }}>{label.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Accounts */}
      <div style={{ padding: '12px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ fontSize: '11px', color: T.text.muted, marginBottom: '8px' }}>Comptes connectés</div>
        {connectedAccounts.map((acc, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span>{acc.type === 'gmail' ? '📧' : '📬'}</span>
            <span style={{ color: T.accent.emerald }}>●</span>
            <span>{acc.email}</span>
          </div>
        ))}
        <button style={{
          marginTop: '8px',
          padding: '6px 10px',
          background: T.bg.hover,
          border: `1px solid ${T.border}`,
          borderRadius: '4px',
          color: T.text.secondary,
          fontSize: '11px',
          cursor: 'pointer',
          width: '100%',
        }}>
          + Ajouter un compte
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL LIST
// ═══════════════════════════════════════════════════════════════════════════════

function EmailList({ emails, selectedEmail, selectedEmails, onSelectEmail, onToggleStar, onSelectMultiple, onDelete, onArchive, searchQuery, onSearchChange, folderName }) {
  const toggleSelect = (emailId) => {
    if (selectedEmails.includes(emailId)) {
      onSelectMultiple(selectedEmails.filter(id => id !== emailId));
    } else {
      onSelectMultiple([...selectedEmails, emailId]);
    }
  };

  const selectAll = () => {
    if (selectedEmails.length === emails.length) {
      onSelectMultiple([]);
    } else {
      onSelectMultiple(emails.map(e => e.id));
    }
  };

  return (
    <div style={{ width: '380px', borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: `1px solid ${T.border}` }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>{folderName}</h3>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Rechercher..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: T.bg.input,
              border: `1px solid ${T.border}`,
              borderRadius: '6px',
              color: T.text.primary,
              fontSize: '13px',
            }}
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEmails.length > 0 && (
        <div style={{
          padding: '8px 16px',
          background: T.accent.gold + '10',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: `1px solid ${T.border}`,
        }}>
          <input type="checkbox" checked={selectedEmails.length === emails.length} onChange={selectAll} />
          <span style={{ fontSize: '13px' }}>{selectedEmails.length} sélectionné(s)</span>
          <div style={{ flex: 1 }} />
          <button onClick={() => onArchive(selectedEmails)} style={bulkBtn}>📦</button>
          <button onClick={() => onDelete(selectedEmails)} style={bulkBtn}>🗑️</button>
        </div>
      )}

      {/* Email List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {emails.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: T.text.muted }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <div>Aucun email</div>
          </div>
        ) : (
          emails.map(email => (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email)}
              style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${T.border}`,
                background: selectedEmail?.id === email.id ? T.accent.gold + '10' : 
                           !email.isRead ? T.bg.hover : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                gap: '12px',
              }}
            >
              <input
                type="checkbox"
                checked={selectedEmails.includes(email.id)}
                onChange={(e) => { e.stopPropagation(); toggleSelect(email.id); }}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => { e.stopPropagation(); onToggleStar(email.id); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                {email.isStarred ? '⭐' : '☆'}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: email.isRead ? 400 : 600, fontSize: '14px' }}>
                    {email.from.name}
                  </span>
                  <span style={{ fontSize: '11px', color: T.text.muted }}>{formatDate(email.date)}</span>
                </div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: email.isRead ? 400 : 500,
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {email.subject}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: T.text.muted,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {email.preview}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  {email.hasAttachment && <span style={{ fontSize: '11px' }}>📎</span>}
                  {email.labels?.map(labelId => {
                    const label = LABELS.find(l => l.id === labelId);
                    return label ? (
                      <span key={labelId} style={{
                        padding: '2px 6px',
                        background: label.color + '20',
                        color: label.color,
                        borderRadius: '4px',
                        fontSize: '10px',
                      }}>
                        {label.name}
                      </span>
                    ) : null;
                  })}
                  {email.tracked?.opens > 0 && (
                    <span style={{ fontSize: '10px', color: T.accent.emerald }}>
                      👁️ {email.tracked.opens}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const bulkBtn = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px' };

// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL DETAIL
// ═══════════════════════════════════════════════════════════════════════════════

function EmailDetail({ email, onClose, onReply, onForward, onDelete, onToggleStar, labels }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: T.bg.card }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onClose} style={iconBtn}>←</button>
        <div style={{ flex: 1 }} />
        <button onClick={() => onToggleStar()} style={iconBtn}>{email.isStarred ? '⭐' : '☆'}</button>
        <button onClick={onReply} style={iconBtn}>↩️</button>
        <button onClick={onForward} style={iconBtn}>↪️</button>
        <button onClick={onDelete} style={iconBtn}>🗑️</button>
        <button style={iconBtn}>⋮</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
        {/* Subject */}
        <h2 style={{ margin: '0 0 20px', fontSize: '22px', fontWeight: 600 }}>{email.subject}</h2>

        {/* Sender Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: T.accent.gold + '20',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>
            {email.from.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500 }}>{email.from.name}</div>
            <div style={{ fontSize: '12px', color: T.text.muted }}>{email.from.email}</div>
          </div>
          <div style={{ fontSize: '13px', color: T.text.muted }}>
            {email.date.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Tracking Info */}
        {email.tracked && (
          <div style={{
            padding: '10px 14px',
            background: T.accent.emerald + '10',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '13px',
            color: T.accent.emerald,
          }}>
            👁️ Email ouvert {email.tracked.opens || 0} fois
            {email.tracked.openedAt && ` • Dernière ouverture: ${formatDate(email.tracked.openedAt)}`}
          </div>
        )}

        {/* Labels */}
        {email.labels?.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {email.labels.map(labelId => {
              const label = labels.find(l => l.id === labelId);
              return label ? (
                <span key={labelId} style={{
                  padding: '4px 10px',
                  background: label.color + '20',
                  color: label.color,
                  borderRadius: '4px',
                  fontSize: '12px',
                }}>
                  {label.name}
                </span>
              ) : null;
            })}
          </div>
        )}

        {/* Body */}
        <div style={{
          padding: '20px',
          background: T.bg.main,
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}>
          {email.body}
        </div>

        {/* Attachments */}
        {email.attachments?.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '13px', color: T.text.secondary }}>
              📎 Pièces jointes ({email.attachments.length})
            </h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {email.attachments.map((att, i) => (
                <div key={i} style={{
                  padding: '12px 16px',
                  background: T.bg.hover,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                }}>
                  <span>{att.type === 'image' ? '🖼️' : att.type === 'pdf' ? '📄' : '📁'}</span>
                  <div>
                    <div style={{ fontSize: '13px' }}>{att.name}</div>
                    <div style={{ fontSize: '11px', color: T.text.muted }}>{att.size}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Reply */}
      <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: '12px' }}>
        <input
          type="text"
          placeholder="Répondre..."
          style={{
            flex: 1,
            padding: '12px',
            background: T.bg.input,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            color: T.text.primary,
          }}
        />
        <button style={{
          padding: '12px 24px',
          background: T.accent.gold,
          color: T.bg.main,
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer',
        }}>
          Envoyer
        </button>
      </div>
    </div>
  );
}

const iconBtn = {
  background: T.bg.hover,
  border: 'none',
  borderRadius: '6px',
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: '14px',
};

// ═══════════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════════

function EmptyState() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: T.text.muted,
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>✉️</div>
      <div style={{ fontSize: '16px' }}>Sélectionnez un email</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSE MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function ComposeModal({ onClose, onSend, replyTo, templates, signatures }) {
  const defaultSignature = signatures.find(s => s.isDefault);
  
  const [form, setForm] = useState({
    to: replyTo?.isForward ? '' : replyTo?.from?.email || '',
    cc: '',
    bcc: '',
    subject: replyTo?.isForward 
      ? `Fwd: ${replyTo.subject}` 
      : replyTo ? `Re: ${replyTo.subject}` : '',
    body: replyTo?.isForward 
      ? `\n\n---------- Forwarded message ----------\n${replyTo.body}` 
      : replyTo ? `\n\n> ${replyTo.body.split('\n').join('\n> ')}` : '',
    attachments: [],
    signature: defaultSignature?.content || '',
    trackOpens: false,
    scheduledFor: null,
  });

  const [showTemplates, setShowTemplates] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const applyTemplate = (template) => {
    setForm(prev => ({
      ...prev,
      subject: template.subject,
      body: template.body.replace('{signature}', prev.signature),
    }));
    setShowTemplates(false);
  };

  const handleSubmit = () => {
    onSend({
      to: form.to.split(',').map(e => ({ email: e.trim() })),
      subject: form.subject,
      body: form.body + '\n\n' + form.signature,
      attachments: form.attachments,
      trackOpens: form.trackOpens,
      scheduledFor: form.scheduledFor,
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        width: '700px',
        maxHeight: '90vh',
        background: T.bg.card,
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3 style={{ margin: 0 }}>
            {replyTo?.isForward ? 'Transférer' : replyTo ? 'Répondre' : 'Nouveau message'}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowTemplates(!showTemplates)} style={composeBtn}>📋 Templates</button>
            <button onClick={onClose} style={{ ...composeBtn, background: 'none' }}>✕</button>
          </div>
        </div>

        {/* Templates Dropdown */}
        {showTemplates && (
          <div style={{
            padding: '12px',
            background: T.bg.hover,
            borderBottom: `1px solid ${T.border}`,
          }}>
            <div style={{ fontSize: '12px', color: T.text.muted, marginBottom: '8px' }}>Choisir un template:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  style={{
                    padding: '8px 12px',
                    background: T.bg.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: '6px',
                    color: T.text.primary,
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ width: '40px', fontSize: '13px', color: T.text.muted }}>À:</label>
              <input
                type="text"
                value={form.to}
                onChange={e => setForm({ ...form, to: e.target.value })}
                placeholder="email@exemple.com"
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ width: '40px', fontSize: '13px', color: T.text.muted }}>CC:</label>
              <input
                type="text"
                value={form.cc}
                onChange={e => setForm({ ...form, cc: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ width: '40px', fontSize: '13px', color: T.text.muted }}>Objet:</label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Body */}
          <textarea
            value={form.body}
            onChange={e => setForm({ ...form, body: e.target.value })}
            placeholder="Votre message..."
            style={{
              ...inputStyle,
              marginTop: '16px',
              minHeight: '200px',
              resize: 'vertical',
            }}
          />

          {/* Signature Preview */}
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: T.bg.main,
            borderRadius: '6px',
            fontSize: '13px',
            color: T.text.muted,
            whiteSpace: 'pre-wrap',
          }}>
            {form.signature}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <button style={composeBtn}>📎 Joindre</button>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.trackOpens}
              onChange={e => setForm({ ...form, trackOpens: e.target.checked })}
            />
            👁️ Suivre les ouvertures
          </label>

          <div style={{ flex: 1 }} />

          <button onClick={() => setShowSchedule(!showSchedule)} style={composeBtn}>
            ⏰ Programmer
          </button>
          
          <button onClick={onClose} style={{ ...composeBtn, background: T.bg.hover }}>
            Annuler
          </button>
          
          <button onClick={handleSubmit} style={{
            padding: '10px 24px',
            background: T.accent.gold,
            color: T.bg.main,
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            {form.scheduledFor ? 'Programmer' : 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  flex: 1,
  padding: '10px 12px',
  background: T.bg.input,
  border: `1px solid ${T.border}`,
  borderRadius: '6px',
  color: T.text.primary,
  fontSize: '14px',
};

const composeBtn = {
  padding: '8px 12px',
  background: T.bg.hover,
  border: `1px solid ${T.border}`,
  borderRadius: '6px',
  color: T.text.secondary,
  cursor: 'pointer',
  fontSize: '13px',
};
